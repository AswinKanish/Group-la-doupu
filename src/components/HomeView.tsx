import React, { useState, useEffect } from 'react';
import { Users, Play, KeyRound, ArrowRight, Dice5, Check, ShieldAlert } from 'lucide-react';
import { PLAYER_COLORS } from '../data/words';
import { ANIMATED_CHARACTERS, normalizeCharacterId } from '../data/characters';
import { AnimatedAvatar } from './AnimatedAvatar';
import { NetworkMode } from '../types/game';
import { sound } from '../utils/sound';

interface HomeViewProps {
  onHost: (playerData: { name: string; avatar: string; color: string }, mode: NetworkMode) => void;
  onJoin: (roomCode: string, playerData: { name: string; avatar: string; color: string }, mode: NetworkMode) => void;
  networkMode: NetworkMode;
  onSelectNetworkMode: (mode: NetworkMode) => void;
  initialRoomCode?: string;
  isConnecting: boolean;
  errorMessage?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onHost,
  onJoin,
  networkMode,
  onSelectNetworkMode,
  initialRoomCode = '',
  isConnecting,
  errorMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'host' | 'join'>(initialRoomCode ? 'join' : 'host');

  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('imposter_player_name') || 'Player ' + Math.floor(Math.random() * 90 + 10);
  });

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem('imposter_player_avatar');
    return saved ? normalizeCharacterId(saved) : ANIMATED_CHARACTERS[0].id;
  });

  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('imposter_player_color') || PLAYER_COLORS[0];
  });

  const [roomCode, setRoomCode] = useState(initialRoomCode.toUpperCase());

  useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(initialRoomCode.toUpperCase());
      setActiveTab('join');
    }
  }, [initialRoomCode]);

  const handleNameChange = (val: string) => {
    setPlayerName(val);
    try {
      localStorage.setItem('imposter_player_name', val);
    } catch {}
  };

  const handleAvatarSelect = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    sound.playClick();
    try {
      localStorage.setItem('imposter_player_avatar', avatarId);
    } catch {}
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    sound.playClick();
    try {
      localStorage.setItem('imposter_player_color', color);
    } catch {}
  };

  const randomizeProfile = () => {
    sound.playClick();
    const randomChar = ANIMATED_CHARACTERS[Math.floor(Math.random() * ANIMATED_CHARACTERS.length)].id;
    const randomCol = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
    setSelectedAvatar(randomChar);
    setSelectedColor(randomCol);
    try {
      localStorage.setItem('imposter_player_avatar', randomChar);
      localStorage.setItem('imposter_player_color', randomCol);
    } catch {}
  };

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isConnecting) return;
    sound.playClick();
    onHost(
      {
        name: playerName.trim(),
        avatar: selectedAvatar,
        color: selectedColor,
      },
      networkMode
    );
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !roomCode.trim() || isConnecting) return;
    sound.playClick();
    onJoin(
      roomCode.trim().toUpperCase(),
      {
        name: playerName.trim(),
        avatar: selectedAvatar,
        color: selectedColor,
      },
      networkMode
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Brand Heading */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-bold tracking-wide uppercase mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Real-Time Multiplayer • Up to 25 Players</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2">
          GROUP LA <span className="text-rose-500">DOOPU</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Find the secret imposter among you. Give subtle clues and vote out the Doopu.
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-sm text-center shadow-lg animate-in fade-in">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Main Action Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur-sm">
        {/* Navigation Tabs (Host vs Join) */}
        <div className="flex p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-6 max-w-md mx-auto">
          <button
            id="tab-host-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('host');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'host'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Host Game</span>
          </button>

          <button
            id="tab-join-btn"
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('join');
            }}
            className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'join'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Join with Code</span>
          </button>
        </div>

        {/* Profile Setup Section */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-500" />
              <span>Player Profile</span>
            </h3>
            <button
              id="randomize-profile-btn"
              type="button"
              onClick={randomizeProfile}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Dice5 className="w-3.5 h-3.5 text-amber-400" />
              <span>Randomize</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Live Character Preview */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <AnimatedAvatar
                avatar={selectedAvatar}
                color={selectedColor}
                size="2xl"
                animate={true}
                className="shadow-2xl"
              />
              <div className="text-center mt-3">
                <span className="text-base font-black text-white block truncate max-w-[160px]">
                  {playerName || 'Player'}
                </span>
              </div>
            </div>

            {/* Avatar & Color Picker */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Your Name
                </label>
                <input
                  id="player-name-input"
                  type="text"
                  maxLength={18}
                  value={playerName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm font-semibold focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {/* Avatar Selector Grid - Pure images, no character names */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80 max-h-44 overflow-y-auto">
                  {ANIMATED_CHARACTERS.map((char) => {
                    const isSelected = selectedAvatar === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleAvatarSelect(char.id)}
                        className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-rose-500 ring-2 ring-rose-500/40 shadow-lg scale-105'
                            : 'bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:scale-105'
                        }`}
                      >
                        <AnimatedAvatar
                          avatar={char.id}
                          color={isSelected ? selectedColor : '#64748b'}
                          size="sm"
                          border={false}
                          animate={isSelected}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color options */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Color Accent
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLAYER_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => handleColorSelect(col)}
                      className={`w-7 h-7 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                        selectedColor === col
                          ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900 shadow-md'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col }}
                    >
                      {selectedColor === col && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: Host Form */}
        {activeTab === 'host' && (
          <form onSubmit={handleHostSubmit} className="space-y-4">
            <button
              id="host-create-room-btn"
              type="submit"
              disabled={isConnecting || !playerName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white font-black text-base shadow-xl shadow-rose-950/40 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isConnecting ? (
                <span>Creating Room...</span>
              ) : (
                <>
                  <span>Create Game Room</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: Join Form */}
        {activeTab === 'join' && (
          <form onSubmit={handleJoinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Enter 4-Character Room Code
              </label>
              <input
                id="join-room-code-input"
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g. 4X8B"
                className="w-full text-center font-mono text-3xl font-black tracking-widest bg-slate-950 border-2 border-slate-700 rounded-2xl py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors uppercase"
              />
            </div>

            <button
              id="join-room-btn"
              type="submit"
              disabled={isConnecting || !roomCode.trim() || !playerName.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-base shadow-xl shadow-indigo-950/40 hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isConnecting ? (
                <span>Connecting...</span>
              ) : (
                <>
                  <span>Join Room</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
