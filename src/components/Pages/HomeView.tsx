import React, { useState } from 'react';
import { ArrowRight, Flame, Sparkles, MessageCircle, Truck, RefreshCw, ShieldCheck, Heart, Instagram, Camera, X, ChevronLeft, ChevronRight, ZoomIn, Star } from 'lucide-react';
import { Product, CategoryInfo, Review, StorefrontSettings } from '../../types';
import ProductCard from '../ProductCard';
import ReviewStars from '../ReviewStars';
import { CATEGORIES, TESTIMONIALS } from '../../data';

// @ts-expect-error - Vite handles dynamic JPG imports
import img1 from '../../assets/images/1.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img2 from '../../assets/images/2.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img3 from '../../assets/images/3.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img4 from '../../assets/images/4.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img5 from '../../assets/images/5.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img6 from '../../assets/images/6.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img7 from '../../assets/images/7.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img8 from '../../assets/images/8.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img9 from '../../assets/images/9.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img10 from '../../assets/images/10.jpeg';

const REAL_PHOTOS_GALLERY = [
  { img: img1, title: 'Moletom Azul Denim', tag: 'Foto Real • Encorpado', desc: 'Blusão de moletom premium flanelado, acabamento de ribana dupla super resistente e toque aveludado único.' },
  { img: img2, title: 'Calça de Moletom Canela', tag: 'Foto Real • Costura Dupla', desc: 'Calça jogger de inverno com excelente gramatura, cós elástico anatômico e bolsos reforçados para o dia a dia.' },
  { img: img3, title: 'Combo Confort Active', tag: 'Foto Real • Best Seller', desc: 'A combinação que as mamães adoram: caimento anatômico leve que se move de acordo com a energia da criança.' },
  { img: img4, title: 'Kids Explorer Moletom', tag: 'Foto Real • Proteção Térmica', desc: 'Nosso tecido flanelado de alto padrão europeu, protegendo do vento frio sem bloquear a respiração da pele.' },
  { img: img5, title: 'Shorts Bermuda Soft', tag: 'Foto Real • Moletinho Leve', desc: 'Frescor ideal para dias de primavera e passeio, feito em moletinho leve, macio e super respirável.' },
  { img: img6, title: 'Calça Kids Adventure', tag: 'Foto Real • Versatilidade', desc: 'Modelagem jogger anatômica com excelente elasticidade para brincadeiras que exigem o máximo de mobilidade.' },
  { img: img7, title: 'Blusão Hoodie Basic', tag: 'Foto Real • Capuz Anatômico', desc: 'Punho duplo elástico reforçado em ribana que resiste à lavagem diária e mantém a estrutura original da lã.' },
  { img: img8, title: 'Conjunto Playtime Duo', tag: 'Foto Real • Praticidade', desc: 'Conjunto confortável de algodão de toque macio que encanta as crianças pelo toque sedoso e estilo moderno.' },
  { img: img9, title: 'Cardigan Premium Ultra', tag: 'Foto Real • Algodão Penteado', desc: 'Fibras longas selecionadas com toque liso super sedoso que protege a pele e impede o acúmulo de bolinhas.' },
  { img: img10, title: 'Shorts Cargo Active', tag: 'Foto Real • Conforto Total', desc: 'Bolsos reforçados e caimento flexível de moletinho premium para brincar no parquinho sem restrições.' }
];

interface HomeViewProps {
  products: Product[];
  favorites: string[];
  onNavigate: (page: string, categorySlug?: string | null) => void;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: number) => void;
  onToggleFavorite: (productId: string) => void;
  storefrontSettings?: StorefrontSettings;
  testimonials?: Review[];
  onAddTestimonial?: (review: Review) => void;
}

const IconComponent = ({ name, size, className }: { name: string; size: number; className: string }) => {
  switch (name) {
    case 'Truck':
      return <Truck size={size} className={className} />;
    case 'RefreshCw':
      return <RefreshCw size={size} className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck size={size} className={className} />;
    case 'MessageCircle':
      return <MessageCircle size={size} className={className} />;
    case 'Flame':
      return <Flame size={size} className={className} />;
    case 'Sparkles':
      return <Sparkles size={size} className={className} />;
    case 'Heart':
      return <Heart size={size} className={className} />;
    case 'Star':
      return <Star size={size} className={className} />;
    default:
      return <Truck size={size} className={className} />;
  }
};

