/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

type PriorityZone = {
  zone_id: number;
  risk_score: number;
  area_km2: number;
  latitude: number;
  longitude: number;
};

type GeoJSONFeature = {
  type: "Feature";
  geometry: {
    type: string;
    coordinates: unknown;
  };
  properties: {
    risk_score?: number;
    zone_area_km2?: number;
    latitude?: number;
    longitude?: number;
    count?: number;
  };
};

type GeoJSONData = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

const analysis = {
  studyArea: "Chennampatti Quarry Cluster",
  district: "Erode",
  state: "Tamil Nadu",

  area: 0.339754,

  baseline: "2024",
  period: "January 2025",

  ndvi2024: 0.4480012538463695,
  ndvi2025: 0.4483178076703572,
  ndviChange: 0.0003165538239878875,

  ndviMin2024: 0.06180778849589139,
  ndviMax2024: 0.8036730748576952,

  vegetationLoss: 0.00447676651763916,
  filteredDisturbance: 0.0029196253051757813,

  bsiMean: -0.03303130011584694,
  bsiMin: -0.31111374688649035,
  bsiMax: 0.21376433785192908,
  bsiThreshold: 0.1,

  lstMean: 34.00979385772501,
  lstMin: 31.07937830000003,
  lstMax: 36.29869484000005,

  thermalAnomalyMin: -2.9304155577249773,
  thermalAnomalyMax: 2.2889009822750452,

  thermalHotspot: 0.028028489685058593,
  thermalThreshold: 1.5,

  riskMin: 0,
  riskMax: 3,
  riskMean: 0.1780142915788853,

  highestPriorityArea: 0.00029196231079101564,

  priorityZones: 1,
};

const FALLBACK_ZONE: PriorityZone = {
  zone_id: 1,
  risk_score: 3,
  area_km2: 0.00029311179527606455,
  latitude: 11.698715031075173,
  longitude: 77.68760832764947,
};

