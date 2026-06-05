'use client';

import { useCartStore } from '@/stores/cart-store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
}

export default function CartDrawer({ isOpen, onClose, isEmbedded = false }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice);

  const total = totalPrice();

  const formatPrice = (price: number) =>
    price.toFixed(2).replace('.', ',') + ' zł';

  if (!isOpen && !isEmbedded) return null;

  const containerClasses = isEmbedded
    ? "flex flex-col w-[340px] shrink-0 bg-slate-50 border-l border-slate-200 h-full relative"
    : "fixed bottom-20 right-4 w-[340px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[999] flex flex-col animate-slide-up overflow-hidden";

  return (
    <>
      {/* Overlay */}
      {!isEmbedded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[998]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={containerClasses}
        style={!isEmbedded ? { maxWidth: 'calc(100vw - 32px)' } : {}}
      >
        {/* Nagłówek koszyka */}
        <div className="bg-sfd-gradient text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <i className="fa-solid fa-bag-shopping text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Twój Koszyk SFD</h3>
              <p className="text-[11px] text-blue-200">
                {items.length === 0
                  ? 'Pusty'
                  : `${items.length} ${items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-blue-200 hover:text-white transition-colors"
                title="Wyczyść koszyk"
              >
                <i className="fa-solid fa-rotate-left mr-1" />
                Wyczyść
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
        </div>

        {/* Lista produktów */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5 min-h-[100px]">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-300 text-4xl mb-2">
                <i className="fa-solid fa-bag-shopping" />
              </div>
              <p className="text-slate-500 text-sm">
                Twój koszyk jest pusty.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Porozmawiaj z konsultantem, aby dodać produkty!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.uid}
                className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100 animate-fade-up"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm shrink-0"
                  width={48}
                  height={48}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">{item.variant}</p>
                  <p className="text-xs font-bold text-sfd-blue mt-0.5">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.uid)}
                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all shrink-0"
                  title="Usuń z koszyka"
                >
                  <i className="fa-solid fa-xmark text-xs" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Podsumowanie */}
        <div className="border-t border-slate-100 p-3 shrink-0 bg-slate-50/50">
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Wartość produktów:</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Dostawa:</span>
              <span className="text-emerald-600 font-medium">
                Gratis (Promocja SFD)
              </span>
            </div>
            <div className="h-px bg-slate-200 my-1" />
            <div className="flex justify-between text-sm font-bold text-slate-800">
              <span>Do zapłaty:</span>
              <span className="text-sfd-blue text-base">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          <button
            className="w-full bg-sfd-gradient-btn hover:opacity-90 text-white py-3 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            disabled={items.length === 0}
            onClick={() => {
              alert('Przekierowanie do kasy sklep.sfd.pl — wkrótce dostępne!');
            }}
          >
            <span>Przejdź do kasy</span>
            <i className="fa-solid fa-arrow-right text-xs" />
          </button>

          <a
            href="https://sklep.sfd.pl/koszyk.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 py-2.5 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Wejdź na pełen koszyk sklepu</span>
            <i className="fa-solid fa-external-link-alt text-xs opacity-70" />
          </a>
        </div>
      </div>
    </>
  );
}
