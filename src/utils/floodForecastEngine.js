// RESQ AI Hydrological Engine & Flood Timeline Forecast Module
// Real-world Web2 flood modeling, CWC river gauge stations, and dynamic 48-hour inundation forecasting

export const RIVER_BASINS = [
  {
    id: 'brahmaputra-assam',
    name: 'Brahmaputra Basin (Guwahati / Kamrup)',
    state: 'Assam',
    center: [26.180, 91.750],
    zoom: 13,
    riverName: 'Brahmaputra',
    currentLevelMeters: 49.8,
    dangerLevelMeters: 49.68,
    warningLevelMeters: 48.68,
    hflMeters: 51.46, // Highest Flood Level recorded
    dischargeCusecs: 142000,
    rainfallLast24hMm: 148,
    forecastNext24hMm: 210,
    floodStatus: 'DANGER_ACTIVE',
    trend: 'RISING_RAPIDLY',
    trendRatePerHour: '+0.14 m/hr',
    peakInundationEtaHours: 6.5,
    gaugeStations: [
      { id: 'GS-ASM-01', name: 'Guwahati DC Court Gauge', level: 49.80, danger: 49.68, status: 'EXCEEDED_DANGER' },
      { id: 'GS-ASM-02', name: 'Pandu Port Hydrological Station', level: 50.12, danger: 49.80, status: 'EXCEEDED_DANGER' },
      { id: 'GS-ASM-03', name: 'Bharalumukh Sluice Gate', level: 48.95, danger: 48.50, status: 'HIGH_ALERT' }
    ]
  },
  {
    id: 'ganga-patna',
    name: 'Ganga & Gandak Confluence (Patna / Digha)',
    state: 'Bihar',
    center: [25.615, 85.130],
    zoom: 13,
    riverName: 'Ganga',
    currentLevelMeters: 50.2,
    dangerLevelMeters: 50.52,
    warningLevelMeters: 49.52,
    hflMeters: 52.52,
    dischargeCusecs: 185000,
    rainfallLast24hMm: 96,
    forecastNext24hMm: 165,
    floodStatus: 'WARNING_RISING',
    trend: 'RISING',
    trendRatePerHour: '+0.09 m/hr',
    peakInundationEtaHours: 11.0,
    gaugeStations: [
      { id: 'GS-BHR-01', name: 'Digha Ghat Station', level: 50.20, danger: 50.52, status: 'APPROACHING_DANGER' },
      { id: 'GS-BHR-02', name: 'Gandhi Ghat Sensor', level: 49.90, danger: 49.80, status: 'EXCEEDED_DANGER' },
      { id: 'GS-BHR-03', name: 'Danapur Cantonment Gauge', level: 51.10, danger: 51.40, status: 'RISING' }
    ]
  },
  {
    id: 'hooghly-kolkata',
    name: 'Hooghly Estuary (Kolkata / Howrah Riverfront)',
    state: 'West Bengal',
    center: [22.650, 88.355],
    zoom: 13,
    riverName: 'Hooghly',
    currentLevelMeters: 6.8,
    dangerLevelMeters: 7.2,
    warningLevelMeters: 6.5,
    hflMeters: 8.4,
    dischargeCusecs: 92000,
    rainfallLast24hMm: 112,
    forecastNext24hMm: 140,
    floodStatus: 'TIDAL_SURGE_RISK',
    trend: 'TIDAL_PEAK',
    trendRatePerHour: '+0.22 m/hr',
    peakInundationEtaHours: 3.5,
    gaugeStations: [
      { id: 'GS-WB-01', name: 'Bally Bridge Hydrometric Post', level: 6.80, danger: 7.20, status: 'HIGH_TIDE_WARNING' },
      { id: 'GS-WB-02', name: 'Dakshineswar Riverfront Sensor', level: 6.95, danger: 7.10, status: 'CRITICAL_APPROACH' },
      { id: 'GS-WB-03', name: 'Dankuni Lowland Sluice', level: 5.40, danger: 5.20, status: 'EXCEEDED_DANGER' }
    ]
  }
];

