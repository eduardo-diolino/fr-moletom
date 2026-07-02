import React, { useState } from 'react';
import { User, ShieldCheck, Heart, ShoppingBag, LogOut, Ticket, Trash2, Eye, Calendar, ArrowRight, Info, Folder } from 'lucide-react';
import { User as UserType, Order, Product, FavoriteGroup } from '../../types';

interface ProfileViewProps {
  user: UserType;
  orders: Order[];
  products: Product[];
  favorites: string[];
  favoriteGroups?: FavoriteGroup[];
  onLogout: () => void;
  onOpenAuth: () => void;
  onNavigate: (page: string, categorySlug?: string | null) => void;
  onToggleFavorite: (productId: string) => void;
  onViewProduct: (product: Product) => void;
  onOrganizeProduct?: (product: Product) => void;
}

export default function ProfileView({
  user,
  orders,
  products,
  favorites,
  favoriteGroups = [],
  onLogout,
  onOpenAuth,
  onNavigate,
  onToggleFavorite,
  onViewProduct,
  onOrganizeProduct
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'coupons'>('orders');
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  if (!user.logged) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 bg-white rounded-none border border-gray-150 shadow-md animate-fadeIn my-12">
        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#FF6A00] mx-auto mb-6">
          <User size={32} className="stroke-[2.5]" />
        </div>
        <h2 className="text-2xl font-black text-[#002855] uppercase tracking-tight mb-2">
          Área do Cliente
        </h2>
        <p className="text-sm text-gray-500 font-semibold mb-8 max-w-xs mx-auto leading-relaxed">
          Acesse sua conta para visualizar seu histórico de pedidos, gerenciar seus favoritos e resgatar cupons de desconto exclusivos!
        </p>

        <button
          onClick={onOpenAuth}
          className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-4 rounded-none font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Iniciar Sessão / Cadastrar-se
        </button>
      </div>
    );
  }

  // Calculate points dynamically
  const points = 340;

  // Filter real orders placed by this customer's email
  const userOrders = orders.filter(
    (o) => o.customerEmail?.trim().toLowerCase() === user.email?.trim().toLowerCase()
  );

  // Fallback demo orders to display if no real orders are present yet
  const demoOrders: Order[] = [
    {
      id: 'FR-948123',
      date: '2026-06-25T14:30:00.000Z',
      items: [
        {
          productId: '1',
          name: 'Moletom Canguru Peluciado Premium Tradicional',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200',
          size: 12,
          colorName: 'Preto',
          price: 179.90,
          quantity: 1
        },
        {
          productId: '2',
          name: 'Calça Jogger Infantil Confort Slim',
          image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=200',
          size: 10,
          colorName: 'Cinza Mescla',
          price: 119.90,
          quantity: 1
        }
      ],
      total: 299.80,
      status: 'pending',
      customerName: user.name,
      customerEmail: user.email,
      method: 'pix'
    },
    {
      id: 'FR-884013',
      date: '2026-05-18T10:15:00.000Z',
      items: [
        {
          productId: '3',
          name: 'Conjunto Moletom Infantil Com Capuz Sport',
          image: 'https://images.unsplash.com/photo-1622273509392-db0e8824cf4f?q=80&w=200',
          size: 8,
          colorName: 'Azul Marinho',
          price: 119.90,
          quantity: 1
        }
      ],
      total: 119.90,
      status: 'delivered',
      customerName: user.name,
      customerEmail: user.email,
      method: 'card'
    }
  ];

  const displayedOrders = userOrders.length > 0 ? userOrders : demoOrders;
  const isUsingDemo = userOrders.length === 0;

  // Find all favorite products
  const favoritedProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Upper Profile Cover info */}
      <div className="bg-gradient-to-r from-[#002855] to-[#003d80] text-white rounded-none p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md mb-8 border border-gray-150">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-none bg-white/20 border-2 border-white/50 flex items-center justify-center text-3xl font-black">
            {(user?.name || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase leading-none font-display">
              Olá, {user?.name || 'Cliente'}!
            </h2>
            <p className="text-xs text-blue-100 font-semibold mt-1">E-mail: {user.email}</p>
          </div>
        </div>

        <div className="bg-white/10 px-5 py-2.5 rounded-none border border-white/10 text-center sm:text-right">
          <span className="text-[10px] font-black uppercase text-[#FF7A00] tracking-wider block">
            Pontos fidelidade FR
          </span>
          <span className="text-2xl font-black font-mono">{points} pts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation panel */}
        <div className="md:col-span-1 bg-white border border-gray-150 p-6 flex flex-col gap-2 h-fit shadow-sm">
          <h3 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2.5 mb-2.5">
            Área do Cliente
          </h3>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left px-3.5 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#002855] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={14} /> Meus Pedidos
            </span>
            <span className="bg-gray-200/50 text-[#002855] font-mono text-[10px] px-1.5 py-0.5 font-bold">
              {userOrders.length > 0 ? userOrders.length : demoOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`w-full text-left px-3.5 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#002855] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart size={14} className={favorites.length > 0 ? 'fill-red-500 text-red-500' : ''} /> Meus Favoritos
            </span>
            <span className="bg-gray-200/50 text-[#002855] font-mono text-[10px] px-1.5 py-0.5 font-bold">
              {favorites.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full text-left px-3.5 py-3 text-xs font-black uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-[#002855] text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Ticket size={14} className="text-[#FF7A00]" /> Meus Cupons
            </span>
            <span className="bg-[#FF7A00] text-white font-mono text-[9px] px-1 py-0.5 font-bold">
              1 Ativo
            </span>
          </button>

          <button
            onClick={onLogout}
            className="w-full text-left px-3.5 py-3 text-xs font-black text-red-500 hover:bg-red-50 flex items-center gap-2 transition-all border-t border-dashed border-gray-150 mt-4 uppercase tracking-wider cursor-pointer"
          >
            <LogOut size={14} /> Encerrar Sessão
          </button>
        </div>

        {/* Content View Area */}
        <div className="md:col-span-3">
          
          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-150 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-5">
                <h3 className="font-black text-sm uppercase tracking-wider text-[#002855] flex items-center gap-2">
                  <ShoppingBag size={16} className="text-[#FF7A00]" /> Histórico de Pedidos
                </h3>
                {isUsingDemo && (
                  <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 uppercase tracking-wider">
                    Modo Demonstração
                  </span>
                )}
              </div>

              {isUsingDemo && (
                <div className="bg-blue-50/50 border border-blue-150 p-4 mb-6 text-xs text-blue-800 flex items-start gap-2.5">
                  <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[10px]">Sincronização de Pedidos Ativa</p>
                    <p className="mt-0.5 font-medium leading-relaxed">
                      Seus pedidos reais finalizados no Checkout aparecerão automaticamente aqui. Abaixo, você visualiza pedidos de exemplo simulados para ilustrar o histórico de entrega.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {displayedOrders.map((order) => {
                  const orderDate = new Date(order.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={order.id} className="border border-gray-150 p-4 sm:p-5 hover:border-gray-300 transition-all shadow-sm">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
                        <div>
                          <span className="text-xs font-black text-[#002855] font-mono tracking-wider block">
                            Pedido #{order.id}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold mt-0.5 flex items-center gap-1.5">
                            <Calendar size={11} /> Realizado em {orderDate}
                          </span>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-sm font-black text-gray-900 font-mono">
                            R$ {order.total.toFixed(2)}
                          </span>
                          <span className={`font-black text-[9px] px-2.5 py-0.5 uppercase tracking-wider block w-fit ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                              : 'bg-orange-50 text--[#FF7A00] border border-orange-150'
                          }`}>
                            {order.status === 'delivered' ? '✓ Entregue' : '⏰ Em Separação'}
                          </span>
                        </div>
                      </div>

                      {/* Order Items List */}
                      <div className="flex flex-col gap-3 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 text-xs font-medium text-gray-700 bg-gray-50 p-2 border border-gray-100">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover border border-gray-200 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=200';
                                }}
                              />
                              <div>
                                <h4 className="font-extrabold text-xs text-gray-850 line-clamp-1">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                                  Tamanho: <span className="text-gray-700">{item.size}</span> • Cor: <span className="text-gray-700">{item.colorName}</span>
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-mono text-gray-500 font-bold block">{item.quantity}x</span>
                              <span className="font-mono text-gray-800 font-bold">R$ {item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Forma de Pagamento: <span className="text-gray-700">{order.method.toUpperCase()}</span>
                        </span>
                        <button
                          onClick={() => {
                            const whatsappMsg = encodeURIComponent(
                              `Olá FR Moletom! Preciso de suporte com o meu pedido #${order.id}. Email do cadastro: ${user.email}`
                            );
                            window.open(`https://api.whatsapp.com/send?phone=5511949697239&text=${whatsappMsg}`, '_blank');
                          }}
                          className="text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          Suporte no WhatsApp <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="bg-white border border-gray-150 p-4 sm:p-6 shadow-sm">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#002855] border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
                <Heart size={16} className="text-red-500 fill-red-500" /> Seus Favoritos Salvos
              </h3>

              {favoritedProducts.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-gray-200">
                  <span className="text-4xl block mb-3">❤️</span>
                  <h4 className="font-extrabold text-gray-850 text-sm uppercase tracking-wider mb-1">
                    Nenhum Favorito Encontrado
                  </h4>
                  <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto mb-6">
                    Você ainda não marcou nenhum moletom, camiseta ou calça como favorito. Explore nossa loja e clique no coração!
                  </p>
                  <button
                    onClick={() => onNavigate('shop', null)}
                    className="bg-[#002855] hover:bg-[#FF7A00] text-white px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Ver Coleção Completa
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoritedProducts.map((p) => {
                    const price = p.promoPrice || p.originalPrice;
                    const productGroups = favoriteGroups.filter(g => g.productIds.includes(p.id));
                    return (
                      <div key={p.id} className="border border-gray-150 p-3 flex gap-4 hover:border-gray-300 transition-all relative">
                        {/* Group Actions: Folder & Delete */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-white/90 px-1.5 py-1 rounded border border-gray-100 shadow-sm">
                          <button
                            onClick={() => onOrganizeProduct?.(p)}
                            title="Organizar em pastas"
                            className="text-gray-400 hover:text-[#002855] transition-colors p-0.5 cursor-pointer"
                          >
                            <Folder size={13} />
                          </button>
                          <button
                            onClick={() => onToggleFavorite(p.id)}
                            title="Remover dos favoritos"
                            className="text-gray-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Image */}
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-20 object-cover border border-gray-200 shrink-0 cursor-pointer"
                          onClick={() => onViewProduct(p)}
                        />

                        {/* Content */}
                        <div className="flex flex-col justify-between py-0.5 flex-1 pr-14">
                          <div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block leading-none mb-1">
                              {p.category} {productGroups.length > 0 && `• 📁 ${productGroups.map(g => g.name).join(', ')}`}
                            </span>
                            <h4
                              onClick={() => onViewProduct(p)}
                              className="font-extrabold text-xs text-gray-800 line-clamp-2 hover:text-[#002855] transition-colors cursor-pointer mt-0.5"
                            >
                              {p.name}
                            </h4>
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className="font-black text-xs text-[#FF7A00] font-mono">
                              R$ {price.toFixed(2)}
                            </span>
                            <button
                              onClick={() => onViewProduct(p)}
                              className="bg-[#002855] hover:bg-[#FF7A00] text-white px-3 py-1.5 font-bold text-[9px] uppercase tracking-wider transition-all flex items-center gap-1"
                            >
                              <Eye size={10} /> Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="bg-white border border-gray-150 p-6 shadow-sm">
              <div className="border-b border-gray-100 pb-3 mb-5">
                <h3 className="font-black text-sm uppercase tracking-wider text-[#002855] flex items-center gap-2">
                  <Ticket size={16} className="text-[#FF7A00]" /> Cupons Ativos e Descontos
                </h3>
              </div>

              <p className="text-xs text-gray-500 font-semibold mb-6">
                Aqui você encontra cupons exclusivos associados à sua conta de cliente na **FR MOLETOM**. Aplique estes cupons no seu carrinho antes de finalizar a compra!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Coupon Card */}
                <div className="border border-dashed border-orange-300 bg-orange-50/25 p-5 relative overflow-hidden flex flex-col justify-between">
                  {/* Decorative Left Half circle */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-r border-dashed border-orange-300 rounded-r-full -ml-2" />
                  {/* Decorative Right Half circle */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-l border-dashed border-orange-300 rounded-l-full -mr-2" />

                  <div>
                    <span className="text-[9px] font-black text-[#FF7A00] uppercase tracking-widest block mb-1">CUPOM DE BOAS-VINDAS</span>
                    <h4 className="text-xl font-black text-[#002855] uppercase tracking-tight">5% DE DESCONTO</h4>
                    <p className="text-[10px] text-gray-500 font-bold mt-2 leading-relaxed">
                      Ganhe 5% de desconto em qualquer produto na sua primeira simulação ou pedido com o cupom abaixo.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex-1 bg-white border border-gray-200 text-center py-2 text-xs font-mono font-black uppercase text-gray-700 select-all">
                      PRIMEIRACOMPRA
                    </div>
                    <button
                      onClick={() => handleCopyCoupon('PRIMEIRACOMPRA')}
                      className="bg-[#002855] hover:bg-[#FF7A00] text-white px-3.5 py-2 font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                    >
                      {copiedCoupon ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Newsletter notification card */}
                <div className="border border-gray-150 bg-gray-50/50 p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">FUTUROS LANÇAMENTOS</span>
                    <h4 className="text-sm font-bold text-[#002855] uppercase tracking-tight">MAIS DESCONTOS EM BREVE</h4>
                    <p className="text-[10px] text-gray-500 font-bold mt-2 leading-relaxed">
                      Nossa próxima Newsletter trará campanhas de frete grátis e descontos progressivos para clientes cadastrados. Fique de olho no seu e-mail!
                    </p>
                  </div>
                  <div className="mt-6 text-[10px] text-[#002855] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" /> FR Moletom Premium Club
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
