import React, { useState, useEffect } from 'react';
import { ListOrdered, ArrowUp, ArrowDown, Shuffle, Play, Crown, Clock, Users } from 'lucide-react';
import { GameState, Player } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface HostOrderViewProps {
  gameState: GameState;
  myPlayerId: string;
  isHost: boolean;
  onSetTurnOrder: (orderedPlayerIds: string[]) => void;
}

export const HostOrderView: React.FC<HostOrderViewProps> = ({
  gameState,
  myPlayerId,
  isHost,
  onSetTurnOrder,
}) => {
  const activePlayers = gameState.players.filter((p) => p.connected);

  // Initialize with gameState.turnOrder or default to active player IDs
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    if (gameState.turnOrder && gameState.turnOrder.length > 0) {
      const activeIds = activePlayers.map((p) => p.id);
      const validOrder = gameState.turnOrder.filter((id) => activeIds.includes(id));
      const missing = activeIds.filter((id) => !validOrder.includes(id));
      return [...validOrder, ...missing];
    }
    return activePlayers.map((p) => p.id);
  });

  // Sync if players change
  useEffect(() => {
    const activeIds = activePlayers.map((p) => p.id);
    setOrderedIds((prev) => {
      const valid = prev.filter((id) => activeIds.includes(id));
      const missing = activeIds.filter((id) => !valid.includes(id));
      return [...valid, ...missing];
    });
  }, [gameState.players]);

  const moveUp = (index: number) => {
    if (index <= 0) return;
    sound.playClick();
    setOrderedIds((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index >= orderedIds.length - 1) return;
    sound.playClick();
    setOrderedIds((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const shuffleOrder = () => {
    sound.playClick();
    setOrderedIds((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  const handleConfirm = () => {
    sound.playStart();
    onSetTurnOrder(orderedIds);
  };

  const playerMap = new Map<string, Player>(gameState.players.map((p) => [p.id, p]));

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ListOrdered className="w-4 h-4" />
            <span>Turn Order Setup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isHost ? 'Set Clue Giving Order' : 'Waiting for Host'}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            {isHost
              ? 'Arrange the sequence in which players will give their clues one at a time.'
              : 'The room host is deciding the player sequence for this round of clues.'}
          </p>
        </div>

        {/* Host Controls */}
        {isHost && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-slate-400 font-semibold">
              Round {gameState.clueRoundNumber || 1} Sequence ({orderedIds.length} Players)
            </span>
            <button
              id="host-order-shuffle-btn"
              type="button"
              onClick={shuffleOrder}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Randomize Order</span>
            </button>
          </div>
        )}

        {/* Player Sequence List - Scrollable for up to 25 players on mobile */}
        <div className="space-y-2 mb-6 max-h-[440px] overflow-y-auto pr-1">
          {orderedIds.map((playerId, index) => {
            const player = playerMap.get(playerId);
            if (!player) return null;
            const isMe = player.id === myPlayerId;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-slate-800/95 border-rose-500/50 ring-1 ring-rose-500/25'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Position number pill */}
                  <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-amber-400 text-xs shrink-0">
                    {index + 1}
                  </div>

                  {/* Animated Avatar */}
                  <AnimatedAvatar
                    avatar={player.avatar}
                    color={player.color}
                    size="sm"
                    animate={isMe}
                  />

                  {/* Player Name */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[130px]">
                        {player.name}
                      </span>
                      {player.isHost && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Host" />
                      )}
                      {isMe && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold shrink-0">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Turn #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Host Reorder Actions */}
                {isHost && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id={`host-order-up-btn-${index}`}
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveUp(index)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`host-order-down-btn-${index}`}
                      type="button"
                      disabled={index === orderedIds.length - 1}
                      onClick={() => moveDown(index)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer / Confirm CTA */}
        {isHost ? (
          <button
            id="host-order-confirm-btn"
            type="button"
            onClick={handleConfirm}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-950/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Confirm Order &amp; Reveal Roles</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-center gap-2 text-slate-400 text-xs">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Waiting for the host to confirm the turn order...</span>
          </div>
        )}
      </div>
    </div>
  );
};