// Dynamic 48-Hour Forecast Timeline Steps
export const TIMELINE_FORECAST_STEPS = [
  {
    hourOffset: 0,
    label: 'NOW (T+0h)',
    timeDisplay: 'Current Live Observation',
    waterRiseMeters: 2.2,
    rainfallAccumulatedMm: 148,
    riverDischargeCusecs: 142000,
    severity: 'MODERATE',
    summary: 'Low-lying riverfront promenades and underpasses submerged. Urban core safe.',
    submergedRoadsCount: 3,
    affectedPopulationEst: 18500,
    inundationZones: [
      {
        id: 'poly-now-1',
        name: 'Riverfront Bund (Zone A)',
        depthMeters: 1.8,
        color: '#38bdf8',
        fillOpacity: 0.45,
        coords: [
          [26.195, 91.730],
          [26.200, 91.755],
          [26.192, 91.780],
          [26.186, 91.765],
          [26.188, 91.735]
        ]
      }
    ],
    vulnerableWaypoints: ['w6', 'w7'] // Old Ghat Underpass & Bund
  },
  {
    hourOffset: 3,
    label: '+3 Hours',
    timeDisplay: 'T+3h Flash Influx Surge',
    waterRiseMeters: 3.4,
    rainfallAccumulatedMm: 185,
    riverDischargeCusecs: 168000,
    severity: 'HIGH',
    summary: 'Upstream catchment runoff reaching city waterways. Bharalumukh canal overflowing.',
    submergedRoadsCount: 7,
    affectedPopulationEst: 42000,
    inundationZones: [
      {
        id: 'poly-3h-1',
        name: 'Riverfront Bund & Bharalu Overflow',
        depthMeters: 2.6,
        color: '#f59e0b',
        fillOpacity: 0.55,
        coords: [
          [26.198, 91.725],
          [26.204, 91.758],
          [26.195, 91.785],
          [26.180, 91.765],
          [26.175, 91.745],
          [26.185, 91.730]
        ]
      }
    ],
    vulnerableWaypoints: ['w6', 'w7', 'w3']
  },
  {
    hourOffset: 6,
    label: '+6 Hours',
    timeDisplay: 'T+6h Peak River Crest Alert',
    waterRiseMeters: 4.8,
    rainfallAccumulatedMm: 240,
    riverDischargeCusecs: 198000,
    severity: 'CRITICAL',
    summary: 'Brahmaputra exceeds Danger Mark by 1.2m. Major arterial bypasses submerged. Evacuation mandatory.',
    submergedRoadsCount: 14,
    affectedPopulationEst: 89000,
    inundationZones: [
      {
        id: 'poly-6h-1',
        name: 'Comprehensive Basin Inundation Zone',
        depthMeters: 3.9,
        color: '#ef4444',
        fillOpacity: 0.65,
        coords: [
          [26.202, 91.720],
          [26.210, 91.760],
          [26.200, 91.795],
          [26.178, 91.790],
          [26.170, 91.755],
          [26.172, 91.730],
          [26.188, 91.715]
        ]
      }
    ],
    vulnerableWaypoints: ['w6', 'w7', 'w3', 'w2', 'w9']
  },
  {
    hourOffset: 12,
    label: '+12 Hours',
    timeDisplay: 'T+12h Maximum Inundation Plateau',
    waterRiseMeters: 5.6,
    rainfallAccumulatedMm: 285,
    riverDischargeCusecs: 215000,
    severity: 'SEVERE_EMERGENCY',
    summary: 'Full floodplain submerged up to 52m contour. Only high-ridge hill shelters accessible.',
    submergedRoadsCount: 22,
    affectedPopulationEst: 135000,
    inundationZones: [
      {
        id: 'poly-12h-1',
        name: 'Severe Flood Extent (Deep Basin)',
        depthMeters: 4.8,
        color: '#dc2626',
        fillOpacity: 0.72,
        coords: [
          [26.208, 91.710],
          [26.215, 91.765],
          [26.205, 91.810],
          [26.175, 91.805],
          [26.165, 91.750],
          [26.168, 91.718],
          [26.192, 91.705]
        ]
      }
    ],
    vulnerableWaypoints: ['w1', 'w2', 'w3', 'w6', 'w7', 'w8', 'w9', 'w10']
  },
  {
    hourOffset: 24,
    label: '+24 Hours',
    timeDisplay: 'T+24h Sustained Embankment Stress',
    waterRiseMeters: 4.9,
    rainfallAccumulatedMm: 310,
    riverDischargeCusecs: 185000,
    severity: 'CRITICAL',
    summary: 'Rainfall easing to intermittent squalls. Slow drainage; floodwaters receding at 4cm/hr.',
    submergedRoadsCount: 16,
    affectedPopulationEst: 110000,
    inundationZones: [
      {
        id: 'poly-24h-1',
        name: 'Sustained Lowland Flood Buffer',
        depthMeters: 3.8,
        color: '#f97316',
        fillOpacity: 0.58,
        coords: [
          [26.202, 91.720],
          [26.210, 91.760],
          [26.200, 91.795],
          [26.178, 91.790],
          [26.170, 91.755],
          [26.172, 91.730]
        ]
      }
    ],
    vulnerableWaypoints: ['w6', 'w7', 'w3', 'w2']
  },
  {
    hourOffset: 48,
    label: '+48 Hours',
    timeDisplay: 'T+48h Recession & Recovery Phase',
    waterRiseMeters: 2.8,
    rainfallAccumulatedMm: 325,
    riverDischargeCusecs: 135000,
    severity: 'MODERATE',
    summary: 'Major arterial roads clearing. Silt cleanup and emergency responder damage assessment in progress.',
    submergedRoadsCount: 5,
    affectedPopulationEst: 35000,
    inundationZones: [
      {
        id: 'poly-48h-1',
        name: 'Residual Riverfront Puddling',
        depthMeters: 1.5,
        color: '#0284c7',
        fillOpacity: 0.35,
        coords: [
          [26.195, 91.730],
          [26.200, 91.755],
          [26.192, 91.780],
          [26.186, 91.765]
        ]
      }
    ],
    vulnerableWaypoints: ['w6', 'w7']
  }
];

