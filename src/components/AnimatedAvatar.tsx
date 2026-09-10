import React from 'react';
import { normalizeCharacterId } from '../data/characters';

export interface AnimatedAvatarProps {
  avatar: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean;
  border?: boolean;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 'w-8 h-8',
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32',
};

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  avatar,
  color = '#f43f5e',
  size = 'md',
  className = '',
  animate = true,
  border = true,
  onClick,
}) => {
  const characterId = normalizeCharacterId(avatar);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  const renderSvg = (id: string, themeColor: string) => {
    switch (id) {
      case 'cyber-neon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="neonBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="neonVisor" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#neonBg)" />
            {/* Tech Helm Silhouette */}
            <path d="M24 38 L50 18 L76 38 L72 74 L50 86 L28 74 Z" fill="#0f172a" stroke={themeColor} strokeWidth="2.5" />
            {/* Audio side fins */}
            <rect x="18" y="44" width="7" height="18" rx="2" fill={themeColor} opacity="0.8" />
            <rect x="75" y="44" width="7" height="18" rx="2" fill={themeColor} opacity="0.8" />
            {/* Curved Neon Visor */}
            <rect x="28" y="42" width="44" height="14" rx="4" fill="url(#neonVisor)" />
            {/* Visor Scanline */}
            <g className={animate ? 'animate-scanline' : ''}>
              <line x1="28" y1="46" x2="72" y2="46" stroke="#ffffff" strokeWidth="2.5" opacity="0.9" />
            </g>
            {/* Chin Respirator */}
            <rect x="42" y="66" width="16" height="10" rx="3" fill="#1e293b" stroke={themeColor} strokeWidth="1.5" />
            <line x1="46" y1="71" x2="54" y2="71" stroke="#38bdf8" strokeWidth="1.5" />
          </svg>
        );

      case 'cyber-oni':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#180509" />
            {/* Glowing Demon Horns */}
            <path d="M30 36 C24 16, 12 14, 16 8 C26 12, 36 22, 38 32 Z" fill="#f43f5e" />
            <path d="M70 36 C76 16, 88 14, 84 8 C74 12, 64 22, 62 32 Z" fill="#f43f5e" />
            {/* Mask Face */}
            <path d="M26 38 L50 26 L74 38 L68 76 L50 88 L32 76 Z" fill="#2d0611" stroke="#f43f5e" strokeWidth="2" />
            {/* Menacing Eyes */}
            <g className={animate ? 'animate-pulse' : ''}>
              <polygon points="34,46 46,52 36,54" fill="#fbbf24" />
              <polygon points="66,46 54,52 64,54" fill="#fbbf24" />
              <circle cx="41" cy="50" r="1.5" fill="#ffffff" />
              <circle cx="59" cy="50" r="1.5" fill="#ffffff" />
            </g>
            {/* Metallic Teeth */}
            <path d="M38 68 L42 62 L46 68 L50 62 L54 68 L58 62 L62 68" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="38" r="3" fill={themeColor} />
          </svg>
        );

      case 'mecha-skull':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#041212" />
            {/* Cyber Skull Cranium */}
            <path d="M26 44 C26 24, 74 24, 74 44 C74 54, 68 62, 64 64 L64 74 L36 74 L36 64 C32 62, 26 54, 26 44 Z" fill="#0b2424" stroke="#10b981" strokeWidth="2" />
            {/* Holographic Sockets */}
            <g className={animate ? 'animate-pulse' : ''}>
              <ellipse cx="40" cy="46" rx="8" ry="10" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
              <ellipse cx="60" cy="46" rx="8" ry="10" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
              <circle cx="40" cy="46" r="3.5" fill="#34d399" />
              <circle cx="60" cy="46" r="3.5" fill="#34d399" />
            </g>
            {/* Inverted Triangle Nose */}
            <polygon points="50,56 46,63 54,63" fill="#34d399" opacity="0.8" />
            {/* Cyber Teeth Grate */}
            <line x1="42" y1="71" x2="42" y2="77" stroke="#34d399" strokeWidth="2" />
            <line x1="50" y1="71" x2="50" y2="77" stroke="#34d399" strokeWidth="2" />
            <line x1="58" y1="71" x2="58" y2="77" stroke="#34d399" strokeWidth="2" />
          </svg>
        );

      case 'shadow-assassin':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#0a0a0f" />
            {/* Assassin Cowl/Hood */}
            <path d="M18 64 C18 20, 50 12, 50 12 C50 12, 82 20, 82 64 C82 86, 68 94, 50 94 C32 94, 18 86, 18 64 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
            {/* Deep Shadow Face Void */}
            <path d="M30 46 C30 32, 70 32, 70 46 C70 66, 50 74, 50 74 C50 74, 30 66, 30 46 Z" fill="#09090b" />
            {/* Glowing Crosshair Optics */}
            <g className={animate ? 'animate-pulse' : ''}>
              <circle cx="42" cy="48" r="4" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
              <circle cx="42" cy="48" r="1.5" fill="#f43f5e" />
              <circle cx="58" cy="48" r="4" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
              <circle cx="58" cy="48" r="1.5" fill="#f43f5e" />
            </g>
            <path d="M46 64 L54 64" stroke={themeColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'cosmic-astral':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#1e1035" />
            {/* Orbiting Planetary Ring */}
            <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="#a855f7" strokeWidth="2" transform="rotate(-25 50 50)" opacity="0.8" />
            {/* Astral Core */}
            <circle cx="50" cy="50" r="22" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
            <circle cx="50" cy="50" r="14" fill="#7e22ce" className={animate ? 'animate-ping' : ''} opacity="0.4" />
            {/* Mystical Eyes */}
            <ellipse cx="44" cy="48" rx="3" ry="5" fill="#fbcfe8" />
            <ellipse cx="56" cy="48" rx="3" ry="5" fill="#fbcfe8" />
            {/* Star sparkle on forehead */}
            <polygon points="50,32 52,38 58,40 52,42 50,48 48,42 42,40 48,38" fill="#ffffff" />
          </svg>
        );

      case 'quantum-bot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#0f172a" />
            {/* Rotating Radar Dish / Antenna */}
            <line x1="50" y1="26" x2="50" y2="12" stroke="#38bdf8" strokeWidth="2.5" />
            <circle cx="50" cy="11" r="4" fill="#38bdf8" className={animate ? 'animate-ping' : ''} />
            {/* Chassis */}
            <rect x="26" y="26" width="48" height="48" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            {/* Screen Matrix */}
            <rect x="32" y="34" width="36" height="22" rx="4" fill="#0284c7" opacity="0.3" />
            {/* Matrix Digital Eyes */}
            <g className={animate ? 'animate-pulse' : ''}>
              <rect x="36" y="40" width="8" height="10" rx="2" fill="#38bdf8" />
              <rect x="56" y="40" width="8" height="10" rx="2" fill="#38bdf8" />
            </g>
            {/* Audio Mouth Bar */}
            <line x1="38" y1="64" x2="62" y2="64" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'laser-cat':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#1a120b" />
            {/* Cat Ears */}
            <polygon points="26,38 18,16 40,28" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            <polygon points="74,38 82,16 60,28" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" />
            {/* Head */}
            <ellipse cx="50" cy="54" rx="28" ry="24" fill="#292524" stroke="#f59e0b" strokeWidth="2" />
            {/* Cyber VR Goggles */}
            <rect x="28" y="42" width="44" height="15" rx="5" fill="#0c0a09" stroke="#fbbf24" strokeWidth="1.5" />
            <ellipse cx="38" cy="49" rx="6" ry="4" fill="#fbbf24" className={animate ? 'animate-pulse' : ''} />
            <ellipse cx="62" cy="49" rx="6" ry="4" fill="#fbbf24" className={animate ? 'animate-pulse' : ''} />
            {/* Whiskers */}
            <line x1="20" y1="62" x2="34" y2="64" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="20" y1="68" x2="34" y2="67" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="80" y1="62" x2="66" y2="64" stroke="#fbbf24" strokeWidth="1.5" />
            <line x1="80" y1="68" x2="66" y2="67" stroke="#fbbf24" strokeWidth="1.5" />
          </svg>
        );

      case 'pixel-glitch':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#11052c" />
            {/* Glitch Box Head */}
            <rect x="26" y="28" width="48" height="46" rx="6" fill="#1c0a3d" stroke="#ec4899" strokeWidth="2" />
            {/* Offset 3D Glitch Slice */}
            <rect x="22" y="44" width="56" height="8" fill="#06b6d4" opacity="0.6" />
            {/* Pixel Eyes */}
            <rect x="36" y="42" width="8" height="8" fill="#ffffff" />
            <rect x="56" y="42" width="8" height="8" fill="#ffffff" />
            {/* Digital mouth */}
            <rect x="40" y="62" width="20" height="4" fill="#ec4899" />
            {/* Neon audio headphones */}
            <rect x="18" y="38" width="8" height="24" rx="3" fill="#ec4899" />
            <rect x="74" y="38" width="8" height="24" rx="3" fill="#ec4899" />
          </svg>
        );

      case 'cyber-ninja':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#052e16" />
            {/* Ninja Cowl */}
            <path d="M22 40 C22 20, 50 14, 50 14 C50 14, 78 20, 78 40 L76 76 L24 76 Z" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
            {/* Forehead Shuriken Crest */}
            <polygon points="50,22 53,27 58,30 53,33 50,38 47,33 42,30 47,27" fill="#22c55e" />
            {/* Eye Slit */}
            <rect x="28" y="42" width="44" height="12" rx="3" fill="#022c22" />
            {/* Glowing Slit Eyes */}
            <g className={animate ? 'animate-pulse' : ''}>
              <line x1="34" y1="48" x2="44" y2="48" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
              <line x1="56" y1="48" x2="66" y2="48" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            </g>
            {/* Mask pleat */}
            <line x1="50" y1="56" x2="50" y2="74" stroke="#22c55e" strokeWidth="1.5" />
          </svg>
        );

      case 'mecha-tiger':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#271005" />
            {/* Angular Ears */}
            <polygon points="24,34 18,12 40,24" fill="#ea580c" stroke="#ffedd5" strokeWidth="1" />
            <polygon points="76,34 82,12 60,24" fill="#ea580c" stroke="#ffedd5" strokeWidth="1" />
            {/* Head Armor */}
            <path d="M26 36 L50 26 L74 36 L68 76 L50 86 L32 76 Z" fill="#431407" stroke="#f97316" strokeWidth="2" />
            {/* Tiger Neon Stripes */}
            <path d="M30 46 L38 48 M30 54 L40 54 M70 46 L62 48 M70 54 L60 54" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            {/* Piercing Amber Eyes */}
            <g className={animate ? 'animate-pulse' : ''}>
              <polygon points="36,48 46,44 44,52" fill="#fbbf24" />
              <polygon points="64,48 54,44 56,52" fill="#fbbf24" />
            </g>
            {/* Cyber Fangs */}
            <polygon points="44,70 47,78 50,70" fill="#ffffff" />
            <polygon points="56,70 53,78 50,70" fill="#ffffff" />
          </svg>
        );

      case 'space-alien':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#022c22" />
            {/* Oval Head */}
            <ellipse cx="50" cy="50" rx="30" ry="36" fill="#065f46" stroke="#34d399" strokeWidth="2" />
            {/* Giant Glossy Alien Eyes */}
            <ellipse cx="38" cy="46" rx="10" ry="16" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" transform="rotate(-15 38 46)" />
            <ellipse cx="62" cy="46" rx="10" ry="16" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" transform="rotate(15 62 46)" />
            {/* Eye glow reflections */}
            <ellipse cx="37" cy="42" rx="4" ry="6" fill="#a7f3d0" className={animate ? 'animate-pulse' : ''} />
            <ellipse cx="61" cy="42" rx="4" ry="6" fill="#a7f3d0" className={animate ? 'animate-pulse' : ''} />
            {/* Third Psychic Forehead Gem */}
            <circle cx="50" cy="24" r="4" fill="#fbbf24" className={animate ? 'animate-ping' : ''} />
          </svg>
        );

      case 'retro-ghost':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#030712" />
            {/* Floating Wavy Phantom */}
            <path d="M26 54 C26 30, 74 30, 74 54 L74 80 L66 74 L58 80 L50 74 L42 80 L34 74 L26 80 Z" fill="#6366f1" opacity="0.85" stroke="#a5b4fc" strokeWidth="2" />
            {/* Glowing Big Eyes */}
            <circle cx="40" cy="48" r="6" fill="#ffffff" />
            <circle cx="60" cy="48" r="6" fill="#ffffff" />
            <circle cx="42" cy="48" r="3" fill="#09090b" className={animate ? 'animate-ping' : ''} />
            <circle cx="62" cy="48" r="3" fill="#09090b" className={animate ? 'animate-ping' : ''} />
          </svg>
        );

      case 'turbo-bunny':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#1e1b4b" />
            {/* Long Mecha Radar Ears */}
            <rect x="32" y="10" width="10" height="34" rx="5" fill="#ec4899" stroke="#f472b6" strokeWidth="1.5" />
            <rect x="58" y="10" width="10" height="34" rx="5" fill="#ec4899" stroke="#f472b6" strokeWidth="1.5" />
            {/* Head */}
            <ellipse cx="50" cy="56" rx="26" ry="24" fill="#312e81" stroke="#818cf8" strokeWidth="2" />
            {/* Neon Eye Mask */}
            <rect x="32" y="48" width="36" height="12" rx="4" fill="#ec4899" />
            <circle cx="40" cy="54" r="3" fill="#ffffff" className={animate ? 'animate-pulse' : ''} />
            <circle cx="60" cy="54" r="3" fill="#ffffff" className={animate ? 'animate-pulse' : ''} />
            {/* Cute nose */}
            <polygon points="50,65 47,62 53,62" fill="#f472b6" />
          </svg>
        );

      case 'deep-diver':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#082f49" />
            {/* Big Brass/Steel Deep Dive Dome */}
            <circle cx="50" cy="52" r="28" fill="#0e7490" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Porthole Glass */}
            <circle cx="50" cy="52" r="16" fill="#0369a1" stroke="#bae6fd" strokeWidth="2" />
            {/* Spotlight Beam inside */}
            <ellipse cx="50" cy="52" rx="9" ry="9" fill="#38bdf8" opacity="0.6" className={animate ? 'animate-pulse' : ''} />
            {/* Air Pipes */}
            <path d="M22 62 Q14 74 30 84" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
            <path d="M78 62 Q86 74 70 84" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
          </svg>
        );

      case 'astro-bot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#090d16" />
            {/* Cosmic Helmet */}
            <circle cx="50" cy="52" r="28" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            {/* Gold Solar Visor */}
            <ellipse cx="50" cy="52" rx="20" ry="16" fill="#f59e0b" stroke="#fcd34d" strokeWidth="1.5" />
            {/* Starlight Glint */}
            <polygon points="44,44 46,40 48,44 52,46 48,48 46,52 44,48 40,46" fill="#ffffff" className={animate ? 'animate-ping' : ''} />
            {/* Helmet Lights */}
            <circle cx="26" cy="52" r="2.5" fill="#38bdf8" />
            <circle cx="74" cy="52" r="2.5" fill="#38bdf8" />
          </svg>
        );

      case 'chili-demon':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="46" fill="#260404" />
            {/* Flame Horns */}
            <path d="M30 38 Q22 14 36 12 Q38 24 40 32 Z" fill="#ef4444" />
            <path d="M70 38 Q78 14 64 12 Q62 24 60 32 Z" fill="#ef4444" />
            {/* Red Molten Face */}
            <circle cx="50" cy="54" r="24" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
            {/* Blazing yellow eyes */}
            <ellipse cx="42" cy="50" rx="4" ry="6" fill="#fef08a" className={animate ? 'animate-pulse' : ''} />
            <ellipse cx="58" cy="50" rx="4" ry="6" fill="#fef08a" className={animate ? 'animate-pulse' : ''} />
            {/* Mischievous smile */}
            <path d="M42 66 Q50 74 58 66" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl transition-all duration-300 ${sizeClass} ${
        onClick ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
      } ${animate ? 'animate-cyber-float' : ''} ${className}`}
      style={{
        boxShadow: border ? `0 0 14px ${color}33` : undefined,
      }}
    >
      {/* Background Glow Ring */}
      <div
        className="absolute inset-0 rounded-2xl opacity-40 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
        }}
      />

      {/* SVG Character Avatar */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden p-0.5">
        {renderSvg(characterId, color)}
      </div>

      {/* Futuristic Corner Tech Bracket */}
      {border && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none border"
          style={{ borderColor: `${color}66` }}
        />
      )}
    </div>
  );
};
