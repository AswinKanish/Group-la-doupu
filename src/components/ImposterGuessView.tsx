import React, { useState, useEffect } from 'react';
import { Target, AlertTriangle, Send } from 'lucide-react';
import { GameState } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface ImposterGuessViewProps {
  gameState: GameState;
  myPlayerId: string;
  onImposterGuess: (word: string) => void;
}

export const ImposterGuessView: React.FC<ImposterGuessViewProps> = ({
  gameState,
  myPlayerId,
  onImposterGuess,
}) => {
  const [guessInput, setGuessInput] = useState('');
  const caughtPlayerId = gameState.verdictDetails?.ejectedPlayerId;
  const isMeCaught = caughtPlayerId === myPlayerId;
  const caughtPlayer = gameState.players.find((p) => p.id === caughtPlayerId);

  useEffect(() => {
    sound.playSuspense();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim() || !isMeCaught) return;
    sound.playClick();
    onImposterGuess(guessInput.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Dramatic Alert Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold mb-3 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>DOOPU REDEMPTION GUESS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isMeCaught
            ? 'You Were Caught! Guess the Secret Word to Win!'
            : `${caughtPlayer?.name || 'The Doopu'} is making their final guess...`}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1.5">
          {isMeCaught
            ? 'You have one chance to guess the secret Tamil Nadu word (famous personality, place, food, song or movie). If correct, you steal the win from the Crew!'
            : 'The crew identified the Doopu! If they cannot guess the secret word, the Crew wins!'}
        </p>
      </div>

      {/* Redemption Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-rose-500" />
            <span>Tamil Nadu Secret Word Guess</span>
          </span>
          {isMeCaught ? (
            <span className="text-xs text-amber-300 font-bold">Type your guess below</span>
          ) : (
            <span className="text-xs text-slate-500">Waiting for {caughtPlayer?.name}...</span>
          )}
        </div>

        {isMeCaught ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              id="imposter-guess-input"
              type="text"
              maxLength={50}
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value)}
              placeholder="e.g. Rajinikanth, Marina Beach, Biryani..."
              autoFocus
              className="w-full bg-slate-950 border-2 border-rose-500/80 rounded-2xl px-4 py-3.5 text-white text-base sm:text-lg font-bold placeholder-slate-600 focus:outline-none focus:border-rose-400 transition-colors text-center"
            />

            <div className="flex gap-2.5">
              <button
                id="imposter-submit-guess-btn"
                type="submit"
                disabled={!guessInput.trim()}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-950/40 hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Final Guess</span>
              </button>

              <button
                id="imposter-forfeit-guess-btn"
                type="button"
                onClick={() => onImposterGuess('')}
                className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Give Up
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center text-slate-400 flex flex-col items-center justify-center">
            {caughtPlayer && (
              <AnimatedAvatar
                avatar={caughtPlayer.avatar}
                color={caughtPlayer.color}
                size="xl"
                animate={true}
                className="shadow-xl mb-3"
              />
            )}
            <p className="text-sm font-bold text-white mb-1">
              {caughtPlayer?.name} is thinking...
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              They are trying to figure out which Tamil Nadu word all the clues pointed to!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
