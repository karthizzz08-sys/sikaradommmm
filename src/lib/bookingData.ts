export interface HallDuration {
  id: string;
  label: string;
  timing: string;
  price: number;
}

export interface AdditionalCharge {
  id: string;
  label: string;
  rate: string;
  unit: string;
  icon: string;
}

export interface Extra {
  id: string;
  label: string;
  price: number;
  icon: string;
}

export interface PhotoPackage {
  id: string;
  name: string;
  tier: 'silver' | 'gold' | 'platinum' | 'diamond';
  pricePerEvent: number;
  priceFor2Events: number;
  features: string[];
  badge?: string;
}

export interface DecorationItem {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  image?: string;
}

// ─── SALON ───
export interface SalonPackage {
  id: string;
  name: string;
  price: number;
  includes: string[];
}

export const salonPackages: SalonPackage[] = [
  {
    id: 'normal-makeup',
    name: 'Normal Make Up',
    price: 14999,
    includes: ['Makeup', 'Gold Facial', 'Waxing', 'Manicure & Pedicure', 'Threading', 'Hair Spa', 'Hair Cut'],
  },
  {
    id: 'hd-makeup',
    name: 'HD Make Up',
    price: 29999,
    includes: ['HD Makeup', 'O3+ Facial', 'Full Waxing', 'Manicure & Pedicure', 'Threading', 'Hair Spa'],
  },
  {
    id: 'traditional-makeup',
    name: 'Traditional Make Up',
    price: 21999,
    includes: ['VLCC Diamond Facial', 'Full Waxing', 'Manicure & Pedicure', 'Threading', 'Upper Lip', 'Hair Spa', 'Jewellery Set', 'Mehndi'],
  },
];

// ─── CATERING ───
export interface CateringPackage {
  id: string;
  name: string;
  pricePerHead: number;
  category: 'tiffen' | 'lunch' | 'dinner';
  includes: string[];
}

export const cateringPackages: CateringPackage[] = [
  // Morning Tiffen
  {
    id: 'tiffen-260',
    name: 'Premium Tiffen',
    pricePerHead: 260,
    category: 'tiffen',
    includes: ['Carrot Halwa / Asoka Halwa', 'Mini Vada / Bonda', 'Variety Idli', 'Mini Onion Uthappam', 'Puri + Masal', 'Sambar', 'Coconut Chutney', 'Tomato Chutney', 'Kalla Paruppu Thovaiyal', 'Idiyappam', 'Coconut Milk', 'Mundiri Pongal', 'Badam Milk', 'Banana', 'Water Bottle', 'Banana Leaf', 'Paper Roll', 'Serving & Cleaning'],
  },
  {
    id: 'tiffen-200',
    name: 'Standard Tiffen',
    pricePerHead: 200,
    category: 'tiffen',
    includes: ['Carrot Halwa / Asoka Halwa', 'Mini Vada / Bonda', 'Variety Idli', 'Mini Onion Uthappam', 'Puri + Masal', 'Sambar', 'Coconut Chutney', 'Tomato Chutney', 'Idiyappam', 'Coconut Milk', 'Tea / Coffee', 'Water Bottle', 'Banana Leaf', 'Paper Roll', 'Serving & Cleaning'],
  },
  {
    id: 'tiffen-150',
    name: 'Basic Tiffen',
    pricePerHead: 150,
    category: 'tiffen',
    includes: ['Jilebi / Milk Sweet', 'Mini Vada / Bonda', 'Variety Idli', 'Mini Veg Uthappam', 'Sambar', 'Coconut Chutney', 'Tomato Chutney', 'Water Bottle', 'Banana Leaf', 'Paper Roll', 'Serving & Cleaning'],
  },
  // Lunch
  {
    id: 'lunch-650',
    name: 'Grand Non-Veg Lunch',
    pricePerHead: 650,
    category: 'lunch',
    includes: ['Mutton Biriyani (Seeraga Samba)', 'Bread Halwa', 'Elumbu Thalicha', 'Egg', 'Fish 65', 'Chicken Gravy', 'Raitha', 'Brinjal Curry', 'Curd Rice', 'Live Beeda', 'Badam Milk', 'Live Ice Cream', 'Water Bottle', 'Banana Leaf', 'Serving & Cleaning'],
  },
  {
    id: 'lunch-500',
    name: 'Chicken Biriyani Lunch',
    pricePerHead: 500,
    category: 'lunch',
    includes: ['Chicken Biriyani', 'Bread Halwa', 'Chicken Gravy', 'Egg', 'Raitha', 'Brinjal Curry', 'Curd Rice', 'Live Beeda', 'Badam Milk', 'Live Ice Cream', 'Water Bottle', 'Banana Leaf', 'Serving & Cleaning'],
  },
  {
    id: 'lunch-450',
    name: 'Standard Lunch',
    pricePerHead: 450,
    category: 'lunch',
    includes: ['Chicken Biriyani', 'Chicken Gravy', 'Egg', 'Raitha', 'Brinjal Curry', 'Curd Rice', 'Badam Milk', 'Ice Cream', 'Water Bottle', 'Banana Leaf', 'Serving & Cleaning'],
  },
  // Dinner
  {
    id: 'dinner-450',
    name: 'Grand Dinner',
    pricePerHead: 450,
    category: 'dinner',
    includes: ['Halwa', 'Tiffen Items', 'Parotta + Paneer Butter Masala', 'Fried Rice', 'Gobi 65', 'Idiyappam', 'Milk', 'Live Ice Cream', 'Live Beeda', 'Water Bottle', 'Banana Leaf', 'Serving & Cleaning'],
  },
  {
    id: 'dinner-380',
    name: 'Medium Dinner',
    pricePerHead: 380,
    category: 'dinner',
    includes: ['Halwa', 'Parotta + Paneer Butter Masala', 'Fried Rice', 'Gobi 65', 'Idiyappam', 'Milk', 'Ice Cream', 'Water Bottle', 'Banana Leaf', 'Serving & Cleaning'],
  },
  {
    id: 'dinner-280',
    name: 'Basic Dinner',
    pricePerHead: 280,
    category: 'dinner',
    includes: ['Parotta + Paneer Butter Masala', 'Fried Rice', 'Gobi 65', 'Tea / Coffee', 'Ice Cream', 'Water Bottle', 'Banana Leaf', 'Serving & Cleaning'],
  },
];

