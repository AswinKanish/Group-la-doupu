import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw, AlertOctagon, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { GameState } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface VerdictViewProps {
  gameState: GameState;
  myPlayerId: string;
  isHost: boolean;
  onNextRound: () => void;
  onReturnToLobby: () => void;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  gameState,
  myPlayerId,
  isHost,
  onNextRound,
  onReturnToLobby,
}) => {
  const verdict = gameState.verdictDetails;
  const isCrewWinner = verdict?.winner === 'crew';
  const isImposter = gameState.myRole === 'imposter';
  const didIWin = (isCrewWinner && !isImposter) || (!isCrewWinner && isImposter);

  useEffect(() => {
    if (isCrewWinner) {
      sound.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playImposterStinger();
      confetti({
        particleCount: 50,
        spread: 90,
        colors: ['#ef4444', '#dc2626', '#f59e0b'],
        origin: { y: 0.6 },
      });
    }
  }, [isCrewWinner]);

  // Sort players by score
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Main Winner Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-center border shadow-2xl mb-6 relative overflow-hidden ${
          isCrewWinner
            ? 'bg-gradient-to-b from-emerald-950 via-slate-900 to-black border-emerald-500/50 shadow-emerald-950/40'
            : 'bg-gradient-to-b from-rose-950 via-slate-900 to-black border-rose-500/50 shadow-rose-950/40'
        }`}
      >
        <div className="text-5xl sm:text-6xl mb-2.5">{isCrewWinner ? '🏆' : '🎭'}</div>

        <span
          className={`text-xs uppercase font-black tracking-widest px-3 py-1 rounded-full border mb-2.5 inline-block ${
            isCrewWinner
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}
        >
          {isCrewWinner ? 'CREW VICTORY' : 'DOOPU (IMPOSTER) VICTORY'}
        </span>

        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          {isCrewWinner ? 'The Crew Prevails!' : 'The Doopu Escaped!'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-5 leading-relaxed">
          {isCrewWinner
            ? 'The imposter was identified and failed to guess the secret word!'
            : verdict?.imposterGuessSuccess
            ? `The imposter was caught, but correctly guessed "${verdict.secretWord}" to steal the win!`
            : 'The imposter deceived everyone and escaped undetected!'}
        </p>

        {/* Secret Word & Imposters Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
          {/* Secret word */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
              Secret Word
            </span>
            <span className="font-mono font-black text-xl sm:text-2xl text-amber-300 tracking-wider block">
              {verdict?.secretWord}
            </span>
          </div>

          {/* Imposter(s) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-black/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-rose-400 font-bold block mb-1">
              The Doopu ({verdict && verdict.imposters.length} Imposter{verdict && verdict.imposters.length > 1 ? 's' : ''})
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {verdict?.imposters.map((imp) => {
                const fullP = gameState.players.find((p) => p.id === imp.id);
                return (
                  <div
                    key={imp.id}
                    className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 px-2.5 py-1 rounded-xl"
                  >
                    {fullP && (
                      <AnimatedAvatar
                        avatar={fullP.avatar}
                        color={fullP.color}
                        size="xs"
                      />
                    )}
                    <span className="font-bold text-xs text-white">
                      {imp.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* You won/lost indicator */}
        <div className="mt-5">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              didIWin
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {didIWin ? '✨ You Won This Round!' : '💔 Better Luck Next Round!'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Voting & Ejection Details Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
          <h3 className="font-bold text-sm sm:text-base text-white mb-3.5 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>Vote Tallies &amp; Ejection</span>
          </h3>

          {verdict?.isTie ? (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 mb-3.5">
              ⚖️ The vote ended in a tie! No one was ejected, allowing the Doopu to slip away.
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 mb-3.5 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Ejected by Majority:</span>
                <span className="font-bold text-white text-xs sm:text-sm">{verdict?.ejectedPlayerName}</span>
              </div>
              <div className="flex items-center gap-1">
                {verdict?.wasImposter ? (
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Imposter Caught!
                  </span>
                ) : (
                  <span className="text-rose-400 font-bold text-xs flex items-center gap-1 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/30">
                    <XCircle className="w-3.5 h-3.5" /> Innocent Crewmate
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Vote counts breakdown - scrollable for up to 25 players */}
          <div className="space-y-1.5 text-xs max-h-52 overflow-y-auto pr-1">
            <span className="text-slate-400 font-semibold block text-[11px] mb-1">Vote Distribution:</span>
            {gameState.players.map((p) => {
              const votesReceived = verdict?.voteCounts[p.id] || 0;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <AnimatedAvatar
                      avatar={p.avatar}
                      color={p.color}
                      size="xs"
                    />
                    <span className="font-medium text-xs text-white truncate max-w-[130px]">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-amber-300 shrink-0">
                    {votesReceived} vote{votesReceived === 1 ? '' : 's'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Scoreboard Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white mb-3.5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard (Scores)</span>
            </h3>

            {/* Scrollable for up to 25 players */}
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {sortedPlayers.map((player, idx) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono font-bold text-xs text-slate-500 w-4 shrink-0">#{idx + 1}</span>
                    <AnimatedAvatar
                      avatar={player.avatar}
                      color={player.color}
                      size="xs"
                    />
                    <span className="font-bold text-xs text-white truncate max-w-[130px]">{player.name}</span>
                  </div>

                  <span className="font-mono font-bold text-xs sm:text-sm text-amber-300 shrink-0">
                    {player.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Controls */}
          {isHost ? (
            <div className="mt-5 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5">
              <button
                id="next-round-btn"
                onClick={() => {
                  sound.playStart();
                  onNextRound();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Play Next Round</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="return-lobby-btn"
                onClick={() => {
                  sound.playClick();
                  onReturnToLobby();
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Lobby</span>
              </button>
            </div>
          ) : (
            <div className="mt-5 text-center text-xs text-slate-400 italic">
              Waiting for the host to start the next round...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