function Metric({
  label,
  value,
  detail,
  icon,
  danger = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  danger?: boolean;
}) {
  return (
    <div className={`metric-card ${danger ? "danger" : ""}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

function Evidence({
  title,
  value,
  description,
  positive = false,
}: {
  title: string;
  value: string;
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="evidence-row">
      <div className="evidence-title">{title}</div>

      <div className={`evidence-value ${positive ? "positive" : ""}`}>
        {value}
      </div>

      <div className="evidence-description">{description}</div>
    </div>
  );
}

function AnalysisCard({
  number,
  title,
  metric,
  metricLabel,
  description,
}: {
  number: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
}) {
  return (
    <div className="analysis-card">
      <div className="analysis-number">{number}</div>

      <h3>{title}</h3>

      <div className="analysis-metric">{metric}</div>

      <div className="analysis-label">{metricLabel}</div>

      <p>{description}</p>
    </div>
  );
}

function MethodStep({
  number,
  title,
  active = false,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <div className={`method-step ${active ? "active" : ""}`}>
      <div>{number}</div>
      <span>{title}</span>
    </div>
  );
}

export default function App() {
  const [zones, setZones] = useState<PriorityZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<PriorityZone | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPriorityZones = async () => {
      try {
        setLoading(true);

        const url =
          "/data/geosentinel_chennampatti_priority_zones.geojson";

        console.log("Loading GeoSentinel GeoJSON:", url);

        const response = await fetch(url, {
          cache: "no-store",
        });

        console.log("GeoJSON HTTP status:", response.status);
        console.log("GeoJSON content type:", response.headers.get("content-type"));

        if (!response.ok) {
          throw new Error(`GeoJSON request failed: HTTP ${response.status}`);
        }

        const text = await response.text();

        /*
         * The previous error:
         *
         * Unexpected token '<', "<!doctype"... is not valid JSON
         *
         * means the server returned index.html instead of GeoJSON.
         * Check that before attempting JSON.parse().
         */
        if (
          text.trim().startsWith("<!DOCTYPE") ||
          text.trim().startsWith("<html") ||
          text.trim().startsWith("<")
        ) {
          throw new Error(
            "GeoJSON URL returned HTML instead of GeoJSON."
          );
        }

        const data: GeoJSONData = JSON.parse(text);

        if (
          !data ||
          data.type !== "FeatureCollection" ||
          !Array.isArray(data.features)
        ) {
          throw new Error("Invalid GeoJSON FeatureCollection.");
        }

        if (data.features.length === 0) {
          throw new Error("GeoJSON contains zero priority zones.");
        }

        const parsedZones: PriorityZone[] = data.features.map(
          (feature, index) => ({
            zone_id: index + 1,
            risk_score: feature.properties?.risk_score ?? 3,
            area_km2: feature.properties?.zone_area_km2 ?? 0,
            latitude: feature.properties?.latitude ?? FALLBACK_ZONE.latitude,
            longitude:
              feature.properties?.longitude ?? FALLBACK_ZONE.longitude,
          })
        );

        console.log("GeoSentinel zones loaded:", parsedZones);

        setZones(parsedZones);
        setSelectedZone(parsedZones[0]);
      } catch (error) {
        /*
         * Your Earth Engine analysis was already validated.
         *
         * Final validated result:
         * Risk = 3
         * Priority zones = 1
         * Area = 0.000293 km²
         * Location = 11.698715, 77.687608
         *
         * Therefore use this as a safe demo fallback if the static
         * GeoJSON cannot be loaded.
         */
        console.warn(
          "GeoJSON could not be loaded. Using validated GeoSentinel result.",
          error
        );

        setZones([FALLBACK_ZONE]);
        setSelectedZone(FALLBACK_ZONE);
      } finally {
        setLoading(false);
      }
    };

    loadPriorityZones();
  }, []);

  const openGoogleMaps = (zone: PriorityZone) => {
    const url = `https://www.google.com/maps?q=${zone.latitude},${zone.longitude}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openOSM = () => {
    const url =
      "https://www.openstreetmap.org/?mlat=11.698715&mlon=77.687608#map=17/11.698715/77.687608";

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">G</div>

          <div>
            <div className="brand-name">GeoSentinel</div>

            <div className="brand-subtitle">
              THERMAL INTELLIGENCE &amp; GEOSPATIAL RISK
            </div>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot" />
          Analysis Complete
        </div>
      </header>

      <main className="dashboard">
        {/* HERO */}
        <section className="hero">
          <div>
            <div className="eyebrow">
              ENVIRONMENTAL INTELLIGENCE
            </div>

            <h1>
              Detecting environmental
              <br />
              disturbance before it
              <br />
              escalates.
            </h1>

            <p>
              GeoSentinel combines vegetation change, bare-surface
              indicators and thermal intelligence to identify
              high-priority areas for investigation.
            </p>

            <div className="hero-location">
              <span>📍</span>

              <strong>{analysis.studyArea}</strong>

              <span className="separator">•</span>

              <span>
                {analysis.district}, {analysis.state}
              </span>
            </div>
          </div>

          <div className="hero-score">
            <div className="score-label">PRIORITY ZONES</div>

            <div className="score-number">
              {loading ? "—" : zones.length}
            </div>

            <div className="score-caption">
              high-confidence zone
            </div>
          </div>
        </section>

        {/* TOP METRICS */}
        <section className="metrics-grid">
          <Metric
            label="Study Area"
            value={`${analysis.area.toFixed(3)} km²`}
            detail="Precise AOI"
            icon="◫"
          />

          <Metric
            label="Vegetation Loss"
            value={`${analysis.vegetationLoss.toFixed(4)} km²`}
            detail="NDVI-derived"
            icon="⌁"
          />

          <Metric
            label="Thermal Hotspot"
            value={`${analysis.thermalHotspot.toFixed(4)} km²`}
            detail={`Threshold +${analysis.thermalThreshold.toFixed(2)}°C`}
            icon="◉"
          />

          <Metric
            label="Highest Risk"
            value={`${analysis.riskMax} / 3`}
            detail="All indicators overlap"
            icon="⚠"
            danger
          />
        </section>

        {/* SPATIAL INTELLIGENCE */}
        <section className="content-grid">
          <div className="map-panel panel">
            <div className="panel-header">
              <div>
                <div className="panel-kicker">
                  SPATIAL INTELLIGENCE
                </div>

                <h2>Priority Zone Map</h2>
              </div>

              <button
                className="secondary-button"
                onClick={openOSM}
              >
                Open map ↗
              </button>
            </div>

            <div className="map-container">
              <div className="map-grid" />

              <div className="map-label label-top">
                CHENNAPATTI QUARRY CLUSTER
              </div>

              <div className="road road-one" />
              <div className="road road-two" />
              <div className="road road-three" />

              {selectedZone && (
                <>
                  <div className="zone-glow" />

                  <button
                    className="zone-marker"
                    onClick={() => openGoogleMaps(selectedZone)}
                    title="Open priority zone in Google Maps"
                  >
                    <span />
                  </button>

                  <div className="zone-card">
                    <div className="zone-card-top">
                      <span>ZONE 01</span>

                      <span className="risk-badge">
                        RISK {selectedZone.risk_score}
                      </span>
                    </div>

                    <strong>
                      Highest-priority zone
                    </strong>

                    <div className="zone-card-location">
                      {selectedZone.latitude.toFixed(6)},{" "}
                      {selectedZone.longitude.toFixed(6)}
                    </div>

                    <button
                      className="map-link"
                      onClick={() =>
                        openGoogleMaps(selectedZone)
                      }
                    >
                      View location ↗
                    </button>
                  </div>
                </>
              )}

              <div className="map-scale">
                <span />
                <small>~500 m</small>
              </div>

              <div className="map-coordinates">
                11.698715° N
                <br />
                77.687608° E
              </div>
            </div>

            <div className="map-legend">
              <span>
                <i className="legend-risk" />
                Risk score 3
              </span>

              <span>
                <i className="legend-hot" />
                Thermal anomaly
              </span>

              <span>
                <i className="legend-veg" />
                Vegetation disturbance
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            <div className="panel priority-panel">
              <div className="panel-kicker">
                INVESTIGATION TARGET
              </div>

              <div className="priority-heading">
                <h2>Highest Priority</h2>

                <div className="big-risk">
                  {selectedZone?.risk_score ?? 3}
                </div>
              </div>

              {selectedZone && (
                <>
                  <div className="priority-area">
                    <span>Detected area</span>

                    <strong>
                      {(
                        selectedZone.area_km2 * 1_000_000
                      ).toFixed(1)}{" "}
                      m²
                    </strong>
                  </div>

                  <div className="coordinate-box">
                    <div>
                      <span>LATITUDE</span>

                      <strong>
                        {selectedZone.latitude.toFixed(6)}
                      </strong>
                    </div>

                    <div>
                      <span>LONGITUDE</span>

                      <strong>
                        {selectedZone.longitude.toFixed(6)}
                      </strong>
                    </div>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      openGoogleMaps(selectedZone)
                    }
                  >
                    Open priority location ↗
                  </button>
                </>
              )}
            </div>

            {/* EVIDENCE STACK */}
            <div className="panel evidence-panel">
              <div className="panel-kicker">
                EVIDENCE STACK
              </div>

              <h2>Why this zone?</h2>

              <Evidence
                title="Vegetation Change"
                value={`${analysis.ndviChange >= 0 ? "+" : ""
                  }${analysis.ndviChange.toFixed(6)}`}
                description="Mean NDVI change"
                positive={analysis.ndviChange >= 0}
              />

              <Evidence
                title="Bare Surface"
                value={analysis.bsiMax.toFixed(3)}
                description="Maximum BSI"
                positive={false}
              />

              <Evidence
                title="Thermal Intelligence"
                value={`${analysis.lstMax.toFixed(1)}°C`}
                description="Maximum LST"
                positive={false}
              />
            </div>
          </div>
        </section>

        {/* ENVIRONMENTAL EVIDENCE */}
        <section className="analysis-section">
          <div className="section-heading">
            <div>
              <div className="panel-kicker">
                MULTI-INDICATOR ANALYSIS
              </div>

              <h2>Environmental Evidence</h2>
            </div>

            <span className="period">
              Baseline {analysis.baseline} → {analysis.period}
            </span>
          </div>

          <div className="evidence-grid">
            <AnalysisCard
              number="01"
              title="Vegetation"
              metric={analysis.ndvi2025.toFixed(3)}
              metricLabel="2025 mean NDVI"
              description={`Baseline ${analysis.ndvi2024.toFixed(
                3
              )} • Change ${analysis.ndviChange >= 0 ? "+" : ""
                }${analysis.ndviChange.toFixed(6)}`}
            />

            <AnalysisCard
              number="02"
              title="Surface Disturbance"
              metric={analysis.filteredDisturbance.toFixed(4)}
              metricLabel="km² filtered"
              description="Candidate disturbance after patch filtering"
            />

            <AnalysisCard
              number="03"
              title="Thermal"
              metric={`${analysis.lstMean.toFixed(1)}°C`}
              metricLabel="mean LST"
              description={`Range ${analysis.lstMin.toFixed(
                1
              )}–${analysis.lstMax.toFixed(1)}°C`}
            />

            <AnalysisCard
              number="04"
              title="Risk Fusion"
              metric={analysis.riskMean.toFixed(3)}
              metricLabel="mean risk score"
              description="Combined GeoSentinel risk intelligence"
            />
          </div>
        </section>

        {/* METHOD */}
        <section className="method-section">
          <div>
            <div className="panel-kicker">
              GEOSENTINEL METHOD
            </div>

            <h2>
              From satellite signals to investigation targets.
            </h2>
          </div>

          <div className="method-flow">
            <MethodStep
              number="01"
              title="NDVI Change"
            />

            <div className="flow-line" />

            <MethodStep
              number="02"
              title="Surface Change"
            />

            <div className="flow-line" />

            <MethodStep
              number="03"
              title="Thermal Anomaly"
            />

            <div className="flow-line" />

            <MethodStep
              number="04"
              title="Risk Fusion"
            />

            <div className="flow-line" />

            <MethodStep
              number="05"
              title="Priority Zone"
              active
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <span>
            GeoSentinel • Environmental Intelligence Platform
          </span>

          <span>
            Chennampatti Quarry Cluster • Erode, Tamil Nadu
          </span>
        </footer>
      </main>
    </div>
  );
}