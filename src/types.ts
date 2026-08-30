export interface StudyArea {
  name: string;
  village: string;
  taluk: string;
  district: string;
  state: string;
  country: string;
  boundingBox: {
    south: number;
    north: number;
    west: number;
    east: number;
  };
  center: {
    latitude: number;
    longitude: number;
  };
}

export interface SatelliteObservation {
  id: string;
  satellite: 'Sentinel-2' | 'Landsat-8' | 'Landsat-9';
  date: string;
  bands: string[];
  cloudCover: number;
}

export interface ThermalObservation {
  id: string;
  source: 'Landsat' | 'FortyGuard';
  date: string;
  temperature: number;
}

export interface RiskMetrics {
  deltaNdvi: number;
  thermalAnomaly: number;
  impactedArea: number; // in square meters or hectares
}

export interface RiskZone {
  id: string;
  geometry: any; // e.g., GeoJSON geometry
  riskScore: number;
  riskTier: 'Low' | 'Medium' | 'High' | 'Critical';
  deltaNdvi: number;
  thermalAnomaly: number;
  impactedArea: number;
  explanation: string;
}
