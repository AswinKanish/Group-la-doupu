import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, Vote, Send, Sparkles } from 'lucide-react';
import { GameState } from '../types/game';
import { sound } from '../utils/sound';

interface DiscussionViewProps {
  gameState: GameState;
  myPlayerId: string;
  isHost: boolean;
  onProceedToVoting: () => void;
  onSendChat: (text: string) => void;
}

export const DiscussionView: React.FC<DiscussionViewProps> = ({
  gameState,
  myPlayerId,
  isHost,
  onProceedToVoting,
  onSendChat,
}) => {
  const [chatInput, setChatInput] = useState('');
  const isImposter = gameState.myRole === 'imposter';

  useEffect(() => {
    sound.playSuspense();
  }, []);

  // Timer ticking sound for last 5 seconds
  useEffect(() => {
    if (gameState.timerRemaining !== null && gameState.timerRemaining <= 5 && gameState.timerRemaining > 0) {
      sound.playTick();
    }
  }, [gameState.timerRemaining]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
    sound.playClick();
  };

  const sendReaction = (text: string) => {
    onSendChat(text);
    sound.playClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">Phase: Discussion</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Category: {gameState.category}</span>
          </div>
          <h2 className="text-2xl font-black text-white">Who is the Imposter?</h2>
          <p className="text-xs text-slate-400">
            Compare each player's clue to the 16 items on the board. Who gave an awkward or vague clue?
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Synchronized Timer */}
          {gameState.timerRemaining !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-base font-bold border transition-colors ${
                gameState.timerRemaining <= 5
                  ? 'bg-rose-950/70 border-rose-600 text-rose-400 animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-amber-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{gameState.timerRemaining}s</span>
            </div>
          )}

          {isHost && (
            <button
              id="proceed-to-voting-btn"
              onClick={() => {
                sound.playClick();
                onProceedToVoting();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Vote className="w-4 h-4" />
              <span>Start Voting</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clues Summary & 16 Word Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Clues Recap Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="font-bold text-base text-white mb-3 flex items-center justify-between">
              <span>All Clues Submitted</span>
              <span className="text-xs text-slate-400 font-normal">Scrutinize every word</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {gameState.clues.map((clue, idx) => {
                const player = gameState.players.find((p) => p.id === clue.playerId);
                const isMe = clue.playerId === myPlayerId;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${
                      isMe ? 'bg-slate-900 border-amber-500/40 ring-1 ring-amber-500/20' : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player?.avatar || '👤'}</span>
                      <div className="text-left">
                        <span className="font-bold text-xs text-white block">{clue.playerName}</span>
                        {isMe && <span className="text-[9px] text-amber-400">You</span>}
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">
                      <span className="font-bold text-xs text-amber-300">"{clue.clue}"</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 16-Word Category Grid */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Category: {gameState.category}
              </h4>
              {!isImposter && (
                <span className="text-xs font-mono font-bold text-amber-300">
                  Secret Word: {gameState.mySecretWord}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {gameState.wordGrid.map((word, idx) => {
                const isSecret = !isImposter && word === gameState.mySecretWord;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-center font-bold text-xs border ${
                      isSecret
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: In-Game Live Discussion Chat & Reactions (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[460px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                Live Discussion & Accusations
              </span>
            </div>

            {/* Quick Accusation Reaction Chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {['👀 That clue was SUS!', '🛡️ I am 100% innocent!', '🤔 Explain your clue!', '🎯 Vote them out!'].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => sendReaction(phrase)}
                  className="text-[11px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {phrase}
                </button>
              ))}
            </div>

            {/* Chat messages stream */}
            <div className="flex-1 overflow-y-auto space-y-2 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
              {gameState.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-lg ${
                    msg.isSystem ? 'bg-indigo-950/40 text-indigo-300 font-medium' : 'text-slate-200'
                  }`}
                >
                  <span className="font-bold mr-1.5" style={{ color: msg.senderColor }}>
                    {msg.senderName}:
                  </span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form onSubmit={handleChatSubmit} className="mt-3 flex gap-2">
              <input
                id="discussion-chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Accuse someone or defend your clue..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <button
                id="discussion-chat-send-btn"
                type="submit"
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
