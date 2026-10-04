import React, { useState } from 'react';
import { X, Shuffle, Check } from 'lucide-react';
import { ANIMATED_CHARACTERS } from '../data/characters';
import { PLAYER_COLORS } from '../data/words';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  avatar: string;
  color: string;
  onSave: (profile: { name: string; avatar: string; color: string }) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  name: initialName,
  avatar: initialAvatar,
  color: initialColor,
  onSave,
}) => {
  const [name, setName] = useState(initialName);
  const [avatar, setAvatar] = useState(initialAvatar);
  const [color, setColor] = useState(initialColor);

  if (!isOpen) return null;

  const handleRandomize = () => {
    sound.playClick();
    const randomChar = ANIMATED_CHARACTERS[Math.floor(Math.random() * ANIMATED_CHARACTERS.length)].id;
    const randomCol = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
    const randomNum = Math.floor(Math.random() * 90 + 10);
    setName(`Agent ${randomNum}`);
    setAvatar(randomChar);
    setColor(randomCol);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    sound.playClick();
    onSave({ name: name.trim(), avatar, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0b0e17] border border-cyan-500/25 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black tracking-tight uppercase text-white">
            Operative Dossier
          </h3>
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/50 border border-white/[0.06]">
            <AnimatedAvatar avatar={avatar} color={color} size="md" animate={true} />
            <div className="flex-1">
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">
                Codename
              </label>
              <input
                type="text"
                maxLength={18}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#101422] border border-slate-700/80 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 mb-2 font-semibold">Choose Mask</span>
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
                      isSelected ? 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400' : 'border-white/[0.06]'
                    }`}
                  >
                    <AnimatedAvatar avatar={char.id} color={color} size="sm" animate={isSelected} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-[11px] text-slate-400 mb-2 font-semibold">Aura Color</span>
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

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-950/50"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
