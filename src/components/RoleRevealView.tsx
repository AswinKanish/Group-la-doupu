import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Play, UserCheck, UserX, Crown } from 'lucide-react';
import { GameState } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface RoleRevealViewProps {
  gameState: GameState;
  myPlayerId: string;
  onContinue: () => void;
  isHost: boolean;
}

export const RoleRevealView: React.FC<RoleRevealViewProps> = ({
  gameState,
  myPlayerId,
  onContinue,
  isHost,
}) => {
  const [isRevealed, setIsRevealed] = useState(true);
  const isImposter = gameState.myRole === 'imposter';
  const me = gameState.players.find((p) => p.id === myPlayerId);

  useEffect(() => {
    if (isImposter) {
      sound.playImposterStinger();
    } else {
      sound.playStart();
    }
  }, [isImposter]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10 animate-fade-in text-center">
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold block mb-1">
          ROUND {gameState.roundNumber} BRIEFING
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          CONFIDENTIAL DOSSIER
        </h2>
        <p className="text-slate-400 text-xs mt-1">Shield your screen from other players</p>
      </div>

      {/* Role Card */}
      <div className="mb-8">
        <div
          className={`relative rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all backdrop-blur-xl ${
            isImposter
              ? 'bg-[#100816]/95 border-purple-500/50 shadow-purple-950/60'
              : 'bg-[#081216]/95 border-cyan-500/50 shadow-cyan-950/60'
          }`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                isImposter
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}
            >
              {isImposter ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{isImposter ? 'SECRET IMPOSTER' : 'OPERATIVE CREW'}</span>
            </span>

            <button
              onClick={() => {
                sound.playClick();
                setIsRevealed(!isRevealed);
              }}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
              title={isRevealed ? 'Conceal Dossier' : 'Reveal Dossier'}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Reveal Content */}
          {isRevealed ? (
            <div className="py-2">
              <div className="flex justify-center mb-4">
                {isImposter ? (
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 shadow-2xl shadow-purple-950/80 animate-pulse">
                    <img
                      src="/imposter-icon.png"
                      alt="Imposter"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : me ? (
                  <AnimatedAvatar
                    avatar={me.avatar}
                    color="#06b6d4"
                    size="xl"
                    animate={true}
                    className="shadow-xl ring-2 ring-cyan-500/40"
                  />
                ) : null}
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 uppercase ${
                  isImposter ? 'text-purple-400' : 'text-cyan-400'
                }`}
              >
                {isImposter ? 'YOU ARE THE IMPOSTER' : 'YOU ARE CREW'}
              </h3>

              {isImposter ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    You do not know the secret word. Blend in with other operatives, listen to their clues, and avoid getting caught!
                  </p>
                  <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/30 text-xs text-purple-300 font-mono font-semibold">
                    OBJECTIVE: Camouflage &amp; Survive Voting
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                      Secret Word
                    </span>
                    <span className="font-mono font-black text-2xl sm:text-3xl text-amber-300 tracking-wider block">
                      {gameState.mySecretWord}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Give clues connected to this word without giving it away to the imposter.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-slate-500 text-sm font-semibold">
              [ Dossier Concealed • Click eye icon above to reveal ]
            </div>
          )}
        </div>
      </div>

      {/* Advance Action */}
      {isHost ? (
        <button
          onClick={() => {
            sound.playClick();
            onContinue();
          }}
          className="w-full max-w-md mx-auto py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-950/60 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Commence Clues (Host)</span>
        </button>
      ) : (
        <div className="text-xs text-slate-400 font-medium">
          Waiting for host to begin clue interrogation...
        </div>
      )}
    </div>
  );
};
