import React, { useState } from 'react';
import { ArrowLeft, Play, Shuffle, Users, Shield, Check } from 'lucide-react';
import { ANIMATED_CHARACTERS } from '../data/characters';
import { PLAYER_COLORS } from '../data/words';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface HostScreenProps {
  onBack: () => void;
  onLaunchLobby: (
    playerData: { name: string; avatar: string; color: string },
    settings: { imposterCount: number; allowImposterGuess: boolean }
  ) => void;
  initialName: string;
  initialAvatar: string;
  initialColor: string;
  isConnecting: boolean;
}

export const HostScreen: React.FC<HostScreenProps> = ({
  onBack,
  onLaunchLobby,
  initialName,
  initialAvatar,
  initialColor,
  isConnecting,
}) => {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [color, setColor] = useState(initialColor);
  const [imposterCount, setImposterCount] = useState<number>(1);
  const [allowImposterGuess, setAllowImposterGuess] = useState<boolean>(true);

  const handleRandomize = () => {
    sound.playClick();
    const randomChar = ANIMATED_CHARACTERS[Math.floor(Math.random() * ANIMATED_CHARACTERS.length)].id;
    const randomCol = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
    const randomNum = Math.floor(Math.random() * 90 + 10);
    setName(`Agent ${randomNum}`);
    setAvatar(randomChar);
    setColor(randomCol);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isConnecting) return;
    sound.playClick();
    onLaunchLobby(
      { name: name.trim(), avatar, color },
      { imposterCount, allowImposterGuess }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
          HOST OPERATION
        </span>
      </div>

      {/* Main Host Form Card */}
      <div className="bg-[#0b0e17]/90 border border-cyan-500/25 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
            INITIALIZE LOBBY
          </h2>
          <p className="text-xs text-slate-400">
            Setup your identity and game presets before inviting operatives.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070910] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Operative Profile
              </span>
              <button
                type="button"
                onClick={handleRandomize}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Randomize</span>
              </button>
            </div>

            {/* Preview and Codename input */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer" onClick={handleRandomize}>
                <AnimatedAvatar
                  avatar={avatar}
                  color={color}
                  size="lg"
                  animate={true}
                  className="ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950/50"
                />
              </div>

              <div className="flex-1">
                <label className="block text-[11px] text-slate-400 mb-1 font-semibold">
                  Operative Codename
                </label>
                <input
                  type="text"
                  maxLength={18}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter codename..."
                  required
                  className="w-full bg-[#0d1220] border border-slate-700/80 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm font-bold text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Avatar Select Carousel */}
            <div>
              <span className="block text-[11px] text-slate-400 mb-2 font-semibold">
                Select Suspect Mask
              </span>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {ANIMATED_CHARACTERS.map((char) => {
                  const isSelected = avatar === char.id;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAvatar(char.id);
                      }}
                      className={`p-1 rounded-2xl border transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-500/40 scale-105'
                          : 'border-white/[0.08] hover:border-slate-600 bg-black/40'
                      }`}
                    >
                      <AnimatedAvatar
                        avatar={char.id}
                        color={color}
                        size="sm"
                        animate={isSelected}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Picker */}
            <div>
              <span className="block text-[11px] text-slate-400 mb-2 font-semibold">
                Accent Aura
              </span>
              <div className="flex flex-wrap gap-2">
                {PLAYER_COLORS.map((col) => {
                  const isSelected = color === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setColor(col);
                      }}
                      className={`w-7 h-7 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                        isSelected ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lobby Presets */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070910] border border-white/[0.08] space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Match Rules
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Imposter Count */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                  Imposter Count
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setImposterCount(1);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      imposterCount === 1
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    1 Imposter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setImposterCount(2);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      imposterCount === 2
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    2 Imposters (7+ P)
                  </button>
                </div>
              </div>

              {/* Imposter Guess Rule */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">
                  Imposter Steal
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAllowImposterGuess(!allowImposterGuess);
                  }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                    allowImposterGuess
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>Guess Word to Steal Win</span>
                  <span className="font-mono text-[10px] uppercase">
                    {allowImposterGuess ? 'Active' : 'Off'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            disabled={!name.trim() || isConnecting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-950/60 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isConnecting ? 'Initializing...' : 'Launch Multiplayer Lobby'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
