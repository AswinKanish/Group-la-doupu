import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, HelpCircle } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  roomCode?: string;
  isHost?: boolean;
  onOpenRules: () => void;
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  isHost,
  onOpenRules,
  onLogoClick,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [copiedCode, setCopiedCode] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const copyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    sound.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <header className="w-full bg-[#07070a]/90 backdrop-blur-xl border-b border-white/[0.06] text-white sticky top-0 z-40 px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Prominent Official Imposter Icon & Brand */}
        <div
          onClick={onLogoClick}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          title="Return to home screen"
        >
          {/* Official Imposter Icon */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full p-[2px] bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-950/60 group-hover:scale-105 transition-transform duration-300 shrink-0">
            <img
              src="/imposter-icon.png"
              alt="Group la Doupu Logo"
              className="w-full h-full object-cover rounded-full select-none"
            />
          </div>

          {/* Brand Name */}
          <div className="flex flex-col text-left">
            <span className="font-black text-xs sm:text-sm tracking-[0.12em] uppercase text-white/95 group-hover:text-cyan-400 transition-colors">
              Group la Doupu
            </span>
          </div>
        </div>

        {/* Center: In-Game Room Code Badge (Only displayed when inside an active game) */}
        {roomCode && (
          <div className="flex items-center gap-2 bg-[#0d111a] border border-cyan-500/20 rounded-xl px-3 py-1 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden xs:inline">
              ROOM
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-cyan-300 tracking-widest">
              {roomCode}
            </span>
            {isHost && (
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                HOST
              </span>
            )}
            <button
              onClick={copyCode}
              title="Copy Room Code"
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Right: Minimal Game Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-white/[0.03] border-white/[0.08] text-slate-500 hover:text-slate-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* How to Play Rules */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
