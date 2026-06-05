import { create } from 'zustand';

export interface CartItem {
  uid: string;
  productId: string;
  name: string;
  variant: string;
  price: number;
  imageUrl: string;
  shopUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'uid'>) => void;
  removeItem: (uid: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          ...item,
          uid: item.productId + '-' + Date.now(),
        },
      ],
    })),

  removeItem: (uid) =>
    set((state) => ({
      items: state.items.filter((item) => item.uid !== uid),
    })),

  clearCart: () => set({ items: [] }),

  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price, 0),

  itemCount: () => get().items.length,
}));
