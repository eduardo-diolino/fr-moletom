export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'moletons' | 'camisetas' | 'conjuntos' | 'calcas' | 'bermudas' | 'lancamentos' | 'promocoes';
  originalPrice: number;
  promoPrice?: number;
  images: string[];
  sizes: number[];
  colors: Color[];
  description: string;
  details: string[];
  rating: number;
  reviewsCount: number;
  salesCount: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  isActive?: boolean; // Active or draft status flag
  tableId?: string; // Tabela de medidas reference
  homepageSections?: string[]; // Storefront section tags/section IDs assigned
  sizesStock?: Record<string, number>; // Per-size stock quantities
}

export interface CartItem {
  id: string; // generated as: productId-size-colorName
  product: Product;
  selectedSize: number;
  selectedColor: Color;
  quantity: number;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  icon: string;
  image: string;
  color: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  location: string;
}

export interface User {
  name: string;
  email: string;
  logged: boolean;
  favorites: string[]; // array of product ids
}

export interface FilterState {
  size: number | null;
  colorName: string | null;
  category: string | null;
  priceRange: [number, number];
  onlyPromo: boolean;
  sortBy: 'relevance' | 'priceAsc' | 'priceDesc' | 'sales';
  searchQuery: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  btn1Text?: string;
  btn1Url: string;
  btn2Text?: string;
  btn2Url?: string;
  bgPosition?: string;
  btn1Color?: string;
  btn2Color?: string;
  btnSize?: 'sm' | 'md' | 'lg';
  contentAlign?: 'left' | 'center' | 'right';
}

export interface AnnouncementSettings {
  messages: string[];
  speed: number;
}

export interface BenefitBadge {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface PromoBanner {
  tag: string;
  title: string;
  subtitle: string;
  btnText: string;
  linkUrl: string;
  icon: string;
  bgColorFrom: string;
  bgColorTo: string;
}

export interface StorefrontSettings {
  categories?: string;
  featured?: string;
  newArrivals?: string;
  bestSellers?: string;
  gallery?: string;
  benefits?: BenefitBadge[];
  promoLeft?: PromoBanner;
  promoRight?: PromoBanner;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: number;
  colorName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  customerName: string;
  customerEmail: string;
  method: string;
  userId?: string;
}export interface FavoriteGroup {
  id: string;
  name: string;
  productIds: string[];
}
