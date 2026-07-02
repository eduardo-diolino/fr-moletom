import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HeroSlide } from '../types';

interface HeroSliderProps {
  slides: HeroSlide[];
  onCtaClick: (categorySlug?: string | null) => void;
}

// Helper to resolve button style based on color selection and size selection
function getButtonStyle(colorCode: string | undefined, btnSize: 'sm' | 'md' | 'lg' | undefined, defaultClasses: string) {
  let sizeClasses = 'text-xs py-3.5 px-8 tracking-widest';
  if (btnSize === 'sm') {
    sizeClasses = 'text-[10px] py-2 px-5 tracking-wider';
  } else if (btnSize === 'lg') {
    sizeClasses = 'text-sm py-4.5 px-10 tracking-widest';
  }

  // Define utility function to replace size inside static lists
  const applySize = (cls: string) => {
    return cls
      .replace('text-xs', '')
      .replace('py-3.5', '')
      .replace('px-8', '')
      .replace('tracking-widest', '')
      + ' ' + sizeClasses;
  };

  if (!colorCode) {
    return { className: applySize(defaultClasses), style: {} };
  }
  
  const trimmed = colorCode.trim();
  
  if (trimmed === 'brand') {
    return { className: applySize('bg-[#FF7A00] hover:bg-[#FF9933] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all shadow-xl text-center border border-transparent cursor-pointer'), style: {} };
  }
  if (trimmed === 'dark-blue') {
    return { className: applySize('bg-[#002855] hover:bg-[#003c82] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all shadow-xl text-center border border-transparent cursor-pointer'), style: {} };
  }
  if (trimmed === 'black') {
    return { className: applySize('bg-black hover:bg-gray-900 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all shadow-xl text-center border border-transparent cursor-pointer'), style: {} };
  }
  if (trimmed === 'white') {
    return { className: applySize('bg-white hover:bg-gray-100 text-[#002855] font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all shadow-xl text-center border border-transparent cursor-pointer'), style: {} };
  }
  if (trimmed === 'trans-dark') {
    return { className: applySize('bg-black/40 hover:bg-black/60 text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all text-center border border-white/20 cursor-pointer'), style: {} };
  }
  if (trimmed === 'trans-light') {
    return { className: applySize('bg-white/10 hover:bg-white text-white hover:text-gray-900 border border-white/20 font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all text-center cursor-pointer'), style: {} };
  }

  // Custom Hex Color
  let isLight = false;
  if (trimmed.startsWith('#')) {
    const hex = trimmed.substring(1);
    if (hex.length === 3 || hex.length === 6) {
      const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
      const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
      const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      isLight = yiq >= 180;
    }
  }

  return {
    className: applySize(`hover:opacity-90 font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all text-center border border-transparent cursor-pointer shadow-xl`),
    style: {
      backgroundColor: trimmed,
      color: isLight ? '#002855' : '#ffffff',
    }
  };
}

