import React, { useState } from 'react';
import { X, UploadCloud, Check, Copy, ExternalLink, ShieldCheck, Terminal, Globe } from 'lucide-react';
import { sound } from '../utils/sound';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'vercel' | 'netlify' | 'render'>('vercel');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    sound.playClick();
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative text-white max-h-[92vh] overflow-y-auto">
        <button
          id="close-deploy-modal-btn"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-white">Free Deployment Guide</h3>
            <p className="text-xs text-slate-400">
              Deploy your Imposter Game to Vercel or Netlify for 100% free with zero server costs!
            </p>
          </div>
        </div>

        {/* Architecture Note */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2.5 mb-5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <span className="font-bold">Zero-Cost Real-Time Architecture:</span> This application includes a built-in <strong>WebRTC Peer-to-Peer engine</strong> using direct browser data channels. When deployed to static platforms like Vercel or Netlify, games run with ultra-low latency directly between players without needing a paid background server!
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'vercel'
                ? 'border-indigo-500 text-white bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>▲ Vercel (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveTab('netlify')}
            className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'netlify'
                ? 'border-teal-500 text-white bg-teal-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>◆ Netlify</span>
          </button>
          <button
            onClick={() => setActiveTab('render')}
            className={`py-2.5 px-4 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'render'
                ? 'border-purple-500 text-white bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>● Render / Cloud Run (WebSocket Server)</span>
          </button>
        </div>

        {/* Vercel Guide */}
        {activeTab === 'vercel' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Deploying to Vercel (100% Free Tier)</span>
              </h4>
              <p className="text-slate-400">
                The repository already has <code>vercel.json</code> configured for single-page routing.
              </p>
            </div>

            <ol className="space-y-3 list-decimal list-inside pl-1 text-slate-300">
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Export or Push to GitHub:</strong> In AI Studio, export the project to a GitHub repository or download the ZIP and push it to your GitHub account.
              </li>
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Import on Vercel:</strong>
                <div className="mt-1 text-slate-400">
                  Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-0.5">vercel.com <ExternalLink className="w-3 h-3" /></a>, click <strong>"Add New" &gt; "Project"</strong>, and select your repository.
                </div>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Build Settings (Auto-Detected):</strong>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Framework Preset</span>
                    <span className="text-white">Vite</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Build Command</span>
                    <span className="text-emerald-400">npm run build</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Output Directory</span>
                    <span className="text-amber-300">dist</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Root Directory</span>
                    <span className="text-white">./</span>
                  </div>
                </div>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Click Deploy:</strong> In 30 seconds your game is live with custom SSL (e.g. <code>my-imposter-game.vercel.app</code>)! Players can host and join rooms from any phone, tablet, or PC worldwide.
              </li>
            </ol>

            {/* Quick CLI tip */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5 text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Deploy via Vercel CLI
                </span>
                <button
                  onClick={() => copyText('npx vercel deploy --prod', 'vercel-cli')}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  {copiedCmd === 'vercel-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'vercel-cli' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="text-indigo-300 font-mono text-[11px] block bg-slate-900 p-2 rounded">
                npx vercel deploy --prod
              </code>
            </div>
          </div>
        )}

        {/* Netlify Guide */}
        {activeTab === 'netlify' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-white">Deploying to Netlify (100% Free Tier)</h4>
              <p className="text-slate-400">
                The repository includes <code>netlify.toml</code> for automatic single-page rewrites.
              </p>
            </div>

            <ol className="space-y-3 list-decimal list-inside pl-1">
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Export Code:</strong> Download project or sync to GitHub.
              </li>
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Import on Netlify:</strong> Log into <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-teal-400 underline inline-flex items-center gap-0.5">netlify.com <ExternalLink className="w-3 h-3" /></a>, select <strong>"Add new site" &gt; "Import an existing project"</strong>.
              </li>
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Verify Settings:</strong>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Build Command</span>
                    <span className="text-emerald-400">npm run build</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Publish Directory</span>
                    <span className="text-amber-300">dist</span>
                  </div>
                </div>
              </li>
              <li className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong>Deploy Site:</strong> Click "Deploy" and Netlify will generate your public live URL (e.g. <code>my-game.netlify.app</code>).
              </li>
            </ol>
          </div>
        )}

        {/* Render Guide */}
        {activeTab === 'render' && (
          <div className="space-y-4 text-xs text-slate-300">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-white">Deploying Node.js Full-Stack (WebSocket Server)</h4>
              <p className="text-slate-400">
                If you want to use the dedicated WebSocket server backend (instead of P2P WebRTC), you can deploy the complete Express container for free on Render or Google Cloud Run:
              </p>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">Render.com Web Service:</span>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  <li>Build Command: <code className="text-white">npm run build</code></li>
                  <li>Start Command: <code className="text-white">npm start</code></li>
                  <li>Free tier includes automatic HTTPS and WebSocket support!</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="font-bold text-blue-400 block mb-1">Google Cloud Run / AI Studio:</span>
                <p className="text-slate-400">
                  You can also deploy directly to Cloud Run from the AI Studio Deploy menu in the top right!
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">Free, fast, and open source</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
