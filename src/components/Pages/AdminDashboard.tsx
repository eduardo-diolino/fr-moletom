import React, { useState } from 'react';
import { Product, Color, AnnouncementSettings, HeroSlide, Review, StorefrontSettings } from '../../types';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Lock, 
  Unlock, 
  Check, 
  DollarSign, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Sliders, 
  FolderPlus,
  ArrowLeft,
  Search,
  FileText,
  Edit,
  X,
  Palette
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onBackToStore: () => void;
  storefrontSettings?: StorefrontSettings;
  onUpdateStorefrontSettings: (settings: any) => void;
  masterColors: Color[];
  onUpdateMasterColors: (colors: Color[]) => void;
  announcementSettings: AnnouncementSettings;
  onUpdateAnnouncementSettings: (settings: AnnouncementSettings | ((prev: AnnouncementSettings) => AnnouncementSettings)) => void;
  heroSlides: HeroSlide[];
  onUpdateHeroSlides: (slides: HeroSlide[] | ((prev: HeroSlide[]) => HeroSlide[])) => void;
  testimonials?: Review[];
  onDeleteTestimonial?: (id: string) => void;
}

export default function AdminDashboard({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onBackToStore,
  storefrontSettings,
  onUpdateStorefrontSettings,
  masterColors,
  onUpdateMasterColors,
  announcementSettings,
  onUpdateAnnouncementSettings,
  heroSlides,
  onUpdateHeroSlides,
  testimonials = [],
  onDeleteTestimonial
}: AdminDashboardProps) {
  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fr_admin_logged') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stock' | 'settings' | 'reviews'>('list');

  // Review Deletion State
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // ----------------------------------------
  // TOP MARQUEE (ANNOUNCEMENT) STATE
  // ----------------------------------------
  const [newMarqueeMessage, setNewMarqueeMessage] = useState('');

  const getAnnouncementText = (msg: any): string => {
    if (!msg) return '';
    if (typeof msg === 'string') return msg;
    if (typeof msg === 'object') {
      return msg.text || msg.message || msg.content || '';
    }
    return String(msg);
  };

  const handleAddMarqueeMessage = () => {
    const text = newMarqueeMessage.trim();
    if (!text) return;
    onUpdateAnnouncementSettings((prev: any) => {
      const currentObj = prev && typeof prev === 'object' ? prev : { messages: [], speed: 25 };
      const messagesList = Array.isArray(currentObj.messages) ? currentObj.messages : [];
      // Support polymorphic addition
      const carriesObjects = messagesList.some(m => m && typeof m === 'object');
      const newItem = carriesObjects 
        ? { id: Date.now(), text } 
        : text;
      return {
        ...currentObj,
        messages: [...messagesList, newItem]
      };
    });
    setNewMarqueeMessage('');
    showToast('Mensagem de anúncio adicionada com sucesso!', 'success');
  };

  const handleEditMarqueeMessage = (index: number, newText: string) => {
    onUpdateAnnouncementSettings((prev: any) => {
      const currentObj = prev && typeof prev === 'object' ? prev : { messages: [], speed: 25 };
      const messagesList = Array.isArray(currentObj.messages) ? currentObj.messages : [];
      const updatedMessages = [...messagesList];
      const target = updatedMessages[index];
      if (typeof target === 'object' && target !== null) {
        updatedMessages[index] = {
          ...target,
          text: newText
        };
      } else {
        updatedMessages[index] = newText;
      }
      return {
        ...currentObj,
        messages: updatedMessages
      };
    });
  };

  const handleRemoveMarqueeMessage = (index: number) => {
    onUpdateAnnouncementSettings((prev: any) => {
      const currentObj = prev && typeof prev === 'object' ? prev : { messages: [], speed: 25 };
      const messagesList = Array.isArray(currentObj.messages) ? currentObj.messages : [];
      return {
        ...currentObj,
        messages: messagesList.filter((_, i) => i !== index)
      };
    });
    showToast('Mensagem de anúncio removida.', 'info');
  };

  // ----------------------------------------
  // HERO SLIDER CAROUSEL STATE & HANDLERS
  // ----------------------------------------
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideImage, setSlideImage] = useState('');
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideBtn1Text, setSlideBtn1Text] = useState('');
  const [slideBtn1Url, setSlideBtn1Url] = useState('');
  const [slideBtn2Text, setSlideBtn2Text] = useState('');
  const [slideBtn2Url, setSlideBtn2Url] = useState('');
  const [slideBgPosition, setSlideBgPosition] = useState('center');
  const [slideBtn1Color, setSlideBtn1Color] = useState('brand');
  const [slideBtn2Color, setSlideBtn2Color] = useState('trans-light');
  const [slideBtnSize, setSlideBtnSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [slideContentAlign, setSlideContentAlign] = useState<'left' | 'center' | 'right'>('left');

  const handleResetSlideForm = () => {
    setEditingSlideId(null);
    setSlideImage('');
    setSlideTitle('');
    setSlideSubtitle('');
    setSlideBtn1Text('');
    setSlideBtn1Url('');
    setSlideBtn2Text('');
    setSlideBtn2Url('');
    setSlideBgPosition('center');
    setSlideBtn1Color('brand');
    setSlideBtn2Color('trans-light');
    setSlideBtnSize('md');
    setSlideContentAlign('left');
  };

  const handleSlideImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const originalBase64 = reader.result;
          // Create image to draw on canvas for compression
          const img = new Image();
          img.src = originalBase64;
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              // Full HD support for maximum sharpness on large monitors and mobile displays
              const MAX_WIDTH = 1920;
              const MAX_HEIGHT = 1080;
              let width = img.width;
              let height = img.height;

              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Compress as image/jpeg with 0.90 quality for visually perfect and crisp high resolution
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.90);
                setSlideImage(compressedBase64);
                showToast('Foto do slide otimizada e carregada em ALTA RESOLUÇÃO!', 'success');
              } else {
                setSlideImage(originalBase64);
                showToast('Foto do slide carregada!', 'success');
              }
            } catch (err) {
              console.error('Error compressing slide image:', err);
              setSlideImage(originalBase64);
              showToast('Foto do slide carregada!', 'success');
            }
          };
          img.onerror = () => {
            setSlideImage(originalBase64);
            showToast('Foto do slide carregada!', 'success');
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const safeHeroSlides = Array.isArray(heroSlides) ? heroSlides : [];

  const handleAddOrUpdateSlide = () => {
    if (!slideImage.trim()) {
      showToast('Por favor, carregue uma foto ou insira a URL da imagem de fundo!', 'error');
      return;
    }

    const targetUrl = slideBtn1Url.trim() || '#/';

    if (editingSlideId) {
      // Update Slide with functional state callback
      onUpdateHeroSlides((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map(slide => {
          if (slide && slide.id === editingSlideId) {
            return {
              id: slide.id || Date.now().toString(),
              image: slideImage.trim(),
              title: slideTitle.trim(),
              subtitle: slideSubtitle.trim(),
              btn1Text: slideBtn1Text.trim(),
              btn1Url: targetUrl,
              btn2Text: slideBtn2Text.trim(),
              btn2Url: slideBtn2Url.trim(),
              bgPosition: slideBgPosition,
              btn1Color: slideBtn1Color,
              btn2Color: slideBtn2Color,
              btnSize: slideBtnSize,
              contentAlign: slideContentAlign
            };
          }
          return slide;
        });
      });
      showToast('Slide atualizado com sucesso!', 'success');
    } else {
      // Add Slide with functional state callback
      const newSlide: HeroSlide = {
        id: Date.now().toString(),
        image: slideImage.trim(),
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        btn1Text: slideBtn1Text.trim(),
        btn1Url: targetUrl,
        btn2Text: slideBtn2Text.trim(),
        btn2Url: slideBtn2Url.trim(),
        bgPosition: slideBgPosition,
        btn1Color: slideBtn1Color,
        btn2Color: slideBtn2Color,
        btnSize: slideBtnSize,
        contentAlign: slideContentAlign
      };
      onUpdateHeroSlides((prev) => {
        const list = Array.isArray(prev) ? prev : [];
        return [...list, newSlide];
      });
      showToast('Novo slide adicionado com sucesso!', 'success');
    }
    handleResetSlideForm();
  };

  const handleStartEditSlide = (slide: HeroSlide) => {
    if (!slide) return;
    setEditingSlideId(slide.id || null);
    setSlideImage(slide.image || '');
    setSlideTitle(slide.title || '');
    setSlideSubtitle(slide.subtitle || '');
    setSlideBtn1Text(slide.btn1Text || '');
    setSlideBtn1Url(slide.btn1Url || '');
    setSlideBtn2Text(slide.btn2Text || '');
    setSlideBtn2Url(slide.btn2Url || '');
    setSlideBgPosition(slide.bgPosition || 'center');
    setSlideBtn1Color(slide.btn1Color || 'brand');
    setSlideBtn2Color(slide.btn2Color || 'trans-light');
    setSlideBtnSize(slide.btnSize || 'md');
    setSlideContentAlign(slide.contentAlign || 'left');
    
    const container = document.getElementById('hero-slider-form-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDeleteSlide = (slideId: string) => {
    if (!slideId) return;
    onUpdateHeroSlides((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return list.filter(s => s && s.id !== slideId);
    });
    showToast('Slide removido das configurações.', 'info');
    if (editingSlideId === slideId) {
      handleResetSlideForm();
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    onUpdateHeroSlides((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      const updated = [...list];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= updated.length) return updated;
      
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated;
    });
    showToast('Ordem dos slides reorganizada!', 'success');
  };

  // Color Manager inputs state
  const [newManagerColorName, setNewManagerColorName] = useState('');
  const [newManagerColorHex, setNewManagerColorHex] = useState('#002855');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'moletons' | 'camisetas' | 'conjuntos' | 'calcas' | 'bermudas'>('moletons');
  const [homepageSections, setHomepageSections] = useState<string[]>([]);
  const [editHomepageSections, setEditHomepageSections] = useState<string[]>([]);

  const handleToggleHomepageSection = (sectionId: string) => {
    setHomepageSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };

  const handleToggleEditHomepageSection = (sectionId: string) => {
    setEditHomepageSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };
  const [originalPrice, setOriginalPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [isNew, setIsNew] = useState(true);
  const [inStock, setInStock] = useState(true);

  // Advanced Image States
  const [uploadedImages, setUploadedImages] = useState<Array<{ file: File; id: string; url: string; customName: string }>>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageFileNameOverride, setImageFileNameOverride] = useState('');

  // Custom Color State
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#002855');
  const [colorsList, setColorsList] = useState<Color[]>([
    { name: 'Cinza Mescla', hex: '#b2b2b2' },
    { name: 'Azul Escuro', hex: '#002855' }
  ]);

  // Search in management table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all'); // category filtering in table

  // Dynamic Toast Notifications state
  interface Toast {
    id: string;
    message: string;
    type: 'success' | 'warn' | 'error' | 'info';
  }
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'warn' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Safe Action Confirm state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Edit Modal & Fields state
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<'moletons' | 'camisetas' | 'conjuntos' | 'calcas' | 'bermudas'>('moletons');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editPromoPrice, setEditPromoPrice] = useState('');
  const [editSelectedSizes, setEditSelectedSizes] = useState<number[]>([]);
  const [editIsNew, setEditIsNew] = useState(true);
  const [editInStock, setEditInStock] = useState(true);
  const [editIsActive, setEditIsActive] = useState(true);

  // Custom Colors List during Edit
  const [editColorName, setEditColorName] = useState('');
  const [editColorHex, setEditColorHex] = useState('#002855');
  const [editColorsList, setEditColorsList] = useState<Color[]>([]);

  // Images URLs during Edit
  const [editUploadedImages, setEditUploadedImages] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState('');

  // Prepopulate form states for editing look
  const handleOpenEdit = (product: Product) => {
    setProductToEdit(product);
    setEditName(product.name);
    setEditDescription(product.description || '');
    setEditCategory(product.category as any);
    setEditOriginalPrice(product.originalPrice.toString());
    setEditPromoPrice(product.promoPrice ? product.promoPrice.toString() : '');
    setEditSelectedSizes(product.sizes || []);
    setEditIsNew(product.isNew);
    setEditInStock(product.inStock);
    setEditIsActive(product.isActive !== false);
    setEditColorsList(product.colors || []);
    setEditUploadedImages(product.images || []);
    setEditColorName('');
    setEditColorHex('#002855');
    setEditImageUrlInput('');
    setEditHomepageSections(product.homepageSections || []);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToEdit) return;

    if (!editName.trim()) {
      showToast('Por favor, informe o título do produto.', 'error');
      return;
    }
    if (editSelectedSizes.length === 0) {
      showToast('Selecione pelo menos um tamanho correspondente.', 'error');
      return;
    }

    const priceNum = parseFloat(editOriginalPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Por favor, defina um preço original válido.', 'error');
      return;
    }

    const promoNum = editPromoPrice ? parseFloat(editPromoPrice) : undefined;
    if (promoNum !== undefined && (isNaN(promoNum) || promoNum >= priceNum)) {
      showToast('O preço promocional de desconto deve ser menor do que o preço de tabela original.', 'error');
      return;
    }

    if (editUploadedImages.length === 0) {
      showToast('Selecione ou vincule pelo menos uma imagem para o produto.', 'error');
      return;
    }

    const updatedSizesStock: Record<string, number> = productToEdit.sizesStock ? { ...productToEdit.sizesStock } : {};
    editSelectedSizes.forEach((s) => {
      if (updatedSizesStock[s] === undefined) {
        updatedSizesStock[s] = editInStock ? 12 : 0;
      }
    });
    // Remove keys for sizes no longer selected
    Object.keys(updatedSizesStock).forEach((key) => {
      if (!editSelectedSizes.includes(parseInt(key))) {
        delete updatedSizesStock[key];
      }
    });

    const updatedProduct: Product = {
      ...productToEdit,
      name: editName.trim(),
      category: editCategory,
      originalPrice: priceNum,
      promoPrice: promoNum,
      images: editUploadedImages,
      sizes: editSelectedSizes,
      colors: editColorsList.length > 0 ? editColorsList : [{ name: 'Sem Cor', hex: '#ebebeb' }],
      description: editDescription.trim(),
      inStock: editInStock,
      onSale: !!promoNum,
      isNew: editIsNew,
      isActive: editIsActive,
      homepageSections: editHomepageSections,
      sizesStock: updatedSizesStock
    };

    onUpdateProduct(updatedProduct);
    setProductToEdit(null);
    showToast(`Produto "${editName.trim()}" atualizado com sucesso!`, 'success');
  };

  const handleToggleStatus = (product: Product) => {
    const currentStatus = product.isActive !== false;
    const updated = {
      ...product,
      isActive: !currentStatus
    };
    onUpdateProduct(updated);
    showToast(
      `Produto "${product.name}" alterado para ${!currentStatus ? 'ATIVO (Público)' : 'RASCUNHO (Oculto)'}!`,
      !currentStatus ? 'success' : 'info'
    );
  };

  // Predefined defaults
  const availableSizes = [2, 4, 6, 8, 10, 12, 14, 16];
  const DEFAULT_PIN = 'admin123';

  // Handle PIN Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === DEFAULT_PIN) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('fr_admin_logged', 'true');
      setAuthError('');
    } else {
      setAuthError('Código de Acesso inválido! Tente "admin123".');
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('fr_admin_logged');
    setAdminPin('');
  };

  // Image Upload Logic
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      const fileExtension = file.name.substring(file.name.lastIndexOf('.'));
      const initialCustomName = `img_${Date.now()}${fileExtension}`;
      const id = Math.random().toString(36).substring(2, 9);
      
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const originalBase64 = reader.result;
          const img = new Image();
          img.src = originalBase64;
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              // Support very high quality product photos up to 1600px width/height for maximum sharpness
              const MAX_WIDTH = 1600;
              const MAX_HEIGHT = 1600;
              let width = img.width;
              let height = img.height;

              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                // Compress with 0.88 quality for extremely sharp visuals
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.88);
                setUploadedImages((prev) => [
                  ...prev,
                  {
                    file,
                    id,
                    url: compressedBase64,
                    customName: initialCustomName
                  }
                ]);
                showToast('Foto do produto otimizada em ALTA QUALIDADE!', 'success');
              } else {
                setUploadedImages((prev) => [
                  ...prev,
                  {
                    file,
                    id,
                    url: originalBase64,
                    customName: initialCustomName
                  }
                ]);
                showToast('Foto do produto carregada!', 'success');
              }
            } catch (err) {
              console.error('Error compressing product image:', err);
              setUploadedImages((prev) => [
                ...prev,
                {
                  file,
                  id,
                  url: originalBase64,
                  customName: initialCustomName
                }
              ]);
              showToast('Foto do produto carregada!', 'success');
            }
          };
          img.onerror = () => {
            setUploadedImages((prev) => [
              ...prev,
              {
                file,
                id,
                url: originalBase64,
                customName: initialCustomName
              }
            ]);
            showToast('Foto do produto carregada!', 'success');
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Set the custom filename override for a specific index
  const updateImageFilename = (id: string, newName: string) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, customName: newName } : img))
    );
  };

  const removeUploadedImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  // URL Image add fallback
  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() === '') return;
    const resolvedName = imageFileNameOverride.trim() !== '' 
      ? imageFileNameOverride.trim() 
      : `online_url_${Math.random().toString(36).substring(2, 7)}.jpg`;

    setUploadedImages((prev) => [
      ...prev,
      {
        file: new File([], resolvedName),
        id: Math.random().toString(36).substring(2, 9),
        url: imageUrlInput.trim(),
        customName: resolvedName
      }
    ]);
    setImageUrlInput('');
    setImageFileNameOverride('');
  };

  // Color actions
  const handleAddColor = () => {
    if (colorName.trim() === '') return;
    if (colorsList.some(c => c.name.toLowerCase() === colorName.trim().toLowerCase())) return;
    setColorsList((prev) => [...prev, { name: colorName.trim(), hex: colorHex }]);
    setColorName('');
  };

  const handleRemoveColor = (nameToRemove: string) => {
    setColorsList((prev) => prev.filter(c => c.name !== nameToRemove));
  };

  // Toggle size checkbox
  const handleToggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Por favor, informe o título do produto.', 'error');
      return;
    }
    if (selectedSizes.length === 0) {
      showToast('Selecione pelo menos um tamanho correspondente.', 'error');
      return;
    }

    const priceNum = parseFloat(originalPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('Por favor, defina um preço original válido.', 'error');
      return;
    }

    const promoNum = promoPrice ? parseFloat(promoPrice) : undefined;
    if (promoNum !== undefined && (isNaN(promoNum) || promoNum >= priceNum)) {
      showToast('O preço promocional de desconto deve ser menor do que o preço de tabela original.', 'error');
      return;
    }

    // Build image paths
    // In our client system, we use object URLs for physical uploads and raw external URLs for fallbacks.
    const productImages = uploadedImages.map((img) => img.url);
    if (productImages.length === 0) {
      // Fallback placeholder image if none assigned
      productImages.push('https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop');
    }

    const initialSizesStock: Record<string, number> = {};
    selectedSizes.forEach((s) => {
      initialSizesStock[s] = inStock ? 12 : 0;
    });

    const freshProduct: Product = {
      id: `adm-${Date.now()}`,
      name: name.trim(),
      category,
      originalPrice: priceNum,
      promoPrice: promoNum,
      images: productImages,
      sizes: selectedSizes,
      colors: colorsList.length > 0 ? colorsList : [{ name: 'Sem Cor', hex: '#ebebeb' }],
      description: description.trim() || 'Moletom casual e robusto produzido com toque flanelado super confortável e as melhores matérias-primas.',
      details: [
        'Produzido em moletom premium de altíssima costura reforçada',
        'Corte geométrico e modelagem esportiva anatômica',
        'Bolsos laterais embutidos confortáveis e capuz aconchegante',
        'Altíssima retenção térmica contra ondas frias intensas'
      ],
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      inStock,
      onSale: !!promoNum,
      isNew,
      isActive: true,
      homepageSections: homepageSections,
      sizesStock: initialSizesStock
    };

    // Callback state to App.tsx
    onAddProduct(freshProduct);

    // Reset Form fields
    setName('');
    setDescription('');
    setOriginalPrice('');
    setPromoPrice('');
    setSelectedSizes([]);
    setUploadedImages([]);
    setColorsList([
      { name: 'Cinza Mescla', hex: '#b2b2b2' },
      { name: 'Azul Escuro', hex: '#002855' }
    ]);
    setHomepageSections([]);
    setIsNew(true);
    setInStock(true);

    // Success transition
    setActiveTab('list');
    showToast('Look inserido com sucesso na base de dados!', 'success');
  };

  // Advanced Stats Calculation
  const totalCatalog = products.length;
  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = totalCatalog - inStockCount;

  // Filter products on the list
  const filteredProductsBySearch = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      filterCategory === 'all' || 
      p.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Authentication Gate Layout
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 py-10 bg-white border border-gray-150 shadow-2xl animate-fadeIn">
        <div className="text-center mb-8">
          <div className="p-3 bg-red-100/60 inline-block rounded-full text-red-500 border border-red-200 mb-3 animate-pulse">
            <Lock size={28} />
          </div>
          <h2 className="text-2xl font-black font-display text-[#002855] tracking-wider uppercase">
            Acesso Restrito Admin
          </h2>
          <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">
            FR Moletom Back-Office
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
              Chave de Acesso Admin:
            </label>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Digite o código (ex: admin123)"
              className="w-full border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-orange-200 focus:outline-none"
              required
            />
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 border-l-4 border-red-500 animate-slideUp">
              {authError}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#002855] hover:bg-[#FF7A00] text-white py-3 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Autenticar e Entrar
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <span className="text-[10px] text-gray-400 font-bold block mb-3 uppercase tracking-wider">
            Código de teste padrão: <span className="text-[#FF7A00] font-black">admin123</span>
          </span>
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs text-[#002855] hover:text-[#FF7A00] font-black uppercase tracking-wider transition-all"
          >
            <ArrowLeft size={12} /> Voltar para a Loja Pública
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Admin Title Banner */}
      <div className="bg-[#002855] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-orange-500 shadow-sm mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-[#FF7A00] mb-1">
            <Unlock size={14} className="fill-orange-500/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Painel de Controle Oficial</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display uppercase tracking-wider">
            Administração FR Moletom
          </h1>
          <p className="text-[11px] text-orange-100 font-bold mt-0.5">
            Gerenciamento de produtos, catalogação de lançamentos e controle de arquivos estáticos.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={onBackToStore}
            className="bg-white/10 hover:bg-white/15 text-white py-2.5 px-4 font-black text-[10px] uppercase tracking-wider border border-white/10 transition-all cursor-pointer inline-flex items-center gap-1"
          >
            Launcer Loja
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
          >
            Desconectar
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-150 p-4 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total no Catálogo</span>
            <h3 className="text-xl md:text-2xl font-black text-[#002855] mt-1">{totalCatalog}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-[#002855]">
            <Layers size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-4 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ativos em Estoque</span>
            <h3 className="text-xl md:text-2xl font-black text-emerald-600 mt-1">{inStockCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600">
            <Check size={18} />
          </div>
        </div>

        <div className="bg-white border border-gray-150 p-4 md:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Esgotados</span>
            <h3 className="text-xl md:text-2xl font-black text-red-500 mt-1">{outOfStockCount}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-500">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* Control Tabs Selector */}
      <div className="border-b border-gray-200 mb-8 flex flex-wrap gap-2 md:gap-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`py-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'border-[#FF7A00] text-[#002855]'
              : 'border-transparent text-gray-400 hover:text-[#002855]'
          }`}
        >
          Lista de Itens ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`py-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'add'
              ? 'border-[#FF7A00] text-[#002855]'
              : 'border-transparent text-gray-400 hover:text-[#002855]'
          }`}
        >
          + Adicionar Novo Moletom
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          className={`py-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1 ${
            activeTab === 'stock'
              ? 'border-[#FF7A00] text-[#002855]'
              : 'border-transparent text-gray-400 hover:text-[#002855]'
          }`}
        >
          📦 Estoque de Grades
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'border-[#FF7A00] text-[#002855]'
              : 'border-transparent text-gray-400 hover:text-[#002855]'
          }`}
        >
          ⚙️ Configurações da Vitrine
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`py-3 px-4 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-[#FF7A00] text-[#002855]'
              : 'border-transparent text-gray-400 hover:text-[#002855]'
          }`}
        >
          ⭐ Avaliações dos Clientes ({testimonials.length})
        </button>
      </div>

      {/* Tab Area 1: Products Table List */}
      {activeTab === 'list' && (
        <div className="bg-white border border-gray-150 shadow-sm overflow-hidden">
          {/* Header Action Row */}
          <div className="p-4 md:p-6 border-b border-gray-150 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Sliders size={15} className="text-[#FF7A00]" /> Painel de Catalogação Geral
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
              {/* Category selector */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white border border-gray-300 p-2.5 text-xs text-gray-700 font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none focus:border-orange-300 rounded-none cursor-pointer pr-8 w-full sm:w-48 appearance-none"
                >
                  <option value="all">📁 Todas as Categorias</option>
                  <option value="moletons">🧥 Moletons & Agasalhos</option>
                  <option value="camisetas">👕 Camisetas Nobres</option>
                  <option value="conjuntos">🎽 Conjuntos Completos</option>
                  <option value="calcas">👖 Calças de Algodão</option>
                  <option value="bermudas">🩳 Shorts & Bermudas</option>
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 text-[10px] font-bold">
                  ▼
                </div>
              </div>

              {/* Text search by name/ID */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Buscar look por nome ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-300 p-2.5 pl-9 text-xs focus:ring-1 focus:ring-orange-200 focus:outline-none focus:border-orange-300 rounded-none placeholder-gray-400 font-bold"
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={13} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredProductsBySearch.length === 0 ? (
              <div className="text-center py-16 animate-fadeIn">
                <span className="text-3xl block mb-2">👚</span>
                <p className="text-sm text-gray-800 font-black uppercase">Nenhum produto indexado</p>
                <p className="text-xs text-gray-400 font-bold mt-1 max-w-xs mx-auto">
                  Tente alterar seus filtros de pesquisa ou insira um novo casaco usando a aba de inclusão!
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100/80 border-b border-gray-150 text-[9.5px] font-black text-[#002855] uppercase tracking-wider">
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Nome do Roupão</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Selos</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Preço</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredProductsBySearch.map((product) => {
                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors text-xs font-bold text-gray-700">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="w-10 h-12 bg-gray-100 border border-gray-200 relative overflow-hidden shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        
                        {/* ID */}
                        <td className="py-3 px-4 font-mono text-[10px] text-gray-400">
                          {product.id}
                        </td>
 
                        {/* Title Name */}
                        <td className="py-3 px-4">
                          <span className="text-gray-900 block line-clamp-1">{product.name}</span>
                          <span className="text-[10px] text-gray-400 block font-normal">
                            Sizes: {product.sizes.join(', ')}
                          </span>
                        </td>
 
                        {/* Category */}
                        <td className="py-3 px-4 uppercase text-[10px] tracking-wide text-[#002855]">
                          {product.category}
                        </td>
 
                        {/* Badges status */}
                        <td className="py-3 px-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {product.isNew && (
                              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-200 text-[8px] font-black uppercase px-2 py-0.5">
                                NOVO
                              </span>
                            )}
                            {product.promoPrice && (
                              <span className="bg-[#FF7A00]/10 text-[#FF7A00] border border-orange-200 text-[8px] font-black uppercase px-2 py-0.5">
                                PROMO
                              </span>
                            )}
                            {!product.inStock && (
                              <span className="bg-red-500/10 text-red-600 border border-red-200 text-[8px] font-black uppercase px-2 py-0.5 animate-pulse">
                                ESGOTADO
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Toggle Status Switch */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 border leading-none tracking-wide mb-1 select-none ${
                              product.isActive !== false
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}>
                              {product.isActive !== false ? 'ATIVO' : 'RASCUNHO'}
                            </span>
                            
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(product)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                product.isActive !== false ? 'bg-emerald-500' : 'bg-gray-200'
                              }`}
                              title={product.isActive !== false ? "Desativar (Mudar para Rascunho)" : "Ativar (Publicar na Loja)"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                                  product.isActive !== false ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </td>
 
                        {/* Prices */}
                        <td className="py-3 px-4">
                          {product.promoPrice ? (
                            <div>
                              <span className="text-[#FF7A00] block">R$ {product.promoPrice.toFixed(2)}</span>
                              <span className="text-gray-400 line-through text-[10px] font-medium block">
                                R$ {product.originalPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-900">R$ {product.originalPrice.toFixed(2)}</span>
                          )}
                        </td>
 
                        {/* Actions */}
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="text-[#002855] hover:text-white hover:bg-[#002855] border border-blue-200 hover:border-[#002855] p-2 transition-all cursor-pointer inline-flex items-center gap-1"
                              title="Editar Produto"
                            >
                              <Edit size={12} />
                              <span className="text-[9px] uppercase font-black px-0.5 hidden lg:inline">Editar</span>
                            </button>

                            <button
                              onClick={() => setProductToDelete(product)}
                              className="text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 p-2 transition-all cursor-pointer inline-flex items-center gap-1"
                              title="Remover Produto"
                            >
                              <Trash2 size={12} />
                              <span className="text-[9px] uppercase font-black px-0.5 hidden lg:inline">Apagar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab Area 2: Add Product Form */}
      {activeTab === 'add' && (
        <div className="bg-white border border-gray-150 p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-sm font-black text-[#002855] uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-100 pb-3 mb-6">
              <FolderPlus size={16} className="text-[#FF7A00]" /> Cadastro de Novo Look
            </h2>

            {/* Title & Category row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Título do Casaco / Produto: *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Moletom Canguru Premium Flanelado"
                  className="w-full border border-gray-300 p-3 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Categoria Principal: *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full border border-gray-300 p-3 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none bg-white cursor-pointer"
                >
                  <option value="moletons">🧥 Moletons & Agasalhos</option>
                  <option value="camisetas">👕 Camisetas Nobres</option>
                  <option value="conjuntos">🎽 Conjuntos Completos</option>
                  <option value="calcas">👖 Calças de Algodão</option>
                  <option value="bermudas">🩳 Shorts & Bermudas</option>
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                Descrição Detalhada do Produto:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Diga mais sobre a maciez do tecido, a composição exata das fibras, os diferenciais térmicos e as sensações de vestir..."
                rows={3}
                className="w-full border border-gray-300 p-3 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            {/* Prices & Product Flags */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Preço de Tabela (R$): *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="Ex: 149.90"
                  className="w-full border border-gray-300 p-3 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Preço com Desconto (R$): (Opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={promoPrice}
                  onChange={(e) => setPromoPrice(e.target.value)}
                  placeholder="Ex: 119.90"
                  className="w-full border border-gray-300 p-3 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Selo de Lançamento / Novo:
                </label>
                <div className="flex gap-4 p-3 bg-gray-50 border border-gray-300">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={isNew}
                      onChange={() => setIsNew(true)}
                      className="cursor-pointer"
                    /> Yes
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isNew}
                      onChange={() => setIsNew(false)}
                      className="cursor-pointer"
                    /> No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Disponibilidade em Estoque:
                </label>
                <div className="flex gap-4 p-3 bg-gray-50 border border-gray-300">
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={inStock}
                      onChange={() => setInStock(true)}
                      className="cursor-pointer"
                    /> Sim (In Stock)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!inStock}
                      onChange={() => setInStock(false)}
                      className="cursor-pointer"
                    /> Não (Esgotado)
                  </label>
                </div>
              </div>
            </div>

            {/* Size checklist */}
            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-2">
                Tamanhos Disponíveis para Seleção: * (Inverno / Verão Infantil)
              </label>
              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => handleToggleSize(sz)}
                      className={`w-11 h-11 text-xs font-black select-none transition-all flex items-center justify-center border ${
                        isChecked
                          ? 'bg-[#FF7A00] text-white border-[#FF7A00] ring-2 ring-orange-200'
                          : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color specification checkbox list */}
            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-2">
                Selecionar Cores do Look (Atributos Globais):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-4 bg-gray-50 border border-gray-200/80">
                {masterColors.map((color) => {
                  const isChecked = colorsList.some((c) => c.name === color.name);
                  return (
                    <label key={color.name} className="flex items-center gap-2 px-2.5 py-2 bg-white border border-gray-200 hover:border-orange-200 cursor-pointer transition-colors shadow-xs select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setColorsList((prev) => prev.filter((c) => c.name !== color.name));
                          } else {
                            setColorsList((prev) => [...prev, color]);
                          }
                        }}
                        className="w-4 h-4 cursor-pointer accent-[#FF7A00]"
                      />
                      <span className="w-4.5 h-4.5 rounded-full border border-gray-350 shrink-0" style={{ backgroundColor: color.hex }} />
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-tight truncate" title={color.name}>
                        {color.name}
                      </span>
                    </label>
                  );
                })}
              </div>
              {masterColors.length === 0 ? (
                <p className="text-xs text-red-500 font-bold uppercase tracking-wider mt-1.5">
                  ⚠️ Cadastre cores no gerenciador (aba Configurações) antes de criar produtos!
                </p>
              ) : (
                <div className="mt-2.5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Cores Selecionadas:</span>
                  {colorsList.map((c) => (
                    <span key={c.name} className="inline-flex items-center gap-1.5 text-[10px] bg-white border border-gray-200 px-2 py-0.5 text-gray-800 font-bold">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </span>
                  ))}
                  {colorsList.length === 0 && (
                    <span className="text-xs text-gray-400 font-medium italic">Nenhuma cor selecionada.</span>
                  )}
                </div>
              )}
            </div>

            {/* REQUIRED IMAGE SPECIFICATION SECTIONS featuring FILENAME RENAME OVERRIDE */}
            <div className="border-t border-gray-150 pt-6">
              <label className="block text-[11px] font-black uppercase text-[#002855] tracking-widest mb-1">
                Upload de Imagens do Look com Rename Opcional:
              </label>
              <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase tracking-wider">
                Selecione as fotos do produto e alterne/renomeie os nomes dos arquivos antes da gravação final!
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Method A: Direct file selector with renaming feature */}
                <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={32} className="text-[#FF7A00] mb-2.5" />
                  <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                    Arrastar ou Selecionar Foto
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                    PNG, JPG, JPEG ou GIF até 10MB
                  </span>
                </div>

                {/* Method B: URL Input override with custom Renamer */}
                <div className="bg-white border text-left border-gray-200 p-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-[#FF7A00] uppercase tracking-wider block">
                      Vínculo de Imagem por URL Externa
                    </span>

                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">URL Completo da Foto:</label>
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Ex: https://images.unsplash.com/..."
                        className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Renomear Arquivo para:</label>
                      <input
                        type="text"
                        value={imageFileNameOverride}
                        onChange={(e) => setImageFileNameOverride(e.target.value)}
                        placeholder="Ex: casaco_classic_azul.jpg"
                        className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="mt-4 bg-[#002855] hover:bg-[#FF7A00] text-white py-2.5 px-3 block text-center font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Vincular UrL & Adicionar
                  </button>
                </div>

                {/* Preview column listing mapped uploaded products & Custom Rename features */}
                <div className="bg-orange-50/20 border border-orange-100 p-4 min-h-[140px] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-[#002855] uppercase tracking-wider block mb-3">
                      Arquivos Vinculados ({uploadedImages.length})
                    </span>

                    {uploadedImages.length === 0 ? (
                      <div className="py-6 text-center">
                        <ImageIcon size={20} className="text-gray-300 mx-auto mb-1.5" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase block">
                          Nenhuma Imagem Selecionada
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                        {uploadedImages.map((img) => (
                          <div key={img.id} className="flex gap-2 bg-white border border-gray-200 p-2 relative shadow-2xs">
                            <div className="w-10 h-10 bg-gray-50 flex-shrink-0 overflow-hidden relative">
                              <img src={img.url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            
                            <div className="flex-grow min-w-0">
                              <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                                Nome do Arquivo no Banco:
                              </label>
                              <input
                                type="text"
                                value={img.customName}
                                onChange={(e) => updateImageFilename(img.id, e.target.value)}
                                className="w-full border-b border-gray-200 focus:border-[#FF7A00] text-[10px] font-bold text-gray-800 p-0 hover:bg-gray-50 focus:outline-none rounded-none transition-colors"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => removeUploadedImage(img.id)}
                              className="text-red-400 hover:text-red-600 self-center p-1 font-black shrink-0 text-sm"
                              title="Remover"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Homepage Visibility Selection */}
            <div className="p-4 bg-orange-50/10 border border-orange-200/60 text-left">
              <span className="block text-[11px] font-black uppercase text-[#002855] tracking-widest mb-1 shadow-xs">
                Visibilidade na Vitrine (Homepage Sections)
              </span>
              <p className="text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-wider">
                Selecione as seções da página inicial onde este produto será promovido e exibido:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={homepageSections.includes('categories')}
                    onChange={() => handleToggleHomepageSection('categories')}
                    className="w-4 h-4 cursor-pointer accent-[#FF7A00]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-800 uppercase block leading-tight">
                      {storefrontSettings?.categories || 'Compre por Categoria'}
                    </span>
                    <span className="text-[8px] text-[#FF7A00] font-bold uppercase tracking-wider block mt-0.5">Seção 1 (Categorias)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={homepageSections.includes('featured')}
                    onChange={() => handleToggleHomepageSection('featured')}
                    className="w-4 h-4 cursor-pointer accent-[#FF7A00]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-800 uppercase block leading-tight">
                      {storefrontSettings?.featured || 'PRODUTOS EM DESTAQUE'}
                    </span>
                    <span className="text-[8px] text-[#FF7A00] font-bold uppercase tracking-wider block mt-0.5">Seção 2 (Destaques)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={homepageSections.includes('newArrivals')}
                    onChange={() => handleToggleHomepageSection('newArrivals')}
                    className="w-4 h-4 cursor-pointer accent-[#FF7A00]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-800 uppercase block leading-tight">
                      {storefrontSettings?.newArrivals || 'LANÇAMENTOS EXCLUSIVOS'}
                    </span>
                    <span className="text-[8px] text-[#FF7A00] font-bold uppercase tracking-wider block mt-0.5">Seção 3 (Lançamentos)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={homepageSections.includes('bestSellers')}
                    onChange={() => handleToggleHomepageSection('bestSellers')}
                    className="w-4 h-4 cursor-pointer accent-[#FF7A00]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-800 uppercase block leading-tight">
                      {storefrontSettings?.bestSellers || 'MAIS VENDIDOS DA SEMANA'}
                    </span>
                    <span className="text-[8px] text-[#FF7A00] font-bold uppercase tracking-wider block mt-0.5">Seção 4 (Mais Vendidos)</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-colors shadow-sm">
                  <input
                    type="checkbox"
                    checked={homepageSections.includes('gallery')}
                    onChange={() => handleToggleHomepageSection('gallery')}
                    className="w-4 h-4 cursor-pointer accent-[#FF7A00]"
                  />
                  <div>
                    <span className="text-xs font-black text-gray-800 uppercase block leading-tight">
                      {storefrontSettings?.gallery || 'Galeria de Fotos Reais'}
                    </span>
                    <span className="text-[8px] text-[#FF7A00] font-bold uppercase tracking-wider block mt-0.5">Seção 5 (Galeria)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit & Reset actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-150">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('list');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-3.5 px-6 font-bold text-xs uppercase tracking-wider transition-colors border border-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#002855] hover:bg-[#FF7A00] text-white py-3.5 px-8 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus size={14} /> Cadastrar Look
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Area 3: Storefront Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-gray-150 p-6 md:p-8 max-w-2xl mx-auto shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-6">
            <Sliders className="text-[#FF7A00]" size={18} />
            <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
              Gerenciar Títulos da Vitrine (Página Inicial)
            </h2>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            showToast('Títulos da vitrine sincronizados e publicados!', 'success');
          }} className="space-y-5 text-left">
            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                Seção 1: {storefrontSettings?.categories || 'Compre por Categoria'} (Título)
              </label>
              <input
                type="text"
                value={storefrontSettings?.categories || ''}
                onChange={(e) => onUpdateStorefrontSettings({ ...storefrontSettings, categories: e.target.value })}
                placeholder="Compre por Categoria"
                className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                Seção 2: {storefrontSettings?.featured || 'PRODUTOS EM DESTAQUE'} (Título)
              </label>
              <input
                type="text"
                value={storefrontSettings?.featured || ''}
                onChange={(e) => onUpdateStorefrontSettings({ ...storefrontSettings, featured: e.target.value })}
                placeholder="PRODUTOS EM DESTAQUE"
                className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                Seção 3: {storefrontSettings?.newArrivals || 'LANÇAMENTOS EXCLUSIVOS'} (Título)
              </label>
              <input
                type="text"
                value={storefrontSettings?.newArrivals || ''}
                onChange={(e) => onUpdateStorefrontSettings({ ...storefrontSettings, newArrivals: e.target.value })}
                placeholder="LANÇAMENTOS EXCLUSIVOS"
                className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                Seção 4: {storefrontSettings?.bestSellers || 'MAIS VENDIDOS DA SEMANA'} (Título)
              </label>
              <input
                type="text"
                value={storefrontSettings?.bestSellers || ''}
                onChange={(e) => onUpdateStorefrontSettings({ ...storefrontSettings, bestSellers: e.target.value })}
                placeholder="MAIS VENDIDOS DA SEMANA"
                className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                Seção 5: {storefrontSettings?.gallery || 'Galeria de Fotos Reais'} (Título)
              </label>
              <input
                type="text"
                value={storefrontSettings?.gallery || ''}
                onChange={(e) => onUpdateStorefrontSettings({ ...storefrontSettings, gallery: e.target.value })}
                placeholder="Galeria de Fotos Reais"
                className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-150 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-[10px] text-[#FF7A00] font-bold uppercase tracking-wider">
                💡 Alterações de títulos são sincronizadas com a Página Inicial em tempo real.
              </p>
              <button
                type="submit"
                className="bg-[#002855] hover:bg-[#FF7A00] text-white py-2.5 px-6 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto"
              >
                Salvar Configurações
              </button>
            </div>
          </form>

          {/* 1. Dynamic Top Announcement Bar (Marquee) Settings */}
          <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-5 text-left">
              <Sliders className="text-[#FF7A00]" size={18} />
              <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                Faixa de Anúncios Top (Efeito Marquee)
              </h2>
            </div>

            <div className="space-y-4 text-left">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                Adicione, remova e controle a velocidade de rotação das mensagens exibidas na barra superior do site em tempo real.
              </p>

              {/* Speed control slider */}
              <div className="bg-gray-50 border border-gray-200 p-4">
                <label className="block text-[10px] font-black uppercase text-[#002855] tracking-widest mb-2.5">
                  Velocidade de Rolagem: {announcementSettings?.speed || 25} segundos (Valores menores rolam mais rápido)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={announcementSettings?.speed || 25}
                    onChange={(e) => onUpdateAnnouncementSettings({
                      ...announcementSettings,
                      speed: Number(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
                  />
                  <span className="text-xs font-mono font-bold text-gray-600 shrink-0 w-12 text-right">
                    {announcementSettings?.speed || 25}s
                  </span>
                </div>
              </div>

              {/* Add Message Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMarqueeMessage}
                  onChange={(e) => setNewMarqueeMessage(e.target.value)}
                  placeholder="Escreva uma nova mensagem para a barra superior..."
                  className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none bg-white font-sans"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMarqueeMessage();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMarqueeMessage}
                  className="bg-[#002855] hover:bg-[#FF7A00] text-white px-5 py-2.5 font-black text-xs uppercase tracking-wide transition-colors cursor-pointer shrink-0"
                >
                  + Adicionar
                </button>
              </div>

              {/* Messages list */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {(announcementSettings?.messages || []).map((msg, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-250 shadow-3xs gap-3">
                    <input
                      type="text"
                      value={getAnnouncementText(msg)}
                      onChange={(e) => handleEditMarqueeMessage(index, e.target.value)}
                      className="flex-grow bg-transparent border-0 font-bold text-xs focus:ring-0 focus:outline-none p-0 text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMarqueeMessage(index)}
                      title="Remover mensagem"
                      className="text-gray-400 hover:text-red-500 font-bold p-1 text-xs shrink-0 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                {(!announcementSettings || !announcementSettings.messages || announcementSettings.messages.length === 0) && (
                  <p className="text-xs text-gray-400 italic">Nenhum anúncio disponível. Por favor, adicione um acima.</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Hero Slider (Main Carousel) Manager Settings */}
          <div id="hero-slider-form-container" className="mt-8 pt-8 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-5 text-left">
              <ImageIcon className="text-[#FF7A00]" size={18} />
              <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                Gerenciador de Slides Hero (Coleção Principal)
              </h2>
            </div>

            <div className="space-y-6 text-left">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                Controle o banner rotativo da homepage. Carregue uma imagem limpa e defina a subpágina ou link para onde o cliente será redirecionado imediatamente ao clicar no banner.
              </p>

              {/* Form: Add/Edit Slide */}
              <div className="bg-gray-50 border border-gray-200 p-5 mt-4 space-y-4">
                <h3 className="text-xs font-black text-[#002855] uppercase tracking-wider border-b border-gray-200 pb-2 flex justify-between items-center">
                  <span>{editingSlideId ? '✏️ Editar Slide Selecionado' : '➕ Cadastrar Novo Slide Hero'}</span>
                  {editingSlideId && (
                    <button
                      type="button"
                      onClick={handleResetSlideForm}
                      className="text-[10px] text-red-500 hover:underline font-black uppercase tracking-wider cursor-pointer"
                    >
                      Sair da edição (cancelar)
                    </button>
                  )}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Background Image - Upload Section */}
                  <div className="md:col-span-2 space-y-2 text-left">
                    <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest">
                      Carregar Imagem de Fundo do Slide *
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Interactive Drag & Drop / Click Upload Box */}
                      <div className="md:col-span-2 border-2 border-dashed border-gray-300 p-5 flex flex-col items-center justify-center text-center bg-white hover:bg-gray-50 hover:border-orange-200 transition-colors relative min-h-[120px] cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSlideImageFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload size={24} className="text-[#FF7A00] mb-2" />
                        <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                          Escolher Foto do Computador / Celular
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                          Clique para selecionar ou arraste o arquivo aqui
                        </span>
                      </div>

                      {/* Preview Column with URL option */}
                      <div className="bg-white border border-gray-200 p-3.5 flex flex-col justify-between min-h-[120px]">
                        <div>
                          <span className="text-[9px] font-black text-[#002855] uppercase tracking-wider block mb-1.5">
                            Previsualização do Slide
                          </span>
                          {slideImage ? (
                            <div className="relative w-full h-16 bg-gray-100 overflow-hidden border border-gray-300">
                              <img
                                src={slideImage}
                                alt="Previsualização do banner"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <button
                                type="button"
                                onClick={() => setSlideImage('')}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-none select-none cursor-pointer"
                                title="Remover imagem"
                              >
                                Remover
                              </button>
                            </div>
                          ) : (
                            <div className="w-full h-16 bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon size={18} className="mb-1" />
                              <span className="text-[8px] uppercase font-bold text-center">Sem Imagem</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Option to type/paste URL directly optionally */}
                        <div className="mt-2 text-left">
                          <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Ou insira uma URL externa:
                          </label>
                          <input
                            type="text"
                            value={slideImage}
                            onChange={(e) => setSlideImage(e.target.value)}
                            placeholder="Ex: https://images.unsplash.com/..."
                            className="w-full border border-gray-200 px-2 py-1 text-[9px] font-bold bg-gray-50 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Background Position Selector */}
                  <div className="md:col-span-2 text-left bg-white p-3 border border-gray-200 space-y-1.5">
                    <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest">
                      Posicionamento vertical/horizontal da Imagem de Fundo *
                    </label>
                    <select
                      value={slideBgPosition}
                      onChange={(e) => setSlideBgPosition(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 cursor-pointer"
                    >
                      <option value="center">🎯 Centro (Padrão)</option>
                      <option value="top">⬆️ Topo (Ideal se rostos/estampas estão no topo)</option>
                      <option value="bottom">⬇️ Base (Ideal se o foco do produto está embaixo)</option>
                      <option value="left">⬅️ Esquerda</option>
                      <option value="right">➡️ Direita</option>
                    </select>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">
                      Isso decide qual parte da imagem fica visível em telas de tamanhos diferentes (computadores vs. celulares).
                    </p>
                  </div>

                  {/* Tamanho dos Botões e Alinhamento do Conteúdo */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Alinhamento do Conteúdo */}
                    <div className="text-left bg-white p-3 border border-gray-200 space-y-1.5">
                      <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest">
                        Alinhamento do Conteúdo do Slide *
                      </label>
                      <select
                        value={slideContentAlign}
                        onChange={(e) => setSlideContentAlign(e.target.value as any)}
                        className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 cursor-pointer"
                      >
                        <option value="left">⬅️ Alinhado à Esquerda (Padrão)</option>
                        <option value="center">↔️ Alinhado ao Centro</option>
                        <option value="right">➡️ Alinhado à Direita</option>
                      </select>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">
                        Define se o título, descrição e botões ficam no canto esquerdo, centralizados ou no canto direito.
                      </p>
                    </div>

                    {/* Tamanho dos Botões */}
                    <div className="text-left bg-white p-3 border border-gray-200 space-y-1.5">
                      <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest">
                        Tamanho dos Botões do Slide *
                      </label>
                      <select
                        value={slideBtnSize}
                        onChange={(e) => setSlideBtnSize(e.target.value as any)}
                        className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 cursor-pointer"
                      >
                        <option value="sm">🔎 Pequeno</option>
                        <option value="md">⚖️ Médio (Padrão)</option>
                        <option value="lg">📢 Grande</option>
                      </select>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">
                        Define as dimensões e o tamanho da fonte para ambos os botões (Botão 1 e Botão 2).
                      </p>
                    </div>
                  </div>

                  {/* Text Contents & Interactive Buttons */}
                  <div className="md:col-span-2 space-y-3 text-left bg-white p-4 border border-gray-200">
                    <span className="block text-[10px] font-black uppercase text-[#002855] tracking-wider border-b border-gray-150 pb-1.5">
                      Conteúdo Escrito e Botões do Slide (Opcional)
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Title */}
                      <div>
                        <label className="block text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">
                          Título Principal (Texto Grande):
                        </label>
                        <input
                          type="text"
                          value={slideTitle}
                          onChange={(e) => setSlideTitle(e.target.value)}
                          placeholder="Ex: NOVA COLEÇÃO DE MOLETONS"
                          className="w-full border border-gray-300 p-2 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>

                      {/* Subtitle */}
                      <div>
                        <label className="block text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">
                          Subtítulo (Descrição Curta):
                        </label>
                        <input
                          type="text"
                          value={slideSubtitle}
                          onChange={(e) => setSlideSubtitle(e.target.value)}
                          placeholder="Ex: Conforto premium e tecido de alta gramatura"
                          className="w-full border border-gray-300 p-2 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>

                      {/* Button 1 Configuration */}
                      <div className="border-t border-gray-100 pt-3 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-black text-[#FF7A00] uppercase tracking-wider mb-1">
                            Texto do Botão Principal (Ação Principal):
                          </label>
                          <input
                            type="text"
                            value={slideBtn1Text}
                            onChange={(e) => setSlideBtn1Text(e.target.value)}
                            placeholder="Ex: Ver Coleção (Deixe vazio para sem botão)"
                            className="w-full border border-gray-300 p-2 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-[#FF7A00] uppercase tracking-wider mb-1">
                            Link/Ação do Botão Principal:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <select
                              className="w-full border border-gray-300 p-2 text-[11px] font-bold bg-white focus:outline-none cursor-pointer"
                              onChange={(e) => {
                                if (e.target.value) {
                                  setSlideBtn1Url(e.target.value);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="">-- Preset de Filtro --</option>
                              <option value="todos">🛍️ Inventário Completo (Todos os Produtos)</option>
                              <option value="moletons">🧥 Categoria: Moletons</option>
                              <option value="camisetas">👕 Categoria: Camisetas</option>
                              <option value="conjuntos">👖 Categoria: Conjuntos</option>
                              <option value="calcas">👖 Categoria: Calças</option>
                              <option value="bermudas">🩳 Categoria: Bermudas</option>
                              <option value="lancamentos">🔥 Lançamentos</option>
                              <option value="promocoes">🏷️ Promoções</option>
                            </select>
                            <input
                              type="text"
                              value={slideBtn1Url}
                              onChange={(e) => setSlideBtn1Url(e.target.value)}
                              placeholder="Ex: moletons, ou link externo"
                              className="w-full border border-gray-300 p-2 text-[11px] font-mono bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Button 1 Color Selector */}
                        <div className="md:col-span-2 bg-gray-50 p-2.5 border border-gray-200">
                          <label className="block text-[9px] font-black text-[#FF7A00] uppercase tracking-widest mb-1.5">
                            🎨 Cor do Botão Principal:
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {[
                              { value: 'brand', label: '🟠 Laranja Padrão' },
                              { value: 'dark-blue', label: '🔵 Azul Escuro' },
                              { value: 'black', label: '⚫ Preto' },
                              { value: 'white', label: '⚪ Branco' },
                              { value: 'trans-dark', label: '🕶️ Trans Escuro' },
                              { value: 'trans-light', label: '🧼 Trans Claro' },
                              { value: 'custom', label: '🌈 Cor Personalizada (Hex)' }
                            ].map((opt) => {
                              const isSelected = opt.value === 'custom'
                                ? (!['brand', 'dark-blue', 'black', 'white', 'trans-dark', 'trans-light'].includes(slideBtn1Color))
                                : slideBtn1Color === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    if (opt.value === 'custom') {
                                      setSlideBtn1Color('#FF7A00');
                                    } else {
                                      setSlideBtn1Color(opt.value);
                                    }
                                  }}
                                  className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FF7A00] border-[#FF7A00] text-white shadow-sm scale-105'
                                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                          
                          {!['brand', 'dark-blue', 'black', 'white', 'trans-dark', 'trans-light'].includes(slideBtn1Color) && (
                            <div className="flex gap-2 items-center max-w-sm mt-1.5">
                              <input
                                type="color"
                                value={slideBtn1Color.startsWith('#') ? slideBtn1Color : '#FF7A00'}
                                onChange={(e) => setSlideBtn1Color(e.target.value)}
                                className="h-8 w-10 border border-gray-300 p-0.5 bg-white cursor-pointer"
                              />
                              <input
                                type="text"
                                value={slideBtn1Color}
                                onChange={(e) => setSlideBtn1Color(e.target.value)}
                                placeholder="Ex: #FF7A00"
                                className="w-full border border-gray-300 p-2 text-xs font-mono bg-white focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Button 2 Configuration */}
                      <div className="border-t border-gray-100 pt-3 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">
                            Texto do Botão Secundário (Opcional):
                          </label>
                          <input
                            type="text"
                            value={slideBtn2Text}
                            onChange={(e) => setSlideBtn2Text(e.target.value)}
                            placeholder="Ex: Suporte WhatsApp (Deixe vazio para sem botão)"
                            className="w-full border border-gray-300 p-2 text-xs font-semibold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-gray-400 uppercase tracking-wider mb-1">
                            Link/Ação do Botão Secundário:
                          </label>
                          <input
                            type="text"
                            value={slideBtn2Url}
                            onChange={(e) => setSlideBtn2Url(e.target.value)}
                            placeholder="Ex: https://api.whatsapp.com/send?phone=..."
                            className="w-full border border-gray-300 p-2 text-xs font-mono bg-white focus:outline-none"
                          />
                        </div>

                        {/* Button 2 Color Selector */}
                        <div className="md:col-span-2 bg-gray-50 p-2.5 border border-gray-200">
                          <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
                            🎨 Cor do Botão Secundário:
                          </label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {[
                              { value: 'brand', label: '🟠 Laranja Padrão' },
                              { value: 'dark-blue', label: '🔵 Azul Escuro' },
                              { value: 'black', label: '⚫ Preto' },
                              { value: 'white', label: '⚪ Branco' },
                              { value: 'trans-dark', label: '🕶️ Trans Escuro' },
                              { value: 'trans-light', label: '🧼 Trans Claro' },
                              { value: 'custom', label: '🌈 Cor Personalizada (Hex)' }
                            ].map((opt) => {
                              const isSelected = opt.value === 'custom'
                                ? (!['brand', 'dark-blue', 'black', 'white', 'trans-dark', 'trans-light'].includes(slideBtn2Color))
                                : slideBtn2Color === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    if (opt.value === 'custom') {
                                      setSlideBtn2Color('#ffffff');
                                    } else {
                                      setSlideBtn2Color(opt.value);
                                    }
                                  }}
                                  className={`text-[9px] font-extrabold uppercase px-2.5 py-1.5 transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-gray-800 border-gray-800 text-white shadow-sm scale-105'
                                      : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                          
                          {!['brand', 'dark-blue', 'black', 'white', 'trans-dark', 'trans-light'].includes(slideBtn2Color) && (
                            <div className="flex gap-2 items-center max-w-sm mt-1.5">
                              <input
                                type="color"
                                value={slideBtn2Color.startsWith('#') ? slideBtn2Color : '#ffffff'}
                                onChange={(e) => setSlideBtn2Color(e.target.value)}
                                className="h-8 w-10 border border-gray-300 p-0.5 bg-white cursor-pointer"
                              />
                              <input
                                type="text"
                                value={slideBtn2Color}
                                onChange={(e) => setSlideBtn2Color(e.target.value)}
                                placeholder="Ex: #FFFFFF"
                                className="w-full border border-gray-300 p-2 text-xs font-mono bg-white focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  {editingSlideId && (
                    <button
                      type="button"
                      onClick={handleResetSlideForm}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Descartar Edição
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAddOrUpdateSlide}
                    className="bg-[#002855] hover:bg-[#FF7A00] text-white py-2 px-5 font-black text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    {editingSlideId ? 'Salvar Alterações' : 'Adicionar Slide'}
                  </button>
                </div>
              </div>

              {/* Active Slides Manager List */}
              <div className="mt-4">
                <h3 className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-3">
                  Slides Ativos no Carrossel ({safeHeroSlides.length}):
                </h3>
                <div className="space-y-3">
                  {safeHeroSlides.map((slide, index) => {
                    if (!slide) return null;
                    return (
                      <div key={slide.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-gray-250 shadow-3xs gap-4 text-left">
                        <div className="flex items-center gap-3.5 truncate">
                          <div className="relative">
                            <img
                              src={slide.image || ''}
                              alt="Previsualização do banner"
                              className="w-16 h-10 object-cover border border-gray-300 flex-shrink-0"
                            />
                            <span className="absolute bottom-0 right-0 bg-[#002855] text-white font-black text-[8px] px-1 py-0.2 select-none">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-black text-[11px] text-[#002855] uppercase block leading-snug">
                                Slide de Banner #{index + 1}
                              </span>
                              <span className="text-[8px] bg-gray-100 text-gray-600 font-black px-1.5 py-0.5 uppercase tracking-wider">
                                Foco: {slide.bgPosition === 'top' ? '⬆️ Topo' : slide.bgPosition === 'bottom' ? '⬇️ Base' : slide.bgPosition === 'left' ? '⬅️ Esquerda' : slide.bgPosition === 'right' ? '➡️ Direita' : '🎯 Centro'}
                              </span>
                              <span className="text-[8px] bg-orange-50 text-orange-700 font-black px-1.5 py-0.5 uppercase tracking-wider">
                                Alinhamento: {slide.contentAlign === 'center' ? '↔️ Centro' : slide.contentAlign === 'right' ? '➡️ Direita' : '⬅️ Esquerda'}
                              </span>
                              <span className="text-[8px] bg-blue-50 text-blue-700 font-black px-1.5 py-0.5 uppercase tracking-wider">
                                Tamanho: {slide.btnSize === 'sm' ? '🔎 Pequeno' : slide.btnSize === 'lg' ? '📢 Grande' : '⚖️ Médio'}
                              </span>
                            </div>

                            {(slide.title || slide.subtitle) && (
                              <p className="text-[10px] text-gray-600 leading-tight">
                                {slide.title && <strong className="font-extrabold text-gray-800">"{slide.title}"</strong>}
                                {slide.subtitle && <span className="text-gray-500 font-normal"> — {slide.subtitle}</span>}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-gray-500 uppercase">
                              {slide.btn1Text ? (
                                <span className="text-[#FF7A00]">
                                  Botão 1: "{slide.btn1Text}" ({slide.btn1Color === 'brand' || !slide.btn1Color ? 'Laranja' : slide.btn1Color === 'dark-blue' ? 'Azul' : slide.btn1Color === 'black' ? 'Preto' : slide.btn1Color === 'white' ? 'Branco' : slide.btn1Color === 'trans-dark' ? 'Trans Escuro' : slide.btn1Color === 'trans-light' ? 'Trans Claro' : slide.btn1Color}) ➔ <span className="font-mono lowercase font-normal">{slide.btn1Url}</span>
                                </span>
                              ) : (
                                <span>Link geral: <span className="font-mono lowercase font-normal">{slide.btn1Url}</span></span>
                              )}
                              {slide.btn2Text && (
                                <span className="text-gray-700">
                                  Botão 2: "{slide.btn2Text}" ({slide.btn2Color === 'brand' ? 'Laranja' : slide.btn2Color === 'dark-blue' ? 'Azul' : slide.btn2Color === 'black' ? 'Preto' : slide.btn2Color === 'white' ? 'Branco' : slide.btn2Color === 'trans-dark' ? 'Trans Escuro' : slide.btn2Color === 'trans-light' || !slide.btn2Color ? 'Trans Claro' : slide.btn2Color}) ➔ <span className="font-mono lowercase font-normal">{slide.btn2Url}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action controls */}
                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveSlide(index, 'up')}
                            className={`p-1 border border-gray-250 text-gray-600 rounded-none text-xs transition-colors ${
                              index === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
                            }`}
                            title="Mover acima"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index === safeHeroSlides.length - 1}
                            onClick={() => handleMoveSlide(index, 'down')}
                            className={`p-1 border border-gray-250 text-gray-600 rounded-none text-xs transition-colors ${
                              index === safeHeroSlides.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
                            }`}
                            title="Mover abaixo"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEditSlide(slide)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-orange-50 hover:text-[#FF7A00] border border-gray-250 font-bold text-[9px] uppercase tracking-wider text-gray-700 transition-all cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="px-2.5 py-1 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {safeHeroSlides.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Nenhum slide cadastrado. Adicione um acima para ativar o banner.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Color Attributes Manager */}
          <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-5">
              <Palette className="text-[#FF7A00]" size={18} />
              <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                Gerenciar Paleta Global de Cores
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed">
                Adicione atributos de cores globais com nome e seletor. Elas serão disponibilizadas em tempo real para tags nos produtos e filtros inteligentes no site.
              </p>

              {/* Add New Color Row */}
              <div className="bg-gray-50 border border-gray-200 p-4 flex flex-col sm:flex-row items-center gap-3 text-left">
                <div className="w-full sm:flex-grow">
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                    Nome da Cor
                  </label>
                  <input
                    type="text"
                    value={newManagerColorName}
                    onChange={(e) => setNewManagerColorName(e.target.value)}
                    placeholder="Ex: Azul Petróleo, Vermelho Flame"
                    className="w-full border border-gray-300 p-2.5 text-xs font-bold bg-white focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  />
                </div>

                <div className="shrink-0 w-full sm:w-auto">
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                    Seletor Hexadecimal
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newManagerColorHex}
                      onChange={(e) => setNewManagerColorHex(e.target.value)}
                      className="w-10 h-10 border border-gray-300 cursor-pointer bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={newManagerColorHex}
                      onChange={(e) => setNewManagerColorHex(e.target.value)}
                      className="border border-gray-300 p-2.5 text-xs font-mono font-bold w-24 focus:outline-none focus:ring-1 focus:ring-orange-200 uppercase bg-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nameTrimmed = newManagerColorName.trim();
                    if (!nameTrimmed) {
                      showToast('Digite o nome da cor dantes de cadastrá-la!', 'error');
                      return;
                    }
                    if (masterColors.some(c => c.name.toLowerCase() === nameTrimmed.toLowerCase())) {
                      showToast('Esta cor já existe na listagem global!', 'warn');
                      return;
                    }
                    const newColor: Color = { name: nameTrimmed, hex: newManagerColorHex };
                    onUpdateMasterColors([...masterColors, newColor]);
                    setNewManagerColorName('');
                    showToast(`Especificação "${nameTrimmed}" adicionada à paleta global!`, 'success');
                  }}
                  className="bg-[#002855] hover:bg-[#FF7A00] text-white py-3 px-5 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto h-auto sm:self-end"
                >
                  Adicionar Cor
                </button>
              </div>

              {/* Master Colors List Grid */}
              <div className="text-left">
                <h3 className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-3">
                  Atributos Ativos na Paleta ({masterColors.length}):
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {masterColors.map((color) => (
                    <div
                      key={color.name}
                      className="flex items-center justify-between p-2.5 bg-white border border-gray-200 shadow-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-5 h-5 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: color.hex }} />
                        <div className="truncate">
                          <span className="text-[11px] font-black text-gray-800 uppercase block truncate leading-tight">
                            {color.name}
                          </span>
                          <span className="text-[9px] font-mono text-gray-450 font-bold uppercase leading-none block mt-0.5">
                            {color.hex}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateMasterColors(masterColors.filter(c => c.name !== color.name));
                          showToast(`Especificação "${color.name}" removida com sucesso.`, 'info');
                        }}
                        className="text-gray-400 hover:text-red-500 font-bold p-1 text-xs shrink-0 transition-colors cursor-pointer"
                        title="Remover cor da paleta"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  {masterColors.length === 0 && (
                    <p className="text-xs text-gray-400 italic font-medium col-span-3">Nenhuma cor cadastrada. Paleta vazia.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: Benefits Indicators (Selos de Confiança) */}
          <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-5 text-left">
              <Sliders className="text-[#FF7A00]" size={18} />
              <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                Gerenciar Selos de Confiança (Benefícios)
              </h2>
            </div>

            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed text-left mb-6">
              Edite as 4 colunas de informações que aparecem no rodapé/meio do site (Ex: Entrega Rápida, Checkout Seguro).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {(storefrontSettings?.benefits || [
                { id: 'benefit_1', icon: 'Truck', title: 'Entrega Rápida', desc: 'Envio expresso para todo o Brasil. Frete grátis compras acima de R$199.' },
                { id: 'benefit_2', icon: 'RefreshCw', title: 'Troca Sem Complicações', desc: 'Até 7 dias úteis para realizar devoluções ou troca gratuita do tamanho.' },
                { id: 'benefit_3', icon: 'ShieldCheck', title: 'Checkout Seguro', desc: 'Pague via Pix ou em até 12x no cartão com tecnologia antifraude SSL.' },
                { id: 'benefit_4', icon: 'MessageCircle', title: 'Suporte WhatsApp', desc: 'Atendimento amigável via chat oficial para tirar dúvidas sobre medidas.' }
              ]).map((b, idx) => (
                <div key={b.id || idx} className="bg-white border border-gray-200 p-4 space-y-3 shadow-sm">
                  <span className="block text-[10px] font-black uppercase text-[#FF7A00] tracking-widest border-b border-gray-200 pb-1.5">
                    Selo {idx + 1}
                  </span>

                  <div>
                    <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                      Ícone do Selo
                    </label>
                    <select
                      value={b.icon || 'Truck'}
                      onChange={(e) => {
                        const updatedBenefits = [...(storefrontSettings?.benefits || [
                          { id: 'benefit_1', icon: 'Truck', title: 'Entrega Rápida', desc: 'Envio expresso para todo o Brasil. Frete grátis compras acima de R$199.' },
                          { id: 'benefit_2', icon: 'RefreshCw', title: 'Troca Sem Complicações', desc: 'Até 7 dias úteis para realizar devoluções ou troca gratuita do tamanho.' },
                          { id: 'benefit_3', icon: 'ShieldCheck', title: 'Checkout Seguro', desc: 'Pague via Pix ou em até 12x no cartão com tecnologia antifraude SSL.' },
                          { id: 'benefit_4', icon: 'MessageCircle', title: 'Suporte WhatsApp', desc: 'Atendimento amigável via chat oficial para tirar dúvidas sobre medidas.' }
                        ])];
                        if (updatedBenefits[idx]) {
                          updatedBenefits[idx] = { ...updatedBenefits[idx], icon: e.target.value };
                          onUpdateStorefrontSettings({ ...storefrontSettings, benefits: updatedBenefits });
                        }
                      }}
                      className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 cursor-pointer"
                    >
                      <option value="Truck">🚚 Caminhão (Entrega)</option>
                      <option value="RefreshCw">🔄 Setas (Troca/Devolução)</option>
                      <option value="ShieldCheck">🛡️ Escudo (Segurança)</option>
                      <option value="MessageCircle">💬 Balão (Suporte/WhatsApp)</option>
                      <option value="Flame">🔥 Fogo (Lançamentos/Ofertas)</option>
                      <option value="Sparkles">✨ Estrelas (Novidades)</option>
                      <option value="Heart">❤️ Coração (Favoritos)</option>
                      <option value="Star">⭐ Estrela (Destaques)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                      Título do Selo
                    </label>
                    <input
                      type="text"
                      value={b.title || ''}
                      onChange={(e) => {
                        const updatedBenefits = [...(storefrontSettings?.benefits || [
                          { id: 'benefit_1', icon: 'Truck', title: 'Entrega Rápida', desc: 'Envio expresso para todo o Brasil. Frete grátis compras acima de R$199.' },
                          { id: 'benefit_2', icon: 'RefreshCw', title: 'Troca Sem Complicações', desc: 'Até 7 dias úteis para realizar devoluções ou troca gratuita do tamanho.' },
                          { id: 'benefit_3', icon: 'ShieldCheck', title: 'Checkout Seguro', desc: 'Pague via Pix ou em até 12x no cartão com tecnologia antifraude SSL.' },
                          { id: 'benefit_4', icon: 'MessageCircle', title: 'Suporte WhatsApp', desc: 'Atendimento amigável via chat oficial para tirar dúvidas sobre medidas.' }
                        ])];
                        if (updatedBenefits[idx]) {
                          updatedBenefits[idx] = { ...updatedBenefits[idx], title: e.target.value };
                          onUpdateStorefrontSettings({ ...storefrontSettings, benefits: updatedBenefits });
                        }
                      }}
                      placeholder="Título do benefício"
                      className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                      Descrição do Selo
                    </label>
                    <textarea
                      value={b.desc || ''}
                      onChange={(e) => {
                        const updatedBenefits = [...(storefrontSettings?.benefits || [
                          { id: 'benefit_1', icon: 'Truck', title: 'Entrega Rápida', desc: 'Envio expresso para todo o Brasil. Frete grátis compras acima de R$199.' },
                          { id: 'benefit_2', icon: 'RefreshCw', title: 'Troca Sem Complicações', desc: 'Até 7 dias úteis para realizar devoluções ou troca gratuita do tamanho.' },
                          { id: 'benefit_3', icon: 'ShieldCheck', title: 'Checkout Seguro', desc: 'Pague via Pix ou em até 12x no cartão com tecnologia antifraude SSL.' },
                          { id: 'benefit_4', icon: 'MessageCircle', title: 'Suporte WhatsApp', desc: 'Atendimento amigável via chat oficial para tirar dúvidas sobre medidas.' }
                        ])];
                        if (updatedBenefits[idx]) {
                          updatedBenefits[idx] = { ...updatedBenefits[idx], desc: e.target.value };
                          onUpdateStorefrontSettings({ ...storefrontSettings, benefits: updatedBenefits });
                        }
                      }}
                      placeholder="Descrição resumida do benefício..."
                      rows={2}
                      className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Selos de confiança salvos e publicados!', 'success')}
                className="bg-[#002855] hover:bg-[#FF7A00] text-white py-2.5 px-6 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto"
              >
                Salvar Selos de Confiança
              </button>
            </div>
          </div>

          {/* Section: Midpage Promotional Banners */}
          <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-150 pb-4 mb-5 text-left">
              <Sliders className="text-[#FF7A00]" size={18} />
              <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                Gerenciar Banners Promocionais do Meio
              </h2>
            </div>

            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider leading-relaxed text-left mb-6">
              Personalize o título, a descrição, as cores e os links dos dois banners promocionais dispostos lado a lado.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
              {/* Promo Left Banner Editor */}
              {(() => {
                const pLeft = storefrontSettings?.promoLeft || {
                  tag: 'Exclusivo Inverno',
                  title: 'Moletons Premium Peluciados',
                  subtitle: 'Estilo europeu com costuras triplas e conforto total para brincadeiras ao ar livre.',
                  btnText: 'Ver Moletons',
                  linkUrl: 'moletons',
                  icon: '🧥',
                  bgColorFrom: '#002855',
                  bgColorTo: '#003D80'
                };
                return (
                  <div className="bg-white border border-gray-200 p-4 space-y-3 shadow-sm">
                    <span className="block text-[10px] font-black uppercase text-[#002855] tracking-widest border-b border-gray-200 pb-1.5 flex items-center gap-1.5">
                      🎨 Banner Esquerdo (Ex: Exclusivo Inverno)
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Mini Tag (Texto do Topo)
                        </label>
                        <input
                          type="text"
                          value={pLeft.tag || ''}
                          onChange={(e) => onUpdateStorefrontSettings({
                            ...storefrontSettings,
                            promoLeft: { ...pLeft, tag: e.target.value }
                          })}
                          placeholder="Exclusivo Inverno"
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Emoji / Ícone de Fundo
                        </label>
                        <input
                          type="text"
                          value={pLeft.icon || ''}
                          onChange={(e) => onUpdateStorefrontSettings({
                            ...storefrontSettings,
                            promoLeft: { ...pLeft, icon: e.target.value }
                          })}
                          placeholder="🧥"
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white text-center focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                        Título Principal do Banner
                      </label>
                      <input
                        type="text"
                        value={pLeft.title || ''}
                        onChange={(e) => onUpdateStorefrontSettings({
                          ...storefrontSettings,
                          promoLeft: { ...pLeft, title: e.target.value }
                        })}
                        placeholder="Título do Banner"
                        className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                        Subtítulo / Descrição
                      </label>
                      <textarea
                        value={pLeft.subtitle || ''}
                        onChange={(e) => onUpdateStorefrontSettings({
                          ...storefrontSettings,
                          promoLeft: { ...pLeft, subtitle: e.target.value }
                        })}
                        placeholder="Estilo europeu com conforto..."
                        rows={2}
                        className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none resize-none focus:ring-1 focus:ring-orange-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Texto do Botão (CTA)
                        </label>
                        <input
                          type="text"
                          value={pLeft.btnText || ''}
                          onChange={(e) => onUpdateStorefrontSettings({
                            ...storefrontSettings,
                            promoLeft: { ...pLeft, btnText: e.target.value }
                          })}
                          placeholder="Ver Moletons"
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Link Destino (Categoria ou URL)
                        </label>
                        <select
                          value={['moletons', 'camisetas', 'conjuntos', 'calcas', 'bermudas', 'lancamentos', 'promocoes'].includes(pLeft.linkUrl || '') ? pLeft.linkUrl : 'custom'}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoLeft: { ...pLeft, linkUrl: val === 'custom' ? '' : val }
                            });
                          }}
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 mb-1.5"
                        >
                          <option value="moletons">🧥 Moletons</option>
                          <option value="camisetas">👕 Camisetas</option>
                          <option value="conjuntos">🎽 Conjuntos</option>
                          <option value="calcas">👖 Calças</option>
                          <option value="bermudas">🩳 Bermudas</option>
                          <option value="lancamentos">✨ Lançamentos</option>
                          <option value="promocoes">🏷️ Promoções</option>
                          <option value="custom">🔗 URL / Link Personalizado</option>
                        </select>
                        {(!['moletons', 'camisetas', 'conjuntos', 'calcas', 'bermudas', 'lancamentos', 'promocoes'].includes(pLeft.linkUrl || '')) && (
                          <input
                            type="text"
                            value={pLeft.linkUrl || ''}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoLeft: { ...pLeft, linkUrl: e.target.value }
                            })}
                            placeholder="Ex: about ou https://..."
                            className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Cor de Início do Degradê
                        </label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={pLeft.bgColorFrom || '#002855'}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoLeft: { ...pLeft, bgColorFrom: e.target.value }
                            })}
                            className="w-8 h-8 border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pLeft.bgColorFrom || ''}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoLeft: { ...pLeft, bgColorFrom: e.target.value }
                            })}
                            placeholder="#002855"
                            className="w-full border border-gray-300 p-1.5 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Cor do Fim do Degradê
                        </label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={pLeft.bgColorTo || '#003D80'}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoLeft: { ...pLeft, bgColorTo: e.target.value }
                            })}
                            className="w-8 h-8 border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pLeft.bgColorTo || ''}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoLeft: { ...pLeft, bgColorTo: e.target.value }
                            })}
                            placeholder="#003D80"
                            className="w-full border border-gray-300 p-1.5 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Promo Right Banner Editor */}
              {(() => {
                const pRight = storefrontSettings?.promoRight || {
                  tag: 'Queima de Estoque',
                  title: 'Coleção Outono Até 40% OFF',
                  subtitle: 'As melhores camisetas de algodão egípcio e calças jogger com preços insuperáveis!',
                  btnText: 'Aproveitar Ofertas',
                  linkUrl: 'promocoes',
                  icon: '🏷️',
                  bgColorFrom: '#fb923c',
                  bgColorTo: '#FF7A00'
                };
                return (
                  <div className="bg-white border border-gray-200 p-4 space-y-3 shadow-sm">
                    <span className="block text-[10px] font-black uppercase text-[#FF7A00] tracking-widest border-b border-gray-200 pb-1.5 flex items-center gap-1.5">
                      🏷️ Banner Direito (Ex: Queima de Estoque)
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Mini Tag (Texto do Topo)
                        </label>
                        <input
                          type="text"
                          value={pRight.tag || ''}
                          onChange={(e) => onUpdateStorefrontSettings({
                            ...storefrontSettings,
                            promoRight: { ...pRight, tag: e.target.value }
                          })}
                          placeholder="Queima de Estoque"
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Emoji / Ícone de Fundo
                        </label>
                        <input
                          type="text"
                          value={pRight.icon || ''}
                          onChange={(e) => onUpdateStorefrontSettings({
                            ...storefrontSettings,
                            promoRight: { ...pRight, icon: e.target.value }
                          })}
                          placeholder="🏷️"
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white text-center focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                        Título Principal do Banner
                      </label>
                      <input
                        type="text"
                        value={pRight.title || ''}
                        onChange={(e) => onUpdateStorefrontSettings({
                          ...storefrontSettings,
                          promoRight: { ...pRight, title: e.target.value }
                        })}
                        placeholder="Título do Banner"
                        className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                        Subtítulo / Descrição
                      </label>
                      <textarea
                        value={pRight.subtitle || ''}
                        onChange={(e) => onUpdateStorefrontSettings({
                          ...storefrontSettings,
                          promoRight: { ...pRight, subtitle: e.target.value }
                        })}
                        placeholder="Preços insuperáveis..."
                        rows={2}
                        className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none resize-none focus:ring-1 focus:ring-orange-200"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Texto do Botão (CTA)
                        </label>
                        <input
                          type="text"
                          value={pRight.btnText || ''}
                          onChange={(e) => onUpdateStorefrontSettings({
                            ...storefrontSettings,
                            promoRight: { ...pRight, btnText: e.target.value }
                          })}
                          placeholder="Aproveitar Ofertas"
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Link Destino (Categoria ou URL)
                        </label>
                        <select
                          value={['moletons', 'camisetas', 'conjuntos', 'calcas', 'bermudas', 'lancamentos', 'promocoes'].includes(pRight.linkUrl || '') ? pRight.linkUrl : 'custom'}
                          onChange={(e) => {
                            const val = e.target.value;
                            onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoRight: { ...pRight, linkUrl: val === 'custom' ? '' : val }
                            });
                          }}
                          className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200 mb-1.5"
                        >
                          <option value="moletons">🧥 Moletons</option>
                          <option value="camisetas">👕 Camisetas</option>
                          <option value="conjuntos">🎽 Conjuntos</option>
                          <option value="calcas">👖 Calças</option>
                          <option value="bermudas">🩳 Bermudas</option>
                          <option value="lancamentos">✨ Lançamentos</option>
                          <option value="promocoes">🏷️ Promoções</option>
                          <option value="custom">🔗 URL / Link Personalizado</option>
                        </select>
                        {(!['moletons', 'camisetas', 'conjuntos', 'calcas', 'bermudas', 'lancamentos', 'promocoes'].includes(pRight.linkUrl || '')) && (
                          <input
                            type="text"
                            value={pRight.linkUrl || ''}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoRight: { ...pRight, linkUrl: e.target.value }
                            })}
                            placeholder="Ex: promocoes ou https://..."
                            className="w-full border border-gray-300 p-2 text-xs font-bold bg-white focus:outline-none focus:ring-1 focus:ring-orange-200"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Cor de Início do Degradê
                        </label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={pRight.bgColorFrom || '#fb923c'}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoRight: { ...pRight, bgColorFrom: e.target.value }
                            })}
                            className="w-8 h-8 border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pRight.bgColorFrom || ''}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoRight: { ...pRight, bgColorFrom: e.target.value }
                            })}
                            placeholder="#fb923c"
                            className="w-full border border-gray-300 p-1.5 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                          Cor do Fim do Degradê
                        </label>
                        <div className="flex gap-1.5 items-center">
                          <input
                            type="color"
                            value={pRight.bgColorTo || '#FF7A00'}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoRight: { ...pRight, bgColorTo: e.target.value }
                            })}
                            className="w-8 h-8 border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={pRight.bgColorTo || ''}
                            onChange={(e) => onUpdateStorefrontSettings({
                              ...storefrontSettings,
                              promoRight: { ...pRight, bgColorTo: e.target.value }
                            })}
                            placeholder="#FF7A00"
                            className="w-full border border-gray-300 p-1.5 text-xs font-mono font-bold uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => showToast('Banners do meio salvos e publicados!', 'success')}
                className="bg-[#002855] hover:bg-[#FF7A00] text-white py-2.5 px-6 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto"
              >
                Salvar Banners Promocionais
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Area: Stock Management */}
      {activeTab === 'stock' && (
        <div className="bg-white border border-gray-150 p-4 md:p-6 shadow-sm">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Layers className="text-[#FF7A00]" size={18} />
              <div>
                <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                  Gerenciador de Estoque Detalhado
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                  Controle de peças por tamanho individual
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('add')}
              className="bg-[#002855] hover:bg-[#FF7A00] text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:shadow-md self-start sm:self-auto"
            >
              ➕ Cadastrar Modelo de Roupa
            </button>
          </div>

          {/* Quick Metrics Cards */}
          {(() => {
            const totalPieces = products.reduce((acc, p) => {
              let prodTotal = 0;
              p.sizes.forEach((s) => {
                prodTotal += p.sizesStock?.[s] !== undefined ? p.sizesStock[s] : (p.inStock ? 12 : 0);
              });
              return acc + prodTotal;
            }, 0);

            const catMetrics: Record<string, { total: number; sizes: Record<number, number>; name: string; emoji: string }> = {
              moletons: { total: 0, sizes: { 2:0, 4:0, 6:0, 8:0, 10:0, 12:0, 14:0, 16:0 }, name: "Moletons", emoji: "🧥" },
              camisetas: { total: 0, sizes: { 2:0, 4:0, 6:0, 8:0, 10:0, 12:0, 14:0, 16:0 }, name: "Camisetas", emoji: "👕" },
              conjuntos: { total: 0, sizes: { 2:0, 4:0, 6:0, 8:0, 10:0, 12:0, 14:0, 16:0 }, name: "Conjuntos", emoji: "🎽" },
              calcas: { total: 0, sizes: { 2:0, 4:0, 6:0, 8:0, 10:0, 12:0, 14:0, 16:0 }, name: "Calças", emoji: "👖" },
              bermudas: { total: 0, sizes: { 2:0, 4:0, 6:0, 8:0, 10:0, 12:0, 14:0, 16:0 }, name: "Bermudas", emoji: "🩳" },
            };

            products.forEach((p) => {
              const cat = p.category || 'moletons';
              if (!catMetrics[cat]) {
                catMetrics[cat] = { total: 0, sizes: { 2:0, 4:0, 6:0, 8:0, 10:0, 12:0, 14:0, 16:0 }, name: cat.charAt(0).toUpperCase() + cat.slice(1), emoji: "📦" };
              }
              p.sizes.forEach((s) => {
                const stock = p.sizesStock?.[s] !== undefined ? p.sizesStock[s] : (p.inStock ? 12 : 0);
                catMetrics[cat].total += stock;
                catMetrics[cat].sizes[s] = (catMetrics[cat].sizes[s] || 0) + stock;
              });
            });

            return (
              <div className="space-y-6 mb-8">
                {/* Total Stock Indicator */}
                <div className="bg-slate-50 border border-gray-150 p-5 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Unidades Totais em Estoque</span>
                    <h3 className="text-2xl md:text-3xl font-black text-[#002855] mt-1">{totalPieces} <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">peças no total</span></h3>
                  </div>
                  <div className="p-3.5 bg-white border border-gray-150 text-[#FF7A00] font-black text-lg">
                    📦
                  </div>
                </div>

                {/* Categories Breakdown */}
                <div>
                  <h4 className="text-xs font-black uppercase text-[#002855] tracking-widest mb-3 flex items-center gap-1.5">
                    <span>📊</span> Quantidade por Categoria & Grade Detalhada
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {Object.entries(catMetrics).map(([key, data]) => (
                      <div key={key} className="bg-white border border-gray-150 p-4 flex flex-col justify-between hover:border-gray-300 transition-all shadow-xs">
                        <div>
                          {/* Category Header */}
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                            <span className="text-xs font-black text-[#002855] uppercase tracking-wider flex items-center gap-1">
                              <span>{data.emoji}</span> {data.name}
                            </span>
                            <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-none font-mono">
                              {data.total} un.
                            </span>
                          </div>

                          {/* Sizes Detailed Breakdown */}
                          <div className="grid grid-cols-4 gap-1.5">
                            {availableSizes.map((sz) => {
                              const szStock = data.sizes[sz] || 0;
                              return (
                                <div
                                  key={sz}
                                  className={`p-1 border text-center flex flex-col justify-center rounded-none ${
                                    szStock <= 0
                                      ? 'border-red-100 bg-red-50/10 text-red-500/85'
                                      : szStock <= 15
                                      ? 'border-amber-150 bg-amber-50/10 text-amber-600'
                                      : 'border-gray-150 bg-gray-50/30 text-gray-700'
                                  }`}
                                  title={`Tamanho ${sz}: ${szStock} unidades em estoque nesta categoria`}
                                >
                                  <span className="text-[8px] font-black text-gray-400 leading-none">TAM {sz}</span>
                                  <span className="text-[10px] font-black mt-0.5 leading-none">{szStock}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center bg-gray-50/50 p-3 border border-gray-150">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Filtrar look no estoque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-300 p-2 text-xs focus:ring-1 focus:ring-orange-200 focus:outline-none focus:border-orange-300 rounded-none placeholder-gray-400 font-bold"
              />
              <Search className="absolute right-3 top-3 text-gray-400" size={12} />
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-white border border-gray-300 p-2 text-xs text-gray-700 font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none focus:border-orange-300 rounded-none cursor-pointer"
              >
                <option value="all">📁 Todas as Categorias</option>
                <option value="moletons">🧥 Moletons</option>
                <option value="camisetas">👕 Camisetas</option>
                <option value="conjuntos">🎽 Conjuntos</option>
                <option value="calcas">👖 Calças</option>
                <option value="bermudas">🩳 Bermudas</option>
              </select>
            </div>

            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest sm:ml-auto">
              Exibindo {filteredProductsBySearch.length} looks
            </div>
          </div>

          {/* Stock Table */}
          <div className="border border-gray-200 overflow-x-auto bg-white">
            {filteredProductsBySearch.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xs font-black text-gray-400 uppercase">Nenhum look localizado</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-[9px] font-black text-[#002855] uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-16">Preview</th>
                    <th className="py-2.5 px-3">Look / ID</th>
                    <th className="py-2.5 px-3 w-28">Status Catálogo</th>
                    <th className="py-2.5 px-3">Quantidade por Tamanho (Grade)</th>
                    <th className="py-2.5 px-3 w-40 text-right">Ações Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150">
                  {filteredProductsBySearch.map((product) => {
                    // Calculate total stock of this look
                    let totalLookStock = 0;
                    product.sizes.forEach((s) => {
                      totalLookStock += product.sizesStock?.[s] !== undefined ? product.sizesStock[s] : (product.inStock ? 12 : 0);
                    });

                    return (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors text-xs font-medium text-gray-800">
                        <td className="py-3 px-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-13 object-cover border border-gray-200"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-extrabold text-gray-900 leading-tight">{product.name}</div>
                          <div className="text-[9px] font-mono text-gray-400 mt-1 flex items-center gap-1.5">
                            <span className="bg-gray-100 text-[#002855] px-1 font-bold">{product.id}</span>
                            <span>•</span>
                            <span className="uppercase">{product.category}</span>
                            <span>•</span>
                            <span className="text-gray-600 font-bold">R$ {(product.promoPrice || product.originalPrice).toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => {
                                const updated = { ...product, inStock: !product.inStock };
                                onUpdateProduct(updated);
                                showToast(`Look "${product.name}" alterado para ${!product.inStock ? 'DISPONÍVEL' : 'ESGOTADO'}!`, 'info');
                              }}
                              className={`py-1 px-2 text-[9px] font-black uppercase tracking-widest text-center cursor-pointer border ${
                                product.inStock
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                              }`}
                            >
                              {product.inStock ? '● Disponível' : '○ Esgotado'}
                            </button>
                            <span className="text-[8px] font-bold text-gray-400 uppercase text-center">
                              Total: {totalLookStock} pçs
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-2 items-center">
                            {product.sizes.map((sz) => {
                              const szStock = product.sizesStock?.[sz] !== undefined ? product.sizesStock[sz] : (product.inStock ? 12 : 0);
                              
                              const handleStockChange = (newVal: number) => {
                                const finalVal = Math.max(0, newVal);
                                const updatedStock = product.sizesStock ? { ...product.sizesStock } : {};
                                
                                // Initialize any missing size fallbacks
                                product.sizes.forEach((s) => {
                                  if (updatedStock[s] === undefined) {
                                    updatedStock[s] = product.inStock ? 12 : 0;
                                  }
                                });

                                updatedStock[sz] = finalVal;
                                
                                // Calculate total stock of this look
                                const total = Object.values(updatedStock).reduce((sum, val) => sum + val, 0);

                                const updated = {
                                  ...product,
                                  sizesStock: updatedStock,
                                  inStock: total > 0 ? product.inStock : false
                                };
                                onUpdateProduct(updated);
                              };

                              return (
                                <div
                                  key={sz}
                                  className={`flex flex-col items-center border p-1 min-w-[54px] bg-white ${
                                    szStock <= 0
                                      ? 'border-red-150 bg-red-50/20'
                                      : szStock <= 3
                                      ? 'border-amber-200 bg-amber-50/20 shadow-xs'
                                      : 'border-gray-200'
                                  }`}
                                >
                                  <span className="text-[9px] font-black text-[#002855] mb-1">TAM {sz}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStockChange(szStock - 1)}
                                      className="w-4 h-4 bg-gray-100 hover:bg-gray-200 text-[10px] font-black text-gray-600 flex items-center justify-center cursor-pointer select-none"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      min="0"
                                      value={szStock}
                                      onChange={(e) => {
                                        const parsed = parseInt(e.target.value);
                                        handleStockChange(isNaN(parsed) ? 0 : parsed);
                                      }}
                                      className="w-8 text-center text-[10px] font-black bg-transparent border-0 focus:outline-none p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleStockChange(szStock + 1)}
                                      className="w-4 h-4 bg-gray-100 hover:bg-gray-200 text-[10px] font-black text-gray-600 flex items-center justify-center cursor-pointer select-none"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex flex-col sm:flex-row gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedStock = product.sizesStock ? { ...product.sizesStock } : {};
                                product.sizes.forEach((s) => {
                                  const current = updatedStock[s] !== undefined ? updatedStock[s] : (product.inStock ? 12 : 0);
                                  updatedStock[s] = current + 10;
                                });
                                onUpdateProduct({
                                  ...product,
                                  sizesStock: updatedStock,
                                  inStock: true
                                });
                                showToast(`Adicionado +10 un. em todas as grades de "${product.name}"!`, 'success');
                              }}
                              className="text-[8px] font-extrabold uppercase bg-orange-50 text-[#FF7A00] border border-orange-200 hover:bg-orange-100 py-1 px-2 cursor-pointer transition-colors"
                            >
                              +10 Geral
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedStock = product.sizesStock ? { ...product.sizesStock } : {};
                                product.sizes.forEach((s) => {
                                  updatedStock[s] = 15;
                                });
                                onUpdateProduct({
                                  ...product,
                                  sizesStock: updatedStock,
                                  inStock: true
                                });
                                showToast(`Estoque de todas as grades de "${product.name}" redefinido para 15 un.!`, 'success');
                              }}
                              className="text-[8px] font-extrabold uppercase bg-blue-50 text-[#002855] border border-blue-200 hover:bg-blue-100 py-1 px-2 cursor-pointer transition-colors"
                            >
                              Definir 15
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedStock = product.sizesStock ? { ...product.sizesStock } : {};
                                product.sizes.forEach((s) => {
                                  updatedStock[s] = 0;
                                });
                                onUpdateProduct({
                                  ...product,
                                  sizesStock: updatedStock,
                                  inStock: false
                                });
                                showToast(`Estoque de "${product.name}" foi zerado!`, 'warn');
                              }}
                              className="text-[8px] font-extrabold uppercase bg-red-50 text-red-600 border border-red-150 hover:bg-red-100 py-1 px-2 cursor-pointer transition-colors"
                            >
                              Zerar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab Area 4: Client Reviews Management */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-gray-150 p-6 md:p-8 max-w-4xl mx-auto shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Sliders className="text-[#FF7A00]" size={18} />
              <h2 className="text-sm font-black text-[#002855] uppercase tracking-wider">
                Gerenciar Avaliações dos Clientes
              </h2>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Total: {testimonials.length} depoimentos
            </p>
          </div>

          {/* Search bar inside Reviews Tab */}
          <div className="mb-6 flex gap-2">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search size={14} />
              </span>
              <input
                type="text"
                placeholder="Buscar por nome ou cidade do cliente..."
                id="reviewSearchInput"
                className="w-full bg-gray-50 border border-gray-200 text-xs px-9 py-2.5 rounded-none focus:outline-none focus:border-[#002855] transition-colors font-semibold"
                onChange={(e) => {
                  const query = e.target.value.toLowerCase();
                  const rows = document.querySelectorAll('.review-row');
                  rows.forEach((row) => {
                    const author = row.getAttribute('data-author')?.toLowerCase() || '';
                    const location = row.getAttribute('data-location')?.toLowerCase() || '';
                    if (author.includes(query) || location.includes(query)) {
                      (row as HTMLElement).style.display = '';
                    } else {
                      (row as HTMLElement).style.display = 'none';
                    }
                  });
                }}
              />
            </div>
          </div>

          <div className="border border-gray-150 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-150 text-[10px] font-black uppercase text-gray-400 tracking-wider">
                    <th className="p-4">Cliente / Origem</th>
                    <th className="p-4">Nota</th>
                    <th className="p-4">Data</th>
                    <th className="p-4">Depoimento</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {testimonials.map((review) => (
                    <tr 
                      key={review.id} 
                      className="review-row hover:bg-gray-50 transition-colors text-xs"
                      data-author={review.author}
                      data-location={review.location}
                    >
                      <td className="p-4 font-bold text-gray-900 min-w-[150px]">
                        <div>{review.author}</div>
                        <span className="text-[10px] text-gray-400 font-semibold">{review.location}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex text-amber-400 gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 font-medium shrink-0 min-w-[90px]">{review.date}</td>
                      <td className="p-4 text-gray-600 max-w-sm italic leading-relaxed">
                        "{review.comment}"
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => setReviewToDelete(review)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider"
                          title="Excluir Depoimento"
                        >
                          <Trash2 size={13} /> Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                  {testimonials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 italic font-medium">
                        Nenhum depoimento cadastrado ou correspondente na busca.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {productToEdit && (
        <div className="fixed inset-0 bg-[#002855]/70 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border-2 border-[#FF7A00] max-w-2xl w-full p-6 md:p-8 relative shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto rounded-none">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-150 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Sliders className="text-[#FF7A00]" size={18} />
                <h2 className="text-base font-black text-[#002855] uppercase tracking-wider">
                  Editar Produto do Catálogo
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setProductToEdit(null)}
                className="text-gray-400 hover:text-red-500 font-extrabold p-1.5 transition-colors cursor-pointer text-base"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-5 text-left">
              {/* Title & Category row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                    Título do Look: *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                    Categoria: *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="moletons">🧥 Moletons & Agasalhos</option>
                    <option value="camisetas">👕 Camisetas Nobres</option>
                    <option value="conjuntos">🎽 Conjuntos Completos</option>
                    <option value="calcas">👖 Calças de Algodão</option>
                    <option value="bermudas">🩳 Shorts & Bermudas</option>
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                  Descrição do Look:
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                />
              </div>

              {/* Prices & Product Flags */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                    Preço de Tabela: *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editOriginalPrice}
                    onChange={(e) => setEditOriginalPrice(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                    Preço Promo:
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editPromoPrice}
                    onChange={(e) => setEditPromoPrice(e.target.value)}
                    className="w-full border border-gray-300 p-2.5 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                    Lançamento / Novo:
                  </label>
                  <div className="flex gap-3 p-2 bg-gray-50 border border-gray-300 justify-around">
                    <label className="flex items-center gap-1 text-[11px] text-gray-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={editIsNew}
                        onChange={() => setEditIsNew(true)}
                        className="cursor-pointer"
                      /> Sim
                    </label>
                    <label className="flex items-center gap-1 text-[11px] text-gray-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={!editIsNew}
                        onChange={() => setEditIsNew(false)}
                        className="cursor-pointer"
                      /> Não
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                    Em Estoque:
                  </label>
                  <div className="flex gap-3 p-2 bg-gray-50 border border-gray-300 justify-around">
                    <label className="flex items-center gap-1 text-[11px] text-gray-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={editInStock}
                        onChange={() => setEditInStock(true)}
                        className="cursor-pointer"
                      /> Sim
                    </label>
                    <label className="flex items-center gap-1 text-[11px] text-gray-700 cursor-pointer select-none">
                      <input
                        type="radio"
                        checked={!editInStock}
                        onChange={() => setEditInStock(false)}
                        className="cursor-pointer"
                      /> Não
                    </label>
                  </div>
                </div>
              </div>

              {/* Status Toggle Switch */}
              <div className="p-3 bg-orange-50/20 border border-orange-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black text-[#002855] uppercase tracking-wider block">
                    Visibilidade na Loja Pública
                  </span>
                  <p className="text-[9px] text-[#FF7A00] font-bold uppercase tracking-wider mt-0.5">
                    Modifique a exibição de Rascunho para Ativo em tempo real.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-black uppercase ${editIsActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {editIsActive ? 'ATIVO (Loja)' : 'RASCUNHO (Oculto)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditIsActive(prev => !prev)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      editIsActive ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                        editIsActive ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Sizes checklist */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1.2">
                  Tamanhos Disponíveis:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((sz) => {
                    const isChecked = editSelectedSizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          setEditSelectedSizes(prev =>
                            prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
                          );
                        }}
                        className={`w-8 h-8 text-[11px] font-black select-none transition-all flex items-center justify-center border ${
                          isChecked
                            ? 'bg-[#FF7A00] text-white border-[#FF7A00]'
                            : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color specification checkbox list */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1.5">
                  Selecionar Cores do Look (Atributos Globais):
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-200">
                  {masterColors.map((color) => {
                    const isChecked = editColorsList.some((c) => c.name === color.name);
                    return (
                      <label key={color.name} className="flex items-center gap-2 px-2 py-1.5 bg-white border border-gray-200 hover:border-orange-200 cursor-pointer transition-colors shadow-xs select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setEditColorsList((prev) => prev.filter((c) => c.name !== color.name));
                            } else {
                              setEditColorsList((prev) => [...prev, color]);
                            }
                          }}
                          className="w-3.5 h-3.5 cursor-pointer accent-[#FF7A00]"
                        />
                        <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: color.hex }} />
                        <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight truncate" title={color.name}>
                          {color.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-1 items-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Selecionadas:</span>
                  {editColorsList.map((c) => (
                    <span key={c.name} className="inline-flex items-center gap-1.5 text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 text-gray-800 font-bold">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </span>
                  ))}
                  {editColorsList.length === 0 && (
                    <span className="text-[10px] text-gray-400 italic">Nenhuma selecionada.</span>
                  )}
                </div>
              </div>

              {/* Mapped Images URLs */}
              <div>
                <label className="block text-[9px] font-black uppercase text-[#002855] tracking-widest mb-1">
                  URLs das Fotos do Look: *
                </label>
                <div className="mb-2 max-h-[100px] overflow-y-auto border border-gray-250 p-2 bg-gray-50/50 space-y-1">
                  {editUploadedImages.map((img, idx) => (
                    <div key={idx} className="flex gap-2 bg-white border border-gray-200 p-1 items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img src={img} className="w-5 h-6 object-cover bg-gray-100 flex-shrink-0" referrerPolicy="no-referrer" />
                        <span className="truncate text-gray-500">{img}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-500 hover:text-red-700 font-black p-1"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  {editUploadedImages.length === 0 && (
                    <span className="text-xs text-gray-400 block text-center p-2">Nenhuma foto adicionada.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editImageUrlInput}
                    onChange={(e) => setEditImageUrlInput(e.target.value)}
                    placeholder="Cole Nova URL da Imagem"
                    className="flex-grow border border-gray-300 p-2 text-xs font-bold focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editImageUrlInput.trim() === '') return;
                      setEditUploadedImages(prev => [...prev, editImageUrlInput.trim()]);
                      setEditImageUrlInput('');
                    }}
                    className="bg-[#002855] hover:bg-[#FF7A00] text-white px-3 py-2 font-black text-[10px] uppercase tracking-wide transition-colors shrink-0"
                  >
                    + Vincular
                  </button>
                </div>
              </div>

              {/* Homepage Visibility Selection during Edit */}
              <div className="p-3 bg-orange-50/10 border border-orange-200/60 text-left space-y-2">
                <div>
                  <span className="block text-[10px] font-black uppercase text-[#002855] tracking-widest leading-none">
                    Visibilidade na Vitrine (Homepage Sections)
                  </span>
                  <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                    Selecione as seções onde este produto será promovido e exibido:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-all shadow-xs">
                    <input
                      type="checkbox"
                      checked={editHomepageSections.includes('categories')}
                      onChange={() => handleToggleEditHomepageSection('categories')}
                      className="w-3.5 h-3.5 cursor-pointer accent-[#FF7A00]"
                    />
                    <div>
                      <span className="text-[11px] font-black text-gray-800 uppercase block leading-tight">
                        {storefrontSettings?.categories || 'Compre por Categoria'}
                      </span>
                      <span className="text-[8px] text-[#FF7A00] font-semibold uppercase leading-none block mt-0.5">Seção 1 (Categorias)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-all shadow-xs">
                    <input
                      type="checkbox"
                      checked={editHomepageSections.includes('featured')}
                      onChange={() => handleToggleEditHomepageSection('featured')}
                      className="w-3.5 h-3.5 cursor-pointer accent-[#FF7A00]"
                    />
                    <div>
                      <span className="text-[11px] font-black text-gray-800 uppercase block leading-tight">
                        {storefrontSettings?.featured || 'PRODUTOS EM DESTAQUE'}
                      </span>
                      <span className="text-[8px] text-[#FF7A00] font-semibold uppercase leading-none block mt-0.5">Seção 2 (Destaques)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-all shadow-xs">
                    <input
                      type="checkbox"
                      checked={editHomepageSections.includes('newArrivals')}
                      onChange={() => handleToggleEditHomepageSection('newArrivals')}
                      className="w-3.5 h-3.5 cursor-pointer accent-[#FF7A00]"
                    />
                    <div>
                      <span className="text-[11px] font-black text-gray-800 uppercase block leading-tight">
                        {storefrontSettings?.newArrivals || 'LANÇAMENTOS EXCLUSIVOS'}
                      </span>
                      <span className="text-[8px] text-[#FF7A00] font-semibold uppercase leading-none block mt-0.5">Seção 3 (Lançamentos)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-all shadow-xs">
                    <input
                      type="checkbox"
                      checked={editHomepageSections.includes('bestSellers')}
                      onChange={() => handleToggleEditHomepageSection('bestSellers')}
                      className="w-3.5 h-3.5 cursor-pointer accent-[#FF7A00]"
                    />
                    <div>
                      <span className="text-[11px] font-black text-gray-800 uppercase block leading-tight">
                        {storefrontSettings?.bestSellers || 'MAIS VENDIDOS DA SEMANA'}
                      </span>
                      <span className="text-[8px] text-[#FF7A00] font-semibold uppercase leading-none block mt-0.5">Seção 4 (Mais Vendidos)</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 hover:border-orange-300 cursor-pointer transition-all shadow-xs">
                    <input
                      type="checkbox"
                      checked={editHomepageSections.includes('gallery')}
                      onChange={() => handleToggleEditHomepageSection('gallery')}
                      className="w-3.5 h-3.5 cursor-pointer accent-[#FF7A00]"
                    />
                    <div>
                      <span className="text-[11px] font-black text-gray-800 uppercase block leading-tight">
                        {storefrontSettings?.gallery || 'Galeria de Fotos Reais'}
                      </span>
                      <span className="text-[8px] text-[#FF7A00] font-semibold uppercase leading-none block mt-0.5">Seção 5 (Galeria)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modals bottom actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setProductToEdit(null)}
                  className="bg-gray-150 hover:bg-gray-200 text-gray-600 py-2 px-4 font-bold text-[10px] uppercase tracking-wider transition-colors border border-gray-250 cursor-pointer"
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  className="bg-[#FF7A00] hover:bg-[#e06b00] text-white py-2 px-6 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Confirmar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safe Delete Dialog Confirmation */}
      {productToDelete && (
        <div className="fixed inset-0 bg-[#002855]/70 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-red-500 max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setProductToDelete(null)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-md font-bold"
            >
              ×
            </button>
            
            <div className="w-12 h-12 bg-red-100 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-sm font-black text-[#002855] uppercase tracking-wider mb-2">
              Confirmar Exclusão
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed font-bold mb-6">
              Você tem certeza de que deseja expurgar <span className="text-[#002855] font-black">"{productToDelete.name}"</span> do catálogo da FR Moletom permanentemente? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setProductToDelete(null)}
                className="bg-gray-150 hover:bg-gray-200 text-gray-600 py-2 px-4 border border-gray-250 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  showToast(`Moletom "${productToDelete.name}" banido com sucesso!`, 'success');
                  setProductToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Safe Delete Dialog Confirmation */}
      {reviewToDelete && (
        <div className="fixed inset-0 bg-[#002855]/70 backdrop-blur-xs z-[99999] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border-2 border-red-500 max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setReviewToDelete(null)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-md font-bold cursor-pointer"
            >
              ×
            </button>
            
            <div className="w-12 h-12 bg-red-100 border border-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle size={24} />
            </div>
            
            <h3 className="text-sm font-black text-[#002855] uppercase tracking-wider mb-2">
              Confirmar Exclusão do Depoimento
            </h3>
            
            <p className="text-xs text-gray-500 leading-relaxed font-bold mb-4">
              Você tem certeza de que deseja excluir permanentemente a avaliação de <span className="text-[#002855] font-black">"{reviewToDelete.author}"</span>? Esta ação não pode ser desfeita.
            </p>

            <div className="bg-gray-50 border border-gray-150 p-3 text-left italic mb-6 text-[11px] text-gray-500 max-h-24 overflow-y-auto">
              "{reviewToDelete.comment}"
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setReviewToDelete(null)}
                className="bg-gray-150 hover:bg-gray-200 text-gray-600 py-2 px-4 border border-gray-250 font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  if (onDeleteTestimonial) {
                    onDeleteTestimonial(reviewToDelete.id);
                    showToast(`Depoimento de "${reviewToDelete.author}" removido com sucesso!`, 'success');
                  }
                  setReviewToDelete(null);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-5 font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Floating Toast Stack */}
      <div className="fixed bottom-5 right-5 z-[999999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-slate-900 border-slate-800 text-white';
          let icon = 'ℹ️';
          if (toast.type === 'success') {
            bgColor = 'bg-emerald-950 border-emerald-500 text-emerald-250';
            icon = '✅';
          } else if (toast.type === 'warn') {
            bgColor = 'bg-yellow-950 border-yellow-500 text-yellow-250';
            icon = '⚠️';
          } else if (toast.type === 'error') {
            bgColor = 'bg-red-950 border-red-500 text-red-250';
            icon = '❌';
          }

          return (
            <div 
              key={toast.id}
              className={`p-3.5 border-l-4 shadow-2xl flex items-center gap-3 animate-slideUp font-bold text-[11px] pointer-events-auto leading-tight ${bgColor}`}
            >
              <span className="text-xs shrink-0">{icon}</span>
              <div className="flex-grow tracking-wide">{toast.message}</div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-white/60 hover:text-white font-extrabold ml-1.5 cursor-pointer pb-0.5 text-xs select-none"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
