export type BuildingKind =
  | "hospital"
  | "residential"
  | "empty_plot"
  | "pharmacy"
  | "police_station"
  | "temple"
  | "mosque"
  | "bank"
  | "school"
  | "college"
  | "market"
  | "railway_station"
  | "bus_stand"
  | "post_office"
  | "fire_station"
  | "petrol_pump"
  | "hotel"
  | "restaurant"
  | "office"
  | "factory"
  | "warehouse"
  | "park"
  | "water_tank"
  | "government_office"
  | "court"
  | "community_hall"
  | "cinema"
  | "playground"
  | "parking"
  | "shop";

export type BuildingDef = {
  kind: BuildingKind;
  label: string;
  hindi: string;
  color: string;
  accent: string;
  icon: string;
};

export const BUILDINGS: Record<BuildingKind, BuildingDef> = {
  hospital: { kind: "hospital", label: "Hospital", hindi: "Aspatal", color: "#FEE2E2", accent: "#DC2626", icon: "+" },
  residential: { kind: "residential", label: "Homes", hindi: "Makan", color: "#DBEAFE", accent: "#2563EB", icon: "H" },
  empty_plot: { kind: "empty_plot", label: "Empty Plot", hindi: "Khali Plot", color: "#F5F5F4", accent: "#78716C", icon: "P" },
  pharmacy: { kind: "pharmacy", label: "Pharmacy", hindi: "Dawai Dukan", color: "#DCFCE7", accent: "#16A34A", icon: "Rx" },
  police_station: { kind: "police_station", label: "Police", hindi: "Thana", color: "#DBEAFE", accent: "#1D4ED8", icon: "PS" },
  temple: { kind: "temple", label: "Temple", hindi: "Mandir", color: "#FFEDD5", accent: "#EA580C", icon: "Om" },
  mosque: { kind: "mosque", label: "Mosque", hindi: "Masjid", color: "#D1FAE5", accent: "#059669", icon: "M" },
  bank: { kind: "bank", label: "Bank", hindi: "Bank", color: "#FEF3C7", accent: "#B45309", icon: "Rs" },
  school: { kind: "school", label: "School", hindi: "School", color: "#E0E7FF", accent: "#4F46E5", icon: "A" },
  college: { kind: "college", label: "College", hindi: "College", color: "#EDE9FE", accent: "#7C3AED", icon: "C" },
  market: { kind: "market", label: "Market", hindi: "Bazaar", color: "#FCE7F3", accent: "#DB2777", icon: "Mkt" },
  railway_station: { kind: "railway_station", label: "Railway", hindi: "Railway Station", color: "#E2E8F0", accent: "#334155", icon: "R" },
  bus_stand: { kind: "bus_stand", label: "Bus Stand", hindi: "Bus Adda", color: "#CCFBF1", accent: "#0F766E", icon: "B" },
  post_office: { kind: "post_office", label: "Post Office", hindi: "Dak Ghar", color: "#FEE2E2", accent: "#B91C1C", icon: "PO" },
  fire_station: { kind: "fire_station", label: "Fire Station", hindi: "Fire Station", color: "#FED7AA", accent: "#C2410C", icon: "F" },
  petrol_pump: { kind: "petrol_pump", label: "Petrol Pump", hindi: "Petrol Pump", color: "#DCFCE7", accent: "#15803D", icon: "Fuel" },
  hotel: { kind: "hotel", label: "Hotel", hindi: "Hotel", color: "#E0F2FE", accent: "#0284C7", icon: "Inn" },
  restaurant: { kind: "restaurant", label: "Restaurant", hindi: "Bhojanalay", color: "#FFEDD5", accent: "#D97706", icon: "Food" },
  office: { kind: "office", label: "Office", hindi: "Karyalay", color: "#E5E7EB", accent: "#4B5563", icon: "Off" },
  factory: { kind: "factory", label: "Factory", hindi: "Karkhana", color: "#E7E5E4", accent: "#57534E", icon: "Ind" },
  warehouse: { kind: "warehouse", label: "Warehouse", hindi: "Godown", color: "#F1F5F9", accent: "#475569", icon: "Wh" },
  park: { kind: "park", label: "Park", hindi: "Bagicha", color: "#BBF7D0", accent: "#15803D", icon: "Park" },
  water_tank: { kind: "water_tank", label: "Water Tank", hindi: "Pani Tanki", color: "#DBEAFE", accent: "#0284C7", icon: "WT" },
  government_office: { kind: "government_office", label: "Govt Office", hindi: "Sarkari Daftar", color: "#FEF9C3", accent: "#A16207", icon: "Gov" },
  court: { kind: "court", label: "Court", hindi: "Nyayalaya", color: "#F3E8FF", accent: "#9333EA", icon: "Law" },
  community_hall: { kind: "community_hall", label: "Community Hall", hindi: "Samudayik Bhavan", color: "#FCE7F3", accent: "#BE185D", icon: "Hall" },
  cinema: { kind: "cinema", label: "Cinema", hindi: "Cinema", color: "#FAE8FF", accent: "#A21CAF", icon: "Film" },
  playground: { kind: "playground", label: "Playground", hindi: "Khel Maidan", color: "#DCFCE7", accent: "#65A30D", icon: "Play" },
  parking: { kind: "parking", label: "Parking", hindi: "Parking", color: "#E0F2FE", accent: "#0369A1", icon: "P" },
  shop: { kind: "shop", label: "Shop", hindi: "Dukan", color: "#FEF3C7", accent: "#CA8A04", icon: "Shop" },
};

export const BUILDING_ORDER: BuildingKind[] = [
  "hospital",
  "residential",
  "empty_plot",
  "pharmacy",
  "police_station",
  "temple",
  "mosque",
  "bank",
  "school",
  "college",
  "market",
  "railway_station",
  "bus_stand",
  "post_office",
  "fire_station",
  "petrol_pump",
  "hotel",
  "restaurant",
  "office",
  "factory",
  "warehouse",
  "park",
  "water_tank",
  "government_office",
  "court",
  "community_hall",
  "cinema",
  "playground",
  "parking",
  "shop",
];
