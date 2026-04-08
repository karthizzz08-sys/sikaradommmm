import { create } from 'zustand';

export interface BookingRecord {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  advanceAmount: number;
  status: 'pending' | 'confirmed' | 'completed';
  selections: string[];
  discount: number;
}

export interface EventItemSelection {
  id: string;
  qty: number;
}

export interface CateringSelection {
  packageId: string;
  headCount: number;
}

export interface BookingState {
  // Hall
  hallDuration: string | null;
  selectedExtras: string[];
  // Photography
  photoPackageId: string | null;
  photoEventCount: 1 | 2;
  // Decoration
  selectedDecorations: string[];
  // Salon/Bridal
  selectedSalonIds: string[];
  // Catering
  selectedCatering: CateringSelection[];
  // Event items (detailed)
  selectedEventItems: EventItemSelection[];
  // Payment
  transactionId: string;
  paymentScreenshot: File | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: Date | null;
  // Booking history
  bookingHistory: BookingRecord[];

  // Actions
  setHallDuration: (id: string | null) => void;
  toggleExtra: (id: string) => void;
  setPhotoPackage: (id: string | null) => void;
  setPhotoEventCount: (count: 1 | 2) => void;
  toggleDecoration: (id: string) => void;
  toggleSalon: (id: string) => void;
  toggleCatering: (id: string) => void;
  setCateringHeadCount: (id: string, count: number) => void;
  toggleEventItem: (id: string) => void;
  setEventItemQty: (id: string, qty: number) => void;
  setTransactionId: (id: string) => void;
  setPaymentScreenshot: (f: File | null) => void;
  setCustomerName: (n: string) => void;
  setCustomerPhone: (p: string) => void;
  setCustomerEmail: (e: string) => void;
  setEventDate: (d: Date | null) => void;
  addBooking: (record: BookingRecord) => void;
  resetSelections: () => void;
}

const loadHistory = (): BookingRecord[] => {
  try {
    const saved = localStorage.getItem('sikara-bookings');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

export const useBookingStore = create<BookingState>((set) => ({
  hallDuration: null,
  selectedExtras: [],
  photoPackageId: null,
  photoEventCount: 1,
  selectedDecorations: [],
  selectedSalonIds: [],
  selectedCatering: [],
  selectedEventItems: [],
  transactionId: '',
  paymentScreenshot: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  eventDate: null,
  bookingHistory: loadHistory(),

  setHallDuration: (id) => set({ hallDuration: id }),
  toggleExtra: (id) => set((s) => ({
    selectedExtras: s.selectedExtras.includes(id)
      ? s.selectedExtras.filter(e => e !== id)
      : [...s.selectedExtras, id]
  })),
  setPhotoPackage: (id) => set({ photoPackageId: id }),
  setPhotoEventCount: (count) => set({ photoEventCount: count }),
  toggleDecoration: (id) => set((s) => ({
    selectedDecorations: s.selectedDecorations.includes(id)
      ? s.selectedDecorations.filter(d => d !== id)
      : [...s.selectedDecorations, id]
  })),
  toggleSalon: (id) => set((s) => ({
    selectedSalonIds: s.selectedSalonIds.includes(id)
      ? s.selectedSalonIds.filter(x => x !== id)
      : [...s.selectedSalonIds, id]
  })),
  toggleCatering: (id) => set((s) => {
    const exists = s.selectedCatering.find(x => x.packageId === id);
    if (exists) {
      return { selectedCatering: s.selectedCatering.filter(x => x.packageId !== id) };
    }
    return { selectedCatering: [...s.selectedCatering, { packageId: id, headCount: 100 }] };
  }),
  setCateringHeadCount: (id, count) => set((s) => ({
    selectedCatering: s.selectedCatering.map(x => x.packageId === id ? { ...x, headCount: count } : x)
  })),
  toggleEventItem: (id) => set((s) => {
    const exists = s.selectedEventItems.find(x => x.id === id);
    if (exists) {
      return { selectedEventItems: s.selectedEventItems.filter(x => x.id !== id) };
    }
    return { selectedEventItems: [...s.selectedEventItems, { id, qty: 1 }] };
  }),
  setEventItemQty: (id, qty) => set((s) => ({
    selectedEventItems: s.selectedEventItems.map(x => x.id === id ? { ...x, qty } : x)
  })),
  setTransactionId: (id) => set({ transactionId: id }),
  setPaymentScreenshot: (f) => set({ paymentScreenshot: f }),
  setCustomerName: (n) => set({ customerName: n }),
  setCustomerPhone: (p) => set({ customerPhone: p }),
  setCustomerEmail: (e) => set({ customerEmail: e }),
  setEventDate: (d) => set({ eventDate: d }),
  addBooking: (record) => set((s) => {
    const updated = [record, ...s.bookingHistory];
    localStorage.setItem('sikara-bookings', JSON.stringify(updated));
    return { bookingHistory: updated };
  }),
  resetSelections: () => set({
    hallDuration: null,
    selectedExtras: [],
    photoPackageId: null,
    photoEventCount: 1,
    selectedDecorations: [],
    selectedSalonIds: [],
    selectedCatering: [],
    selectedEventItems: [],
    transactionId: '',
    paymentScreenshot: null,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    eventDate: null,
  }),
}));