export default function HeroSlider({ slides, onCtaClick }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlides = Array.isArray(slides) ? slides : [];

  const startAutoplay = () => {
    stopAutoplay();
    if (activeSlides.length <= 1) return;
    autoplayRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeSlides.length]);

  // Adjust bounds if slide deleted
  useEffect(() => {
    if (current >= activeSlides.length && activeSlides.length > 0) {
      setCurrent(activeSlides.length - 1);
    }
  }, [activeSlides.length, current]);

  if (activeSlides.length === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[21/9] min-h-[420px] bg-gray-900 flex flex-col items-center justify-center text-white p-6 border-b border-gray-800 text-center">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">
          Nenhum Slide Ativo
        </h3>
        <p className="text-xs text-gray-400 font-bold max-w-xs">
          Adicione slides através do Painel Administrativo para ativar o banner rotativo principal.
        </p>
      </div>
    );
  }

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
    startAutoplay();
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % activeSlides.length);
    startAutoplay();
  };

  const handleDotClick = (idx: number) => {
    setCurrent(idx);
    startAutoplay();
  };

  const handleButtonClick = (url: string) => {
    if (!url || url === '#' || url === '#/' || url.trim() === '') {
      onCtaClick(null);
      return;
    }
    const cleanUrl = url.toLowerCase().trim();
    if (cleanUrl.includes('moleton')) {
      onCtaClick('moletons');
    } else if (cleanUrl.includes('calca')) {
      onCtaClick('calcas');
    } else if (cleanUrl.includes('conjunto')) {
      onCtaClick('conjuntos');
    } else if (cleanUrl.includes('bermuda') || cleanUrl.includes('short')) {
      onCtaClick('bermudas');
    } else if (cleanUrl.includes('camiseta')) {
      onCtaClick('camisetas');
    } else if (cleanUrl.includes('promoc') || cleanUrl.includes('promo')) {
      onCtaClick('promocoes');
    } else if (cleanUrl.includes('lanca') || cleanUrl.includes('novo')) {
      onCtaClick('lancamentos');
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      onCtaClick(url as any);
    }
  };

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] min-h-[420px] bg-gray-950 overflow-hidden select-none">
      {/* Slides mapping */}
      {activeSlides.map((slide, idx) => {
        const isCurrent = idx === current;
        if (!slide) return null;
        return (
          <div
            key={slide.id || idx}
            onClick={() => handleButtonClick(slide.btn1Url)}
            className={`absolute inset-0 cursor-pointer transition-all duration-1000 ease-in-out ${
              isCurrent 
                ? 'opacity-100 z-10 scale-100 visible' 
                : 'opacity-0 z-0 scale-95 invisible'
            }`}
          >
            {/* Dimmer overlay and text - only if title or subtitle is present */}
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/50 to-transparent z-10" />
            )}
            
            {/* Main Background Cover */}
            <img
              src={slide.image || 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1200&auto=format&fit=crop'}
              alt={slide.title || "Banner"}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform transition-transform duration-[6000ms] ease-out-sine"
              style={{
                transform: isCurrent ? 'scale(1.03)' : 'scale(1.00)',
                objectPosition: slide.bgPosition || 'center'
              }}
            />

            {/* Absolute content overlays - only if title/subtitle/buttons are present */}
            {(slide.title || slide.subtitle || slide.btn1Text || slide.btn2Text) && (() => {
              const alignClass = slide.contentAlign === 'right' 
                ? 'text-right' 
                : slide.contentAlign === 'center' 
                ? 'text-center' 
                : 'text-left';
              
              const blockClass = slide.contentAlign === 'right'
                ? 'max-w-xl ml-auto mr-0 flex flex-col gap-3 py-6 items-end'
                : slide.contentAlign === 'center'
                ? 'max-w-xl mx-auto flex flex-col gap-3 py-6 items-center'
                : 'max-w-xl mr-auto ml-0 flex flex-col gap-3 py-6 items-start';

              const buttonsAlignClass = slide.contentAlign === 'right'
                ? 'justify-end'
                : slide.contentAlign === 'center'
                ? 'justify-center'
                : 'justify-start';

              return (
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full ${alignClass}`}>
                    <div className={blockClass}>
                      
                      {/* Title text */}
                      {slide.title && (
                        <h2 
                          className={`text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight transition-all duration-700 delay-200 transform ${
                            isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          }`}
                        >
                          {slide.title}
                        </h2>
                      )}

                      {/* Paragraph description */}
                      {slide.subtitle && (
                        <p 
                          className={`text-gray-300 text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-4 sm:mb-6 hidden sm:block transition-all duration-700 delay-400 transform ${
                            isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                          }`}
                        >
                          {slide.subtitle}
                        </p>
                      )}

                      {/* Action buttons */}
                      <div 
                        className={`flex flex-wrap gap-4 transition-all duration-700 delay-550 transform ${buttonsAlignClass} ${
                          isCurrent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                      >
                        {slide.btn1Text && (() => {
                          const styleConfig = getButtonStyle(slide.btn1Color, slide.btnSize, "bg-[#FF7A00] hover:bg-[#FF9933] text-white font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all shadow-xl text-center border border-transparent cursor-pointer");
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleButtonClick(slide.btn1Url);
                              }}
                              className={styleConfig.className}
                              style={styleConfig.style}
                            >
                              {slide.btn1Text}
                            </button>
                          );
                        })()}
                        {slide.btn2Text && slide.btn2Url && (() => {
                          const styleConfig = getButtonStyle(slide.btn2Color, slide.btnSize, "bg-white/10 hover:bg-white text-white hover:text-gray-900 border border-white/20 font-bold text-xs uppercase tracking-widest py-3.5 px-8 rounded-none transition-all text-center cursor-pointer");
                          return (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleButtonClick(slide.btn2Url);
                              }}
                              className={styleConfig.className}
                              style={styleConfig.style}
                            >
                              {slide.btn2Text}
                            </button>
                          );
                        })()}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })}

      {/* Manual direction controls */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 bg-black/40 hover:bg-[#FF7A00] text-white transition-all backdrop-blur-sm border border-white/10 rounded-none cursor-pointer"
            aria-label="Anterior"
          >
            <ArrowLeft size={16} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3.5 bg-black/40 hover:bg-[#FF7A00] text-white transition-all backdrop-blur-sm border border-white/10 rounded-none cursor-pointer"
            aria-label="Próximo"
          >
            <ArrowRight size={16} />
          </button>

          {/* Indicators dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`h-1.5 transition-all cursor-pointer ${
                  i === current ? 'w-8 bg-[#FF7A00]' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
