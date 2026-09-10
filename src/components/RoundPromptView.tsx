import React from 'react';
import { HelpCircle, RefreshCw, Vote, MessageSquare, Crown, CheckCircle2, Shield } from 'lucide-react';
import { GameState } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface RoundPromptViewProps {
  gameState: GameState;
  myPlayerId: string;
  isHost: boolean;
  onChooseContinueOrVote: (choice: 'continue' | 'vote') => void;
  onProceedToVoting: () => void;
}

export const RoundPromptView: React.FC<RoundPromptViewProps> = ({
  gameState,
  myPlayerId,
  isHost,
  onChooseContinueOrVote,
  onProceedToVoting,
}) => {
  const activePlayers = gameState.players.filter((p) => p.connected);
  const totalPlayers = activePlayers.length;
  const continueVotes = gameState.continueVotes || {};

  const myChoice = continueVotes[myPlayerId];

  let continueCount = 0;
  let voteCount = 0;
  Object.values(continueVotes).forEach((c) => {
    if (c === 'continue') continueCount++;
    if (c === 'vote') voteCount++;
  });

  const handleChoice = (choice: 'continue' | 'vote') => {
    sound.playClick();
    onChooseContinueOrVote(choice);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Round {gameState.clueRoundNumber || 1} Completed</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Continue Clues or Vote?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            All players completed their turn. Decide as a group: give another round of clues or vote out the Doopu (Imposter)!
          </p>
        </div>

        {/* Clues Review Box */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            <span>Clues Review ({gameState.clues.length} clues)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {gameState.clues.map((clue) => {
              const player = gameState.players.find((p) => p.id === clue.playerId);
              const isPassed = clue.text === '[Passed]';

              return (
                <div
                  key={clue.id}
                  className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5 min-w-0"
                >
                  {player && (
                    <AnimatedAvatar
                      avatar={player.avatar}
                      color={player.color}
                      size="xs"
                      className="shrink-0"
                    />
                  )}
                  <div className="min-w-0 overflow-hidden">
                    <span className="text-[11px] font-bold text-slate-300 block truncate">
                      {player?.name || 'Player'}
                    </span>
                    <span
                      className={`text-xs font-semibold truncate block ${
                        isPassed ? 'text-slate-500 italic' : 'text-amber-300'
                      }`}
                    >
                      &ldquo;{clue.text}&rdquo;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voting Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {/* Option 1: Continue */}
          <button
            id="round-prompt-continue-btn"
            type="button"
            onClick={() => handleChoice('continue')}
            className={`p-4 sm:p-6 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              myChoice === 'continue'
                ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2.5">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white mb-1">Continue Clues</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Play another round of clues. The host will set the turn sequence for round #{((gameState.clueRoundNumber || 1) + 1)}.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">
                {continueCount} / {totalPlayers} voted
              </span>
              {myChoice === 'continue' && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
          </button>

          {/* Option 2: Vote */}
          <button
            id="round-prompt-vote-btn"
            type="button"
            onClick={() => handleChoice('vote')}
            className={`p-4 sm:p-6 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
              myChoice === 'vote'
                ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2.5">
                <Vote className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-white mb-1">Proceed to Vote</h3>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Enough clues! Everyone casts a vote on who is the Doopu (Imposter).
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400">
                {voteCount} / {totalPlayers} voted
              </span>
              {myChoice === 'vote' && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Host controls / Info */}
        {isHost ? (
          <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Host Override: Start voting or another round whenever ready.</span>
            </div>
            <button
              id="host-force-vote-btn"
              type="button"
              onClick={onProceedToVoting}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              Start Voting Now
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-slate-400">
            When majority votes or host decides, the game will advance automatically.
          </p>
        )}
      </div>
    </div>
  );
};