export default function HomeView({
  products,
  favorites,
  onNavigate,
  onViewProduct,
  onAddToCart,
  onToggleFavorite,
  storefrontSettings,
  testimonials = TESTIMONIALS,
  onAddTestimonial
}: HomeViewProps) {
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [testimonyIdx, setTestimonyIdx] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // States for the new review/testimonial form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const titles = storefrontSettings || {
    featured: 'PRODUTOS EM DESTAQUE',
    newArrivals: 'LANÇAMENTOS EXCLUSIVOS',
    bestSellers: 'MAIS VENDIDOS DA SEMANA',
    gallery: 'Galeria de Fotos Reais',
    categories: 'Compre por Categoria',
  };

  const benefits = storefrontSettings?.benefits || [
    {
      id: 'benefit_1',
      icon: 'Truck',
      title: 'Entrega Rápida',
      desc: 'Envio expresso para todo o Brasil. Frete grátis compras acima de R$199.'
    },
    {
      id: 'benefit_2',
      icon: 'RefreshCw',
      title: 'Troca Sem Complicações',
      desc: 'Até 7 dias úteis para realizar devoluções ou troca gratuita do tamanho.'
    },
    {
      id: 'benefit_3',
      icon: 'ShieldCheck',
      title: 'Checkout Seguro',
      desc: 'Pague via Pix ou em até 12x no cartão com tecnologia antifraude SSL.'
    },
    {
      id: 'benefit_4',
      icon: 'MessageCircle',
      title: 'Suporte WhatsApp',
      desc: 'Atendimento amigável via chat oficial para tirar dúvidas sobre medidas.'
    }
  ];

  const promoLeft = storefrontSettings?.promoLeft || {
    tag: 'Exclusivo Inverno',
    title: 'Moletons Premium Peluciados',
    subtitle: 'Estilo europeu com costuras triplas e conforto total para brincadeiras ao ar livre.',
    btnText: 'Ver Moletons',
    linkUrl: 'moletons',
    icon: '🧥',
    bgColorFrom: '#002855',
    bgColorTo: '#003D80'
  };

  const promoRight = storefrontSettings?.promoRight || {
    tag: 'Queima de Estoque',
    title: 'Coleção Outono Até 40% OFF',
    subtitle: 'As melhores camisetas de algodão egípcio e calças jogger com preços insuperáveis!',
    btnText: 'Aproveitar Ofertas',
    linkUrl: 'promocoes',
    icon: '🏷️',
    bgColorFrom: '#fb923c',
    bgColorTo: '#FF7A00'
  };

  const handlePromoClick = (url: string) => {
    if (!url) return;
    let cleanUrl = url.trim().toLowerCase();
    
    // Strip leading or trailing slashes and hashtags
    if (cleanUrl.startsWith('/')) cleanUrl = cleanUrl.substring(1);
    if (cleanUrl.startsWith('#')) cleanUrl = cleanUrl.substring(1);
    if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);
    
    // Map accented category names to valid slugs
    if (cleanUrl === 'calças') cleanUrl = 'calcas';
    if (cleanUrl === 'promoções' || cleanUrl === 'promoçoes') cleanUrl = 'promocoes';
    if (cleanUrl === 'lançamentos' || cleanUrl === 'lançamento') cleanUrl = 'lancamentos';

    // Route check for general pages
    const mainPages = ['home', 'shop', 'about', 'contact', 'profile', 'favorites', 'admin'];
    if (mainPages.includes(cleanUrl)) {
      onNavigate(cleanUrl, null);
      return;
    }

    const validCategories = ['moletons', 'camisetas', 'conjuntos', 'calcas', 'bermudas', 'lancamentos', 'promocoes'];
    if (validCategories.includes(cleanUrl)) {
      onNavigate('shop', cleanUrl);
    } else if (url.trim().startsWith('http://') || url.trim().startsWith('https://')) {
      window.open(url.trim(), '_blank');
    } else {
      // Fallback: try navigating as category under shop
      onNavigate('shop', cleanUrl);
    }
  };

  // Filter products by dynamic assigned storefront sections with core fallbacks
  const featuredProducts = products.filter(p => p.homepageSections?.includes('featured')).length > 0
    ? products.filter(p => p.homepageSections?.includes('featured'))
    : products.slice(0, 4);

  const newArrivals = products.filter(p => p.homepageSections?.includes('newArrivals')).length > 0
    ? products.filter(p => p.homepageSections?.includes('newArrivals'))
    : products.filter(p => p.isNew);

  const bestSellers = products.filter(p => p.homepageSections?.includes('bestSellers')).length > 0
    ? products.filter(p => p.homepageSections?.includes('bestSellers'))
    : products.slice(2, 5);

  const promoProducts = products.filter(p => p.onSale);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterName && newsletterEmail) {
      setSubscribed(true);
    }
  };

  const handlePrevTestimony = () => {
    setTestimonyIdx((prev) => (prev === 0 ? (testimonials.length || 1) - 1 : prev - 1));
  };

  const handleNextTestimony = () => {
    setTestimonyIdx((prev) => (prev + 1) % (testimonials.length || 1));
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === 0 ? REAL_PHOTOS_GALLERY.length - 1 : prev! - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % REAL_PHOTOS_GALLERY.length);
    }
  };

  // Instagram simulated image feed
  const INSTAGRAM_MOCKS = [
    { id: 1, img: img1 },
    { id: 2, img: img2 },
    { id: 3, img: img3 },
    { id: 4, img: img4 },
    { id: 5, img: img5 }
  ];

  return (
    <div className="flex flex-col gap-16 py-6 animate-fadeIn">
      
      {/* 1. Categorias cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#002855] uppercase tracking-wider">
              {titles.categories || 'Compre por Categoria'}
            </h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">Navegação especializada para looks perfeitos</p>
          </div>
          <button
            onClick={() => onNavigate('shop', null)}
            className="text-xs font-bold text-[#FF7A00] hover:text-[#002855] flex items-center gap-1.5 transition-colors uppercase tracking-widest"
          >
            Ver Todas <ArrowRight size={14} />
          </button>
        </div>

        {/* Carousel of dynamic categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.slug}
              onClick={() => onNavigate('shop', cat.slug)}
              className={`group rounded-none border p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${cat.color} flex flex-col items-center justify-between`}
            >
              <div className="w-14 h-14 rounded-none overflow-hidden bg-white/80 border border-white/50 mb-3 flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </div>
              <h3 className="font-extrabold text-xs text-gray-800 tracking-wide uppercase">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Custom Promotional Banners Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner Left */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${promoLeft.bgColorFrom || '#002855'}, ${promoLeft.bgColorTo || '#003D80'})`
            }}
            className="text-white p-8 rounded-none relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px] group"
          >
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 flex items-center justify-center select-none text-9xl">
              {promoLeft.icon || '🧥'}
            </div>
            <div>
              <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-none font-bold uppercase tracking-wider">
                {promoLeft.tag}
              </span>
              <h3 className="text-2xl font-bold font-display uppercase tracking-tight mt-4 max-w-xs leading-tight">
                {promoLeft.title}
              </h3>
              <p className="text-xs text-blue-100 font-semibold mt-2 max-w-xs">
                {promoLeft.subtitle}
              </p>
            </div>
            <button
              onClick={() => handlePromoClick(promoLeft.linkUrl)}
              className="bg-white hover:bg-[#FF7A00] hover:text-white text-[#002855] font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-none transition-all self-start mt-6 shadow-md cursor-pointer"
            >
              {promoLeft.btnText}
            </button>
          </div>

          {/* Banner Right */}
          <div 
            style={{
              background: `linear-gradient(135deg, ${promoRight.bgColorFrom || '#fb923c'}, ${promoRight.bgColorTo || '#FF7A00'})`
            }}
            className="text-white p-8 rounded-none relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px] group"
          >
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 flex items-center justify-center select-none text-9xl">
              {promoRight.icon || '🏷️'}
            </div>
            <div>
              <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-none font-bold uppercase tracking-wider">
                {promoRight.tag}
              </span>
              <h3 className="text-2xl font-bold font-display uppercase tracking-tight mt-4 max-w-xs leading-tight">
                {promoRight.title}
              </h3>
              <p className="text-xs text-orange-50 font-semibold mt-2 max-w-xs">
                {promoRight.subtitle}
              </p>
            </div>
            <button
              onClick={() => handlePromoClick(promoRight.linkUrl)}
              className="bg-white hover:bg-[#002855] hover:text-white text-[#FF7A00] font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-none transition-all self-start mt-6 shadow-md cursor-pointer"
            >
              {promoRight.btnText}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Grid (Destaques) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col mb-10 text-center sm:text-left">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest mb-1 block">
            Os mais pedidos
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002855] uppercase tracking-wider">
            {titles.featured || 'PRODUTOS EM DESTAQUE'}
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Qualidade indestrutível para curtir com conforto absoluto
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFavorite={favorites.includes(p.id)}
              onView={onViewProduct}
              onAddToCart={(product, sz) => onAddToCart(product, sz)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 4. Lançamentos Section with high contrast custom slider theme */}
      <section className="bg-gray-50 border-t border-b border-gray-100 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-1">
                <Flame size={16} className="text-[#FF7A00] fill-[#FF7A00]" />
                <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest">Just In</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002855] uppercase tracking-wider mt-1">
                {titles.newArrivals || 'LANÇAMENTOS EXCLUSIVOS'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop', 'lancamentos')}
              className="text-xs font-bold text-[#002855] hover:text-[#FF7A00] flex items-center gap-1.5 transition-colors uppercase tracking-widest cursor-pointer"
            >
              Ver Tudo <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.slice(0, 3).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFavorite={favorites.includes(p.id)}
                onView={onViewProduct}
                onAddToCart={(product, sz) => onAddToCart(product, sz)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Benefits indicators section with modern clean designs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#002855] rounded-none p-8 text-white relative overflow-hidden shadow-sm">
          {benefits.map((b, idx) => {
            let borderClasses = "flex gap-4 items-start";
            if (idx === 0) {
              borderClasses += " border-b sm:border-b-0 sm:border-r border-white/10 pb-6 sm:pb-0 pr-0 sm:pr-4";
            } else if (idx === 1) {
              borderClasses += " border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 pr-0 lg:pr-4";
            } else if (idx === 2) {
              borderClasses += " border-b sm:border-b-0 sm:border-r border-white/10 pb-6 sm:pb-0 pr-0 sm:pr-4";
            }
            return (
              <div key={b.id || idx} className={borderClasses}>
                <IconComponent name={b.icon} size={32} className="text-[#FF7A00] shrink-0 stroke-[2.5]" />
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide">{b.title}</h4>
                  <p className="text-[11px] text-blue-100 font-medium leading-relaxed mt-1">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. High volume carrossel: Mais Vendidos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col mb-10 text-center sm:text-left">
          <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest mb-1 block">
            Os preferidos das mamães
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002855] uppercase tracking-wider">
            {titles.bestSellers || 'MAIS VENDIDOS DA SEMANA'}
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            Unindo elegância, toque macio de algodão egípcio e durabilidade especial
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestSellers.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFavorite={favorites.includes(p.id)}
              onView={onViewProduct}
              onAddToCart={(product, sz) => onAddToCart(product, sz)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Real Photos Product Gallery (Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-gray-150 pt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[#FF7A00] mb-2">
              <Camera size={16} className="fill-orange-500/10" />
              <span className="text-xs font-black uppercase tracking-widest">Compromisso com a Qualidade</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#002855] uppercase tracking-wider">
              {titles.gallery || 'Galeria de Fotos Reais'}
            </h2>
            <p className="text-xs text-gray-400 font-bold mt-1">
              Chega de surpresas nas compras online! Veja fotos 100% reais tiradas em nosso estúdio para conferir a altíssima qualidade do tecido e das costuras.
            </p>
          </div>
          <span className="text-xs font-black bg-gray-100 text-[#002855] border border-gray-200 px-3.5 py-1.5 uppercase tracking-widest self-start md:self-auto select-none">
            {REAL_PHOTOS_GALLERY.length} Fotos de Estúdio
          </span>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {REAL_PHOTOS_GALLERY.map((item, index) => (
            <div
              key={index}
              onClick={() => setLightboxIndex(index)}
              className="group cursor-pointer bg-white border border-gray-150 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Box */}
              <div className="relative pt-[125%] overflow-hidden bg-gray-50">
                <img
                  src={item.img}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-[#002855]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/95 text-[#002855] p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <ZoomIn size={18} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Corner Label */}
                <span className="absolute top-3 left-3 bg-[#FF7A00] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1">
                  {item.tag}
                </span>
              </div>

              {/* Decriptions Footer */}
              <div className="p-4 border-t border-gray-100 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wide group-hover:text-[#FF7A00] transition-colors mb-1 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[10.5px] text-gray-400 font-bold leading-normal line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                
                <span className="text-[9px] text-[#002855] group-hover:text-[#FF7A00] font-black uppercase tracking-widest mt-4 flex items-center gap-1 transition-all">
                  Clique para zoom <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Elegant Lightbox Modal Overlay */}
      {lightboxIndex !== null && (
        <div
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all z-50 cursor-pointer"
            title="Fechar"
          >
            <X size={20} className="stroke-[2.5]" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={handlePrevImage}
            className="absolute left-4 md:left-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-10 cursor-pointer"
            title="Anterior"
          >
            <ChevronLeft size={24} className="stroke-[2.5]" />
          </button>

          {/* Central Modal container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-white flex flex-col md:flex-row shadow-2xl animate-scaleIn border border-white/10 overflow-hidden"
          >
            {/* Image section */}
            <div className="relative md:w-3/5 bg-neutral-950 flex items-center justify-center min-h-[320px] md:max-h-[80vh]">
              <img
                src={REAL_PHOTOS_GALLERY[lightboxIndex].img}
                alt={REAL_PHOTOS_GALLERY[lightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[50vh] md:max-h-[75vh] object-contain transition-all"
              />
              <span className="absolute bottom-4 left-4 bg-black/60 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 text-center">
                FOTO REAL {lightboxIndex + 1} DE {REAL_PHOTOS_GALLERY.length}
              </span>
            </div>

            {/* Content side */}
            <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white text-gray-900 border-t md:border-t-0 md:border-l border-gray-150">
              <div>
                <span className="bg-[#FF7A00] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 inline-block mb-3 select-none">
                  🔍 Alta Resolução Estúdio
                </span>
                <h3 className="text-lg font-black text-[#002855] uppercase tracking-wide mb-1">
                  {REAL_PHOTOS_GALLERY[lightboxIndex].title}
                </h3>
                <p className="text-xs text-[#FF7A00] font-black uppercase tracking-wider mb-4">
                  {REAL_PHOTOS_GALLERY[lightboxIndex].tag}
                </p>
                
                <hr className="border-gray-100 mb-4" />

                <h4 className="text-[11px] font-black text-gray-800 uppercase tracking-wider mb-1.5">Material e Caimento</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed mb-6">
                  {REAL_PHOTOS_GALLERY[lightboxIndex].desc}
                </p>

                <div className="bg-orange-50/50 border border-orange-100 p-4">
                  <h5 className="text-[9px] font-black text-[#FF7A00] uppercase tracking-wider mb-1">🔍 Diferencial de Verdade</h5>
                  <p className="text-[10px] text-gray-400 font-bold leading-normal">
                    Fibras penteadas super macias com reforços estruturais nas golas e mangas. Conforto térmico inigualável para o dia a dia e nas brincadeiras mais agitadas do seu menino.
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setLightboxIndex(null);
                    onNavigate('shop', null);
                  }}
                  className="flex-1 bg-[#002855] hover:bg-[#FF7A00] text-white text-center py-3 px-4 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Ver Catálogo Completo
                </button>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-center py-3 px-5 font-bold text-xs uppercase tracking-wider transition-all border border-gray-200 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNextImage}
            className="absolute right-4 md:right-8 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-10 cursor-pointer"
            title="Próxima"
          >
            <ChevronRight size={24} className="stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* 7. Client Testimonials review sliders */}
      <section className="bg-gray-100 border-t border-b border-gray-200/50 py-16 w-full">
        <div className="max-w-xl mx-auto px-4 text-center flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#002855] uppercase tracking-widest block mb-1">
            Opinião Real de Clientes
          </span>
          <h3 className="text-2xl font-bold font-display text-[#002855] uppercase tracking-wider mb-8">
            Avaliações com Nota Máxima ⭐
          </h3>

          {/* Testimonies Card */}
          {testimonials.length > 0 ? (
            (() => {
              const safeTestimonyIdx = testimonyIdx >= testimonials.length ? 0 : testimonyIdx;
              const currentTestimony = testimonials[safeTestimonyIdx];
              return (
                <div className="bg-white rounded-none p-6 sm:p-8 border border-gray-150 shadow-sm relative w-full flex flex-col gap-4 animate-fadeIn">
                  <div className="flex justify-center">
                    <ReviewStars rating={currentTestimony.rating} size={18} />
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-600 font-semibold italic leading-relaxed">
                    "{currentTestimony.comment}"
                  </p>

                  <div className="mt-2">
                    <h4 className="font-extrabold text-gray-900 text-sm">
                      {currentTestimony.author}
                    </h4>
                    <p className="text-[10px] text-[#FF7A00] font-bold mt-0.5">
                      {currentTestimony.location} • {currentTestimony.date}
                    </p>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-white rounded-none p-8 border border-gray-150 shadow-sm relative w-full text-center">
              <p className="text-gray-500 font-medium text-sm">Seja o primeiro a avaliar a FR Moletom!</p>
            </div>
          )}

          {/* Carousel dots controls */}
          {testimonials.length > 0 && (
            <div className="flex gap-2 mt-6">
              {testimonials.map((_, i) => {
                const safeTestimonyIdx = testimonyIdx >= testimonials.length ? 0 : testimonyIdx;
                return (
                  <button
                    key={i}
                    onClick={() => setTestimonyIdx(i)}
                    className={`w-2.5 h-2.5 rounded-none transition-all ${
                      i === safeTestimonyIdx ? 'w-6 bg-[#002855]' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para avaliação ${i + 1}`}
                  />
                );
              })}
            </div>
          )}

          {/* Leave a review button and form */}
          <div className="mt-8 w-full">
            {!showReviewForm ? (
              <button
                onClick={() => {
                  setShowReviewForm(true);
                  setReviewSubmitted(false);
                }}
                className="inline-flex items-center gap-2 bg-[#002855] hover:bg-[#FF7A00] text-white text-xs font-black uppercase tracking-wider py-3 px-6 transition-all shadow-sm cursor-pointer"
              >
                Deixar Meu Depoimento Real ✍️
              </button>
            ) : (
              <div className="bg-white rounded-none p-6 border border-gray-200 shadow-md text-left w-full animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-black text-[#002855] text-sm uppercase tracking-wider">Escreva seu Depoimento</h4>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {reviewSubmitted ? (
                  <div className="py-6 text-center">
                    <span className="text-3xl block mb-2">🎉</span>
                    <h5 className="font-bold text-gray-800 text-sm mb-1">Avaliação enviada com sucesso!</h5>
                    <p className="text-xs text-gray-500">Obrigado por compartilhar sua opinião realista conosco!</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newAuthor.trim() || !newComment.trim()) {
                      return;
                    }
                    const newRev: Review = {
                      id: `t-${Date.now()}`,
                      author: newAuthor.trim(),
                      rating: newRating,
                      date: new Date().toLocaleDateString('pt-BR'),
                      comment: newComment.trim(),
                      location: newLocation.trim() || 'Brasil'
                    };
                    if (onAddTestimonial) {
                      onAddTestimonial(newRev);
                    }
                    setReviewSubmitted(true);
                    setTestimonyIdx(0); // Exibe o novo comentário imediatamente
                    // Reseta campos
                    setNewAuthor('');
                    setNewLocation('');
                    setNewRating(5);
                    setNewComment('');
                    // Fecha o formulário após 3 segundos
                    setTimeout(() => {
                      setShowReviewForm(false);
                      setReviewSubmitted(false);
                    }, 3000);
                  }} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Nome Completo</label>
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Ex: Amanda Silva"
                        className="w-full bg-gray-50 border border-gray-200 text-sm px-3 py-2 text-gray-900 rounded-none focus:outline-none focus:border-[#002855] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Sua Cidade / Estado</label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Ex: Rio de Janeiro - RJ"
                        className="w-full bg-gray-50 border border-gray-200 text-sm px-3 py-2 text-gray-900 rounded-none focus:outline-none focus:border-[#002855] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Sua Nota</label>
                      <div className="flex gap-1.5 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              size={22}
                              fill={star <= newRating ? 'currentColor' : 'none'}
                              className={star <= newRating ? 'text-amber-400' : 'text-gray-300'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Seu Depoimento Sincero</label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Conte sua experiência com os tecidos, entrega e atendimento da FR Moletom..."
                        className="w-full bg-gray-50 border border-gray-200 text-sm px-3 py-2 text-gray-900 rounded-none focus:outline-none focus:border-[#002855] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#002855] hover:bg-[#FF7A00] text-white text-xs font-black uppercase tracking-wider py-3 px-4 transition-all w-full text-center cursor-pointer mt-2"
                    >
                      Publicar Depoimento Real ⭐
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. Instagram mock Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
        <span className="text-xs font-bold text-[#FF7A00] uppercase tracking-widest block mb-1">
          Galeria de Fotos
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#002855] uppercase tracking-wider mb-2">
          #FRMOLETOM NO INSTAGRAM
        </h2>
        <p className="text-xs text-gray-400 font-bold mb-8 uppercase tracking-wider">
          Siga-nos para conferir novidades diárias e looks inspiradores para os garotos!
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {INSTAGRAM_MOCKS.map((mock) => (
            <a
              key={mock.id}
              href="https://www.instagram.com/frmoletom?igsh=M2V2a3ZpMGU1NWp6"
              target="_blank"
              rel="noreferrer"
              className="group aspect-square rounded-none overflow-hidden bg-gray-50 border border-gray-100 relative cursor-pointer shadow-sm hover:scale-[1.02] transition-all block"
            >
              <img src={mock.img} alt="insta-mock" referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#002855]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram size={28} className="text-white" />
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://www.instagram.com/frmoletom?igsh=M2V2a3ZpMGU1NWp6"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#002855] hover:bg-[#FF7A00] text-white py-4 px-8 rounded-none font-bold text-xs uppercase tracking-widest transition-colors shadow-sm cursor-pointer"
        >
          <Instagram size={15} /> Seguir Instagram Oficial
        </a>
      </section>

      {/* 9. Newsletter Registration Box */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="bg-[#FF7A00] rounded-none p-8 sm:p-12 text-white relative overflow-hidden shadow-md flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          
          <div className="max-w-md">
            <span className="text-[10px] font-bold uppercase bg-white/20 text-white py-1 px-2.5 rounded-none tracking-widest mb-2 inline-block">
              Fique por dentro de tudo
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wider leading-none mb-2">
              Assine Nossa Newsletter
            </h3>
            <p className="text-xs sm:text-sm text-orange-50 font-semibold">
              Cadastre-se e ganhe cupons adicionais, novidades fresquinhas de inverno e dicas de moda infantil diretamente no seu e-mail!
            </p>
          </div>

          <div className="w-full lg:w-auto flex-1 max-w-md">
            {subscribed ? (
              <div className="bg-white/10 p-6 rounded-none text-center border border-white/20">
                <p className="font-bold text-sm">🎉 CADASTRO EFETUADO COM SUCESSO!</p>
                <p className="text-xs text-orange-100 mt-1">Acompanhe seu email para os próximos lançamentos.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2.5 w-full">
                <input
                  type="text"
                  required
                  placeholder="Seu primeiro nome"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  className="w-full bg-white text-gray-800 placeholder-gray-400 font-semibold px-4 py-3 rounded-none text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]"
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Seu melhor e-mail"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-white text-gray-800 placeholder-gray-400 font-semibold px-4 py-3 rounded-none text-xs focus:outline-none focus:ring-2 focus:ring-[#002855]"
                  />
                  <button
                    type="submit"
                    className="bg-[#002855] hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-none transition-all cursor-pointer"
                  >
                    Cadastrar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
