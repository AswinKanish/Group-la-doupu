import React, { useState } from 'react';
import {
  Play,
  Settings,
  Crown,
  CheckCircle2,
  Send,
  LogOut,
  Copy,
  Check,
  ListOrdered,
  Plus,
  Minus,
  Skull,
} from 'lucide-react';
import { GameState, GameSettings } from '../types/game';
import { AnimatedAvatar } from './AnimatedAvatar';
import { sound } from '../utils/sound';

interface LobbyViewProps {
  gameState: GameState;
  myPlayerId: string;
  isHost: boolean;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onToggleReady: () => void;
  onStartGame: () => void;
  onSendChat: (text: string) => void;
  onLeaveRoom: () => void;
  onKickPlayer?: (playerId: string) => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  gameState,
  myPlayerId,
  isHost,
  onUpdateSettings,
  onToggleReady,
  onStartGame,
  onSendChat,
  onLeaveRoom,
  onKickPlayer,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const me = gameState.players.find((p) => p.id === myPlayerId);
  const activePlayers = gameState.players.filter((p) => p.connected);
  const maxPossibleImposters = Math.max(1, Math.min(8, Math.floor((activePlayers.length > 2 ? activePlayers.length - 1 : 24) / 2)));
  const currentImposters = gameState.settings.imposterCount || 1;

  const copyCode = () => {
    navigator.clipboard.writeText(gameState.roomCode);
    sound.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    const url = `${window.location.origin}?room=${gameState.roomCode}`;
    navigator.clipboard.writeText(url);
    sound.playClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
    sound.playClick();
  };

  const sendQuickReaction = (reaction: string) => {
    onSendChat(reaction);
    sound.playClick();
  };

  const handleAdjustImposters = (delta: number) => {
    const next = Math.max(1, Math.min(maxPossibleImposters, currentImposters + delta));
    if (next !== currentImposters) {
      sound.playClick();
      onUpdateSettings({ imposterCount: next });
    }
  };

