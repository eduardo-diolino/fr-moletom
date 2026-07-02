import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, Heart, ShoppingBag, ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, categorySlug?: string | null) => void;
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onSearch: (query: string) => void;
}

export default function Header({
  currentPage,
  onNavigate,
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenAuth,
  onSearch
}: HeaderProps) {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    onNavigate('shop', null);
    setSearchOpen(false);
  };

  const navItems = [
    { label: 'Home', page: 'home', category: null },
    { label: 'Moletons', page: 'shop', category: 'moletons' },
    { label: 'Camisetas', page: 'shop', category: 'camisetas' },
    { label: 'Conjuntos', page: 'conjuntos', category: null },
    { label: 'Calças', page: 'calcas', category: null },
    { label: 'Shorts', page: 'shorts', category: null },
    { label: 'Lançamentos', page: 'shop', category: 'lancamentos' },
    { label: 'Promoções', page: 'shop', category: 'promocoes' },
    { label: 'Contato', page: 'contact', category: null },
    { label: 'Sobre Nós', page: 'about', category: null },
  ];

  return (
    <>
      <header
        className={`fixed top-12 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-md py-2 border-b border-gray-100'
            : 'bg-white/95 backdrop-blur-md py-4 border-b border-gray-50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Hamburger Mobile */}
            <button
              onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
              className="lg:hidden p-2 text-[#002855] hover:text-[#FF7A00] transition-colors focus:outline-none"
              aria-label="Abrir menu"
            >
              {isOpenMobileMenu ? <X size={26} /> : <Menu size={26} />}
            </button>

            {/* Logo */}
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <Logo className="h-10 sm:h-12" />
            </div>

            {/* Navigation Menu Central (Desktop) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.page, item.category);
                    setIsOpenMobileMenu(false);
                  }}
                  className={`px-3 py-2 rounded-md text-sm font-semibold tracking-wide transition-all duration-200 ${
                    currentPage === item.page && (item.category === null || item.category)
                      ? 'text-[#FF7A00] bg-orange-50/50'
                      : 'text-gray-700 hover:text-[#002855] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Icons Bar (Right side) */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-700 hover:text-[#002855] hover:bg-gray-50 rounded-full transition-all relative"
                title="Pesquisar"
              >
                <Search size={22} />
              </button>

              {/* My Account */}
              <button
                onClick={onOpenAuth}
                className="p-2 text-gray-700 hover:text-[#002855] hover:bg-gray-50 rounded-full transition-all"
                title="Minha Conta"
              >
                <User size={22} />
              </button>

              {/* Favorites (Wishlist) */}
              <button
                onClick={() => onNavigate('favorites')}
                className="p-2 text-gray-700 hover:text-red-500 hover:bg-gray-50 rounded-full transition-all relative"
                title="Favoritos"
              >
                <Heart size={22} className={favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF7A00] text-white text-[10px] w-5 h-5 font-bold flex items-center justify-center rounded-full animate-bounce">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={onOpenCart}
                className="p-2 text-gray-700 hover:text-[#002855] hover:bg-gray-50 rounded-full transition-all relative"
                title="Carrinho"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#002855] text-white text-[10px] w-5 h-5 font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* WhatsApp direct assist */}
              <a
                href="https://api.whatsapp.com/send?phone=5511949697239&text=Olá!%20Estou%20no%20site%20da%20FR%20Moletom%20e%20gostaria%20de%20tirar%20uma%20dúvida."
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex p-2 text-emerald-600 hover:bg-emerald-55 rounded-full transition-all"
                title="Suporte WhatsApp"
              >
                <MessageCircle size={22} />
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic Inner Search Bar Overlay */}
        {searchOpen && (
          <div className="bg-gray-50 border-t border-b border-gray-100 py-3 px-4 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="O que seu pequeno está precisando hoje? (ex: Moletom Canguru)"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#002855] text-gray-800 font-medium"
                    autoFocus
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => setSearchVal('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[#002855] hover:bg-[#054FA0] text-white px-5 py-2 rounded-full text-xs font-bold transition-all"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Drawer Mobile Navigation */}
      {isOpenMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay background */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobileMenu(false)}
          ></div>

          {/* Drawer content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white h-full shadow-2xl pl-6 py-6 pb-20 overflow-y-auto animate-slideIn">
            <div className="flex items-center justify-between pr-4 mb-8">
              <Logo className="h-10" />
              <button
                onClick={() => setIsOpenMobileMenu(false)}
                className="p-2 text-gray-500 hover:text-[#FF7A00] rounded-full hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="pr-4 mb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar roupas..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-xs font-medium focus:outline-none text-gray-800"
                />
              </form>
            </div>

            <nav className="flex-1 flex flex-col space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 mb-2">
                Categorias
              </span>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.page, item.category);
                    setIsOpenMobileMenu(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-l-full text-sm font-semibold flex items-center justify-between transition-all ${
                    currentPage === item.page && (item.category === null || item.category)
                      ? 'text-[#FF7A00] bg-orange-50 font-bold border-r-4 border-[#FF7A00]'
                      : 'text-gray-700 hover:text-[#002855] hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.category === 'moletons' && '🧥'}
                    {item.category === 'camisetas' && '👕'}
                    {(item.category === 'conjuntos' || item.page === 'conjuntos') && '🎽'}
                    {(item.category === 'calcas' || item.page === 'calcas') && '👖'}
                    {(item.category === 'bermudas' || item.page === 'shorts') && '🩳'}
                    {item.category === 'lancamentos' && '🔥'}
                    {item.category === 'promocoes' && '🏷️'}
                    {item.label}
                  </span>
                  <ArrowRight size={14} className="text-gray-300" />
                </button>
              ))}
            </nav>

            <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-gray-100">
              <a
                href="https://api.whatsapp.com/send?phone=5511949697239&text=Olá!%20Estou%20no%20site%20da%20FR%20Moletom."
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-50 text-emerald-600 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors text-xs"
              >
                <MessageCircle size={18} />
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
