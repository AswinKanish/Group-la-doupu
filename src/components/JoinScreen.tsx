import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, KeyRound, Shuffle, Check, RefreshCw } from 'lucide-react';
import { ANIMATED_CHARACTERS } from '../data/characters';
import { PLAYER_COLORS } from '../data/words';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface JoinScreenProps {
  onBack: () => void;
  onJoinLobby: (
    roomCode: string,
    playerData: { name: string; avatar: string; color: string }
  ) => void;
  initialCode?: string;
  initialName: string;
  initialAvatar: string;
  initialColor: string;
  isConnecting: boolean;
  errorMessage?: string;
}

export const JoinScreen: React.FC<JoinScreenProps> = ({
  onBack,
  onJoinLobby,
  initialCode = '',
  initialName,
  initialAvatar,
  initialColor,
  isConnecting,
  errorMessage,
}) => {
  const [digits, setDigits] = useState<string[]>(() => {
    const clean = (initialCode || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
    const padded = clean.padEnd(4, ' ');
    return padded.split('').map((char) => (char === ' ' ? '' : char));
  });

  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [color, setColor] = useState(initialColor);
  const [showProfileCustomizer, setShowProfileCustomizer] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update digits if initialCode changes
  useEffect(() => {
    if (initialCode) {
      const clean = initialCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4);
      const padded = clean.padEnd(4, ' ');
      setDigits(padded.split('').map((char) => (char === ' ' ? '' : char)));
    }
  }, [initialCode]);

  // Focus first empty digit box or last box on mount
  useEffect(() => {
    const firstEmpty = digits.findIndex((d) => !d);
    const targetIdx = firstEmpty === -1 ? 3 : firstEmpty;
    if (inputRefs.current[targetIdx]) {
      inputRefs.current[targetIdx]?.focus();
    }
  }, []);

  const fullCode = digits.join('').trim().toUpperCase();

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Handle pasting multi-character code
    if (clean.length > 1) {
      const next = [...digits];
      for (let i = 0; i < clean.length && index + i < 4; i++) {
        next[index + i] = clean[i];
      }
      setDigits(next);
      sound.playClick();
      const nextFocus = Math.min(3, index + clean.length);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = clean.slice(-1);
    setDigits(next);
    sound.playClick();

    // Auto-advance
    if (index < 3 && clean) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
    if (fullCode.length !== 4 || !name.trim() || isConnecting) return;
    sound.playClick();
    onJoinLobby(fullCode, { name: name.trim(), avatar, color });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
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

        <span className="text-[11px] font-mono tracking-widest uppercase text-purple-400 font-bold">
          JOIN OPERATION
        </span>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm text-center shadow-lg animate-fade-in">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Join Card */}
      <div className="bg-[#0e0a18]/90 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-300 mx-auto mb-3 shadow-lg shadow-purple-950/40">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            Enter Game Code
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Type the 4-character room code from your host
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 4 Satisfying Digit Boxes [ _ _ _ _ ] */}
          <div className="flex justify-center gap-2.5 sm:gap-4">
            {[0, 1, 2, 3].map((index) => {
              const val = digits[index] || '';
              return (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={4}
                  value={val}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-14 h-16 sm:w-20 sm:h-22 text-center text-2xl sm:text-4xl font-mono font-black rounded-2xl border transition-all uppercase focus:outline-none ${
                    val
                      ? 'bg-purple-950/40 border-purple-400 text-purple-200 ring-2 ring-purple-500/30 shadow-lg shadow-purple-950/50'
                      : 'bg-black/60 border-slate-700/80 text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40'
                  }`}
                />
              );
            })}
          </div>

          {/* Quick Operative Badge */}
          <div className="p-3.5 rounded-2xl bg-[#080510] border border-white/[0.08] flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <AnimatedAvatar
                avatar={avatar}
                color={color}
                size="sm"
                animate={false}
                className="shrink-0 ring-1 ring-purple-500/40"
              />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                  Operative Codename
                </span>
                <input
                  type="text"
                  maxLength={18}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name..."
                  className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-purple-400 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleRandomize}
                className="p-2 rounded-xl text-slate-400 hover:text-purple-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
                title="Randomize"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowProfileCustomizer(!showProfileCustomizer)}
                className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 text-xs font-semibold hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                {showProfileCustomizer ? 'Done' : 'Mask'}
              </button>
            </div>
          </div>

          {/* Optional Mask Picker Drawer */}
          {showProfileCustomizer && (
            <div className="p-4 rounded-2xl bg-[#080510] border border-purple-500/25 space-y-3 animate-fade-in text-left">
              <span className="text-xs font-bold text-slate-300 block">Choose Mask</span>
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
                          ? 'border-purple-400 bg-purple-950/40 ring-2 ring-purple-500/40 scale-105'
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

              <span className="text-xs font-bold text-slate-300 block">Aura Color</span>
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
                      className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                        isSelected ? 'border-white scale-110 shadow-md' : 'opacity-80'
                      }`}
                      style={{ backgroundColor: col }}
                    >
                      {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dominant Join Action */}
          <button
            type="submit"
            disabled={fullCode.length !== 4 || !name.trim() || isConnecting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-950/60 hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 active:scale-[0.99]"
          >
            {isConnecting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting to Room {fullCode}...</span>
              </>
            ) : (
              <span>Enter Game Lobby</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
