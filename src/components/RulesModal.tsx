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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0c0f18] border border-cyan-500/20 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-purple-600 to-cyan-400 shrink-0">
            <img src="/imposter-icon.png" alt="Icon" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-white uppercase">Game Manual</h3>
            <p className="text-[11px] text-cyan-400 font-mono">Group la Doupu</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <span>01. Secret Word</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every crew member receives the same secret word. The Imposter receives nothing.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] space-y-1">
            <div className="font-bold text-purple-300 flex items-center gap-1.5">
              <span>02. Sequential Clues</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Operatives take turns giving single-word or short clues. Be subtle so the imposter cannot guess the word!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] space-y-1">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <span>03. Continue or Vote</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              After each clue round, vote whether to give another round of clues or initiate suspect voting.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>04. Interrogation &amp; Guess</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Vote out the imposter. If caught, the imposter has one final chance to guess the secret word and steal victory!
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-black/50 border border-white/[0.06] space-y-1">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <span>05. Scoring &amp; Detective Rewards</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              • <strong className="text-emerald-300">Crew Victory (+2 pts):</strong> Imposter identified and defeated.<br />
              • <strong className="text-rose-300">Imposter Victory (+3/+4 pts):</strong> Imposter escapes or guesses the word.<br />
              • <strong className="text-cyan-300">Sharp Detective (+1 pt):</strong> Awarded to operatives who vote for the Imposter even if the Imposter wasn't caught by majority!
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
