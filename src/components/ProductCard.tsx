import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Flame } from 'lucide-react';
import { Product } from '../types';
import ReviewStars from './ReviewStars';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  isFavorite: boolean;
  onView: (product: Product) => void;
  onAddToCart: (product: Product, size: number) => void;
  onToggleFavorite: (productId: string) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onView,
  onAddToCart,
  onToggleFavorite
}: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);

  const discountPercent = product.promoPrice
    ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)
    : 0;

  const installments = product.promoPrice
    ? Math.ceil(product.promoPrice / 5)
    : Math.ceil(product.originalPrice / 5);

  return (
    <div
      className="group bg-white rounded-none border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && (
          <span className="bg-[#002855] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-none shadow-sm flex items-center gap-1">
            <Flame size={10} className="fill-white" /> NOVO
          </span>
        )}
        {product.promoPrice && (
          <span className="bg-[#FF7A00] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-none shadow-sm">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Favorite heart button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(product.id);
        }}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-none shadow-sm border border-gray-200 focus:outline-none transition-all duration-300 ${
          isFavorite
            ? 'bg-red-50 text-red-500 hover:bg-red-100'
            : 'bg-white/90 text-gray-500 hover:text-red-500 hover:bg-white'
        }`}
        aria-label="Adicionar aos favoritos"
      >
        <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
      </button>

      {/* Main Product Image Container */}
      <div 
        className="relative bg-gray-50 aspect-[3/4] overflow-hidden cursor-pointer"
        onClick={() => onView(product)}
      >
        <img
          src={hovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out sm:group-hover:scale-105"
          onError={(e) => {
            // fallback if image fails to load
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600";
          }}
        />

        {/* Quick actions box sliding up on desktop hover */}
        <div className="absolute inset-x-4 bottom-4 transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hidden md:flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(product);
            }}
            className="flex-1 bg-white text-gray-800 hover:bg-[#002855] hover:text-white py-2.5 px-3 rounded-none font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 border border-gray-100 shadow-lg"
          >
            <Eye size={15} /> Ver Detalhes
          </button>
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Label */}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
            {product.category}
          </span>

          {/* Product Name */}
          <h3
            className="font-bold text-gray-850 hover:text-[#002855] transition-colors line-clamp-2 text-sm sm:text-base leading-snug cursor-pointer mb-2"
            onClick={() => onView(product)}
          >
            {product.name}
          </h3>

          {/* Reviews Score */}
          <div className="mb-3.5">
            <ReviewStars rating={product.rating} size={13} showText reviewsCount={product.reviewsCount} />
          </div>
        </div>

        {/* Interactive rapid size selector */}
        <div className="mb-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
            Selecione o tamanho:
          </span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((sz) => {
              const szStock = product.sizesStock ? (product.sizesStock[sz] !== undefined ? product.sizesStock[sz] : 12) : 12;
              const isOutOfStock = szStock <= 0;
              return (
                <button
                  key={sz}
                  disabled={isOutOfStock}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(selectedSize === sz ? null : sz);
                  }}
                  title={isOutOfStock ? `Tamanho ${sz} esgotado` : `Tamanho ${sz}`}
                  className={`text-[10px] font-bold w-8 h-8 flex items-center justify-center rounded-none border transition-all ${
                    isOutOfStock
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through opacity-55'
                      : selectedSize === sz
                      ? 'bg-[#FF7A00] border-[#FF7A00] text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-600'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {/* Pricing area */}
          <div className="flex items-baseline gap-2 mb-1">
            {product.promoPrice ? (
              <>
                <span className="text-lg font-black text-[#FF7A00]">
                  R$ {product.promoPrice.toFixed(2)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-900">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-[11px] text-emerald-600 font-bold mb-3">
            R$ {(product.promoPrice ? product.promoPrice * 0.95 : product.originalPrice * 0.95).toFixed(2)} no PIX (5% desc)
          </p>

          <p className="text-[10px] text-gray-500 mb-4 font-semibold">
            Ou 5x sem juros de <span className="text-gray-700">R$ {installments.toFixed(2)}</span>
          </p>

          {/* Immediate Action Buttons */}
          <button
            onClick={() => {
              const sz = selectedSize || product.sizes[0];
              onAddToCart(product, sz);
              // Feedback trigger
              setSelectedSize(null);
            }}
            className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-3.5 px-4 rounded-none font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-[0.98]"
          >
            <ShoppingBag size={15} /> 
            {selectedSize ? `Adicionar (Tam. ${selectedSize})` : 'Comprar rápido'}
          </button>
        </div>
      </div>
    </div>
  );
}
