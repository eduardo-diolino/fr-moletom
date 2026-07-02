import React from 'react';
import { Filter, X, RefreshCw } from 'lucide-react';
import { FilterState, CategoryInfo, Color } from '../types';
import { CATEGORIES } from '../data';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  masterColors: Color[];
}

const SIZES_POOL = [2, 4, 6, 8, 10, 12, 14, 16];

export default function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  masterColors
}: ProductFiltersProps) {

  const handleCategorySelect = (categorySlug: string | null) => {
    onFilterChange({ ...filters, category: categorySlug });
  };

  const handleSizeSelect = (sz: number | null) => {
    onFilterChange({ ...filters, size: sz });
  };

  const handleColorSelect = (colorName: string | null) => {
    onFilterChange({ ...filters, colorName: colorName });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, priceRange: [50, Number(e.target.value)] });
  };

  const handlePromoToggle = () => {
    onFilterChange({ ...filters, onlyPromo: !filters.onlyPromo });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, sortBy: e.target.value as any });
  };

  return (
    <div className="bg-white rounded-none border border-gray-150 p-6 shadow-sm flex flex-col gap-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
        <h3 className="text-sm font-bold text-[#002855] uppercase tracking-wider flex items-center gap-2">
          <Filter size={16} /> Filtros de Busca
        </h3>
        <button
          onClick={onReset}
          className="text-[11px] font-bold text-[#FF7A00] hover:text-[#002855] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw size={12} /> Limpar Filtros
        </button>
      </div>

      {/* Sorting order */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Ordenar por:
        </label>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="w-full bg-gray-50 border border-gray-200 rounded-none px-3 py-2.5 text-xs text-gray-700 font-bold focus:outline-none focus:border-[#002855]"
        >
          <option value="relevance">Mais Relevantes</option>
          <option value="priceAsc">Menor Preço</option>
          <option value="priceDesc">Maior Preço</option>
          <option value="sales">Mais Vendidos</option>
        </select>
      </div>

      {/* Categories choice */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Categorias:
        </label>
        <div className="flex flex-col gap-1.5 mt-1">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`w-full text-left px-3 py-2 text-xs rounded-none font-bold transition-all flex items-center justify-between cursor-pointer ${
              filters.category === null
                ? 'bg-orange-50 text-[#FF7A00]'
                : 'text-gray-600 hover:text-[#002855] hover:bg-gray-50'
            }`}
          >
            <span>✨ Ver Todas</span>
          </button>
          {CATEGORIES.filter(cat => cat.slug !== 'lancamentos' && cat.slug !== 'promocoes').map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`w-full text-left px-3 py-2 text-xs rounded-none font-bold transition-all flex items-center justify-between cursor-pointer ${
                filters.category === cat.slug
                  ? 'bg-orange-50 text-[#FF7A00]'
                  : 'text-gray-600 hover:text-[#002855] hover:bg-gray-50'
              }`}
            >
              <span>{cat.icon} {cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sizes Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Tamanhos (Anos):
        </label>
        <div className="grid grid-cols-4 gap-1.5 mt-1.5">
          {SIZES_POOL.map((sz) => (
            <button
              key={sz}
              onClick={() => handleSizeSelect(filters.size === sz ? null : sz)}
              className={`text-xs font-bold py-2 rounded-none border text-center transition-all cursor-pointer ${
                filters.size === sz
                  ? 'bg-[#FF7A00] border-[#FF7A00] text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-600'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color options */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center justify-between">
          <span>Cores do Look:</span>
          {filters.colorName && (
            <span className="text-[10px] text-[#FF7A00] font-black lowercase tracking-normal">
              ativo: {filters.colorName}
            </span>
          )}
        </label>
        <div className="flex flex-wrap gap-2 mt-1.5">
          {masterColors && masterColors.map((color) => {
            const isActive = filters.colorName === color.name;
            return (
              <button
                key={color.name}
                onClick={() => handleColorSelect(isActive ? null : color.name)}
                className={`w-7 h-7 rounded-full border relative transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'scale-115 ring-2 ring-[#002855] ring-offset-2 border-[#002855]' 
                    : 'border-gray-200 hover:scale-105 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {color.name.toLowerCase() === 'branco' && (
                  <span className="absolute inset-0 rounded-full border border-gray-200" />
                )}
              </button>
            );
          })}
          {(!masterColors || masterColors.length === 0) && (
            <span className="text-xs text-gray-450 italic">Nenhuma cor na paleta.</span>
          )}
        </div>
      </div>

      {/* Maximum Price Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
            Preço Máximo:
          </label>
          <span className="text-xs font-bold text-[#FF7A00]">
            R$ {filters.priceRange[1].toFixed(2)}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="300"
          step="10"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-gray-100 rounded-none appearance-none cursor-pointer accent-[#002855]"
        />
        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
          <span>R$ 50</span>
          <span>R$ 300</span>
        </div>
      </div>

      {/* Promo toggles */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Apenas em Oferta:
        </span>
        <button
          onClick={handlePromoToggle}
          className={`w-11 h-6 rounded-none p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
            filters.onlyPromo ? 'bg-[#FF7A00]' : 'bg-gray-200'
          }`}
        >
          <div
            className={`bg-white w-5 h-5 rounded-none shadow-md transform duration-200 ${
              filters.onlyPromo ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

    </div>
  );
}
