export const satelliteConfig = {
  sentinel2: {
    baselineDateT1: null, // TO BE VERIFIED
    currentDateT2: null, // TO BE VERIFIED
    redBand: "B4",
    nirBand: "B8",
    spatialResolution: "10m",
    cloudCoverRequirement: "< 10%"
  },
  landsat89: {
    thermalSource: "LST",
    thermalAcquisitionDate: null, // TO BE VERIFIED
    spatialResolution: "30m (resampled)",
    baselineRequirement: null // TO BE VERIFIED
  },
  fortyGuard: {
    isOptional: true,
    status: "SAMPLE DATA until real FortyGuard data is provided",
    apiEndpoint: null // TO BE VERIFIED
  }
};
