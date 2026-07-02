import { Product, CategoryInfo, Review } from './types';

// @ts-expect-error - Vite handles dynamic JPG imports
import img1 from './assets/images/1.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img2 from './assets/images/2.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img3 from './assets/images/3.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img4 from './assets/images/4.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img5 from './assets/images/5.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img6 from './assets/images/6.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img7 from './assets/images/7.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img8 from './assets/images/8.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img9 from './assets/images/9.jpeg';
// @ts-expect-error - Vite handles dynamic JPG imports
import img10 from './assets/images/10.jpeg';

export const CATEGORIES: CategoryInfo[] = [
  { slug: 'moletons', name: 'Moletons', icon: '🧥', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=400&auto=format&fit=crop', color: 'bg-indigo-50 border-indigo-200' },
  { slug: 'camisetas', name: 'Camisetas', icon: '👕', image: 'https://images.unsplash.com/photo-1618414925857-1088463c4aa1?q=80&w=400&auto=format&fit=crop', color: 'bg-sky-50 border-sky-200' },
  { slug: 'conjuntos', name: 'Conjuntos', icon: '🎽', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=400&auto=format&fit=crop', color: 'bg-orange-50 border-orange-200' },
  { slug: 'calcas', name: 'Calças', icon: '👖', image: 'https://images.unsplash.com/photo-1602052528751-24b4df9d0fa1?q=80&w=400&auto=format&fit=crop', color: 'bg-amber-50 border-amber-200' },
  { slug: 'bermudas', name: 'Bermudas', icon: '🩳', image: 'https://images.unsplash.com/photo-1591258370574-3405c5d74211?q=80&w=400&auto=format&fit=crop', color: 'bg-emerald-50 border-emerald-200' },
  { slug: 'lancamentos', name: 'Lançamentos', icon: '🔥', image: 'https://images.unsplash.com/photo-1611601679655-7c8bc197f0c6?q=80&w=400&auto=format&fit=crop', color: 'bg-rose-50 border-rose-200' },
  { slug: 'promocoes', name: 'Promoções', icon: '🏷️', image: 'https://images.unsplash.com/photo-1540479859303-471343e7751b?q=80&w=400&auto=format&fit=crop', color: 'bg-orange-100 border-orange-300 animate-pulse' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'mol-01',
    name: 'Moletom Canguru Premium FR Classic',
    category: 'moletons',
    originalPrice: 159.90,
    promoPrice: 119.90,
    images: [img1, img7],
    sizes: [2, 4, 6, 8, 10, 12, 14, 16],
    colors: [
      { name: 'Azul Escuro', hex: '#02407d' },
      { name: 'Cinza Mescla', hex: '#b2b2b2' },
      { name: 'Laranja Flame', hex: '#FF6A00' }
    ],
    description: 'O moletom Canguru Premium FR Classic é o nosso campeão de vendas. Confeccionado em algodão peluciado de altíssima qualidade, com toque macio por dentro e costuras reforçadas. Perfeito para manter seu pequeno aquecido com muito estilo e elegância no inverno.',
    details: [
      'Material: 75% Algodão Premium, 25% Poliéster para estabilidade dimensional',
      'Forro peluciado macio termo-regulador',
      'Bolso canguru frontal com reforço nas bordas',
      'Capuz forrado super aconchegante',
      'Punhos e barra em ribana elástica durável',
      'Estampa FR Moletom em alto relevo'
    ],
    rating: 4.9,
    reviewsCount: 124,
    salesCount: 387,
    inStock: true,
    onSale: true,
    isNew: false
  },
  {
    id: 'mol-02',
    name: 'Blusão Moletom Gola Careca Urban Boy',
    category: 'moletons',
    originalPrice: 139.90,
    images: [img4],
    sizes: [4, 6, 8, 10, 12, 14, 16],
    colors: [
      { name: 'Preto Total', hex: '#111111' },
      { name: 'Verde Militar', hex: '#4B5320' },
      { name: 'Azul Marinho', hex: '#0F1E36' }
    ],
    description: 'Blusão masculino infantil gola careca com design clean e urbano. Ideal para sobreposições no período de outono-inverno, oferecendo total conforto e máxima liberdade de movimentos para as brincadeiras do dia a dia.',
    details: [
      'Material: 100% Algodão Peluciado 3 cabos',
      'Modelagem moderna levemente oversized',
      'Gola careca confortável com acabamento em punho de ribana',
      'Combina perfeitamente com calças jogger ou jeans',
      'Resistente a lavagens sucessivas, não desbota'
    ],
    rating: 4.8,
    reviewsCount: 82,
    salesCount: 215,
    inStock: true,
    onSale: false,
    isNew: true
  },
  {
    id: 'con-01',
    name: 'Conjunto Moletom Infantil Street Active',
    category: 'conjuntos',
    originalPrice: 229.90,
    promoPrice: 179.90,
    images: [img3],
    sizes: [4, 6, 8, 10, 12, 14],
    colors: [
      { name: 'Cinza com Azul', hex: '#b2b2b2' },
      { name: 'Preto com Laranja', hex: '#ff6a00' }
    ],
    description: 'Conjunto completo composto por blusão com capuz e calça de moletom jogger. União ideal de moda, praticidade e conforto premium. Possui detalhes contrastantes na cor laranja de destaque da FR Moletom.',
    details: [
      'Acompanha: 1 Blusão com Capuz + 1 Calça Moletom Jogger',
      'Material: 80% Algodão Premium, 20% Poliéster Super Soft',
      'Calça com cordão regulador funcional na cintura e bolsos faca',
      'Punhos nos pés para melhor caimento de calçados',
      'Estilo inspirado no streetwear europeu infantil'
    ],
    rating: 5.0,
    reviewsCount: 145,
    salesCount: 420,
    inStock: true,
    onSale: true,
    isNew: false
  },
  {
    id: 'cam-01',
    name: 'Camiseta Algodão Egípcio Minimal Kids',
    category: 'camisetas',
    originalPrice: 79.90,
    images: [img9],
    sizes: [2, 4, 6, 8, 10, 12, 14, 16],
    colors: [
      { name: 'Branco Neve', hex: '#ffffff' },
      { name: 'Azul FR', hex: '#02407d' },
      { name: 'Laranja Energético', hex: '#FF6A00' }
    ],
    description: 'Camiseta premium confeccionada em algodão de fibra longa super leve, proporcionando suavidade extrema à pele da criança. Ideal para dias amenos de brincadeiras ao ar livre ou passeios casuais em família.',
    details: [
      'Material: 100% Algodão Premium Penteado Fio 30.1',
      'Toque extremamente aveludado e macio',
      'Costura reforçada de ombro a ombro',
      'Estampa pequena e elegante no peito em silk-screen premium',
      'Não dá bolinhas após a lavagem'
    ],
    rating: 4.7,
    reviewsCount: 63,
    salesCount: 198,
    inStock: true,
    onSale: false,
    isNew: true
  },
  {
    id: 'cal-01',
    name: 'Calça Jogger Moletom Bold Comfort',
    category: 'calcas',
    originalPrice: 119.90,
    promoPrice: 89.90,
    images: [img2, img6],
    sizes: [4, 6, 8, 10, 12, 14, 16],
    colors: [
      { name: 'Cinza Escuro', hex: '#444444' },
      { name: 'Azul Escuro', hex: '#02407d' },
      { name: 'Preto Blackout', hex: '#000000' }
    ],
    description: 'Calça de moletom modelagem jogger, o equilíbrio supremo entre elegância esportiva e conforto. O elástico ajustável garante que sirva perfeitamente em corpos dinâmicos de meninos ativos.',
    details: [
      'Material: Moletom flanelado encorpado 3 cabos',
      'Cós elástico anatômico com cadarço laranja de ajuste premium',
      'Bolsos laterais profundos para armazenar pequenos tesouros nas brincadeiras',
      'Ribana reforçada na barra que acompanha o crescimento'
    ],
    rating: 4.9,
    reviewsCount: 97,
    salesCount: 290,
    inStock: true,
    onSale: true,
    isNew: false
  },
  {
    id: 'ber-01',
    name: 'Bermuda Moletinho Summer Adventure',
    category: 'bermudas',
    originalPrice: 89.90,
    promoPrice: 69.90,
    images: [img5, img10],
    sizes: [2, 4, 6, 8, 10, 12, 14],
    colors: [
      { name: 'Azul FR', hex: '#02407d' },
      { name: 'Cinza Mescla', hex: '#b2b2b2' },
      { name: 'Laranja Solar', hex: '#FF6A00' }
    ],
    description: 'Bermuda em tecido de moletinho premium (não flanelado por dentro), perfeita para o verão e dias quentes. Oferece alta transpiração, leveza absoluta e visual refinado.',
    details: [
      'Teor: 88% Algodão, 12% Poliéster',
      'Modelagem reta moderna e confortável',
      'Cós em ribana elástica com cordão ajustável',
      'Bolso traseiro funcional adicional',
      'Ótimo par com t-shirts básicas'
    ],
    rating: 4.8,
    reviewsCount: 52,
    salesCount: 154,
    inStock: true,
    onSale: true,
    isNew: false
  },
  {
    id: 'con-02',
    name: 'Conjunto Inverno Moletom Heavy Hoodie',
    category: 'conjuntos',
    originalPrice: 249.90,
    images: [img8],
    sizes: [6, 8, 10, 12, 14, 16],
    colors: [
      { name: 'Azul Escuro Real', hex: '#02407d' },
      { name: 'Laranja Flame', hex: '#FF6A00' }
    ],
    description: 'Nosso conjunto mais pesado e quente para as baixas temperaturas. O blusão conta com capuz duplo acolchoado e a calça possui forro duplo na região dos joelhos para aguentar qualquer aventura.',
    details: [
      'Material de altíssima gramatura: Algodão Heavy Fleece',
      'Duplo forro no capuz e reforços estruturais',
      'Cadarços e zíperes premium antiferrugem',
      'Logotipo bordado em alta definição com fios acetinados',
      'Ideal para viagens de inverno rigoroso ou passeios na serra'
    ],
    rating: 5.0,
    reviewsCount: 61,
    salesCount: 110,
    inStock: true,
    onSale: false,
    isNew: true
  },
  {
    id: 'cam-02',
    name: 'Camiseta Polo Kids Classic Piquet',
    category: 'camisetas',
    originalPrice: 99.90,
    promoPrice: 79.90,
    images: [img9],
    sizes: [4, 6, 8, 10, 12, 14, 16],
    colors: [
      { name: 'Azul Real', hex: '#0a58a6' },
      { name: 'Preto Nobre', hex: '#1e1e1e' },
      { name: 'Branco Premium', hex: '#f9f9f9' }
    ],
    description: 'A clássica camisa gola polo adaptada para a energia do público infantil. Confeccionada em piquet de algodão respirável, confere um ar arrumado e elegante sem perder a flexibilidade que os meninos precisam para correr e brincar.',
    details: [
      'Material: 96% Algodão Piquet Premium, 4% Elastano para flexibilidade',
      'Gola estruturada que não deforma nas lavagens',
      'Punhos decorados nas mangas',
      'Fechamento com dois botões madrepérola em cor contrastante',
      'Abertura lateral na barra com fita de reforço estilosa'
    ],
    rating: 4.8,
    reviewsCount: 44,
    salesCount: 112,
    inStock: true,
    onSale: true,
    isNew: false
  },
  {
    id: 'mol-03',
    name: 'Moletom Bomber College Varsity FR',
    category: 'moletons',
    originalPrice: 189.90,
    images: [img1],
    sizes: [8, 10, 12, 14, 16],
    colors: [
      { name: 'Azul com Laranja', hex: '#02407d' },
      { name: 'Preto com Branco', hex: '#222222' }
    ],
    description: 'Inspirada no estilo clássico das universidades americanas, a jaqueta bomber Moletom Varsity combina o conforto supremo do moletom com o visual descolado que os meninos mais velhos adoram.',
    details: [
      'Estilo jaqueta College com fecho de botões de pressão encapados',
      'Corpo em moletom flanelado espesso e mangas em cor contrastante',
      'Gola, punhos e barra de ribana listrada premium',
      'Letra F bordada em ponto chenille tipo flocado no peito'
    ],
    rating: 4.9,
    reviewsCount: 78,
    salesCount: 185,
    inStock: true,
    onSale: false,
    isNew: true
  }
];

export const TESTIMONIALS: Review[] = [
  {
    id: 't1',
    author: 'Letícia Benvegnú Mariano',
    rating: 5,
    date: '09/06/2026',
    comment: 'Produtos de ótima qualidade, moletom grosso de verdade e com ótimos preços. Entrega super rápida em Louveira - SP. Recomendo demais!',
    location: 'Louveira - SP'
  },
  {
    id: 't2',
    author: 'Thaina Marques',
    rating: 5,
    date: '03/06/2026',
    comment: 'Amei as roupinhas para o meu menino! Podem confiar demais, a confecção é impecável e chegou num perfume delicioso, super rápido!',
    location: 'Limeira - SP'
  },
  {
    id: 't3',
    author: 'Rosa Francisca Ramires',
    rating: 5,
    date: '31/05/2026',
    comment: 'Estava na dúvida quanto aos tamanhos mas a tabela de medidas ajudou muito. Comprei e serviu perfeitamente. Entrega muito rápida!',
    location: 'São José dos Campos - SP'
  },
  {
    id: 't4',
    author: 'Andreia Vieira Guerra',
    rating: 5,
    date: '31/05/2026',
    comment: 'O melhor e-commerce de moda infantil masculina! Site super fácil de navegar e muito seguro. Vou comprar novamente para o inverno.',
    location: 'São Paulo - SP'
  },
  {
    id: 't5',
    author: 'Miriam Junqueira',
    rating: 5,
    date: '29/05/2026',
    comment: 'Entrega rápida, produtos com a qualidade excelente esperada. Moletom flanelado que aquece de verdade e brinde lindo. Adorei!',
    location: 'Belo Horizonte - MG'
  },
  {
    id: 't6',
    author: 'Rafaela Campos',
    rating: 5,
    date: '18/05/2026',
    comment: 'Amei os conjuntos! O preço é ótimo pela qualidade dos tecidos. Chegou super embrulhado e muito rápido.',
    location: 'Contagem - MG'
  }
];

export const SIZE_CHART = {
  title: 'Tabela de Medidas (cm)',
  headers: ['Tamanho', 'Idade Recomendada', 'Instatura (cm)', 'Tórax (cm)', 'Cintura (cm)', 'Quadril (cm)'],
  rows: [
    ['2', '2 Anos', '88 - 98', '52 - 54', '50 - 52', '52 - 54'],
    ['4', '3 a 4 Anos', '99 - 105', '56 - 58', '54 - 56', '56 - 58'],
    ['6', '5 a 6 Anos', '106 - 117', '60 - 62', '56 - 58', '60 - 62'],
    ['8', '7 a 8 Anos', '118 - 128', '64 - 66', '58 - 60', '64 - 66'],
    ['10', '9 a 10 Anos', '129 - 138', '68 - 70', '60 - 62', '68 - 70'],
    ['12', '11 a 12 Anos', '139 - 149', '72 - 74', '62 - 64', '74 - 76'],
    ['14', '13 a 14 Anos', '150 - 159', '76 - 78', '64 - 66', '80 - 82'],
    ['16', '15 a 16 Anos', '160 - 168', '80 - 82', '66 - 68', '86 - 88'],
  ]
};
