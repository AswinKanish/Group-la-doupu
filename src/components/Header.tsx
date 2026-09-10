import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Radio, HelpCircle, UploadCloud } from 'lucide-react';
import { sound } from '../utils/sound';
import { NetworkMode } from '../types/game';

interface HeaderProps {
  roomCode?: string;
  isHost?: boolean;
  networkMode: NetworkMode;
  onToggleNetworkMode?: () => void;
  onOpenDeployGuide: () => void;
  onOpenRules: () => void;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
}

export const Header: React.FC<HeaderProps> = ({
  roomCode,
  isHost,
  networkMode,
  onToggleNetworkMode,
  onOpenDeployGuide,
  onOpenRules,
  connectionStatus,
}) => {
  const [isMuted, setIsMuted] = useState(sound.isMuted());
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const copyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    sound.playClick();
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyInviteLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    sound.playClick();
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-40 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center font-black text-lg tracking-wider shadow-lg shadow-rose-950/40 border border-rose-400/30">
            🎭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">Group la Doopu</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                25P
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Real-Time Multiplayer Party Game</p>
          </div>
        </div>

        {/* Room Code Badge (if in room) */}
        {roomCode && (
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-1.5 shadow-inner">
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                Room Code {isHost && <span className="text-amber-400 font-bold ml-1">• Host</span>}
              </span>
              <span className="font-mono font-black text-base text-amber-300 tracking-widest">
                {roomCode}
              </span>
            </div>

            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 ml-1">
              <button
                id="copy-room-code-btn"
                onClick={copyCode}
                title="Copy Room Code"
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                id="copy-invite-link-btn"
                onClick={copyInviteLink}
                title="Copy Invite Link"
                className="hidden sm:inline-flex text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors font-medium"
              >
                {copiedLink ? 'Copied Link!' : 'Invite Link'}
              </button>
            </div>
          </div>
        )}

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Connection Status Pill */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              connectionStatus === 'connected'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                : connectionStatus === 'connecting'
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 animate-pulse'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
            }`}
            title={`Mode: ${networkMode === 'websocket' ? 'WebSocket (Cloud Server)' : 'WebRTC P2P (Serverless/Vercel)'}`}
          >
            <Radio className="w-3 h-3" />
            <span className="capitalize">{networkMode === 'websocket' ? 'WS' : 'P2P'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
          </div>

          {/* Vercel & Netlify Deploy Guide Button */}
          <button
            id="open-deploy-guide-btn"
            onClick={onOpenDeployGuide}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
            title="Free Vercel & Netlify Deployment Guide"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Deploy Free</span>
          </button>

          {/* How to Play Rules */}
          <button
            id="open-rules-btn"
            onClick={onOpenRules}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Audio Toggle */}
          <button
            id="toggle-audio-btn"
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                : 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