// Predictive Sector Breach ETAs
export const SECTOR_FLOOD_PREDICTIONS = [
  {
    sector: 'Zone 1 — Riverfront Bund & Old Ghat',
    status: 'SUBMERGED_NOW',
    submergenceDepth: '2.1 meters',
    breachTime: 'Current (Active)',
    etaToCrest: 'Peak in 4h 15m',
    riskLevel: 'CRITICAL',
    evacuationPriority: 'IMMEDIATE_ACTION',
    recommendedHighGround: 'Nilachal High Ridge (145m)'
  },
  {
    sector: 'Zone 2 — Bharalumukh Canal Corridor',
    status: 'IMMINENT_SURGE',
    submergenceDepth: 'Expected 1.4 meters',
    breachTime: 'In 1 hr 45 min (17:15 IST)',
    etaToCrest: 'Peak in 6h 30m',
    riskLevel: 'HIGH_ALERT',
    evacuationPriority: 'EVACUATE_NOW',
    recommendedHighGround: 'Navagraha Ridge Base (120m)'
  },
  {
    sector: 'Zone 3 — Paltan Commercial & Railway Basin',
    status: 'PROJECTED_INUNDATION',
    submergenceDepth: 'Expected 0.8 meters',
    breachTime: 'In 4 hrs 20 min (19:50 IST)',
    etaToCrest: 'Peak in 10h 00m',
    riskLevel: 'WARNING',
    evacuationPriority: 'PREPARE_DEPARTURE',
    recommendedHighGround: 'Sarania Command Hub (112m)'
  },
  {
    sector: 'Zone 4 — Uzanbazar & High Valley Incline',
    status: 'SAFE_HIGH_GROUND',
    submergenceDepth: '0 meters (Dry)',
    breachTime: 'No Submergence Projected',
    etaToCrest: 'Safe Above 60m Elevation',
    riskLevel: 'SECURE',
    evacuationPriority: 'SHELTER_ASSEMBLY_POINT',
    recommendedHighGround: 'Navagraha Ridge Base (120m)'
  }
];