// ─── EVENT ITEMS (detailed) ───
export interface EventItem {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
  defaultQty: number;
  minQty: number;
  category: string;
}

export const eventItems: EventItem[] = [
  // Welcome Setup
  { id: 'welcome-girls', name: 'Welcome Girls', basePrice: 2000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Welcome Setup' },
  { id: 'welcome-drinks', name: 'Welcome Drinks (Coffee/Tea/Buttermilk/Juice)', basePrice: 2000, unit: 'per 100 nos', defaultQty: 1, minQty: 1, category: 'Welcome Setup' },
  { id: 'welcome-crackers', name: 'Welcome Crackers', basePrice: 1500, unit: 'per 2 nos', defaultQty: 1, minQty: 1, category: 'Welcome Setup' },
  // Plates & Entry
  { id: 'valai-maram', name: 'Valai Maram', basePrice: 2000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry' },
  { id: 'seer-plate', name: 'Seer Plate / Named Plate', basePrice: 500, unit: 'per plate', defaultQty: 1, minQty: 1, category: 'Plates & Entry' },
  { id: 'karbedu-plate', name: 'Karbedu Plate', basePrice: 100, unit: 'per plate', defaultQty: 1, minQty: 1, category: 'Plates & Entry' },
  { id: 'chocolate-plate', name: 'Chocolate Plate', basePrice: 150, unit: 'per plate', defaultQty: 1, minQty: 1, category: 'Plates & Entry' },
  { id: 'cream-plate', name: 'Cream Plate', basePrice: 250, unit: 'per plate', defaultQty: 1, minQty: 1, category: 'Plates & Entry' },
  { id: 'flower-pot', name: 'Flower Pot (Welcome Table)', basePrice: 500, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry' },
  // Decorations & Effects
  { id: 'outer-lighting', name: 'Outer Lighting', basePrice: 10000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects' },
  { id: 'dj-dance', name: 'DJ & Dance', basePrice: 35000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects' },
  { id: 'chariot-entry', name: 'Chariot Entry', basePrice: 35000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects' },
  { id: 'pyro-blast', name: 'Pyro Blast', basePrice: 1500, unit: 'per burst', defaultQty: 1, minQty: 1, category: 'Decorations & Effects' },
  { id: 'bubble-effect', name: 'Bubble Effect', basePrice: 1500, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects' },
  { id: 'ice-smoke-entry', name: 'Ice Smoke Entry', basePrice: 5000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects' },
];

// ─── EXISTING DATA ───

export const hallDurations: HallDuration[] = [
  { id: '4hrs', label: '4 Hours', timing: 'Flexible timing', price: 25000 },
  { id: 'half', label: 'Half Day', timing: '6:00 AM – 4:00 PM', price: 35000 },
  { id: 'full', label: 'Full Day', timing: '4:00 PM – 4:00 PM', price: 55000 },
];

export const additionalCharges: AdditionalCharge[] = [
  { id: 'electricity', label: 'Electricity (EB)', rate: '₹30', unit: 'per unit', icon: '⚡' },
  { id: 'cleaning', label: 'Cleaning Charges', rate: '₹5,000', unit: 'fixed', icon: '🧹' },
  { id: 'gas', label: 'Gas Charges', rate: '₹220/kg', unit: 'if used', icon: '🔥' },
  { id: 'generator', label: 'Generator', rate: '₹2,500/hr', unit: 'if used', icon: '🔌' },
];

export const extras: Extra[] = [
  { id: 'mandapam-light', label: 'Mandapam Lighting', price: 8000, icon: '💡' },
  { id: 'lawn-light', label: 'Lawn Area Lighting', price: 5000, icon: '🌿' },
  { id: 'bubble', label: 'Bubble Burst', price: 1500, icon: '🫧' },
  { id: 'pyro', label: 'Pyro Burst', price: 1500, icon: '🎆' },
  { id: 'paper', label: 'Paper Burst', price: 1500, icon: '🎊' },
  { id: 'selfie', label: '360° Selfie Booth', price: 7500, icon: '📸' },
];

export const photoPackages: PhotoPackage[] = [
  {
    id: 'silver',
    name: 'Silver',
    tier: 'silver',
    pricePerEvent: 8000,
    priceFor2Events: 12000,
    features: ['Traditional Photographer (1)', 'Fully digital photos in pendrive'],
  },
  {
    id: 'gold',
    name: 'Gold',
    tier: 'gold',
    pricePerEvent: 25000,
    priceFor2Events: 40000,
    features: ['Traditional Photographer (1)', 'Traditional Videographer (1)', 'Full-length 4K video + photos in pendrive', 'Premium Canva Album (1)'],
    badge: 'Popular',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    tier: 'platinum',
    pricePerEvent: 50000,
    priceFor2Events: 80000,
    features: ['Traditional Photographer (1)', 'Traditional Videographer (1)', 'Candid Photographer (1)', 'Drone + TV (2 nos)', 'Full-length 4K video + photos', 'Premium Canva Album'],
    badge: 'Best Value',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tier: 'diamond',
    pricePerEvent: 80000,
    priceFor2Events: 120000,
    features: ['Traditional Photographer (1)', 'Traditional Videographer (1)', 'Candid Photographer (1)', 'Drone + TV (2 nos)', 'Pre/Post wedding shoot (1 day)', 'Full-length 4K video + photos', 'Premium Canva Album (enhanced)', 'Cinematic story invitation', 'Special proposal event', 'Digital invitation'],
    badge: 'Premium',
  },
];

export const decorationItems: DecorationItem[] = [
  { id: 'stage-basic', name: 'Basic Stage Decoration', price: 10000, description: 'Simple floral & fabric stage setup', icon: '🌸' },
  { id: 'stage-premium', name: 'Premium Stage Decoration', price: 12000, description: 'Elegant violet & white floral mandapam', icon: '💐' },
  { id: 'stage-grand', name: 'Grand Stage Decoration', price: 15000, description: 'Luxury full-stage décor with lighting', icon: '👑' },
  { id: 'entrance', name: 'Entrance Decoration', price: 15000, description: 'Welcome arch with flowers & drapes', icon: '🚪' },
  { id: 'table-decor', name: 'Table Centerpieces', price: 15000, description: 'Elegant table arrangements (all tables)', icon: '🕯️' },
  { id: 'car-decor', name: 'Outdoor Welcome Arch', price: 15000, description: 'Grand outdoor arch with marigold & LED lights', icon: '🚗' },
  { id: 'mandapam-floral', name: 'Mandapam Floral Setup', price: 18000, description: 'Traditional mandapam with fresh flowers', icon: '🌺' },
  { id: 'reception-decor', name: 'Birthday Hall Décor', price: 18000, description: 'Full birthday hall decoration with drapes & lights', icon: '✨' },
  { id: 'outdoor-arch', name: 'Wedding Car Decoration', price: 5000, description: 'Beautiful car décor with flowers & ribbons', icon: '🏛️' },
];

export function formatPrice(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
