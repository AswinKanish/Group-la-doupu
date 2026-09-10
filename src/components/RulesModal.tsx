import React from 'react';
import { X, Sparkles, HelpCircle, ListOrdered, RefreshCw, Target } from 'lucide-react';
import { sound } from '../utils/sound';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        <button
          id="close-rules-modal-btn"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight">How to Play</h3>
            <p className="text-xs text-slate-400">Group la Doopu</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>1. Secret Words</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Secret words include famous personalities, iconic places, foods, movies, and songs. Words never repeat across rounds!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-rose-400" />
              <span>2. Sequential Clues</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The host arranges the sequence each round. Players give clues one by one without timer rush.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>3. Continue or Vote</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              After each round of clues, players vote whether to give another round of clues or proceed to voting out the imposter.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-400" />
              <span>4. Voting &amp; Escape</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Vote out the suspected Doopu! If caught, the imposter can make one final guess of the secret word to steal victory.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
