import { create } from 'zustand';

export interface CartItem {
  uid: string;
  productId: string;
  name: string;
  variant: string;
  price: number;
  imageUrl: string;
  shopUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'uid' | 'quantity'>, quantity?: number) => void;
  removeItem: (uid: string) => void;
  updateQuantity: (uid: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item, quantity = 1) =>
    set((state) => {
      // Scal z istniejącą pozycją o tym samym produkcie i wariancie — zwiększ ilość
      const existing = state.items.find(
        (i) => i.productId === item.productId && i.variant === item.variant
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.uid === existing.uid
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            ...item,
            quantity,
            uid: item.productId + '-' + item.variant + '-' + Date.now(),
          },
        ],
      };
    }),

  removeItem: (uid) =>
    set((state) => ({
      items: state.items.filter((item) => item.uid !== uid),
    })),

  updateQuantity: (uid, quantity) =>
    set((state) => {
      // Ilość <= 0 oznacza usunięcie pozycji
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.uid !== uid) };
      }
      return {
        items: state.items.map((item) =>
          item.uid === uid ? { ...item, quantity } : item
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  totalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
