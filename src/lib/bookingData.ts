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
  unit?: string;
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
    price: 7499,
    includes: ['Makeup', 'Gold Facial', 'Waxing', 'Manicure & Pedicure', 'Threading', 'Hair Spa', 'Hair Cut'],
  },
  {
    id: 'hd-makeup',
    name: 'HD Make Up',
    price: 14999,
    includes: ['HD Makeup', 'O3+ Facial', 'Full Waxing', 'Manicure & Pedicure', 'Threading', 'Hair Spa'],
  },
  {
    id: 'traditional-makeup',
    name: 'Traditional Make Up',
    price: 11999,
    includes: ['VLCC Diamond Facial', 'Full Waxing', 'Manicure & Pedicure', 'Threading', 'Upper Lip', 'Hair Spa', 'Jewellery Set', 'Mehndi'],
  },
];

export const mensGroomingPackages: SalonPackage[] = [
  {
    id: 'prince-package',
    name: 'THE PRINCE PACKAGE',
    price: 2499,
    includes: ['Haircut', 'Beard', 'Hairwash', 'D.Tan', 'Aroma / Fruit Facial', 'Hair Coloring / Hair Spa'],
  },
  {
    id: 'king-package',
    name: 'THE KING PACKAGE',
    price: 3399,
    includes: ['Haircut', 'Beard', 'Hairwash', 'D.Tan', 'Gold / Diamond / Platinum Facial', 'Hair Coloring / Hair Spa'],
  },
  {
    id: 'emperor-package',
    name: 'THE EMPEROR PACKAGE',
    price: 4499,
    includes: ['VIP Private Suite Haircut', 'Signature Beard Design & Hot Towel Shave', 'Therapeutic Scalp Massage & Treatment', 'Anti-aging Skin Firming Treatment', 'Luxury Facial with Gold Serum', 'Hair Spa with Hand & Foot Massage', 'Pre-wedding Grooming Consultation'],
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
    includes: ['Carrot Halwa / Asoka Halwa', 'Ulutha Vada Mini/ Mini Bonda', 'Variety Idli', 'Mini Onion Uthappam','puri' ,'Puri + Masal', 'Sambar', 'Coconut Chutney', 'Tomato Chutney', 'Kalla Paruppu Thovaiyal', 'Idiyappam', 'Coconut Milk', 'Mundiri Pongal', 'Badam Milk', 'Banana', 'Water Bottle', 'Vaalai Ilia', 'Paper Roll', 'Serving & Cleaning'],
  },
  {
    id: 'tiffen-200',
    name: 'Standard Tiffen',
    pricePerHead: 200,
    category: 'tiffen',
    includes: ['Carrot Halwa / Asoka Halwa', 'Ulutha Vada Mini/ Mini Bonda', 'Variety Idli', 'Mini Onion Uthappam','puri' ,'Puri + Masal', 'Sambar', 'Coconut Chutney', 'Tomato Chutney', 'Green chutney','Tea / Coffee', 'Water Bottle', 'Vaalai Ilia', 'Paper Roll', 'Serving & Cleaning'],
  },
  {
    id: 'tiffen-150',
    name: 'Basic Tiffen',
    pricePerHead: 150,
    category: 'tiffen',
    includes: ['Jilebi / Milk Sweet', 'Ulutha Vada Mini /Mini Bonda', 'Variety Idli', 'Mini Veg Uthappam', 'Sambar', 'Coconut Chutney', 'Tomato Chutney', 'Green Chutney','Water Bottle', 'Vaalai Ilia', 'Paper Roll', 'Serving & Cleaning'],
  },
  // Lunch
  {
    id: 'lunch-650',
    name: 'Grand Non-Veg Lunch',
    pricePerHead: 650,
    category: 'lunch',
    includes: [ 'Bread Halwa','Mutton Biriyani (Seeraga Samba)' ,'Elumbu Thalicha', 'Fried Egg', 'Fish 65(Tuna Fish)', 'Chicken Gravy', 'Carrot Onion Raitha', 'Puli Kathtika', 'Curd Rice With Fruits', 'Live Beeda', 'Hot Badam Milk', 'Live Ice Cream', 'Water Bottle', 'Vaalai Ilia', 'Paper Roll','Serving & Cleaning'],
  },
  {
    id: 'lunch-500',
    name: 'Chicken Biriyani Lunch',
    pricePerHead: 500,
    category: 'lunch',
    includes: [ 'Bread Halwa', 'Mutton Biriyani (Seeraga Samba)','Elumbu Thalicha','Fried Egg','Ellu Fish 65(Tuna Fish)','Chicken Gravy', 'Carrot Onion Raitha', 'Puli Kathrika', 'Curd Rice', 'Live Beeda', 'Hot Badam Milk', 'Live Ice Cream', 'Water Bottle', 'Vaalai Ilia', 'Paper Roll','Serving & Cleaning'],
  },
  {
    id: 'lunch-450',
    name: 'Standard Lunch',
    pricePerHead: 450,
    category: 'lunch',
    includes: ['Bread Halwa','Chicken Biriyani(Seeraga Samba)','Elumbu Thalicha' ,'Fried Egg','Chicken Gravy', 'Carrot Onion Raitha', 'Puli Kathrika', 'Curd Rice With Fruits','Live Beeda', 'Hot Badam Milk', 'Ice Cream', 'Water Bottle', 'Vaalai Ilia','Paper Roll', 'Serving & Cleaning'],
  },
  {
    id: 'lunch-veg-custom',
    name: 'Veg Lunch (Traditional)',
    pricePerHead: 300,
    category: 'lunch',
    includes: ['Halwa', 'Ponni Arisi Soru', 'Kalyana Sambar', 'Kovai Milagu Rasam', 'Vatha Kulambu', 'Urulaikilangu Double Beans Roast', 'Pachapayir Carrot Poriyal', 'Chow Chow Senai Kootu', 'Appalam', 'Gothumai Rava Payasam', 'Medhu Vadai', 'Mango Pickle', 'Water Bottle', 'Ice Cream', 'Banana Leaf', 'Paper Roll & Service'],
  },
  // Dinner
  {
  id: 'dinner-450',
  name: 'Dinner Menu 450',
  pricePerHead: 450,
  category: 'dinner',
  includes: [
    'Carrot Halwa / Asoka Halwa',
    'Uluntha Vada Mini / Mini Bonda',
    'Variety Idli',
    'Mini Veg Uthappam',
    'Parotta',
    'Paneer Butter Masala',
    'Sambar',
    'Coconut Chutney',
    'Tomato Chutney',
    'Kalla Paruppu Thovaiyal',
    'Idiyappam',
    'Thengai Milk',
    'Veg Fried Rice',
    'Gobi 65',
    'Fruit Curd Rice',
    'Badam Milk',
    'Ice Cream (Live)',
    'Beeda (Live)',
    'Water Bottle',
    'Vaalai Ilai',
    'Paper Roll',
    'Serving & Cleaning',
  ],
},
{
  id: 'dinner-380',
  name: 'Dinner Menu 380',
  pricePerHead: 380,
  category: 'dinner',
  includes: [
    'Carrot Halwa / Asoka Halwa',
    'Uluntha Vada Mini / Mini Bonda',
    'Variety Idli',
    'Mini Veg Uthappam',
    'Parotta',
    'Paneer Butter Masala',
    'Sambar',
    'Coconut Chutney',
    'Tomato Chutney',
    'Kalla Paruppu Thovaiyal',
    'Fruit Curd Rice',
    'Badam Milk',
    'Ice Cream (Live)',
    'Beeda (Live)',
    'Water Bottle',
    'Vaalai Ilai',
    'Paper Roll',
    'Serving & Cleaning',
  ],
},
{
  id: 'dinner-280',
  name: 'Dinner Menu 280',
  pricePerHead: 280,
  category: 'dinner',
  includes: [
    'Carrot Halwa / Asoka Halwa',
    'Uluntha Vada Mini / Mini Bonda',
    'Variety Idli',
    'Mini Veg Uthappam',
    // 'Parotta',
    // 'Paneer Butter Masala',
    'Sambar',
    'Coconut Chutney',
    'Tomato Chutney',
    // 'Kalla Paruppu Thovaiyal',
    // 'Idiyappam',
    // 'Thengai Milk',
    // 'Veg Fried Rice',
    // 'Gobi 65',
    'Fruit Curd Rice',
    'Tea / Coffee',
    'Ice Cream (Live)',
    'Beeda (Live)',
    'Water Bottle',
    'Vaalai Ilai',
    'Paper Roll',
    'Serving & Cleaning',
  ],
},
];

