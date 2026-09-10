import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Play, Sparkles, UserCheck, UserX, Crown } from 'lucide-react';
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
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Round {gameState.roundNumber} Assignment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Role Reveal
        </h2>
        <p className="text-slate-400 text-xs mt-1">Keep your screen hidden from others!</p>
      </div>

      {/* Role Card */}
      <div className="max-w-md mx-auto mb-6">
        <div
          className={`relative rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all ${
            isImposter
              ? 'bg-gradient-to-b from-rose-950 via-slate-900 to-black border-rose-600/60 shadow-rose-950/50'
              : 'bg-gradient-to-b from-emerald-950 via-slate-900 to-black border-emerald-500/60 shadow-emerald-950/50'
          }`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                isImposter
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}
            >
              {isImposter ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              <span>{isImposter ? 'YOU ARE DOOPU (IMPOSTER)' : 'INNOCENT CREW'}</span>
            </span>

            <button
              onClick={() => {
                sound.playClick();
                setIsRevealed(!isRevealed);
              }}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
              title={isRevealed ? 'Hide Role' : 'Show Role'}
            >
              {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Role Reveal Content */}
          {isRevealed ? (
            <div className="text-center py-2">
              <div className="flex justify-center mb-3">
                {me && (
                  <AnimatedAvatar
                    avatar={me.avatar}
                    color={isImposter ? '#ef4444' : '#10b981'}
                    size="xl"
                    animate={true}
                    className="shadow-xl"
                  />
                )}
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${
                  isImposter ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isImposter ? 'YOU ARE THE DOOPU' : 'YOU ARE CREW'}
              </h3>

              <div className="my-4 p-4 rounded-2xl bg-black/60 border border-slate-800">
                {isImposter ? (
                  <div className="py-1">
                    <span className="font-mono font-black text-lg text-rose-400 tracking-wider block mb-2">
                      ??? SECRET WORD UNKNOWN ???
                    </span>
                    <p className="text-xs text-rose-200/90 leading-relaxed">
                      You do not know the secret word. Pay close attention to other clues, give a subtle clue on your turn, and avoid suspicion!
                    </p>
                  </div>
                ) : (
                  <div className="py-1">
                    <span className="text-[11px] text-slate-400 block mb-1">Secret Word:</span>
                    <span className="font-mono font-black text-2xl sm:text-3xl text-amber-300 tracking-wider block mb-2">
                      {gameState.mySecretWord}
                    </span>
                    <p className="text-xs text-emerald-200/90 leading-relaxed">
                      Give a clever clue on your turn without making it too obvious for the imposter!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <Shield className="w-10 h-10 mb-2 opacity-50" />
              <p className="text-sm font-semibold">Role Hidden</p>
              <p className="text-xs">Tap the eye icon above to reveal</p>
            </div>
          )}

          {/* Action button */}
          {isHost ? (
            <button
              id="role-reveal-continue-btn"
              onClick={() => {
                sound.playClick();
                onContinue();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Proceed to Clues</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Waiting for host to proceed...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
