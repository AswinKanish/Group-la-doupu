import React, { useState } from 'react';
import {
  Play,
  Crown,
  CheckCircle2,
  Send,
  LogOut,
  Copy,
  Check,
  Share2,
  Shield,
  UserX,
  Users,
  MessageSquare,
  Sparkles,
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
  const [showChat, setShowChat] = useState(false);

  const me = gameState.players.find((p) => p.id === myPlayerId);
  const activePlayers = gameState.players.filter((p) => p.connected);
  const currentImposters = gameState.settings.imposterCount || 1;
  const canStart = activePlayers.length >= 3;

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

  const handleSetImposters = (count: number) => {
    sound.playClick();
    onUpdateSettings({ imposterCount: count });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 animate-fade-in">
      {/* Lobby Room Header */}
      <div className="bg-[#0b0e17]/95 border border-white/[0.08] rounded-3xl p-4 sm:p-6 mb-6 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Room Code Showcase */}
        <div className="flex items-center gap-4 text-center md:text-left w-full md:w-auto justify-between md:justify-start">
          <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-purple-600 to-cyan-400 shrink-0 hidden sm:block shadow-lg">
            <img
              src="/imposter-icon.png"
              alt="Lobby Icon"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-[10px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
                OPERATIONS LOBBY
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/[0.06] text-slate-300 font-semibold">
                {activePlayers.length}/25 Operatives
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest">
                {gameState.roomCode}
              </span>

              <button
                type="button"
                onClick={copyCode}
                className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy Invite Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copiedLink ? 'Copied Link' : 'Invite'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setShowChat(!showChat)}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              showChat
                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat ({gameState.chatMessages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onLeaveRoom();
            }}
            className="px-3.5 py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Connected Operatives Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0b0e17]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Connected Operatives</span>
              </h3>
              <span className="text-xs text-slate-500">
                Minimum 3 players required
              </span>
            </div>

            {/* Operatives Cards Grid - Scalable for up to 25 players */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {activePlayers.map((player) => {
                const isMe = player.id === myPlayerId;
                const isPlayerHost = player.isHost;

                return (
                  <div
                    key={player.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isMe
                        ? 'bg-cyan-950/20 border-cyan-500/40 ring-1 ring-cyan-500/20'
                        : 'bg-[#070910] border-white/[0.06] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <AnimatedAvatar
                        avatar={player.avatar}
                        color={player.color}
                        size="md"
                        animate={true}
                        className="shrink-0"
                      />

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-white truncate max-w-[120px]">
                            {player.name}
                          </span>
                          {isMe && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                              YOU
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isPlayerHost ? (
                            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                              <Crown className="w-3 h-3" /> Host
                            </span>
                          ) : player.isReady ? (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">Standby</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Host kick player action */}
                    {isHost && !isPlayerHost && onKickPlayer && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          onKickPlayer(player.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title={`Remove ${player.name}`}
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Game Master Launch (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Host Setup Panel */}
          {isHost ? (
            <div className="bg-[#0b0e17]/90 border border-cyan-500/25 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Host Mission Control
                </h3>
              </div>

              {/* Imposter Settings */}
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                  Imposters in Game
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetImposters(1)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currentImposters === 1
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    1 Imposter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetImposters(2)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currentImposters === 2
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    2 Imposters
                  </button>
                </div>
              </div>

              {/* Start Game Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playVictory();
                    onStartGame();
                  }}
                  disabled={!canStart}
                  className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    canStart
                      ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-black hover:shadow-cyan-500/30 cursor-pointer animate-pulse active:scale-[0.98]'
                      : 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{canStart ? 'Commence Operation' : `Need ${3 - activePlayers.length} More`}</span>
                </button>
                {!canStart && (
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Share room code <span className="font-mono text-cyan-400">{gameState.roomCode}</span> to start
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Guest Ready Panel */
            <div className="bg-[#0b0e17]/90 border border-purple-500/25 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4 text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Operative Status
              </h3>
              <p className="text-xs text-slate-400">
                Confirm you are ready to receive your secret role briefing.
              </p>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleReady();
                }}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                  me?.isReady
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/60'
                }`}
              >
                {me?.isReady ? '✓ Ready for Briefing' : 'Set Ready Status'}
              </button>

              <span className="text-[11px] text-slate-500 block">
                Awaiting host to launch mission...
              </span>
            </div>
          )}

          {/* Tactical Chat Feed (Toggleable Drawer) */}
          {showChat && (
            <div className="bg-[#070910] border border-white/[0.08] rounded-3xl p-4 shadow-xl flex flex-col h-64 animate-fade-in">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Tactical Chat
              </span>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
                {gameState.chatMessages.length === 0 ? (
                  <span className="text-xs text-slate-600 block text-center py-8">
                    No messages yet. Say hello!
                  </span>
                ) : (
                  gameState.chatMessages.map((msg) => (
                    <div key={msg.id} className="text-xs leading-relaxed">
                      <span className="font-bold text-cyan-300 mr-1.5">{msg.senderName}:</span>
                      <span className="text-slate-300">{msg.text}</span>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input
                  type="text"
                  maxLength={60}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Transmit message..."
                  className="flex-1 bg-[#0b0e17] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
