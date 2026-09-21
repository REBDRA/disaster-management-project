// Research papers and data sources from Slide 6

export const RESEARCH_PAPERS = [
  {
    id: 1,
    title: 'DYNAMIC EVACUATION ROUTING',
    paperName: 'Optimising pre-disaster evacuation strategies using shared autonomous vehicles: A dynamic and stochastic approach',
    journal: 'ScienceDirect (PII: S095219762501022X)',
    url: 'https://www.sciencedirect.com/science/article/pii/S095219762501022X',
    keyTakeaway: 'Stochastic route optimization models vehicle allocation under sudden road submergence constraints.'
  },
  {
    id: 2,
    title: 'REAL TIME REROUTING',
    paperName: 'Real-time rerouting of traffic flows to control the risk of disruptions',
    journal: 'ScienceDirect (PII: S0968090X26002093)',
    url: 'https://www.sciencedirect.com/science/article/pii/S0968090X26002093',
    keyTakeaway: 'Dynamic recalculation of traffic flows mitigates cascading bottleneck hazards.'
  },
  {
    id: 3,
    title: 'TRAFFIC AWARE EVACUATION',
    paperName: 'Disaster-Responsive and Emergency-Aware Traffic Management for Autonomous Vehicle Networks',
    journal: 'IEEE Xplore (Doc ID: 11523926)',
    url: 'https://ieeexplore.ieee.org/document/11523926',
    keyTakeaway: 'Ad-hoc P2P vehicular mesh coordinates movement without relying on centralized cellular infrastructure.'
  },
  {
    id: 4,
    title: 'HAZARD AWARE ROUTE PLANNING',
    paperName: 'Hazard analysis and risk assessment in disaster engineering',
    journal: 'ScienceDirect Engineering Topics',
    url: 'https://www.sciencedirect.com/topics/engineering/hazard-analysis-and-risk-assessment',
    keyTakeaway: 'Systematic probabilistic hazard scoring evaluates depth, velocity, and ground stability to assign road risk levels.'
  }
];

export const DATA_SOURCES_INFO = [
  { name: 'OPENSTREETMAP', desc: 'Base road geometry, bridges, and building footprint nodes' },
  { name: 'REAL TIME TRAFFIC DATA', desc: 'Congestion and speed feeds to prevent bottleneck gridlock' },
  { name: 'WEATHER & HAZARD DATA', desc: 'Hydrological precipitation and water surcharge levels' },
  { name: 'DISRUPTION AREA', desc: 'Submerged zones, landslides, and fallen power grid polygons' },
  { name: 'GPS TELEMETRY', desc: 'Satellite positioning fixes with on-device DEM elevation matching' }
];
