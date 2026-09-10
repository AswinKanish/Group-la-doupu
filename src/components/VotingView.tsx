import React, { useEffect } from 'react';
import { Vote, CheckCircle, ShieldAlert } from 'lucide-react';
import { GameState } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface VotingViewProps {
  gameState: GameState;
  myPlayerId: string;
  onCastVote: (targetPlayerId: string | null) => void;
}

export const VotingView: React.FC<VotingViewProps> = ({
  gameState,
  myPlayerId,
  onCastVote,
}) => {
  const myVote = gameState.votes[myPlayerId];
  const hasVoted = myVote !== undefined;
  const activePlayers = gameState.players.filter((p) => p.connected);
  const totalVotesCast = Object.keys(gameState.votes).length;

  useEffect(() => {
    sound.playVote();
  }, []);

  const handleVote = (targetPlayerId: string | null) => {
    sound.playClick();
    onCastVote(targetPlayerId);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 mb-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-500 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              Phase: Voting Out the Doopu
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {totalVotesCast}/{activePlayers.length} Voted
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Cast Your Vote</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the player you suspect of being the Imposter. You cannot vote for yourself.
          </p>
        </div>
      </div>

      {/* Player Vote Cards Grid - Scrollable for up to 25 players on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6 max-h-[520px] overflow-y-auto pr-1">
        {activePlayers.map((player) => {
          const isMe = player.id === myPlayerId;
          const isSelectedByMe = myVote === player.id;
          const playerClue = gameState.clues.find((c) => c.playerId === player.id)?.text;
          const hasThisPlayerVoted = gameState.votes[player.id] !== undefined;

          return (
            <div
              key={player.id}
              className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelectedByMe
                  ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/50 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AnimatedAvatar
                      avatar={player.avatar}
                      color={player.color}
                      size="sm"
                      animate={isSelectedByMe}
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-white block truncate max-w-[120px]">
                        {player.name}
                      </span>
                      {isMe && <span className="text-[10px] text-slate-400 block">(You)</span>}
                    </div>
                  </div>

                  {/* Voted badge */}
                  {hasThisPlayerVoted ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      <CheckCircle className="w-3 h-3" /> Voted
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 shrink-0">Deciding...</span>
                  )}
                </div>

                {/* Player's clue */}
                <div className="mb-3.5 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                    Clue Given:
                  </span>
                  <span className="font-bold text-xs text-amber-300 block truncate">
                    {playerClue ? `"${playerClue}"` : '[No clue recorded]'}
                  </span>
                </div>
              </div>

              {/* Vote action button */}
              <div>
                {isMe ? (
                  <div className="py-2 text-center text-xs text-slate-500 font-medium bg-slate-950/40 rounded-xl border border-slate-800">
                    Cannot vote for yourself
                  </div>
                ) : (
                  <button
                    id={`vote-player-${player.id}`}
                    type="button"
                    onClick={() => handleVote(player.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelectedByMe
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Vote className="w-3.5 h-3.5" />
                    <span>{isSelectedByMe ? 'Voted For' : 'Vote to Accuse'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip Vote Option */}
      <div className="flex justify-center">
        <button
          id="vote-skip-btn"
          type="button"
          onClick={() => handleVote(null)}
          className={`px-6 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
            myVote === null
              ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          {myVote === null ? '✓ Skipped Vote' : 'Skip / Abstain Vote'}
        </button>
      </div>
    </div>
  );
};
