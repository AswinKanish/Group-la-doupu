import React, { useState } from 'react';
import { Send, UserCheck, AlertCircle, FastForward, ListOrdered, Sparkles, Shield, UserX } from 'lucide-react';
import { GameState } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface ClueGivingViewProps {
  gameState: GameState;
  myPlayerId: string;
  isHost: boolean;
  onSubmitClue: (clue: string) => void;
  onPassTurn: () => void;
}

export const ClueGivingView: React.FC<ClueGivingViewProps> = ({
  gameState,
  myPlayerId,
  isHost,
  onSubmitClue,
  onPassTurn,
}) => {
  const [clueInput, setClueInput] = useState('');
  const isMyTurn = gameState.currentTurnPlayerId === myPlayerId;
  const currentTurnPlayer = gameState.players.find((p) => p.id === gameState.currentTurnPlayerId);
  const isImposter = gameState.myRole === 'imposter';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueInput.trim() || !isMyTurn) return;
    sound.playClick();
    onSubmitClue(clueInput.trim());
    setClueInput('');
  };

  const handlePass = () => {
    sound.playClick();
    onPassTurn();
    setClueInput('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Turn Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 mb-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left w-full sm:w-auto">
          {currentTurnPlayer && (
            <AnimatedAvatar
              avatar={currentTurnPlayer.avatar}
              color={currentTurnPlayer.color}
              size="lg"
              animate={true}
              className="shadow-lg shrink-0"
            />
          )}
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-slate-400">
                Round {gameState.clueRoundNumber || 1} • Sequential Clues
              </span>
              {isMyTurn && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 animate-pulse">
                  YOUR TURN!
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {isMyTurn ? "It's your turn to give a clue!" : `${currentTurnPlayer?.name}'s turn to give a clue...`}
            </h2>
          </div>
        </div>

        {/* Player Word Pill / Imposter Indicator */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
          {isImposter ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 border border-rose-600/50 text-rose-300 text-xs font-bold flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-400" />
              <span>You are the Doopu</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center gap-2">
              <span className="text-slate-400 font-medium">Secret Word:</span>
              <span className="font-mono font-black text-amber-300 text-sm">
                {gameState.mySecretWord}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Sequential Turn Order & Input (7 cols) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          {/* Turn Order Tracker */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-rose-400" />
                <span>Player Turn Sequence</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {gameState.clues.length}/{gameState.turnOrder.length} Given
              </span>
            </div>

            {/* Scrollable for up to 25 players */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {gameState.turnOrder.map((pId, idx) => {
                const player = gameState.players.find((item) => item.id === pId);
                const hasGivenClue = gameState.clues.some((c) => c.playerId === pId);
                const isCurrent = gameState.currentTurnPlayerId === pId;
                const isMe = pId === myPlayerId;
                const playerClue = gameState.clues.find((c) => c.playerId === pId);

                return (
                  <div
                    key={pId}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-rose-950/30 border-rose-500/60 ring-2 ring-rose-500/30 shadow-md'
                        : hasGivenClue
                        ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                        : 'bg-slate-950/40 border-slate-800/40 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isCurrent
                            ? 'bg-rose-600 text-white'
                            : hasGivenClue
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      {player && (
                        <AnimatedAvatar
                          avatar={player.avatar}
                          color={player.color}
                          size="xs"
                          animate={isCurrent}
                        />
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-white truncate max-w-[120px]">
                            {player?.name}
                          </span>
                          {isMe && (
                            <span className="text-[9px] px-1 py-0.1 rounded bg-rose-500/20 text-rose-300 font-bold shrink-0">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {isCurrent
                            ? 'Giving clue now...'
                            : hasGivenClue
                            ? 'Clue completed'
                            : 'Waiting'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {hasGivenClue ? (
                        <div className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-300 font-semibold bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 max-w-[130px] sm:max-w-[170px] truncate">
                          <UserCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">&ldquo;{playerClue?.text}&rdquo;</span>
                        </div>
                      ) : isCurrent ? (
                        <span className="text-[11px] font-bold text-rose-400 animate-pulse bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-800">
                          Active Turn
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-600">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clue Submission Box for Current Player */}
          {isMyTurn && (
            <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-amber-950/90 border-2 border-rose-500 rounded-3xl p-4 sm:p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-300">
                  Your Turn: Submit Your Clue
                </span>
                <span className="text-[11px] text-slate-400">
                  (Single word or short clue)
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="clue-input-field"
                  type="text"
                  maxLength={45}
                  value={clueInput}
                  onChange={(e) => setClueInput(e.target.value)}
                  placeholder="Type your clue..."
                  autoFocus
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-rose-400"
                />

                <div className="flex gap-2">
                  <button
                    id="submit-clue-btn"
                    type="submit"
                    disabled={!clueInput.trim()}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Clue</span>
                  </button>

                  <button
                    id="pass-turn-btn"
                    type="button"
                    onClick={handlePass}
                    className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    Pass
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Host Skip button if a player is idle/away */}
          {isHost && !isMyTurn && (
            <div className="flex justify-end">
              <button
                id="host-skip-turn-btn"
                type="button"
                onClick={onPassTurn}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip Stalled Player Turn</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Clue Feed (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col h-full min-h-[350px]">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                <span>Clues Feed</span>
                <span className="text-[11px] font-normal text-slate-400">
                  ({gameState.clues.length}/{gameState.turnOrder.length})
                </span>
              </h3>
            </div>

            {gameState.clues.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                <AlertCircle className="w-7 h-7 mb-2 opacity-40" />
                <p className="text-xs font-semibold text-slate-400">No clues submitted yet</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Waiting for {currentTurnPlayer?.name || 'the first player'} to submit a clue!
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[360px]">
                {gameState.clues.map((entry, idx) => {
                  const player = gameState.players.find((p) => p.id === entry.playerId);
                  const isPassed = entry.text === '[Passed]';

                  return (
                    <div
                      key={entry.id || idx}
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-2.5 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {player && (
                          <AnimatedAvatar
                            avatar={player.avatar}
                            color={player.color}
                            size="sm"
                          />
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-white block truncate">{player?.name}</span>
                          <span className="text-[10px] text-slate-500">Clue #{idx + 1}</span>
                        </div>
                      </div>

                      <div className="bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 rounded-xl max-w-[160px] text-right shrink-0">
                        <span
                          className={`font-bold text-xs sm:text-sm tracking-wide break-words ${
                            isPassed ? 'text-slate-500 italic' : 'text-amber-300'
                          }`}
                        >
                          &ldquo;{entry.text}&rdquo;
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
