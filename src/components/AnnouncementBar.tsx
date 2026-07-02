import React, { useEffect, useState } from 'react';
import { AnnouncementSettings } from '../types';

interface AnnouncementBarProps {
  settings: AnnouncementSettings;
}

export default function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);

  const rawMessages = settings && Array.isArray(settings.messages) ? settings.messages : [];
  const messages = rawMessages.length > 0 
    ? rawMessages 
    : [
        "🚚 FRETE GRÁTIS acima de R$ 199 para todo o Brasil",
        "🎁 Primeira compra? Use o cupom PRIMEIRACOMPRA para 5% OFF!",
        "💳 Parcelamos em até 12x (5x sem juros no cartão)"
      ];
  
  const speed = settings && typeof settings.speed === 'number' ? settings.speed : 25;

  const renderMessageContent = (msg: any): string => {
    if (!msg) return '';
    if (typeof msg === 'string') return msg;
    if (typeof msg === 'object') {
      return msg.text || msg.message || msg.content || '';
    }
    return String(msg);
  };

  // Fallback timer for mobile fade animation
  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]); // clean primitive length dependency array

  // Triple items to ensure seamless flow
  const tripledMessages = [...messages, ...messages, ...messages];

  return (
    <div 
      className="bg-[#FF7A00] text-white overflow-hidden py-2.5 px-4 relative z-50 text-xs font-bold uppercase select-none border-b border-white/10 flex items-center w-full"
      style={{ '--marquee-speed': `${speed}s` } as React.CSSProperties}
    >
      {/* Desktop continuous scrolling marquee */}
      <div className="hidden md:flex relative w-full overflow-hidden items-center">
        <div className="flex animate-marquee whitespace-nowrap items-center min-w-full gap-16 py-1">
          {tripledMessages.map((msg, i) => {
            if (!msg) return null;
            return (
              <span key={i} className="inline-flex items-center gap-6 tracking-widest font-black shrink-0">
                <span>{renderMessageContent(msg)}</span>
                <span className="text-white/40 font-black">★</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Mobile animated fade announcement */}
      <div className="md:hidden w-full text-center flex items-center justify-center h-5">
        <div className="animate-pulse flex items-center justify-center gap-2 text-[11px] tracking-wide text-center">
          {renderMessageContent(messages[index % messages.length])}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333333%, 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee-scroll var(--marquee-speed, 25s) linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
