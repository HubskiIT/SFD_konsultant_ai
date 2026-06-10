'use client';

import { useEffect, useRef, useState } from 'react';
import type { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  onAddToCart: (product: Product, variantIndex: number) => void;
}

export default function ProductCarousel({ products, onAddToCart }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 12 : 252;
    setActiveIndex(Math.round(el.scrollLeft / step));
  };

  useEffect(() => {
    updateButtons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const scrollByCard = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 12 : 252;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <div className="mt-3 relative">
      <div
        ref={scrollRef}
        onScroll={updateButtons}
        className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar"
      >
        {products.map((product) => (
          <div key={product.id} data-card className="shrink-0 w-[240px] snap-start">
            <ProductCard
              product={product}
              compact
              onAddToCart={(_, variantIndex) => onAddToCart(product, variantIndex)}
            />
          </div>
        ))}
      </div>

      {/* Strzałki nawigacji */}
      {canPrev && (
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Poprzedni produkt"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-sfd-blue hover:bg-sfd-blue hover:text-white transition-colors z-10"
        >
          <i className="fa-solid fa-chevron-left text-sm" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Następny produkt"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-9 h-9 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-sfd-blue hover:bg-sfd-blue hover:text-white transition-colors z-10"
        >
          <i className="fa-solid fa-chevron-right text-sm" />
        </button>
      )}

      {/* Kropki postępu */}
      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {products.map((p, i) => (
            <span
              key={p.id}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? 'w-4 bg-sfd-blue' : 'w-1.5 bg-slate-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
