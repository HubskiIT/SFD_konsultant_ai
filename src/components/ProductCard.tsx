'use client';

import { useState } from 'react';
import type { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, variantIndex: number) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onAddToCart, compact = false }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [isAdded, setIsAdded] = useState(false);

  const currentVariant = product.variants[selectedVariant];

  // Promocja: pokazuj przekresloną cenę i % zniżki, gdy originalPrice > aktualna cena
  const hasDiscount =
    typeof product.originalPrice === 'number' &&
    product.originalPrice > currentVariant.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - currentVariant.price / product.originalPrice!) * 100)
    : 0;

  const handleAdd = () => {
    onAddToCart(product.id, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div
      className={`bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 animate-fade-up ${
        compact ? 'flex-col h-full' : 'flex-col sm:flex-row'
      }`}
    >
      {/* Miniatura produktu */}
      <div className={`relative shrink-0 ${compact ? 'mx-auto' : 'mx-auto sm:mx-0'}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`rounded-lg object-cover shadow-sm bg-white ${compact ? 'w-24 h-24' : 'w-16 h-16'}`}
          width={compact ? 96 : 64}
          height={compact ? 96 : 64}
        />
        {hasDiscount && (
          <span className="absolute -top-1.5 -left-1.5 bg-sfd-accent text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Dane produktu */}
      <div className="flex-1 min-w-0 flex flex-col">
        <p className="text-[10px] font-semibold text-sfd-blue uppercase tracking-wider">
          {product.brand}
        </p>
        <h4 className="font-bold text-slate-800 text-sm leading-tight">
          {product.name}
        </h4>
        <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${compact ? 'line-clamp-4' : 'line-clamp-2'}`}>
          {product.description}
        </p>

        {/* Cena — wyraźnie w treści karty */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-sfd-blue leading-none">
            {currentVariant.price.toFixed(2).replace('.', ',')} zł
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through">
              {product.originalPrice!.toFixed(2).replace('.', ',')} zł
            </span>
          )}
        </div>

        {/* Wariant + Przycisk */}
        <div
          className={`flex justify-between gap-2 ${
            compact ? 'flex-col mt-auto pt-2' : 'mt-2 flex-col sm:flex-row sm:items-end'
          }`}
        >
          {product.variants.length > 1 && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">
                Wariant:
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sfd-blue focus:outline-none"
              >
                {product.variants.map((v, i) => (
                  <option key={i} value={i}>
                    {v.label} – {v.price.toFixed(2).replace('.', ',')} zł
                  </option>
                ))}
              </select>
            </div>
          )}

          <div
            className={`w-full flex items-center gap-2 ${
              compact ? 'flex-col' : 'sm:w-auto flex-col sm:flex-row sm:ml-auto mt-2 sm:mt-0'
            }`}
          >
            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`w-full text-white text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                isAdded
                  ? 'bg-emerald-500 cursor-default'
                  : 'bg-sfd-gradient-btn hover:opacity-90'
              }`}
            >
              {isAdded ? (
                <>
                  <i className="fa-solid fa-check" />
                  Dodano!
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cart-plus" />
                  {compact ? 'Do koszyka' : 'Dodaj do koszyka'}
                </>
              )}
            </button>

            <a
              href={product.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sfd-blue hover:text-sfd-dark text-xs font-medium flex items-center gap-1 whitespace-nowrap"
            >
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
              Sklep SFD
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