  const handleSetImposters = (count: number) => {
    sound.playClick();
    onUpdateSettings({ imposterCount: count });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Top Banner with Room Code & Quick Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 mb-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center md:text-left w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg border border-rose-400/30 shrink-0">
              🎭
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Room Code</span>
                <span className="font-mono font-black text-xl sm:text-2xl text-amber-300 tracking-wider">
                  {gameState.roomCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {activePlayers.length} / 25 Players • {currentImposters} Doopu (Imposter{currentImposters > 1 ? 's' : ''})
              </p>
            </div>
          </div>

          {/* Leave Button for Mobile in Header */}
          <button
            id="lobby-leave-btn-mobile"
            onClick={onLeaveRoom}
            className="md:hidden p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all cursor-pointer"
            title="Leave Lobby"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="lobby-copy-code-btn"
            onClick={copyCode}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            id="lobby-share-link-btn"
            onClick={copyLink}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : null}
            <span>{copiedLink ? 'Link Copied!' : 'Invite Link'}</span>
          </button>

          <button
            id="lobby-leave-btn"
            onClick={onLeaveRoom}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Player Roster & Ready Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">Players Roster</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                  {activePlayers.length} / 25
                </span>
              </div>

              <span className="text-xs text-slate-400">
                {isHost ? 'You are Host' : me?.isReady ? 'Ready' : 'Not Ready'}
              </span>
            </div>

            {/* Scrollable Player List - Smoothly handles up to 25 players */}
            <div className="space-y-2 mb-6 max-h-[360px] overflow-y-auto pr-1">
              {activePlayers.map((player) => {
                const isCurrent = player.id === myPlayerId;
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-slate-800/80 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <AnimatedAvatar
                        avatar={player.avatar}
                        color={player.color}
                        size="md"
                        animate={isCurrent}
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm text-white truncate max-w-[130px]">
                            {player.name}
                          </span>
                          {player.isHost && (
                            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" title="Host" />
                          )}
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] text-rose-400 font-semibold block">
                            (You)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {player.isHost ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Host
                        </span>
                      ) : player.isReady ? (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
                          Waiting
                        </span>
                      )}

                      {isHost && !player.isHost && onKickPlayer && (
                        <button
                          onClick={() => onKickPlayer(player.id)}
                          className="text-[11px] text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Remove player"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ready / Start Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {!isHost && (
                <button
                  id="lobby-ready-toggle-btn"
                  onClick={() => {
                    sound.playClick();
                    onToggleReady();
                  }}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    me?.isReady
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 hover:bg-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{me?.isReady ? 'Ready! (Tap to unready)' : "I'm Ready to Play"}</span>
                </button>
              )}

              {isHost && (
                <button
                  id="lobby-start-game-btn"
                  disabled={activePlayers.length < 2}
                  onClick={() => {
                    sound.playStart();
                    onStartGame();
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-rose-950/40 hover:opacity-95 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Game</span>
                </button>
              )}
            </div>
          </div>

          {/* Lobby Live Chat & Reactions */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col h-[240px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lobby Chat
              </span>
              <div className="flex gap-1">
                {['👋', '👀', '🤫', '🔥', '🕵️'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => sendQuickReaction(emoji)}
                    className="hover:scale-125 transition-transform text-sm p-1 rounded hover:bg-slate-800 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat message list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 p-2.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-xs">
              {gameState.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-1.5 rounded-lg ${
                    msg.isSystem ? 'bg-indigo-950/30 text-indigo-300 font-medium' : 'text-slate-200'
                  }`}
                >
                  <span className="font-bold mr-1.5" style={{ color: msg.senderColor }}>
                    {msg.senderName}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Send input */}
            <form onSubmit={handleChatSubmit} className="mt-2.5 flex gap-2">
              <input
                id="lobby-chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something to the lobby..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <button
                id="lobby-chat-send-btn"
                type="submit"
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Host Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/85 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-400" />
                <span>Host Settings</span>
              </h3>
              {!isHost && (
                <span className="text-[11px] text-slate-500 italic">Host controls settings</span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {/* Imposter Count Configurator */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Skull className="w-4 h-4 text-rose-500" />
                    <label className="text-slate-300 font-bold text-xs">
                      Number of Imposters (Doopu)
                    </label>
                  </div>
                  <span className="text-rose-400 font-mono font-bold text-sm">
                    {currentImposters} {currentImposters === 1 ? 'Imposter' : 'Imposters'}
                  </span>
                </div>

                {isHost ? (
                  <div className="space-y-2.5">
                    {/* Stepper controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAdjustImposters(-1)}
                        disabled={currentImposters <= 1}
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                        title="Decrease imposters"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-center">
                        <span className="font-black text-lg text-white font-mono">{currentImposters}</span>
                        <span className="text-[10px] text-slate-400 block">
                          for {activePlayers.length} players
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdjustImposters(1)}
                        disabled={currentImposters >= maxPossibleImposters}
                        className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors cursor-pointer"
                        title="Increase imposters"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5, 6].map((num) => {
                        const isAvailable = num <= maxPossibleImposters;
                        const isSelected = currentImposters === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => handleSetImposters(num)}
                            className={`flex-1 min-w-[36px] py-1.5 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-rose-600 border-rose-500 text-white shadow-sm'
                                : isAvailable
                                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                                : 'bg-slate-950 border-slate-900 text-slate-600 opacity-40 cursor-not-allowed'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs">
                    The host configured <strong className="text-white">{currentImposters} imposter{currentImposters > 1 ? 's' : ''}</strong>.
                  </div>
                )}
              </div>

              {/* Sequential Turn Order Info */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                <ListOrdered className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Sequential Turn Order</span>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Host orders player turns before each round. Players give clues one at a time.
                  </span>
                </div>
              </div>

              {/* Imposter Guess Rule */}
              <div className="pt-2 border-t border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300 font-medium">Imposter Redemption Guess</span>
                  <input
                    id="lobby-settings-imposter-guess"
                    type="checkbox"
                    disabled={!isHost}
                    checked={gameState.settings.allowImposterGuess}
                    onChange={(e) => onUpdateSettings({ allowImposterGuess: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-slate-950 border-slate-700 cursor-pointer"
                  />
                </label>
                <p className="text-[10px] text-slate-500 mt-1">
                  If caught in voting, the Imposter can guess the secret word to steal the win.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
