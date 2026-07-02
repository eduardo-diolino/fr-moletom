import React from 'react';
import { FilterState, Product, Color } from '../../types';
import ProductCard from '../ProductCard';
import ProductFilters from '../ProductFilters';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  favorites: string[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number) => void;
  onToggleFavorite: (productId: string) => void;
  onResetFilters: () => void;
  masterColors: Color[];
}

export default function CatalogView({
  products,
  favorites,
  filters,
  onFilterChange,
  onViewProduct,
  onAddToCart,
  onToggleFavorite,
  onResetFilters,
  masterColors
}: CatalogViewProps) {

  // Search & Filter Logic
  const filteredProducts = products.filter((p) => {
    // 1. Category check
    if (filters.category && p.category !== filters.category) {
      if (filters.category === 'promocoes' && !p.promoPrice) return false;
      if (filters.category === 'lancamentos' && !p.isNew) return false;
      if (filters.category !== 'promocoes' && filters.category !== 'lancamentos') return false;
    }

    // 2. Size check
    if (filters.size !== null && !p.sizes.includes(filters.size)) {
      return false;
    }

    // 3. Color check
    if (filters.colorName !== null && !p.colors.some(c => c.name === filters.colorName)) {
      return false;
    }

    // 4. Promo only
    if (filters.onlyPromo && !p.promoPrice) {
      return false;
    }

    // 5. Price range
    const activePrice = p.promoPrice || p.originalPrice;
    if (activePrice < filters.priceRange[0] || activePrice > filters.priceRange[1]) {
      return false;
    }

    // 6. Search Query
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchDetails = p.details.some(d => d.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchDetails) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.promoPrice || a.originalPrice;
    const priceB = b.promoPrice || b.originalPrice;

    if (filters.sortBy === 'priceAsc') {
      return priceA - priceB;
    }
    if (filters.sortBy === 'priceDesc') {
      return priceB - priceA;
    }
    if (filters.sortBy === 'sales') {
      return b.salesCount - a.salesCount;
    }
    // relevance (default rating then sales)
    return b.rating - a.rating;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Title block */}
      <div className="flex flex-col mb-10 text-center sm:text-left">
        <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest block mb-1">
          Moda Meninos 2 a 16 Anos
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#002855] uppercase tracking-wider">
          {filters.category ? `COLEÇÃO: ${filters.category.toUpperCase()}` : 'TODOS OS PRODUTOS'}
        </h1>
        <p className="text-xs font-semibold text-gray-400 mt-2">
          {filteredProducts.length} itens encontrados combinando com seus filtros de busca
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar column */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onReset={onResetFilters}
            masterColors={masterColors}
          />
        </div>

        {/* Catalog Products List column */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-none border border-gray-150 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-orange-50 rounded-none flex items-center justify-center text-[#FF7A00] mx-auto mb-4 animate-bounce">
                <ShoppingBag size={32} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">Nenhum Look Encontrado</h3>
              <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto mb-6">
                Nenhuma peça de roupa corresponde exatamente aos filtros aplicados. Tente expandir sua busca limpando ou alterando alguns filtros!
              </p>
              <button
                onClick={onResetFilters}
                className="bg-[#002855] hover:bg-[#FF7A00] text-white py-4.5 px-8 rounded-none font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFavorite={favorites.includes(p.id)}
                  onView={onViewProduct}
                  onAddToCart={onAddToCart}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
