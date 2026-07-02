import React, { useState } from 'react';
import { ShoppingBag, Heart, ArrowLeft, ShieldCheck, RefreshCw, Truck, HelpCircle, MessageSquare } from 'lucide-react';
import { Product, Color } from '../types';
import ReviewStars from './ReviewStars';
import { SIZE_CHART } from '../data';

interface ProductDetailProps {
  product: Product;
  isFavorite: boolean;
  onAddToCart: (product: Product, size: number, color: Color, quantity: number) => void;
  onToggleFavorite: (productId: string) => void;
  onBack: () => void;
}

export default function ProductDetail({
  product,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
  onBack
}: ProductDetailProps) {
  const defaultSize = product.sizes.find(sz => {
    const szStock = product.sizesStock ? (product.sizesStock[sz] !== undefined ? product.sizesStock[sz] : 12) : 12;
    return szStock > 0;
  }) || product.sizes[0];
  const [activeImg, setActiveImg] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<number>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<Color>(product.colors[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const priceToUse = product.promoPrice || product.originalPrice;
  const discountPercent = product.promoPrice
    ? Math.round(((product.originalPrice - product.promoPrice) / product.originalPrice) * 100)
    : 0;

  const szStock = product.sizesStock ? (product.sizesStock[selectedSize] !== undefined ? product.sizesStock[selectedSize] : 12) : 12;
  const isOutOfStock = szStock <= 0;

  // Prepares the WhatsApp API string to submit order instantly
  const handleWhatsAppPurchase = () => {
    const formattedPrice = priceToUse.toFixed(2);
    const message = `Olá! Vi no site da FR Moletom o produto *${product.name}*.\nGostaria de comprar:\n- *Tamanho:* ${selectedSize}\n- *Cor:* ${selectedColor.name}\n- *Quantidade:* ${quantity}\n- *Valor Unitário:* R$ ${formattedPrice}\n\nComo posso finalizar o pedido?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=5511949697239&text=${encodedMessage}`, '_blank');
  };

  const handleLocalAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-none border border-gray-150 p-4 sm:p-8 shadow-sm animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#002855] mb-6 tracking-wider uppercase transition-colors cursor-pointer"
      >
        <ArrowLeft size={16} /> Voltar para Coleções
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left column: Image gallery with magnifying state */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[3/4] bg-gray-50 rounded-none overflow-hidden border border-gray-100">
            {product.promoPrice && (
              <span className="absolute top-4 left-4 bg-[#FF7A00] text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-none z-10 shadow">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={activeImg}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none transition-all duration-300 transform"
            />
          </div>

          {/* Image miniature selector */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(img)}
                  className={`aspect-[3/4] w-20 rounded-none overflow-hidden bg-gray-50 border-2 transition-all cursor-pointer ${
                    activeImg === img ? 'border-[#002855] scale-105 shadow-sm' : 'border-transparent opacity-80'
                  }`}
                >
                  <img src={img} alt={`mini-${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Purchase controls */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            {/* Category / Launch Tag */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-[#FF7A00] bg-orange-50 border border-orange-100 uppercase tracking-widest px-2.5 py-1 rounded-none">
                {product.category}
              </span>
              {product.isNew && (
                <span className="text-[10px] font-bold text-white bg-[#002855] uppercase tracking-widest px-2.5 py-1 rounded-none">
                  Lançamento
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 leading-tight mb-2 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings stars */}
            <div className="mb-4">
              <ReviewStars rating={product.rating} size={15} showText reviewsCount={product.reviewsCount} />
            </div>

            {/* Price Area */}
            <div className="bg-gray-50/50 rounded-none p-4 border border-gray-150 mb-6 flex flex-col">
              <span className="text-xs text-gray-400 font-semibold mb-1">Preço exclusivo no site:</span>
              <div className="flex items-baseline gap-3 mb-1">
                {product.promoPrice ? (
                  <>
                    <span className="text-3xl font-bold text-[#FF7A00]">
                      R$ {product.promoPrice.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-gray-400 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-[#002855]">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-emerald-600 font-bold mb-1">
                🔥 R$ {(priceToUse * 0.95).toFixed(2)} no PIX (Ganhe +5% de desconto extra)
              </p>
              <p className="text-xs text-gray-500 font-semibold">
                Ou até 5x sem juros de R$ {(priceToUse / 5).toFixed(2)} no cartão de crédito.
              </p>
            </div>

            {/* Description Text */}
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color selection */}
            <div className="mb-5">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                Cor Selecionada: <span className="text-gray-500 font-semibold normal-case">{selectedColor.name}</span>
              </span>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform duration-200 cursor-pointer ${
                      selectedColor.name === color.name ? 'border-[#002855] scale-125 shadow-md' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size selector & Measures Guide */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Selecionar Tamanho:
                </span>
                <button
                  onClick={() => setShowSizeTable(true)}
                  className="text-xs text-[#002855] hover:text-[#FF7A00] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  📏 Guia de Medidas
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const szStock = product.sizesStock ? (product.sizesStock[sz] !== undefined ? product.sizesStock[sz] : 12) : 12;
                  const isOutOfStock = szStock <= 0;
                  return (
                    <button
                      key={sz}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSize(sz);
                        setQuantity(1);
                      }}
                      className={`text-xs font-bold w-12 h-9 flex flex-col items-center justify-center rounded-none border transition-all cursor-pointer ${
                        isOutOfStock
                          ? 'bg-gray-100 border-gray-200 text-gray-350 cursor-not-allowed line-through opacity-50'
                          : selectedSize === sz
                          ? 'bg-[#FF7A00] border-[#FF7A00] text-white scale-110 shadow'
                          : 'bg-white border-gray-200 text-gray-800 hover:border-gray-450'
                      }`}
                      title={isOutOfStock ? `Tamanho ${sz} esgotado` : `Tamanho ${sz} (${szStock} unidades disponíveis)`}
                    >
                      <span className="text-xs leading-none">{sz}</span>
                      {!isOutOfStock && szStock <= 3 && (
                        <span className="text-[7px] font-black uppercase text-red-500 scale-90 -mt-0.5">Últimas!</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Stock Indicator */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Quantidade:
                </span>
                <div className="flex items-center border border-gray-200 rounded-none overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 font-bold hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 font-bold text-gray-800 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(szStock, quantity + 1))}
                    disabled={quantity >= szStock}
                    className="px-3.5 py-1.5 font-bold hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${szStock > 0 ? (szStock <= 3 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500') : 'bg-red-500'}`}></span>
                <span className={`text-[11px] font-black uppercase tracking-wider ${szStock <= 3 ? 'text-orange-600' : 'text-emerald-700'}`}>
                  {szStock > 0 ? `${szStock} unidades em estoque` : 'Produto Esgotado neste tamanho'}
                </span>
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Local Cart Add */}
              <button
                onClick={handleLocalAdd}
                disabled={isOutOfStock}
                className={`w-full py-4.5 px-6 rounded-none font-bold flex items-center justify-center gap-2 tracking-wide transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-gray-150 border border-gray-250 text-gray-400 cursor-not-allowed'
                    : isAddedFeedback
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-[#002855] hover:bg-[#003D80] text-white shadow-sm hover:shadow active:scale-[0.98] cursor-pointer'
                }`}
              >
                <ShoppingBag size={18} />
                {isOutOfStock ? 'Indisponível' : isAddedFeedback ? 'Adicionado!' : 'Adicionar ao Carrinho'}
              </button>

              {/* Direct WhatsApp purchase (Agency spec requirement) */}
              <button
                onClick={handleWhatsAppPurchase}
                disabled={isOutOfStock}
                className={`w-full py-4.5 px-6 rounded-none font-bold flex items-center justify-center gap-2 tracking-wide shadow-sm hover:shadow transition-all duration-300 active:scale-[0.98] ${
                  isOutOfStock
                    ? 'bg-gray-100 border border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-[#FF7A00] hover:bg-[#ff8c40] text-white cursor-pointer'
                }`}
              >
                <MessageSquare size={18} className={isOutOfStock ? 'text-gray-300' : 'fill-white/20'} />
                {isOutOfStock ? 'Indisponível' : 'Comprar via WhatsApp'}
              </button>
            </div>

            {/* Wishlist Add */}
            <button
              onClick={() => onToggleFavorite(product.id)}
              className={`w-full py-3.5 px-6 rounded-none font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-500'
              }`}
            >
              <Heart size={15} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
              {isFavorite ? 'Produto nos Favoritos' : 'Salvar na Lista de Desejos'}
            </button>

            {/* Benefits badging inside item page */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-50 text-[10px] font-semibold text-gray-500">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#FF7A00]" />
                <span>Frete expresso</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw size={14} className="text-[#002855]" />
                <span>Troca fácil 7d</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Marca 100% segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Composition list block */}
      <div className="mt-12 pt-8 border-t border-gray-100">
        <h2 className="text-lg font-bold font-display text-[#002855] uppercase tracking-wide mb-4">
          Especificações e Detalhes do Produto
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
          {product.details.map((detail, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-none bg-[#FF7A00] shrink-0" />
              {detail}
            </li>
          ))}
        </ul>
      </div>

      {/* Measurement chart Dialog overlay */}
      {showSizeTable && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none p-6 md:p-8 max-w-2xl w-full shadow-2xl relative animate-slideIn max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold font-display text-[#002855] uppercase tracking-wide mb-2 flex items-center gap-2">
              📏 {SIZE_CHART.title}
            </h3>
            <p className="text-xs text-gray-500 font-medium mb-6">
              *Tire as medidas do seu pequeno herói utilizando uma fita métrica sem apertá-la. Em caso de dúvidas, escolha um número maior para garantir o conforto durante o crescimento.
            </p>

            <div className="overflow-x-auto border border-gray-150 rounded-none mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-150">
                    {SIZE_CHART.headers.map((hdr, i) => (
                      <th key={i} className="p-3 text-center first:text-left">{hdr}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="border-b border-gray-100 hover:bg-gray-50/50 font-semibold text-gray-700">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-center first:text-left first:font-extrabold text-gray-800">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowSizeTable(false)}
              className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-3.5 rounded-none font-bold text-xs uppercase tracking-wide transition-colors cursor-pointer"
            >
              Fechar Guia de Medidas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
