import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className = "h-12", light = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 400 400"
        className="w-auto h-full pointer-events-none drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background rounded badge matching the logo */}
        <rect width="400" height="400" rx="40" fill="#002855" />
        
        {/* Subtle Embroidered Fabric texture dots / grid */}
        <defs>
          <pattern id="stitch-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.8" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="400" height="400" rx="40" fill="url(#stitch-pattern)" />

        <g transform="translate(40, 40)">
          {/* FR Lettering - Bright Cyan-Blue */}
          <text
            x="30"
            y="220"
            fontSize="180"
            fontWeight="900"
            fontFamily="'Outfit', 'Inter', sans-serif"
            fill="#3F9BFC"
            letterSpacing="-8"
          >
            FR
          </text>
          
          {/* Sliced effect via Orange swoosh passing through */}
          <path
            d="M -10,240 C 30,170 120,90 320,60"
            fill="none"
            stroke="#FF7A00"
            strokeWidth="24"
            strokeLinecap="round"
            className="drop-shadow-md"
          />

          {/* Underline Subtext: MOLETOM spelled out in bold orange letters */}
          <text
            x="160"
            y="300"
            textAnchor="middle"
            fontSize="42"
            fontWeight="bold"
            fontFamily="'Outfit', 'Inter', sans-serif"
            fill="#FF7A00"
            letterSpacing="8"
          >
            MOLETOM
          </text>
        </g>
      </svg>
      <div>
        <div className={`font-black text-xl tracking-tight leading-none ${light ? 'text-white' : 'text-[#002855]'}`}>
          FR <span className="text-[#FF7A00]">MOLETOM</span>
        </div>
        <span className="text-[9px] tracking-[0.25em] font-medium block text-gray-500 uppercase">
          Moda Infantil Masculina
        </span>
      </div>
    </div>
  );
}
