# GeoSentinel: Thermal Intelligence for Mining Environmental Risk

## 1. What GeoSentinel Does
GeoSentinel is a satellite-based monitoring platform designed to assess environmental risks associated with mining activities. It analyzes vegetation changes (via NDVI) and surface temperature anomalies (via LST) over time to identify high-risk zones that require attention.

## 2. Final Study Area
The finalized study area is the **Chennampatti Quarry Cluster**, located in the Anthiyur Taluk of the Erode District, Tamil Nadu, India.

## 3. Study-Area Coordinates
The bounding box for the study area is defined based on documented official environmental-clearance records:
- **South**: 11.693678
- **North**: 11.700864
- **West**: 77.687078
- **East**: 77.690983

## 4. Sentinel-2 Role
Sentinel-2 data will provide high-resolution multispectral imagery to calculate the Normalized Difference Vegetation Index (NDVI). By comparing a baseline date (T1) with a current date (T2), the project will measure vegetation degradation (`deltaNdvi`).

## 5. Landsat Role
Landsat 8/9 data will be utilized for its thermal infrared sensors to derive Land Surface Temperature (LST). This helps detect thermal anomalies associated with mining activities.

## 6. FortyGuard Role
FortyGuard is included as an optional, high-resolution temperature data source. Until real FortyGuard data or API access is provided, it will serve as sample data.

## 7. Current Milestone
**Milestone 1**: Project Preparation. The current phase establishes the configuration, data interfaces, backend pipeline structure, and verifies that the system is ready to ingest and process real satellite data. No fake satellite data or algorithms are implemented yet.

## 8. Next Milestone
**Milestone 2**: Data Acquisition and Processing. The next phase will focus on obtaining real Sentinel-2 and Landsat data for Chennampatti and building the processing pipeline to compute NDVI and thermal metrics.
