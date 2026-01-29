export interface ExpandedContent {
  heroVideo?: string;
  heroImage?: string;
  overview: string;
  stats: {
    label: string;
    value: string;
    trend?: "up" | "down" | "neutral";
  }[];
  timeline: {
    date: string;
    title: string;
    description: string;
  }[];
  gallery: {
    type: "image" | "video";
    url: string;
    caption: string;
  }[];
  team: {
    name: string;
    role: string;
    avatar: string;
  }[];
  documents: {
    title: string;
    type: string;
    size: string;
  }[];
}

export interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  imageUrl: string | null;
  expandedContent?: ExpandedContent;
}

export interface SpaceOperation {
  id: number;
  name: string;
  description: string;
  orbitType: "LEO" | "MEO" | "GEO" | "HEO" | "Lunar" | "Deep Space";
  altitude: string;
  category: string;
  imageUrl: string | null;
  expandedContent?: ExpandedContent;
}

export const locations: Location[] = [
  {
    id: 1,
    name: "Kyoto, Japan",
    description: "The cultural capital of Japan, famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
    latitude: 35.0116,
    longitude: 135.7681,
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Santorini, Greece",
    description: "A volcanic island in the Cyclades group of the Greek islands. It is famous for its dramatic views, stunning sunsets from Oia town, strange white aubergine (eggplant), and its very own active volcano.",
    latitude: 36.3932,
    longitude: 25.4615,
    category: "Humanitarian aid",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Machu Picchu, Peru",
    description: "A 15th-century Inca citadel, located in the Eastern Cordillera of southern Peru, on a 2,430-metre (7,970 ft) mountain ridge.",
    latitude: -13.1631,
    longitude: -72.5450,
    category: "QRA",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Reykjavik, Iceland",
    description: "The capital and largest city of Iceland. It is located in southwestern Iceland, on the southern shore of Faxaflói bay.",
    latitude: 64.1466,
    longitude: -21.9426,
    category: "International partnerships",
    imageUrl: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Cape Town, South Africa",
    description: "A port city on South Africa's southwest coast, on a peninsula beneath the imposing Table Mountain.",
    latitude: -33.9249,
    longitude: 18.4241,
    category: "Exercises",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Arashiyama, Japan",
    description: "A scenic district on the western outskirts of Kyoto, known for bamboo groves and riverside vistas.",
    latitude: 34.9855,
    longitude: 135.5703,
    category: "Humanitarian aid",
    imageUrl: "https://images.unsplash.com/photo-1505067216369-2e6a8aa7f099?auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Gion, Kyoto",
    description: "Kyoto's historic geisha district, lined with traditional wooden machiya houses and tea shops.",
    latitude: 35.1189,
    longitude: 135.9204,
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1493997181344-712f2f19d87a?auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Fira, Santorini",
    description: "Cliffside capital of Santorini with whitewashed architecture and sweeping caldera views.",
    latitude: 36.6084,
    longitude: 25.2357,
    category: "Exercises",
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    name: "Oia, Santorini",
    description: "Iconic village perched on volcanic cliffs, famous for blue domes and sunset vistas.",
    latitude: 36.5487,
    longitude: 25.6729,
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    name: "Aguas Calientes, Peru",
    description: "Gateway town to Machu Picchu, nestled along the Urubamba River in the Andes.",
    latitude: -13.0508,
    longitude: -72.2159,
    category: "Exercises",
    imageUrl: "https://images.unsplash.com/photo-1459679749680-18aa1c6fe2a9?auto=format&fit=crop&q=80"
  },
  {
    id: 11,
    name: "Sacred Valley, Peru",
    description: "A highland valley in the Andes, dotted with Inca sites and traditional villages.",
    latitude: -13.6124,
    longitude: -71.7345,
    category: "QRA",
    imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80"
  },
  {
    id: 12,
    name: "Kopavogur, Iceland",
    description: "A neighboring town to Reykjavik with coastal walks and geothermal pools.",
    latitude: 64.5674,
    longitude: -22.2176,
    category: "International partnerships",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
  },
  {
    id: 13,
    name: "Stellenbosch, South Africa",
    description: "A university town surrounded by vineyards and Cape Dutch architecture.",
    latitude: -33.7402,
    longitude: 19.0528,
    category: "Training",
    imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80"
  },
  {
    id: 14,
    name: "Tokyo, Japan",
    description: "Japan's capital, a sprawling metropolis blending neon modernity with historic temples.",
    latitude: 35.6764,
    longitude: 139.6500,
    category: "Exercises",
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80"
  },
  {
    id: 15,
    name: "Athens, Greece",
    description: "Ancient city known for the Acropolis, white-stone plazas, and a vibrant modern culture.",
    latitude: 37.9838,
    longitude: 23.7275,
    category: "QRA",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
  },
  {
    id: 16,
    name: "Lima, Peru",
    description: "Capital city on Peru's Pacific coast, famed for colonial architecture and coastal cliffs.",
    latitude: -12.0464,
    longitude: -77.0428,
    category: "Exercises",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
  },
  {
    id: 17,
    name: "Akureyri, Iceland",
    description: "Northern Icelandic town known for fjord views and access to nearby waterfalls.",
    latitude: 65.6835,
    longitude: -18.1105,
    category: "Humanitarian aid",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80"
  },
  {
    id: 18,
    name: "Johannesburg, South Africa",
    description: "South Africa's largest city, a major economic hub with rich cultural history.",
    latitude: -26.2041,
    longitude: 28.0473,
    category: "Exercises",
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80",
    expandedContent: {
      heroVideo: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&q=80",
      heroImage: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&q=80",
      overview: "Operation Johannesburg represents our flagship initiative in the African continent. This multi-phase deployment has established critical infrastructure across the greater Gauteng region, enabling unprecedented data collection and analysis capabilities. The operation leverages local partnerships and cutting-edge technology to achieve strategic objectives while maintaining complete operational security.",
      stats: [
        { label: "Active Sensors", value: "2,847", trend: "up" },
        { label: "Data Points / Day", value: "14.2M", trend: "up" },
        { label: "Coverage Area", value: "1,645 km²", trend: "neutral" },
        { label: "Uptime", value: "99.97%", trend: "up" },
        { label: "Response Time", value: "12ms", trend: "down" },
        { label: "Team Members", value: "34", trend: "neutral" }
      ],
      timeline: [
        {
          date: "2024-01",
          title: "Initial Reconnaissance",
          description: "Ground team deployed for preliminary assessment and site surveys across key locations in Johannesburg CBD and surrounding areas."
        },
        {
          date: "2024-03",
          title: "Infrastructure Phase",
          description: "Primary network nodes established. Secure communications backbone deployed with redundant failover systems."
        },
        {
          date: "2024-06",
          title: "Sensor Deployment",
          description: "First wave of monitoring equipment installed across 47 strategic locations. Real-time data feeds established."
        },
        {
          date: "2024-09",
          title: "Full Operational Capacity",
          description: "Operation reached 100% planned capacity. All systems nominal. Continuous monitoring and analysis initiated."
        },
        {
          date: "2025-01",
          title: "Phase 2 Expansion",
          description: "Extended coverage to Pretoria corridor. Additional 800 sensors deployed. AI-driven anomaly detection activated."
        }
      ],
      gallery: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?auto=format&fit=crop&q=80",
          caption: "Johannesburg skyline from operations center"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80",
          caption: "Network infrastructure installation"
        },
        {
          type: "video",
          url: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80",
          caption: "Aerial survey footage - restricted"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80",
          caption: "Field team deployment"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?auto=format&fit=crop&q=80",
          caption: "Sensor array installation"
        },
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&q=80",
          caption: "Operations center interior"
        }
      ],
      team: [
        { name: "Sarah Chen", role: "Operations Lead", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
        { name: "Marcus Webb", role: "Field Director", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
        { name: "Anika Patel", role: "Data Analyst", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100" },
        { name: "James Okonkwo", role: "Local Liaison", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" }
      ],
      documents: [
        { title: "Operational Brief Q4 2024", type: "PDF", size: "2.4 MB" },
        { title: "Sensor Network Topology", type: "PDF", size: "8.1 MB" },
        { title: "Risk Assessment Report", type: "PDF", size: "1.2 MB" },
        { title: "Field Operations Manual", type: "PDF", size: "15.7 MB" }
      ]
    }
  }
];

export function getLocation(id: number): Location | undefined {
  return locations.find(loc => loc.id === id);
}

export function getLocations(): Location[] {
  return locations;
}

export const spaceOperations: SpaceOperation[] = [
  {
    id: 1001,
    name: "SENTINEL-7",
    description: "Advanced Earth observation satellite providing real-time imagery and environmental monitoring across global hotspots. Equipped with multi-spectral sensors and synthetic aperture radar.",
    orbitType: "LEO",
    altitude: "512 km",
    category: "reconnaissance",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80",
    expandedContent: {
      heroImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80",
      overview: "SENTINEL-7 represents our most advanced orbital reconnaissance platform. Operating in low Earth orbit, this satellite provides continuous coverage of strategic regions with sub-meter resolution imaging capabilities. The platform integrates AI-driven anomaly detection for automated alerts.",
      stats: [
        { label: "Orbital Period", value: "94.6 min", trend: "neutral" },
        { label: "Coverage/Day", value: "12.4M km²", trend: "up" },
        { label: "Image Resolution", value: "0.3m", trend: "neutral" },
        { label: "Data Downlink", value: "1.2 Gbps", trend: "up" },
        { label: "Mission Duration", value: "847 days", trend: "up" },
        { label: "Fuel Remaining", value: "72%", trend: "down" }
      ],
      timeline: [
        { date: "2023-06", title: "Launch", description: "Successfully deployed from Vandenberg SFB aboard Falcon 9." },
        { date: "2023-07", title: "Commissioning", description: "All systems nominal. Began operational imaging campaign." },
        { date: "2024-03", title: "Software Update", description: "AI detection algorithms upgraded with 40% improved accuracy." },
        { date: "2025-01", title: "Extended Mission", description: "Mission extended 3 years based on exceptional performance." }
      ],
      gallery: [
        { type: "image", url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80", caption: "SENTINEL-7 in orbit" },
        { type: "image", url: "https://images.unsplash.com/photo-1457364887197-9150188c107b?auto=format&fit=crop&q=80", caption: "Launch sequence" }
      ],
      team: [
        { name: "Dr. Elena Vasquez", role: "Mission Director", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
        { name: "Col. James Wright", role: "Operations Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" }
      ],
      documents: [
        { title: "Mission Status Report", type: "PDF", size: "3.2 MB" },
        { title: "Orbital Parameters", type: "PDF", size: "1.1 MB" }
      ]
    }
  },
  {
    id: 1002,
    name: "ARTEMIS RELAY",
    description: "Deep space communications relay supporting lunar operations and beyond. Provides critical data links for crewed and uncrewed missions in cislunar space.",
    orbitType: "Lunar",
    altitude: "384,400 km",
    category: "communications",
    imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80"
  },
  {
    id: 1003,
    name: "HAWKEYE-3",
    description: "Geostationary signals intelligence platform providing persistent coverage over areas of strategic interest. Advanced SIGINT and ELINT capabilities.",
    orbitType: "GEO",
    altitude: "35,786 km",
    category: "intelligence",
    imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80"
  },
  {
    id: 1004,
    name: "NAVIGATOR CONSTELLATION",
    description: "Network of 24 satellites providing enhanced positioning, navigation, and timing services with military-grade encryption and anti-jamming capabilities.",
    orbitType: "MEO",
    altitude: "20,200 km",
    category: "navigation",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
  },
  {
    id: 1005,
    name: "AURORA STATION",
    description: "Classified orbital research platform conducting advanced materials science and observation experiments. Crew rotation every 90 days.",
    orbitType: "LEO",
    altitude: "408 km",
    category: "research",
    imageUrl: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80"
  },
  {
    id: 1006,
    name: "DEEP WATCH",
    description: "Space-based infrared early warning satellite detecting missile launches and tracking objects in Earth orbit. Critical component of strategic defense.",
    orbitType: "HEO",
    altitude: "39,000 km apogee",
    category: "defense",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80"
  }
];

export function getSpaceOperation(id: number): SpaceOperation | undefined {
  return spaceOperations.find(op => op.id === id);
}

export function getSpaceOperations(): SpaceOperation[] {
  return spaceOperations;
}
