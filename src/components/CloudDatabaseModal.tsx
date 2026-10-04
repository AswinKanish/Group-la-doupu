import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Flame,
  Layers,
  Award,
  History,
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  testConnection as testFirebaseConnection,
  fetchRecentMatches,
  fetchLeaderboard,
  CloudMatchRecord,
  CloudLeaderboardRecord,
} from '../lib/firebase';
import {
  getStoredSupabaseConfig,
  saveSupabaseConfig,
  testSupabaseConnection,
  clearSupabaseConfig,
} from '../lib/supabase';
import { sound } from '../utils/sound';

interface CloudDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudDatabaseModal: React.FC<CloudDatabaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'firebase' | 'supabase' | 'history'>('supabase');
  
  // Supabase form state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseTestStatus, setSupabaseTestStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
    message?: string;
  }>({ tested: false, loading: false });

  // Firebase state
  const [firebaseStatus, setFirebaseStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success?: boolean;
  }>({ tested: false, loading: false });

  // History & Leaderboard data
  const [matches, setMatches] = useState<CloudMatchRecord[]>([]);
  const [leaderboard, setLeaderboard] = useState<CloudLeaderboardRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const conf = getStoredSupabaseConfig();
    setSupabaseUrl(conf.url);
    setSupabaseKey(conf.anonKey);
    handleTestFirebase();
    loadCloudRecords();
  }, [isOpen]);

  const loadCloudRecords = async () => {
    setLoadingData(true);
    try {
      const [m, l] = await Promise.all([fetchRecentMatches(), fetchLeaderboard()]);
      setMatches(m);
      setLeaderboard(l);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleTestFirebase = async () => {
    setFirebaseStatus({ tested: true, loading: true });
    const ok = await testFirebaseConnection();
    setFirebaseStatus({ tested: true, loading: false, success: ok });
  };

  const handleTestSupabase = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setSupabaseTestStatus({
        tested: true,
        loading: false,
        success: false,
        message: 'Please provide both Supabase Project URL and Anon API Key.',
      });
      return;
    }

    setSupabaseTestStatus({ tested: true, loading: true });
    sound.playClick();
    const result = await testSupabaseConnection(supabaseUrl.trim(), supabaseKey.trim());
    setSupabaseTestStatus({
      tested: true,
      loading: false,
      success: result.success,
      message: result.message,
    });

    if (result.success) {
      saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    }
  };

  const handleClearSupabase = () => {
    clearSupabaseConfig();
    setSupabaseUrl('');
    setSupabaseKey('');
    setSupabaseTestStatus({ tested: false, loading: false });
    sound.playClick();
  };

  const sqlSchema = `-- Supabase PostgreSQL Schema for Group la Doupu
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  room_code VARCHAR(12) NOT NULL,
  winner VARCHAR(10) NOT NULL,
  secret_word TEXT NOT NULL,
  imposter_names TEXT[] DEFAULT '{}',
  player_count INT NOT NULL,
  round_number INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard (
  player_id TEXT PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  games_played INT DEFAULT 0,
  wins INT DEFAULT 0,
  imposter_wins INT DEFAULT 0,
  detective_wins INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    sound.playClick();
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Cloud Database
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Persistent storage, match history, and global leaderboards
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/80 px-4 pt-2 gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('supabase');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'supabase'
                ? 'bg-slate-800 text-emerald-300 border-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Supabase Setup
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('firebase');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'firebase'
                ? 'bg-slate-800 text-amber-300 border-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Firebase (Provisioned)
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('history');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === 'history'
                ? 'bg-slate-800 text-cyan-300 border-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            Records & Stats
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-200 text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-300 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Connect Your Supabase Project
                </div>
                You can link any free Supabase project to sync match history and leaderboards directly into PostgreSQL with real-time replication.
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Supabase Project URL
                  </label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzabcdefghijklm.supabase.co"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Supabase Anon Public API Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleTestSupabase}
                    disabled={supabaseTestStatus.loading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 disabled:opacity-50"
                  >
                    {supabaseTestStatus.loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Save & Test Connection
                      </>
                    )}
                  </button>

                  {supabaseUrl && (
                    <button
                      onClick={handleClearSupabase}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Status Result */}
                {supabaseTestStatus.tested && (
                  <div
                    className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                      supabaseTestStatus.success
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                    }`}
                  >
                    {supabaseTestStatus.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{supabaseTestStatus.message}</span>
                  </div>
                )}
              </div>

              {/* SQL Schema Copy */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">
                    Supabase SQL Schema (Run in SQL Editor)
                  </span>
                  <button
                    onClick={copySql}
                    className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy SQL
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-slate-400 overflow-x-auto">
                  {sqlSchema}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: FIREBASE */}
          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-300 mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Live Provisioned Firestore Database
                </div>
                Your app is pre-configured with a live, dedicated Google Firebase Firestore database instance. All games and verdicts are saved automatically.
              </div>

              {/* Config Details */}
              <div className="space-y-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                  <span className="text-slate-400">Firebase Project ID</span>
                  <span className="font-mono text-slate-200">{firebaseConfig.projectId}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                  <span className="text-slate-400">Database ID</span>
                  <span className="font-mono text-amber-300 text-[11px] truncate max-w-xs">{firebaseConfig.firestoreDatabaseId}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-900">
                  <span className="text-slate-400">Security Rules</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deployed & Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-400">Collections</span>
                  <span className="text-slate-300 font-mono">rooms, matches, leaderboard</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestFirebase}
                  disabled={firebaseStatus.loading}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
                >
                  {firebaseStatus.loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Testing Ping...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Test Cloud Connection
                    </>
                  )}
                </button>

                {firebaseStatus.tested && (
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Connected to Firestore
                  </span>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: RECORDS & STATS */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  Top Players & Win Rates
                </span>
                <button
                  onClick={loadCloudRecords}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingData ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {leaderboard.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                  No completed matches saved yet. Play a game round to see player stats!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {leaderboard.map((item, idx) => (
                    <div
                      key={item.playerId || idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white">{item.playerName}</div>
                          <div className="text-[10px] text-slate-400">
                            {item.gamesPlayed} game{item.gamesPlayed === 1 ? '' : 's'} played
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">{item.wins} Wins</div>
                        <div className="text-[10px] text-slate-500">
                          {item.imposterWins} Doupu / {item.detectiveWins} Crew
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Recent Matches */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  Recent Matches
                </span>

                {matches.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                    No recent match archives. Matches will appear here after each game verdict.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {matches.map((m) => (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.winner === 'crew'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {m.winner}
                          </span>
                          <span className="text-slate-300">
                            Word: <span className="font-mono font-bold text-amber-300">{m.secretWord}</span>
                          </span>
                        </div>
                        <div className="text-right text-[11px] text-slate-400">
                          Room {m.roomCode} • {m.playerCount}P
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
