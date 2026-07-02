import React, { useState } from 'react';
import { Product, Color } from '../../types';
import { ToggleLeft, ToggleRight, Filter } from 'lucide-react';

interface ShortsViewProps {
  products: Product[];
  favorites: string[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number) => void;
  onToggleFavorite: (productId: string) => void;
  masterColors: Color[];
}

export default function ShortsView({
  products,
  favorites,
  onViewProduct,
  onAddToCart,
  onToggleFavorite,
  masterColors
}: ShortsViewProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [onlyPromo, setOnlyPromo] = useState(false);

  // Filter products for category 'bermudas' (which contains shorts)
  const categoryProducts = products.filter(
    (p) => p.category === 'bermudas'
  );

  // Filter by size, promo, and color
  const filteredProducts = categoryProducts.filter((p) => {
    if (selectedSize !== null && !p.sizes.includes(selectedSize)) return false;
    if (onlyPromo && !p.promoPrice) return false;
    if (selectedColor !== null && !p.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())) return false;
    return true;
  });

  const availableSizes = [2, 4, 6, 8, 10, 12, 14, 16];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Category Banner */}
      <div className="relative bg-gradient-to-r from-emerald-900 to-emerald-750 text-white p-8 md:p-12 mb-10 overflow-hidden shadow-sm border border-emerald-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute right-0 bottom-0 translate-y-12 translate-x-12 opacity-10 font-black text-9xl">
          SHORTS
        </div>
        <div className="relative z-10 max-w-xl">
          <span className="bg-[#FF7A00] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 inline-block mb-3 select-none">
            Estilo Fresquinho & Divertido
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display uppercase tracking-wider mb-2">
            Bermudas & Shorts
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
            Shorts e bermudas de moletinho leves, não peluciados e de toque macio. Máxima mobilidade e frescor para correr, pular, passear e curtir todas as estações do ano com conforto garantido.
          </p>
        </div>
      </div>

      {/* Filter and Utility Section */}
      <div className="bg-gray-50 border border-gray-150 p-5 md:p-6 mb-8 flex flex-col gap-5">
        {/* Row 1: Sizes & Discount Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200/60">
          {/* Sizes choices */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-[#002855] uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <Filter size={14} className="text-[#FF7A00]" /> Filtrar Tamanho:
            </span>
            <button
              onClick={() => setSelectedSize(null)}
              className={`px-3 py-1.5 text-xs font-bold transition-all ${
                selectedSize === null
                  ? 'bg-[#002855] text-white'
                  : 'bg-white text-gray-750 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Todos
            </button>
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-9 h-9 text-xs font-bold transition-all flex items-center justify-center ${
                  selectedSize === size
                    ? 'bg-[#FF7A00] text-white ring-2 ring-orange-200'
                    : 'bg-white text-gray-800 hover:bg-orange-50 hover:text-[#FF7A00] border border-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Promos Toggle */}
          <button
            onClick={() => setOnlyPromo(!onlyPromo)}
            className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#002855] transition-colors shrink-0"
          >
            {onlyPromo ? (
              <ToggleRight size={24} className="text-[#FF7A00]" />
            ) : (
              <ToggleLeft size={24} className="text-gray-400" />
            )}
            Apenas com Desconto
          </button>
        </div>

        {/* Row 2: Dynamic Colors filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-black text-[#002855] uppercase tracking-wider flex items-center gap-1.5 mr-2">
            🎨 Filtrar por Cor:
          </span>
          <button
            onClick={() => setSelectedColor(null)}
            className={`px-3 py-1.5 text-xs font-bold transition-all ${
              selectedColor === null
                ? 'bg-[#002855] text-white'
                : 'bg-white text-gray-750 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Mostrar Todas
          </button>
          
          <div className="flex flex-wrap gap-2">
            {masterColors && masterColors.map((color) => {
              const isActive = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(isActive ? null : color.name)}
                  className={`w-7 h-7 rounded-full border relative transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'scale-115 ring-2 ring-[#002855] ring-offset-2 border-[#002855]'
                      : 'border-gray-300 hover:scale-105 hover:border-gray-600'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name}${isActive ? ' (Ativo)' : ''}`}
                >
                  {color.name.toLowerCase() === 'branco' && (
                    <span className="absolute inset-0 rounded-full border border-gray-250" />
                  )}
                </button>
              );
            })}
          </div>

          {selectedColor && (
            <span className="text-[10px] font-black text-[#FF7A00] uppercase tracking-widest ml-auto bg-orange-50 border border-orange-100 px-2.5 py-1">
              Ativo: {selectedColor}
            </span>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-100 p-16 text-center shadow-xs">
          <span className="text-4xl block mb-2">🩳</span>
          <h3 className="font-extrabold text-gray-800 text-lg mb-1">
            Nenhum Shorts Encontrado
          </h3>
          <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto mb-6">
            Nenhum shorts correspondente foi localizado para os filtros ativos no momento.
          </p>
          <button
            onClick={() => {
              setSelectedSize(null);
              setOnlyPromo(false);
              setSelectedColor(null);
            }}
            className="bg-[#002855] hover:bg-[#FF7A00] text-white py-3.5 px-6 font-bold text-xs uppercase tracking-wider transition-all"
          >
            Ver Todos os Shorts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const hasPromo = !!product.promoPrice;
            const currentPrice = product.promoPrice || product.originalPrice;
            const discountPct = hasPromo
              ? Math.round(
                  ((product.originalPrice - product.promoPrice!) /
                    product.originalPrice) *
                    100
                )
              : 0;

            const isLiked = favorites.includes(product.id);

            return (
              <div
                key={product.id}
                className="group relative bg-white border border-gray-150 transition-all duration-300 hover:shadow-xl hover:border-orange-200 flex flex-col justify-between"
              >
                {/* Badges / Hearts */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  {product.isNew && (
                    <span className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                      Novo
                    </span>
                  )}
                  {hasPromo && (
                    <span className="bg-[#FF7A00] text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onToggleFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-xs"
                >
                  <span className={`text-sm ${isLiked ? 'text-red-500 font-black' : ''}`}>
                    {isLiked ? '❤️' : '🤍'}
                  </span>
                </button>

                {/* Card Top Link */}
                <div
                  onClick={() => onViewProduct(product)}
                  className="cursor-pointer overflow-hidden relative pt-[125%] bg-gray-100"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                {/* Info and Purchase Footer */}
                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    {/* Colors Circles */}
                    <div className="flex gap-1 mb-2">
                      {product.colors.map((c) => (
                        <span
                          key={c.name}
                          className="w-3 h-3 rounded-full border border-gray-300 cursor-help"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                    </div>

                    <h3
                      onClick={() => onViewProduct(product)}
                      className="text-sm font-bold text-gray-800 uppercase tracking-tight line-clamp-2 hover:text-[#002855] cursor-pointer min-h-[40px]"
                    >
                      {product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="mt-2.5 mb-4 flex items-baseline gap-2">
                      {hasPromo ? (
                        <>
                          <span className="text-[#FF7A00] font-black text-base">
                            R$ {product.promoPrice?.toFixed(2)}
                          </span>
                          <span className="text-gray-400 text-[10px] line-through font-bold">
                            R$ {product.originalPrice.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-800 font-black text-sm">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => onViewProduct(product)}
                      className="border border-gray-300 hover:border-[#002855] text-[#002855] hover:bg-gray-50 py-2 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => onAddToCart(product, product.sizes[0])}
                      className="bg-[#002855] hover:bg-[#FF7A00] text-white py-2 text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