// ─── CATERING ADD-ONS ───
export interface CateringAddOn {
  id: string;
  name: string;
  price: number;
  unit: string;
  icon: string;
}

export const cateringAddOns: CateringAddOn[] = [
  { id: 'chicken-65', name: 'Chicken 65', price: 5000, unit: 'per 100 nos', icon: '🍗' },
  { id: 'paneer-65', name: 'Paneer 65', price: 3500, unit: 'per 100 nos', icon: '🧀' },
  { id: 'fish-65', name: 'Fish 65', price: 4500, unit: 'per 100 nos', icon: '🐟' },
  { id: 'veg-biryani', name: 'Veg Biryani', price: 150, unit: 'per head', icon: '🍚' },
  { id: 'mutton-biryani', name: 'Mutton Biryani', price: 200, unit: 'per head', icon: '🍛' },
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
  image?: string;
}

export const eventItems: EventItem[] = [
  // Welcome Setup
  { id: 'welcome-girls', name: 'Welcome Girls', basePrice: 2000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Welcome Setup', image: '@/assets/gallery-1.jpg' },
  { id: 'welcome-drinks', name: 'Welcome Drinks (Coffee/Tea/Buttermilk/Juice)', basePrice: 2000, unit: 'per 50 nos', defaultQty: 1, minQty: 1, category: 'Welcome Setup', image: '@/assets/catering-1.jpg' },
  { id: 'welcome-crackers', name: 'Welcome Crackers', basePrice: 1500, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Welcome Setup', image: '@/assets/gallery-2.jpg' },
  // Plates & Entry
  { id: 'valai-maram', name: 'Valai Maram', basePrice: 2000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry', image: '@/assets/decor-entrance.jpg' },
  { id: 'seer-plate', name: 'Santhanam & Kumkumam & Paneer ', basePrice: 150, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry', image: '@/assets/decor-table.jpg' },
  { id: 'karbedu-plate', name: 'Gem named plate', basePrice: 100, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry', image: '@/assets/decor-3.jpg' },
  { id: 'chocolate-plate', name: 'Chocolate Plate', basePrice: 150, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry', image: '@/assets/catering-2.jpg' },
  { id: 'cream-plate', name: 'Vetrilai Paakku Plate', basePrice: 100, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry', image: '@/assets/catering-3.jpg' },
  { id: 'flower-pot', name: 'Flower Pot (Welcome Table)', basePrice: 500, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Plates & Entry', image: '@/assets/decor-table.jpg' },
  // Decorations & Effects
  { id: 'outer-lighting', name: 'Outer Lighting', basePrice: 10000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects', image: '@/assets/decor-stage.jpg' },
  { id: 'dj-dance', name: 'DJ & Dance', basePrice: 35000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects', image: '@/assets/gallery-4.jpg' },
  { id: 'chariot-entry', name: 'Chariot Entry', basePrice: 35000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects', image: '@/assets/gallery-5.jpg' },
  { id: 'pyro-blast', name: 'Pyro Blast', basePrice: 1500, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects', image: '@/assets/decor-1.jpg' },
  { id: 'bubble-effect', name: 'Bubble Effect', basePrice: 1500, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects', image: '@/assets/decor-2.jpg' },
  { id: 'ice-smoke-entry', name: 'Ice Smoke Entry', basePrice: 5000, unit: 'fixed', defaultQty: 1, minQty: 1, category: 'Decorations & Effects', image: '@/assets/gallery-6.jpg' },
];

// ─── EXISTING DATA ───

export type CateringCategory = 'tiffen' | 'lunch' | 'dinner';

export const hallDurations: HallDuration[] = [
  { id: '4hrs', label: '4 Hours', timing: 'Choose start and end time', price: 25000 },
  { id: 'half', label: 'Half Day', timing: '5:00 AM – 4:00 PM or 2:00 PM – 10:00 PM', price: 35000 },
  { id: 'full', label: 'Full Day', timing: '4:00 PM – 4:00 PM', price: 55000 },
];

const parseTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const parseTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const formatMinutesToTime = (minutes: number) => {
  const normalized = ((minutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const formatTimeToAmPm = (time: string) => {
  if (!time) return 'Not Selected';
  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 'Not Selected';
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const normalizeInterval = (start: number, end: number) => {
  if (end <= start) return [start, end + 24 * 60];
  return [start, end];
};

export const timeIntervalsOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string,
) => {
  const [aStart, aEnd] = normalizeInterval(parseTime(startA), parseTime(endA));
  const [bStart, bEnd] = normalizeInterval(parseTime(startB), parseTime(endB));
  return aStart < bEnd && bStart < aEnd;
};

export const getAllowedCateringCategories = (
  hallDuration: string | null,
  hallStartTime: string,
  hallHalfMode: '' | 'morning' | 'evening'
): CateringCategory[] => {
  if (hallDuration === 'full') {
    return ['tiffen', 'lunch', 'dinner'];
  }

  if (hallDuration === 'half') {
    if (hallHalfMode === 'morning') return ['tiffen', 'lunch'];
    if (hallHalfMode === 'evening') return ['dinner'];
    return [];
  }

  if (hallDuration === '4hrs' && hallStartTime) {
    const [hours, minutes] = hallStartTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes >= 300 && totalMinutes < 720) return ['tiffen'];
    if (totalMinutes >= 720 && totalMinutes < 960) return ['lunch'];
    if (totalMinutes >= 960 && totalMinutes <= 1440) return ['dinner'];
    return [];
  }

  return [];
};

export const formatHallTimeRange = (start: string, end: string) => {
  if (!start || !end) return '';
  return `${start} - ${end}`;
};

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
  { id: 'chicken-65', label: 'Chicken 65', price: 5000, icon: '🍗', unit: 'per 100 nos' },
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

const rupeeFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return rupeeFormatter.format(amount);
}

export function formatPriceForPdf(amount: number): string {
  const formattedNumber = amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  return `Rs ${formattedNumber}`;
}
