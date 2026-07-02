import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import HomeView from './components/Pages/HomeView';
import CatalogView from './components/Pages/CatalogView';
import CalcasView from './components/Pages/CalcasView';
import ShortsView from './components/Pages/ShortsView';
import ConjuntosView from './components/Pages/ConjuntosView';
import ProductDetail from './components/ProductDetail';
import AboutView from './components/Pages/AboutView';
import ContactView from './components/Pages/ContactView';
import ProfileView from './components/Pages/ProfileView';
import CheckoutPage from './components/CheckoutPage';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import FavoriteGroupModal from './components/FavoriteGroupModal';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import AdminDashboard from './components/Pages/AdminDashboard';

import { Product, CartItem, FilterState, User, Color, AnnouncementSettings, HeroSlide, Review, StorefrontSettings, Order, FavoriteGroup } from './types';
import { PRODUCTS, TESTIMONIALS } from './data';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';

const INITIAL_FILTERS: FilterState = {
  size: null,
  colorName: null,
  category: null,
  priceRange: [50, 300],
  onlyPromo: false,
  sortBy: 'relevance',
  searchQuery: ''
};

export default function App() {
  // Navigation & Page State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Safe Local Storage parsing utility
  const safeParse = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === 'undefined' || saved === 'null') {
        return defaultValue;
      }
      const parsed = JSON.parse(saved);
      if (parsed === null || parsed === undefined) {
        return defaultValue;
      }

      // Validate keys dynamically to prevent Uncaught runtime exceptions
      if (key === 'fr_announcement_settings') {
        const p = parsed as any;
        if (!p || typeof p !== 'object' || !Array.isArray(p.messages) || typeof p.speed !== 'number') {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
      }

      if (key === 'fr_hero_slides') {
        if (!Array.isArray(parsed)) {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
      }

      if (key === 'fr_master_colors') {
        if (!Array.isArray(parsed)) {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
      }

      if (key === 'fr_products') {
        if (!Array.isArray(parsed)) {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
      }

      if (key === 'fr_cart') {
        if (!Array.isArray(parsed)) {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
      }

      if (key === 'fr_favorites') {
        if (!Array.isArray(parsed)) {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
      }

      if (key === 'fr_storefront_settings') {
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          console.warn(`Invalid format found for ${key}, resetting to default.`);
          return defaultValue;
        }
        // Merge defaults with parsed values to support new fields
        return {
          ...defaultValue,
          ...parsed
        } as unknown as T;
      }

      // If of object type, merge defaults deep/shallow to satisfy type definitions
      if (key === 'fr_user' && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return {
          name: '',
          email: '',
          logged: false,
          favorites: [],
          ...parsed
        } as unknown as T;
      }
      return parsed as T;
    } catch (error) {
      console.error(`Error loading or parsing JSON for key "${key}":`, error);
      return defaultValue;
    }
  };

  // Dynamic Products state loaded from Local Storage or default catalog
  const [productsList, setProductsList] = useState<Product[]>(() => {
    return safeParse<Product[]>('fr_products', PRODUCTS);
  });

  // Core Ecom State (Local Storage persistence)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return safeParse<CartItem[]>('fr_cart', []);
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    return safeParse<string[]>('fr_favorites', []);
  });

  const [user, setUser] = useState<User>(() => {
    return safeParse<User>('fr_user', { name: '', email: '', logged: false, favorites: [] });
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return safeParse<Order[]>('fr_orders', []);
  });

  const [favoriteGroups, setFavoriteGroups] = useState<FavoriteGroup[]>(() => {
    return safeParse<FavoriteGroup[]>('fr_favorite_groups', []);
  });

  const [favoriteModalOpen, setFavoriteModalOpen] = useState(false);
  const [authFavoritesModalOpen, setAuthFavoritesModalOpen] = useState(false);
  const [pendingFavoriteProduct, setPendingFavoriteProduct] = useState<Product | null>(null);
  const [selectedFavoriteGroupId, setSelectedFavoriteGroupId] = useState<string>('all');
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [newGroupNameInput, setNewGroupNameInput] = useState('');
  const [createGroupError, setCreateGroupError] = useState('');
  const [deleteGroupPending, setDeleteGroupPending] = useState<string | null>(null);

  // Controls
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showToTopBtn, setShowToTopBtn] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('fr_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('fr_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('fr_user', JSON.stringify(user));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('fr_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('fr_favorite_groups', JSON.stringify(favoriteGroups));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [favoriteGroups]);

  useEffect(() => {
    try {
      localStorage.setItem('fr_products', JSON.stringify(productsList));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [productsList]);

  // Real-time Products Sync from Firestore
  useEffect(() => {
    const path = 'products';
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        if (snapshot.empty) {
          console.log('No products found in Firestore. Showing local PRODUCTS list as fallback.');
          setProductsList(PRODUCTS);
        } else {
          const list: Product[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as Product);
          });
          setProductsList(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Auth State and synchronize `/users/{userId}` profile doc
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userId = firebaseUser.uid;
        const userRef = doc(db, 'users', userId);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUser({
              name: data.name || firebaseUser.displayName || 'Usuário',
              email: data.email || firebaseUser.email || '',
              logged: true,
              favorites: data.favorites || []
            });
            setFavorites(data.favorites || []);
          } else {
            const initialData = {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
              email: firebaseUser.email || '',
              favorites: favorites
            };
            await setDoc(userRef, initialData);
            setUser({
              name: initialData.name,
              email: initialData.email,
              logged: true,
              favorites: initialData.favorites
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${userId}`);
        }
      } else {
        setUser({ name: '', email: '', logged: false, favorites: [] });
        setFavorites(safeParse<string[]>('fr_favorites', []));
        setFavoriteGroups(safeParse<FavoriteGroup[]>('fr_favorite_groups', []));
        setOrders(safeParse<Order[]>('fr_orders', []));
      }
    });
    return () => unsubscribe();
  }, []);

  // Update favorites in Firestore when favorites state changes
  useEffect(() => {
    const updateFavorites = async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userRef = doc(db, 'users', userId);
        try {
          await updateDoc(userRef, { favorites });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
        }
      }
    };
    updateFavorites();
  }, [favorites]);

  // Listen to favoriteGroups collection in Firestore under /users/{userId}/favoriteGroups
  useEffect(() => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const path = `users/${userId}/favoriteGroups`;
    const unsubscribe = onSnapshot(
      collection(db, 'users', userId, 'favoriteGroups'),
      (snapshot) => {
        const list: FavoriteGroup[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as FavoriteGroup);
        });
        setFavoriteGroups(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsubscribe();
  }, [user.logged]);

  // Listen to orders in Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const userId = auth.currentUser.uid;
    const path = 'orders';
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Order);
        });
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return () => unsubscribe();
  }, [user.logged]);

  // Dynamic storefront section titles
  const [storefrontSettings, setStorefrontSettings] = useState<StorefrontSettings>(() => {
    const DEFAULT_SECTION_TITLES: StorefrontSettings = {
      featured: 'PRODUTOS EM DESTAQUE',
      newArrivals: 'LANÇAMENTOS EXCLUSIVOS',
      bestSellers: 'MAIS VENDIDOS DA SEMANA',
      gallery: 'Galeria de Fotos Reais',
      categories: 'Compre por Categoria',
      benefits: [
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
      ],
      promoLeft: {
        tag: 'Exclusivo Inverno',
        title: 'Moletons Premium Peluciados',
        subtitle: 'Estilo europeu com costuras triplas e conforto total para brincadeiras ao ar livre.',
        btnText: 'Ver Moletons',
        linkUrl: 'moletons',
        icon: '🧥',
        bgColorFrom: '#002855',
        bgColorTo: '#003D80'
      },
      promoRight: {
        tag: 'Queima de Estoque',
        title: 'Coleção Outono Até 40% OFF',
        subtitle: 'As melhores camisetas de algodão egípcio e calças jogger com preços insuperáveis!',
        btnText: 'Aproveitar Ofertas',
        linkUrl: 'promocoes',
        icon: '🏷️',
        bgColorFrom: '#fb923c',
        bgColorTo: '#FF7A00'
      }
    };
    return safeParse<StorefrontSettings>('fr_storefront_settings', DEFAULT_SECTION_TITLES);
  });

  useEffect(() => {
    try {
      localStorage.setItem('fr_storefront_settings', JSON.stringify(storefrontSettings));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [storefrontSettings]);

  // Global Color Attributes state manager
  const DEFAULT_COLORS: Color[] = [
    { name: 'Azul Escuro', hex: '#02407d' },
    { name: 'Cinza Mescla', hex: '#b2b2b2' },
    { name: 'Laranja Solar', hex: '#FF7A00' },
    { name: 'Preto', hex: '#000000' },
    { name: 'Verde Militar', hex: '#4B5320' },
    { name: 'Azul Marinho', hex: '#002855' },
    { name: 'Branco', hex: '#ffffff' }
  ];

  const [masterColors, setMasterColors] = useState<Color[]>(() => {
    return safeParse<Color[]>('fr_master_colors', DEFAULT_COLORS);
  });

  useEffect(() => {
    try {
      localStorage.setItem('fr_master_colors', JSON.stringify(masterColors));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [masterColors]);

  // Top announcement state (Marquee speed and text strings)
  const [announcementSettings, setAnnouncementSettings] = useState<AnnouncementSettings>(() => {
    const DEFAULT_ANNOUNCEMENTS: AnnouncementSettings = {
      messages: [
        "🚚 FRETE GRÁTIS acima de R$ 199 para todo o Brasil",
        "🎁 Primeira compra? Use o cupom PRIMEIRACOMPRA para 5% OFF!",
        "💳 Parcelamos em até 12x (5x sem juros no cartão)",
        "⚡ Envio expresso para todo Brasil com código de rastreio",
        "⭐ Roupas Infantis Premium da faixa etária 2 a 16 anos!",
        "📲 Suporte especializado via WhatsApp para auxílio de medidas"
      ],
      speed: 25
    };
    return safeParse<AnnouncementSettings>('fr_announcement_settings', DEFAULT_ANNOUNCEMENTS);
  });

  useEffect(() => {
    try {
      localStorage.setItem('fr_announcement_settings', JSON.stringify(announcementSettings));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [announcementSettings]);

  // Main Hero banners state
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const DEFAULT_SLIDES: HeroSlide[] = [
      {
        id: '1',
        image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1920&auto=format&fit=crop',
        title: 'CONFORTO PREMIUM PARA O SEU PEQUENO',
        subtitle: 'Moletons peluciados ultra quentes e aconchegantes com tecido 100% algodão fios selecionados. Tamanhos do 2 ao 16 anos!',
        btn1Text: 'Comprar Coleção',
        btn1Url: '#/',
        btn2Text: 'Ver Outlet',
        btn2Url: '#/'
      },
      {
        id: '2',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1920&auto=format&fit=crop',
        title: 'ELEGÂNCIA URBANA E ZERO PRECONCEITOS',
        subtitle: 'Conjuntos e casacos modernos que combinam alta transpiração e liberdade absoluta de movimentos para correr e brincar.',
        btn1Text: 'Ver Lançamentos',
        btn1Url: '#/',
        btn2Text: 'Tabela Medidas',
        btn2Url: '#/'
      },
      {
        id: '3',
        image: 'https://images.unsplash.com/photo-1540479859303-471343e7751b?q=80&w=1920&auto=format&fit=crop',
        title: 'PROMOÇÕES DE ATÉ 40% OFF EXTRA',
        subtitle: 'Aproveite descontos imperdíveis com parcelamento facilitado em até 12 vezes e com entrega imediata para todo o país!',
        btn1Text: 'Ver Outlet com Desconto',
        btn1Url: '#/',
        btn2Text: 'Ajuda WhatsApp',
        btn2Url: 'https://api.whatsapp.com/send?phone=5511949697239'
      }
    ];
    return safeParse<HeroSlide[]>('fr_hero_slides', DEFAULT_SLIDES);
  });

  useEffect(() => {
    try {
      localStorage.setItem('fr_hero_slides', JSON.stringify(heroSlides));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [heroSlides]);

  // Dynamic client testimonials
  const [testimonialsList, setTestimonialsList] = useState<Review[]>(() => {
    return safeParse<Review[]>('fr_testimonials', TESTIMONIALS);
  });

  useEffect(() => {
    try {
      localStorage.setItem('fr_testimonials', JSON.stringify(testimonialsList));
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [testimonialsList]);

  const handleAddTestimonial = (newReview: Review) => {
    setTestimonialsList((prev) => [newReview, ...prev]);
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
  };

  // Admin Inclusions & Removals Actions
  const handleAddProduct = async (newProd: Product) => {
    setProductsList((prev) => [newProd, ...prev]);
    try {
      await setDoc(doc(db, 'products', newProd.id), newProd);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${newProd.id}`);
    }
  };

  const handleUpdateProduct = async (updatedProd: Product) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    try {
      await setDoc(doc(db, 'products', updatedProd.id), updatedProd);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `products/${updatedProd.id}`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  // Back to top scroll observer
  useEffect(() => {
    const toggleVisibility = () => {
      setShowToTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Set-up Actions
  const handleNavigate = (page: string, categorySlug: string | null = null) => {
    // Engagement feature guard for unauthenticated clients
    if (page === 'favorites' && !user.logged) {
      setPendingFavoriteProduct(null);
      setAuthFavoritesModalOpen(true);
      return;
    }

    setCurrentPage(page);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Pre-apply category filter if selected from menu
    if (page === 'shop') {
      const activeCategory = (categorySlug === 'todos' || categorySlug === 'all') ? null : categorySlug;
      setFilters((prev) => ({
        ...prev,
        category: activeCategory,
        searchQuery: activeCategory ? '' : prev.searchQuery // Clear search if clicking direct category
      }));
    }
  };

  const handleSearch = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
      category: null // Reset category to look everywhere
    }));
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCartQuick = (product: Product, size: number) => {
    const defaultColor = product.colors[0];
    handleAddToCartCombined(product, size, defaultColor, 1);
  };

  const handleAddToCartCombined = (product: Product, size: number, color: Color, qty: number) => {
    const itemId = `${product.id}-${size}-${color.name}`;
    setCartItems((prevItems) => {
      const idx = prevItems.findIndex((it) => it.id === itemId);
      if (idx > -1) {
        const newItems = [...prevItems];
        newItems[idx].quantity += qty;
        return newItems;
      } else {
        const newItem: CartItem = {
          id: itemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: qty
        };
        return [...prevItems, newItem];
      }
    });
    // Open cart sidebar on add for feedback
    setCartOpen(true);
  };

  const handleUpdateCartQty = (itemId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: newQty } : it))
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCreateFavoriteGroup = (name: string) => {
    const newGroup: FavoriteGroup = {
      id: `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      productIds: []
    };
    setFavoriteGroups(prev => [...prev, newGroup]);

    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const groupRef = doc(db, 'users', userId, 'favoriteGroups', newGroup.id);
      setDoc(groupRef, newGroup).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `users/${userId}/favoriteGroups/${newGroup.id}`);
      });
    }
    return newGroup;
  };

  const handleConfirmCreateGroup = () => {
    const name = newGroupNameInput.trim();
    if (!name) return;

    const exists = favoriteGroups.some(g => g.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setCreateGroupError('Você já possui uma pasta com este nome!');
      return;
    }

    handleCreateFavoriteGroup(name);
    setCreateGroupOpen(false);
    setNewGroupNameInput('');
    setCreateGroupError('');
  };

  const handleSaveToGroups = async (productId: string, selectedGroupIds: string[]) => {
    // 1. Add to global favorites
    setFavorites(prev => prev.includes(productId) ? prev : [...prev, productId]);

    // 2. Sync group productIds
    const updatedGroups = favoriteGroups.map(g => {
      const isSelected = selectedGroupIds.includes(g.id);
      const isAlreadyInGroup = g.productIds.includes(productId);

      if (isSelected && !isAlreadyInGroup) {
        return { ...g, productIds: [...g.productIds, productId] };
      } else if (!isSelected && isAlreadyInGroup) {
        return { ...g, productIds: g.productIds.filter(id => id !== productId) };
      }
      return g;
    });
    setFavoriteGroups(updatedGroups);

    // 3. Sync to Firestore if logged in
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      for (const g of updatedGroups) {
        const groupRef = doc(db, 'users', userId, 'favoriteGroups', g.id);
        try {
          await setDoc(groupRef, g);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${userId}/favoriteGroups/${g.id}`);
        }
      }
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    // Elegant Engagement Check: Block guests and show Google Login Popup Modal
    if (!user.logged) {
      const product = productsList.find(p => p.id === productId);
      if (product) {
        setPendingFavoriteProduct(product);
        setAuthFavoritesModalOpen(true);
      }
      return;
    }

    if (favorites.includes(productId)) {
      // Remove globally
      const updatedFavorites = favorites.filter(id => id !== productId);
      setFavorites(updatedFavorites);

      // Remove from all groups
      const updatedGroups = favoriteGroups.map(g => ({
        ...g,
        productIds: g.productIds.filter(id => id !== productId)
      }));
      setFavoriteGroups(updatedGroups);

      // Sync updated groups to Firestore
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        for (const g of updatedGroups) {
          const groupRef = doc(db, 'users', userId, 'favoriteGroups', g.id);
          try {
            await setDoc(groupRef, g);
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${userId}/favoriteGroups/${g.id}`);
          }
        }
      }
    } else {
      // We want to add it. Find the product details
      const product = productsList.find(p => p.id === productId);
      if (product) {
        setPendingFavoriteProduct(product);
        setFavoriteModalOpen(true);
      }
    }
  };

  const handleGoogleLoginFromFavorites = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário';
      
      // Update local state
      handleLoginSuccess(displayName, firebaseUser.email || '');
      setAuthFavoritesModalOpen(false);

      // Instantly apply the favorite action for the pending product!
      if (pendingFavoriteProduct) {
        const productId = pendingFavoriteProduct.id;
        
        // Add to local favorites state
        setFavorites(prev => {
          if (!prev.includes(productId)) {
            const updated = [...prev, productId];
            // Sync to Firestore
            const userRef = doc(db, 'users', firebaseUser.uid);
            setDoc(userRef, { favorites: updated }, { merge: true }).catch(err => {
              console.error("Error syncing favorites after instant login:", err);
            });
            return updated;
          }
          return prev;
        });

        // Trigger the folder modal so they can organize it if desired
        setFavoriteModalOpen(true);
      }
    } catch (error: any) {
      console.error("Erro ao autenticar com Google a partir de favoritos:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error(`Falha no Login com o Google: ${error.message}`);
      }
    }
  };

  const handleDeleteFavoriteGroup = (groupId: string) => {
    setDeleteGroupPending(groupId);
  };

  const executeDeleteFavoriteGroup = async (groupId: string) => {
    setFavoriteGroups(prev => prev.filter(g => g.id !== groupId));
    if (selectedFavoriteGroupId === groupId) {
      setSelectedFavoriteGroupId('all');
    }

    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const groupRef = doc(db, 'users', userId, 'favoriteGroups', groupId);
      try {
        await deleteDoc(groupRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${userId}/favoriteGroups/${groupId}`);
      }
    }
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setUser(prev => ({
      ...prev,
      name,
      email,
      logged: true
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser({ name: '', email: '', logged: false, favorites: [] });
      setCurrentPage('home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePlaceOrder = async (order: Order) => {
    const enrichedOrder: Order = {
      ...order,
      userId: auth.currentUser?.uid || 'guest'
    };
    
    setOrders((prev) => [enrichedOrder, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'orders', enrichedOrder.id), enrichedOrder);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `orders/${enrichedOrder.id}`);
      }
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Switch display elements dynamically
  const renderMainViewContent = () => {
    const visibleProducts = productsList.filter((p) => p.isActive !== false);

    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSlider slides={heroSlides} onCtaClick={(cat) => handleNavigate('shop', cat)} />
            <HomeView
              products={visibleProducts}
              favorites={favorites}
              onNavigate={handleNavigate}
              onViewProduct={handleViewProduct}
              onAddToCart={handleAddToCartQuick}
              onToggleFavorite={handleToggleFavorite}
              storefrontSettings={storefrontSettings}
              testimonials={testimonialsList}
              onAddTestimonial={handleAddTestimonial}
            />
          </>
        );
      case 'shop':
        return (
          <CatalogView
            products={visibleProducts}
            favorites={favorites}
            filters={filters}
            onFilterChange={setFilters}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCartQuick}
            onToggleFavorite={handleToggleFavorite}
            onResetFilters={handleResetFilters}
            masterColors={masterColors}
          />
        );
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            isFavorite={favorites.includes(selectedProduct.id)}
            onAddToCart={handleAddToCartCombined}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => handleNavigate('shop', null)}
          />
        ) : (
          <div className="text-center py-20 font-bold text-[#02407d]">Erro ao carregar produto.</div>
        );
      case 'favorites': {
        const likedProducts = visibleProducts.filter((p) => favorites.includes(p.id));
        const unassignedProductIds = favorites.filter(
          id => !favoriteGroups.some(g => g.productIds.includes(id))
        );

        // Filter products based on selected tab
        let filteredLikedProducts = likedProducts;
        if (selectedFavoriteGroupId !== 'all') {
          if (selectedFavoriteGroupId === 'unassigned') {
            filteredLikedProducts = likedProducts.filter(p => unassignedProductIds.includes(p.id));
          } else {
            const group = favoriteGroups.find(g => g.id === selectedFavoriteGroupId);
            const groupProductIds = group ? group.productIds : [];
            filteredLikedProducts = likedProducts.filter(p => groupProductIds.includes(p.id));
          }
        }

        return (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#002855] uppercase tracking-tight mb-2">
                  Suas Roupas Favoritas
                </h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {likedProducts.length} itens salvos na sua lista de desejos especial
                </p>
              </div>

              {/* Quick Create Group Trigger directly in favorites view */}
              <div className="relative">
                <button
                  onClick={() => {
                    setCreateGroupOpen(!createGroupOpen);
                    setNewGroupNameInput('');
                    setCreateGroupError('');
                  }}
                  className="bg-[#002855] hover:bg-[#FF7A00] text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer self-start md:self-auto hover:shadow-md"
                >
                  📁 Nova Pasta
                </button>

                {createGroupOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-150 shadow-xl p-4 z-50 animate-scaleUp text-left">
                    <h4 className="text-[10px] font-black uppercase text-[#002855] tracking-wider mb-2">
                      Criar Pasta de Favoritos
                    </h4>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newGroupNameInput}
                        onChange={(e) => {
                          setNewGroupNameInput(e.target.value);
                          setCreateGroupError('');
                        }}
                        placeholder="Nome da pasta (ex: Inverno)"
                        className="flex-1 border border-gray-200 px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#002855]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleConfirmCreateGroup();
                          }
                        }}
                      />
                      <button
                        onClick={handleConfirmCreateGroup}
                        className="bg-[#002855] hover:bg-[#FF7A00] text-white px-3 py-1.5 text-xs font-black uppercase tracking-wider cursor-pointer"
                      >
                        Criar
                      </button>
                    </div>
                    {createGroupError && (
                      <p className="text-[9px] font-black text-red-500 uppercase tracking-wider mb-2">
                        ⚠️ {createGroupError}
                      </p>
                    )}
                    <button
                      onClick={() => setCreateGroupOpen(false)}
                      className="text-[9px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest block text-right w-full"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Folder selection Tabs */}
            {likedProducts.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-8 border-b border-gray-150 pb-4">
                <button
                  onClick={() => setSelectedFavoriteGroupId('all')}
                  className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedFavoriteGroupId === 'all'
                      ? 'bg-[#002855] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  📁 Todos ({favorites.length})
                </button>

                {favoriteGroups.map(group => (
                  <div
                    key={group.id}
                    className="flex items-center"
                  >
                    <button
                      onClick={() => setSelectedFavoriteGroupId(group.id)}
                      className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                        selectedFavoriteGroupId === group.id
                          ? 'bg-[#002855] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>📁 {group.name} ({group.productIds.length})</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFavoriteGroup(group.id);
                      }}
                      title="Excluir esta pasta"
                      className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 p-2 border-y border-r border-gray-150 transition-all cursor-pointer flex items-center justify-center font-bold"
                      style={{ height: '38px', marginLeft: '-1px' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                {unassignedProductIds.length > 0 && (
                  <button
                    onClick={() => setSelectedFavoriteGroupId('unassigned')}
                    className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      selectedFavoriteGroupId === 'unassigned'
                        ? 'bg-[#002855] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📁 Sem Pasta ({unassignedProductIds.length})
                  </button>
                )}
              </div>
            )}

            {likedProducts.length === 0 ? (
              <div className="bg-white rounded-none border border-gray-150 p-12 text-center shadow-sm">
                <span className="text-4xl block mb-3">❤️</span>
                <h3 className="font-extrabold text-[#002855] text-lg uppercase tracking-wider mb-1">Nenhum favorito selecionado</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6 font-semibold uppercase tracking-wider leading-relaxed">
                  Navegue pela loja FR Moletom, favorite suas jaquetas, t-shirts e calças prediletas para visualizá-las aqui!
                </p>
                <button
                  onClick={() => handleNavigate('shop', null)}
                  className="bg-[#002855] hover:bg-[#FF7A00] text-white py-4 px-8 font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Ver Todos os Produtos
                </button>
              </div>
            ) : filteredLikedProducts.length === 0 ? (
              <div className="bg-white border border-gray-150 p-12 text-center shadow-sm">
                <span className="text-4xl block mb-3">📁</span>
                <h3 className="font-extrabold text-[#002855] text-sm uppercase tracking-wider mb-1">Nenhum favorito nesta pasta</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6 font-semibold uppercase tracking-wider">
                  Nesta pasta de favoritos você ainda não salvou nenhuma roupa. Organize seus favoritos para adicioná-los aqui!
                </p>
                <button
                  onClick={() => setSelectedFavoriteGroupId('all')}
                  className="bg-[#002855] hover:bg-[#FF7A00] text-white py-3 px-6 font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Ver Todos os Favoritos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredLikedProducts.map((p) => {
                  const productGroups = favoriteGroups.filter(g => g.productIds.includes(p.id));
                  return (
                    <div key={p.id} className="flex flex-col">
                      <ProductCard
                        product={p}
                        isFavorite={true}
                        onView={handleViewProduct}
                        onAddToCart={handleAddToCartQuick}
                        onToggleFavorite={handleToggleFavorite}
                      />
                      <div className="bg-gray-50 border-x border-b border-gray-150 p-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-500 rounded-none mt-[-1px]">
                        <span className="truncate text-[9px] text-gray-400 font-extrabold flex items-center gap-1">
                          📁 {productGroups.length === 0 ? 'Sem Pasta' : productGroups.map(g => g.name).join(', ')}
                        </span>
                        <button
                          onClick={() => {
                            setPendingFavoriteProduct(p);
                            setFavoriteModalOpen(true);
                          }}
                          className="text-[#002855] hover:text-[#FF7A00] flex items-center gap-1 transition-colors text-[9px] font-black tracking-widest shrink-0"
                          title="Mudar pastas"
                        >
                          ORGANIZAR
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      case 'calcas':
        return (
          <CalcasView
            products={visibleProducts}
            favorites={favorites}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCartQuick}
            onToggleFavorite={handleToggleFavorite}
            masterColors={masterColors}
          />
        );
      case 'shorts':
        return (
          <ShortsView
            products={visibleProducts}
            favorites={favorites}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCartQuick}
            onToggleFavorite={handleToggleFavorite}
            masterColors={masterColors}
          />
        );
      case 'conjuntos':
        return (
          <ConjuntosView
            products={visibleProducts}
            favorites={favorites}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCartQuick}
            onToggleFavorite={handleToggleFavorite}
            masterColors={masterColors}
          />
        );
      case 'admin':
        return (
          <ErrorBoundary fallback={
            <div className="p-8 max-w-4xl mx-auto text-center font-sans">
              <div className="p-6 bg-red-50 border border-red-250">
                <h2 className="text-sm font-black text-red-800 uppercase tracking-wider mb-2">Painel de Administração Indisponível</h2>
                <p className="text-xs text-red-600 mb-4 font-bold">Ocorreu um erro interno durante a renderização deste painel.</p>
                <button
                  type="button"
                  onClick={() => handleNavigate('home', null)}
                  className="px-4 py-2 bg-[#002855] text-white font-black text-xs uppercase cursor-pointer"
                >
                  Voltar para a Loja
                </button>
              </div>
            </div>
          }>
            <AdminDashboard
              products={productsList}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onBackToStore={() => handleNavigate('home', null)}
              storefrontSettings={storefrontSettings}
              onUpdateStorefrontSettings={setStorefrontSettings}
              masterColors={masterColors}
              onUpdateMasterColors={setMasterColors}
              announcementSettings={announcementSettings}
              onUpdateAnnouncementSettings={setAnnouncementSettings}
              heroSlides={heroSlides}
              onUpdateHeroSlides={setHeroSlides}
              testimonials={testimonialsList}
              onDeleteTestimonial={handleDeleteTestimonial}
            />
          </ErrorBoundary>
        );
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'profile':
        return (
          <ProfileView
            user={user}
            orders={orders}
            products={visibleProducts}
            favorites={favorites}
            favoriteGroups={favoriteGroups}
            onLogout={handleLogout}
            onOpenAuth={() => setAuthOpen(true)}
            onNavigate={handleNavigate}
            onToggleFavorite={handleToggleFavorite}
            onViewProduct={handleViewProduct}
            onOrganizeProduct={(p) => {
              setPendingFavoriteProduct(p);
              setFavoriteModalOpen(true);
            }}
          />
        );
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cartItems}
            onBackToCart={() => {
              setCurrentPage('home');
              setCartOpen(true);
            }}
            onClearCart={handleClearCart}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      default:
        return <div className="text-center py-10 font-bold">Página não encontrada</div>;
    }
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      
      {/* 1. Bar of scrolling announcements */}
      <ErrorBoundary fallback={
        <div className="bg-[#FF7A00] text-white py-2 text-center text-xs font-bold font-sans uppercase">
          ⚠️ Sistema de Anúncios temporariamente indisponível
        </div>
      }>
        <AnnouncementBar settings={announcementSettings} />
      </ErrorBoundary>

      {/* 2. Fixed Sticky Header menu content */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        favoritesCount={favorites.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => handleNavigate(user.logged ? 'profile' : 'profile')}
        onSearch={handleSearch}
      />

      {/* 3. Central main portal viewport */}
      <main className="flex-grow pt-28 pb-16">
        {renderMainViewContent()}
      </main>

      {/* 4. Complete footer column rows */}
      <Footer onNavigate={handleNavigate} onOpenAuth={() => setAuthOpen(true)} />

      {/* 5. Dynamic overlay widgets drawers */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onGoToCheckout={() => {
          setCartOpen(false);
          handleNavigate('checkout');
        }}
      />

      {/* Login authentication overlay */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Dynamic Pop-up for unauthorized favorites / engagement */}
      {authFavoritesModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 border border-gray-150 shadow-2xl animate-scaleUp text-center relative overflow-hidden">
            {/* Design detail top gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002855] via-[#FF7A00] to-[#002855]" />
            
            {/* Close button */}
            <button
              onClick={() => setAuthFavoritesModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Fechar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon / Branding */}
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-[#FF7A00] mx-auto mb-5 shadow-inner">
              <svg className="w-8 h-8 fill-red-500 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Message requested by business rules */}
            <h3 className="text-xl font-black text-[#002855] uppercase tracking-wide leading-snug mb-3 font-display">
              OII TUDO BEM?
            </h3>
            <p className="text-sm text-gray-600 font-semibold mb-6 px-2 leading-relaxed">
              Faça login rapidamente com o Google para salvar suas peças favoritas da Fortuna!
            </p>

            {/* Action Google Sign-In */}
            <button
              onClick={handleGoogleLoginFromFavorites}
              className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-4 px-6 rounded-none font-black text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-4 h-4 bg-white rounded-full p-0.5 shadow-sm" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.35,11.1H12v2.7h5.38C16.88,16.27,14.67,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.55,0,2.95,0.59,4.01,1.55l2.01-2.01C16.32,3.87,14.3,3,12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9c4.71,0,8.75-3.41,9.35-8.1H21.35z" fill="#4285F4" />
              </svg>
              Entrar com o Google
            </button>

            {/* Safe footer banner */}
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 flex items-center justify-center gap-1.5">
              🛡️ Conexão Segura SSL do Google
            </p>
          </div>
        </div>
      )}

      {/* Favorite group organizer modal */}
      <FavoriteGroupModal
        isOpen={favoriteModalOpen}
        onClose={() => setFavoriteModalOpen(false)}
        productId={pendingFavoriteProduct?.id || null}
        productName={pendingFavoriteProduct?.name || ''}
        productImage={pendingFavoriteProduct?.images?.[0] || ''}
        groups={favoriteGroups}
        onCreateGroup={handleCreateFavoriteGroup}
        onSaveToGroups={handleSaveToGroups}
      />

      {/* Delete favorite group confirmation modal */}
      {deleteGroupPending && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-sm w-full p-6 border border-gray-150 shadow-2xl animate-scaleUp text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg rounded-full">
              🗑️
            </div>
            <h3 className="text-sm font-black text-[#002855] uppercase tracking-wider mb-2">
              Excluir Pasta?
            </h3>
            <p className="text-xs text-gray-500 font-bold mb-6 leading-relaxed">
              Tem certeza de que deseja excluir esta pasta de favoritos? As roupas continuarão salvas em sua lista geral de favoritos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteGroupPending(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (deleteGroupPending) {
                    executeDeleteFavoriteGroup(deleteGroupPending);
                    setDeleteGroupPending(null);
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Global Action Floating Buttons --- */}
      
      {/* Right bottom WhatsApp Assist button */}
      <a
        href="https://api.whatsapp.com/send?phone=5511949697239&text=Olá!%20Estou%20no%20site%20da%20FR%20Moletom%20e%20gostaria%20de%20conversar%20sobre%20as%20roupas%20disponíveis."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white/20 animate-bounce cursor-pointer"
        style={{ animationDuration: '3s' }}
        title="Fale conosco no WhatsApp"
      >
        <MessageCircle size={26} className="fill-white/15" />
      </a>

      {/* Back to top scroll button (slightly offset upwards because of WhatsApp button) */}
      {showToTopBtn && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-40 bg-[#002855] hover:bg-[#FF7A00] text-white p-3 rounded-full shadow-lg border border-white/10 transition-all hover:scale-110 active:scale-95 flex items-center justify-center animate-fadeIn cursor-pointer"
          title="Voltar ao topo da página"
        >
          <ArrowUp size={20} />
        </button>
      )}

    </div>
  );
}
