import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onGoToCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onGoToCheckout
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [cartFeedback, setCartFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product.promoPrice || item.product.originalPrice;
    return acc + price * item.quantity;
  }, 0);

  const discountVal = subtotal * (discountPercent / 100);
  
  // Shipping rule: Free above 199 BRL
  const finalShipping = shippingCost !== null 
    ? (subtotal >= 199 ? 0 : shippingCost) 
    : 0;

  const total = subtotal - discountVal + finalShipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCartFeedback(null);
    if (couponCode.toUpperCase() === 'PRIMEIRACOMPRA') {
      setDiscountPercent(5);
      setCartFeedback({ text: 'Cupom PRIMEIRACOMPRA aplicado! 5% de desconto!', type: 'success' });
    } else {
      setCartFeedback({ text: 'Cupom inválido ou expirado.', type: 'error' });
    }
  };

  const handleCalcularFrete = (e: React.FormEvent) => {
    e.preventDefault();
    setCartFeedback(null);
    if (shippingZip.length < 8) {
      setCartFeedback({ text: 'Por favor, informe um CEP válido com 8 dígitos.', type: 'error' });
      return;
    }
    setIsCalculatingShipping(true);
    setTimeout(() => {
      // simulated pricing
      setShippingCost(subtotal >= 199 ? 0 : 15.9);
      setCartFeedback({ text: 'Frete calculado com sucesso!', type: 'success' });
      setIsCalculatingShipping(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background shadow overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Cart Container Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animation-slideIn z-10 overflow-hidden rounded-none">
        
        {/* Header Drawer */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 text-[#002855]">
            <ShoppingBag size={22} className="stroke-[2.5]" />
            <h2 className="text-lg font-bold font-display uppercase tracking-wider">Seu Carrinho</h2>
            <span className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-0.5 rounded-none">
              {cartItems.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 rounded-none hover:bg-gray-100 transition-all focus:outline-none cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content list or Empty feedback */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
              <div className="bg-orange-50 p-6 rounded-none text-[#FF7A00] mb-4 animate-bounce">
                <ShoppingBag size={42} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">O carrinho está vazio</h3>
              <p className="text-sm text-gray-400 font-medium max-w-[240px] mb-6">
                Explore os nossos moletons e camisetas masculinas e monte um look incrível!
              </p>
              <button
                onClick={onClose}
                className="bg-[#002855] hover:bg-[#FF7A00] text-white px-8 py-4 rounded-none font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const currentPrice = item.product.promoPrice || item.product.originalPrice;
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-none border border-gray-150 hover:border-gray-300 transition-all bg-white relative group animate-fadeIn"
                >
                  {/* Photo mini */}
                  <div className="w-20 aspect-[3/4] bg-gray-50 rounded-none overflow-hidden shrink-0 border border-gray-100">
                    <img src={item.product.images[0]} alt={item.product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>

                  {/* Info details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-1 mb-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-1.5">
                        Tam: <span className="text-gray-700 bg-gray-50 px-1.5 py-0.5 rounded-none border border-gray-100">{item.selectedSize}</span>
                        <span className="w-0.5 h-3 bg-gray-200" />
                        Cor: <span className="w-2.5 h-2.5 rounded-full inline-block border border-gray-250 align-middle" style={{ backgroundColor: item.selectedColor.hex }} />
                        <span className="text-gray-700">{item.selectedColor.name}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity switcher */}
                      <div className="flex items-center border border-gray-200 rounded-none overflow-hidden shrink-0 bg-white scale-90 -ml-1">
                        <button
                          onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-gray-700">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Total line item price */}
                      <span className="text-sm font-bold text-gray-800">
                        R$ {(currentPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove absolute trashcan item */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 rounded-none hover:bg-red-50 transition-colors focus:outline-none opacity-100 sm:opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Calculations / Codes panel */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50/70 flex flex-col gap-4">
            {cartFeedback && (
              <div className={`p-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between border ${
                cartFeedback.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-650'
                  : 'bg-emerald-50 border-emerald-250 text-emerald-700'
              }`}>
                <span className="flex-1 pr-2">{cartFeedback.text}</span>
                <button
                  type="button"
                  onClick={() => setCartFeedback(null)}
                  className="text-[9px] font-black opacity-60 hover:opacity-100 cursor-pointer w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/5"
                >
                  ✕
                </button>
              </div>
            )}
            {/* Promo coupon form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Cupom de desconto"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-none px-4 py-2 text-xs focus:outline-none focus:border-[#002855] font-semibold text-gray-800 uppercase"
              />
              <button
                type="submit"
                className="bg-[#002855] hover:bg-[#FF7A00] text-white px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Aplicar
              </button>
            </form>

            {/* Simulated shipping */}
            <form onSubmit={handleCalcularFrete} className="flex gap-2">
              <input
                type="text"
                maxLength={8}
                placeholder="Insira seu CEP (ex: 01001000)"
                value={shippingZip}
                onChange={(e) => setShippingZip(e.target.value.replace(/\D/g, ''))}
                className="flex-1 bg-white border border-gray-200 rounded-none px-4 py-2 text-xs focus:outline-none focus:border-[#002855] font-medium text-gray-800"
              />
              <button
                type="submit"
                disabled={isCalculatingShipping}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isCalculatingShipping ? 'Calcurando...' : 'Calcular'}
              </button>
            </form>

            {/* Calculations lines */}
            <div className="font-semibold text-xs text-gray-600 flex flex-col gap-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span>Subtotal dos itens</span>
                <span className="font-bold text-gray-800">R$ {subtotal.toFixed(2)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div className="flex justify-between items-center text-[#FF7A00] font-bold">
                  <span>Desconto (Cupom)</span>
                  <span>- R$ {discountVal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Cálculo de Entrega</span>
                {shippingCost === null ? (
                  <span className="text-gray-400">Pendente</span>
                ) : finalShipping === 0 ? (
                  <span className="text-emerald-600 font-bold">Grátis (Acima de R$199)</span>
                ) : (
                  <span className="font-bold text-gray-800">R$ {finalShipping.toFixed(2)}</span>
                )}
              </div>

              {/* Final checkout pricing block */}
              <div className="flex justify-between items-baseline text-gray-900 border-t border-dashed border-gray-200 pt-3 mt-1">
                <span className="text-sm font-bold uppercase text-[#002855]">Total</span>
                <span className="text-xl font-bold text-[#FF7A00]">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              <p className="text-[10px] text-center text-emerald-600 font-bold block pt-1">
                Ou R$ {(total * 0.95).toFixed(2)} no PIX com 5% de desconto extra!
              </p>
            </div>

            {/* Final checkout triggers */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={onGoToCheckout}
                className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-4 rounded-none font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                Finalizar Compra <ArrowRight size={15} />
              </button>
              
              <div className="flex justify-center items-center gap-1 text-[10px] text-gray-500 font-semibold mt-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                Compra 100% protegida e protegida por LGPD
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
