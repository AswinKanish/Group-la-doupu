import React, { useState } from 'react';
import { Play, KeyRound, Sparkles, User, Shuffle } from 'lucide-react';
import { ThreeGameHero } from './ThreeGameHero';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface HomeViewProps {
  onStartHostFlow: () => void;
  onStartJoinFlow: () => void;
  playerName: string;
  playerAvatar: string;
  playerColor: string;
  onRandomizeProfile: () => void;
  onOpenProfileModal: () => void;
  errorMessage?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartHostFlow,
  onStartJoinFlow,
  playerName,
  playerAvatar,
  playerColor,
  onRandomizeProfile,
  onOpenProfileModal,
  errorMessage,
}) => {
  const [hoveredAction, setHoveredAction] = useState<'host' | 'join' | null>(null);

  const handleHostClick = () => {
    sound.playClick();
    onStartHostFlow();
  };

  const handleJoinClick = () => {
    sound.playClick();
    onStartJoinFlow();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      {/* Error Banner */}
      {errorMessage && (
        <div className="w-full max-w-md mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm text-center shadow-lg animate-fade-in flex items-center justify-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Atmospheric Stage */}
      <div className="w-full flex flex-col items-center text-center">
        {/* Foreground 3D Interactive Suspect Artifact */}
        <div className="relative z-10 w-full flex justify-center mb-1 sm:mb-2">
          <ThreeGameHero
            hoveredAction={hoveredAction}
            onSceneClick={() => {
              sound.playSuspense();
            }}
            className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px]"
          />
        </div>

        {/* Title & Brand with Logo */}
        <div className="relative z-20 mb-8 sm:mb-10 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-3 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-500/20 shadow-lg backdrop-blur-md">
            <img src="/imposter-icon.png" alt="Group la Doupu Logo" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">Multiplayer Mystery</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-wider text-white uppercase">
            Group la <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Doupu</span>
          </h1>
        </div>

        {/* The Two Dominant Primary Action Portals */}
        <div className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl px-2 mb-8">
          {/* HOST GAME PORTAL */}
          <button
            id="home-host-game-btn"
            type="button"
            onClick={handleHostClick}
            onMouseEnter={() => setHoveredAction('host')}
            onMouseLeave={() => setHoveredAction(null)}
            className="group relative p-6 sm:p-8 rounded-3xl bg-[#0a0d16]/90 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] transition-all duration-300 flex flex-col items-center justify-between gap-4 text-center cursor-pointer overflow-hidden backdrop-blur-md active:scale-[0.98]"
          >
            {/* Ambient Cyan Flare */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/25 transition-all" />

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300 shadow-lg shadow-cyan-950/40">
              <Play className="w-7 h-7 fill-current ml-0.5" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider group-hover:text-cyan-300 transition-colors uppercase">
                Host Game
              </h2>
              <p className="text-xs text-slate-400 mt-1">Create a room for your group</p>
            </div>

            <span className="w-full py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider group-hover:bg-cyan-500 group-hover:text-black transition-all">
              Initialize Room
            </span>
          </button>

          {/* JOIN GAME PORTAL */}
          <button
            id="home-join-game-btn"
            type="button"
            onClick={handleJoinClick}
            onMouseEnter={() => setHoveredAction('join')}
            onMouseLeave={() => setHoveredAction(null)}
            className="group relative p-6 sm:p-8 rounded-3xl bg-[#0e0a18]/90 border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] transition-all duration-300 flex flex-col items-center justify-between gap-4 text-center cursor-pointer overflow-hidden backdrop-blur-md active:scale-[0.98]"
          >
            {/* Ambient Purple Flare */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all" />

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-black transition-all duration-300 shadow-lg shadow-purple-950/40">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wider group-hover:text-purple-300 transition-colors uppercase">
                Join Game
              </h2>
              <p className="text-xs text-slate-400 mt-1">Enter with a 6-digit code</p>
            </div>

            <span className="w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider group-hover:bg-purple-500 group-hover:text-black transition-all">
              Enter Code
            </span>
          </button>
        </div>

        {/* Minimal Player Identity Card (Click to edit or quick randomize) */}
        <div className="relative z-20 flex items-center gap-3 bg-[#0a0d14]/80 border border-white/[0.08] hover:border-white/[0.2] px-4 py-2 rounded-2xl backdrop-blur-md transition-all">
          <div
            onClick={onOpenProfileModal}
            className="flex items-center gap-2.5 cursor-pointer"
            title="Change identity"
          >
            <AnimatedAvatar
              avatar={playerAvatar}
              color={playerColor}
              size="xs"
              animate={false}
              className="shrink-0 ring-1 ring-cyan-500/30"
            />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                Operative
              </span>
              <span className="text-xs font-bold text-slate-200 block truncate max-w-[130px]">
                {playerName}
              </span>
            </div>
          </div>

          <div className="w-[1px] h-6 bg-white/[0.08] mx-1" />

          {/* Quick Randomize */}
          <button
            onClick={onRandomizeProfile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
            title="Randomize Codename & Avatar"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
