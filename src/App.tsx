import React, { useState, useEffect, useCallback } from 'react';
import { GameState, NetworkMode, GameSettings } from './types/game';
import { multiplayer } from './network/multiplayer';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { LobbyView } from './components/LobbyView';
import { HostOrderView } from './components/HostOrderView';
import { RoleRevealView } from './components/RoleRevealView';
import { ClueGivingView } from './components/ClueGivingView';
import { RoundPromptView } from './components/RoundPromptView';
import { VotingView } from './components/VotingView';
import { ImposterGuessView } from './components/ImposterGuessView';
import { VerdictView } from './components/VerdictView';
import { ThreeBackground } from './components/ThreeBackground';
import { RulesModal } from './components/RulesModal';
import { DeployGuideModal } from './components/DeployGuideModal';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [networkMode, setNetworkMode] = useState<NetworkMode>('websocket');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [initialRoomCode, setInitialRoomCode] = useState('');

  // Check URL params for invite link (?room=CODE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setInitialRoomCode(roomParam.toUpperCase());
    }
  }, []);

  // Listen to multiplayer network events
  useEffect(() => {
    const unsubState = multiplayer.onState((newState) => {
      setGameState(newState);
      setErrorMessage(null);
    });

    const unsubError = multiplayer.onError((err) => {
      setErrorMessage(err);
    });

    const unsubStatus = multiplayer.onStatus((status) => {
      setConnectionStatus(status);
    });

    return () => {
      unsubState();
      unsubError();
      unsubStatus();
    };
  }, []);

  // Host a game
  const handleHostGame = useCallback(
    async (
      profile: { name: string; avatar: string; color: string },
      mode: NetworkMode
    ) => {
      setErrorMessage(null);
      try {
        setNetworkMode(mode);
        await multiplayer.hostGame(profile, mode);
      } catch (err: any) {
        console.error('Host error:', err);
        setErrorMessage(err.message || 'Failed to host game');
      }
    },
    []
  );

  // Join an existing game
  const handleJoinGame = useCallback(
    async (
      roomCode: string,
      profile: { name: string; avatar: string; color: string },
      mode: NetworkMode
    ) => {
      setErrorMessage(null);
      try {
        setNetworkMode(mode);
        await multiplayer.joinGame(roomCode, profile, mode);
      } catch (err: any) {
        console.error('Join error:', err);
        setErrorMessage(err.message || 'Failed to join game');
      }
    },
    []
  );

  // Host updates room settings
  const handleUpdateSettings = useCallback((settings: Partial<GameSettings>) => {
    multiplayer.dispatch('UPDATE_SETTINGS', { settings });
  }, []);

  // Player toggles ready
  const handleToggleReady = useCallback(() => {
    multiplayer.dispatch('TOGGLE_READY');
  }, []);

  // Host starts game (moves to host_order phase)
  const handleStartGame = useCallback(() => {
    multiplayer.dispatch('START_GAME');
  }, []);

  // Host sets turn order for the round and proceeds to role_reveal
  const handleSetTurnOrder = useCallback((orderedPlayerIds: string[]) => {
    multiplayer.dispatch('SET_TURN_ORDER', { orderedPlayerIds });
  }, []);

  // Advance to clue giving after role reveal
  const handleProceedToClues = useCallback(() => {
    multiplayer.dispatch('START_CLUES');
  }, []);

  // Player submits a clue
  const handleSubmitClue = useCallback((clue: string) => {
    multiplayer.dispatch('SUBMIT_CLUE', { clue });
  }, []);

  // Player passes turn or Host skips player
  const handlePassTurn = useCallback(() => {
    multiplayer.dispatch('PASS_TURN');
  }, []);

  // Player chooses whether to continue clue rounds or proceed to voting
  const handleChooseContinueOrVote = useCallback((choice: 'continue' | 'vote') => {
    multiplayer.dispatch('CHOOSE_CONTINUE_OR_VOTE', { choice });
  }, []);

  // Proceed directly to voting
  const handleProceedToVoting = useCallback(() => {
    multiplayer.dispatch('START_VOTING');
  }, []);

  // Player casts vote
  const handleCastVote = useCallback((targetPlayerId: string | null) => {
    multiplayer.dispatch('CAST_VOTE', { targetPlayerId });
  }, []);

  // Imposter guesses secret word
  const handleImposterGuess = useCallback((guessedWord: string) => {
    multiplayer.dispatch('IMPOSTER_GUESS', { guessedWord });
  }, []);

  // Host advances to next round
  const handleNextRound = useCallback(() => {
    multiplayer.dispatch('NEXT_ROUND');
  }, []);

  // Return to lobby
  const handleReturnToLobby = useCallback(() => {
    multiplayer.dispatch('RETURN_TO_LOBBY');
  }, []);

  // Leave room
  const handleLeaveRoom = useCallback(() => {
    multiplayer.cleanup();
    setGameState(null);
    setErrorMessage(null);
    // Remove query param from URL without page reload
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  // Send chat message
  const handleSendChat = useCallback((text: string) => {
    multiplayer.dispatch('SEND_CHAT', { text });
  }, []);

  // Host kicks player
  const handleKickPlayer = useCallback((playerId: string) => {
    multiplayer.dispatch('KICK_PLAYER', { playerId });
  }, []);

  const isHost = gameState ? gameState.hostId === multiplayer.myPlayerId : false;

  return (
    <div className="min-h-screen bg-slate-950/80 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white relative overflow-x-hidden">
      {/* Interactive 3D Three.js Universe */}
      <ThreeBackground />

      {/* Top Navigation Bar */}
      <Header
        roomCode={gameState?.roomCode}
        isHost={isHost}
        networkMode={networkMode}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onOpenRules={() => setIsRulesOpen(true)}
        connectionStatus={connectionStatus}
      />

      {/* Main Game Screen */}
      <main className="flex-1 flex flex-col justify-center">
        {!gameState ? (
          /* Home Screen: Host vs Join */
          <HomeView
            onHost={handleHostGame}
            onJoin={handleJoinGame}
            networkMode={networkMode}
            onSelectNetworkMode={setNetworkMode}
            initialRoomCode={initialRoomCode}
            isConnecting={connectionStatus === 'connecting'}
            errorMessage={errorMessage || undefined}
          />
        ) : (
          /* Active Room Stages */
          <>
            {gameState.phase === 'lobby' && (
              <LobbyView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                isHost={isHost}
                onUpdateSettings={handleUpdateSettings}
                onToggleReady={handleToggleReady}
                onStartGame={handleStartGame}
                onSendChat={handleSendChat}
                onLeaveRoom={handleLeaveRoom}
                onKickPlayer={handleKickPlayer}
              />
            )}

            {gameState.phase === 'host_order' && (
              <HostOrderView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                isHost={isHost}
                onSetTurnOrder={handleSetTurnOrder}
              />
            )}

            {gameState.phase === 'role_reveal' && (
              <RoleRevealView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                isHost={isHost}
                onContinue={handleProceedToClues}
              />
            )}

            {gameState.phase === 'clue_giving' && (
              <ClueGivingView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                isHost={isHost}
                onSubmitClue={handleSubmitClue}
                onPassTurn={handlePassTurn}
              />
            )}

            {gameState.phase === 'round_prompt' && (
              <RoundPromptView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                isHost={isHost}
                onChooseContinueOrVote={handleChooseContinueOrVote}
                onProceedToVoting={handleProceedToVoting}
              />
            )}

            {gameState.phase === 'voting' && (
              <VotingView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                onCastVote={handleCastVote}
              />
            )}

            {gameState.phase === 'imposter_guess' && (
              <ImposterGuessView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                onImposterGuess={handleImposterGuess}
              />
            )}

            {(gameState.phase === 'verdict' || gameState.phase === 'round_over') && (
              <VerdictView
                gameState={gameState}
                myPlayerId={multiplayer.myPlayerId}
                isHost={isHost}
                onNextRound={handleNextRound}
                onReturnToLobby={handleReturnToLobby}
              />
            )}
          </>
        )}
      </main>

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Deploy to Vercel & Netlify Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
