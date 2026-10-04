import React, { useState, useEffect, useCallback } from 'react';
import { GameState, NetworkMode, GameSettings } from './types/game';
import { multiplayer } from './network/multiplayer';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { HostScreen } from './components/HostScreen';
import { JoinScreen } from './components/JoinScreen';
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
import { ProfileModal } from './components/ProfileModal';
import { ANIMATED_CHARACTERS, normalizeCharacterId } from './data/characters';
import { PLAYER_COLORS } from './data/words';
import { sound } from './utils/sound';

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [networkMode, setNetworkMode] = useState<NetworkMode>('websocket');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Screen routing for pre-game state
  const [viewMode, setViewMode] = useState<'home' | 'host' | 'join'>('home');
  const [prefilledRoomCode, setPrefilledRoomCode] = useState('');

  // Persistent Player Profile
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('imposter_player_name') || `Operative ${Math.floor(Math.random() * 90 + 10)}`;
  });

  const [playerAvatar, setPlayerAvatar] = useState(() => {
    const saved = localStorage.getItem('imposter_player_avatar');
    return saved ? normalizeCharacterId(saved) : 'imposter-prime';
  });

  const [playerColor, setPlayerColor] = useState(() => {
    return localStorage.getItem('imposter_player_color') || PLAYER_COLORS[0];
  });

  // Check URL params for invite link (?room=CODE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setPrefilledRoomCode(roomParam.toUpperCase());
      setViewMode('join');
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

  // Save profile helpers
  const saveProfile = useCallback((profile: { name: string; avatar: string; color: string }) => {
    setPlayerName(profile.name);
    setPlayerAvatar(profile.avatar);
    setPlayerColor(profile.color);
    try {
      localStorage.setItem('imposter_player_name', profile.name);
      localStorage.setItem('imposter_player_avatar', profile.avatar);
      localStorage.setItem('imposter_player_color', profile.color);
    } catch {}
  }, []);

  const randomizeProfile = useCallback(() => {
    sound.playClick();
    const randomChar = ANIMATED_CHARACTERS[Math.floor(Math.random() * ANIMATED_CHARACTERS.length)].id;
    const randomCol = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
    const randomNum = Math.floor(Math.random() * 90 + 10);
    saveProfile({
      name: `Agent ${randomNum}`,
      avatar: randomChar,
      color: randomCol,
    });
  }, [saveProfile]);

  // Host a game from HostScreen
  const handleLaunchHostLobby = useCallback(
    async (
      profile: { name: string; avatar: string; color: string },
      settings: { imposterCount: number; allowImposterGuess: boolean }
    ) => {
      setErrorMessage(null);
      saveProfile(profile);
      try {
        await multiplayer.hostGame(profile, networkMode);
        multiplayer.dispatch('UPDATE_SETTINGS', { settings });
      } catch (err: any) {
        console.error('Host error:', err);
        setErrorMessage(err.message || 'Failed to create game room');
      }
    },
    [networkMode, saveProfile]
  );

  // Join an existing game from JoinScreen
  const handleJoinLobby = useCallback(
    async (
      code: string,
      profile: { name: string; avatar: string; color: string }
    ) => {
      setErrorMessage(null);
      saveProfile(profile);
      try {
        await multiplayer.joinGame(code, profile, networkMode);
      } catch (err: any) {
        console.error('Join error:', err);
        setErrorMessage(err.message || 'Failed to join game');
      }
    },
    [networkMode, saveProfile]
  );

  // Host updates room settings
  const handleUpdateSettings = useCallback((settings: Partial<GameSettings>) => {
    multiplayer.dispatch('UPDATE_SETTINGS', { settings });
  }, []);

  // Player toggles ready
  const handleToggleReady = useCallback(() => {
    multiplayer.dispatch('TOGGLE_READY');
  }, []);

  // Host starts game
  const handleStartGame = useCallback(() => {
    multiplayer.dispatch('START_GAME');
  }, []);

  // Host confirms turn sequence
  const handleSetTurnOrder = useCallback((orderedPlayerIds: string[]) => {
    multiplayer.dispatch('SET_TURN_ORDER', { orderedPlayerIds });
  }, []);

  // Host starts clues after role reveal
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

  // Leave active room completely and return home
  const handleLeaveRoom = useCallback(() => {
    sound.playClick();
    multiplayer.disconnect();
    setGameState(null);
    setViewMode('home');
  }, []);

  // Send tactical chat message
  const handleSendChat = useCallback((text: string) => {
    multiplayer.dispatch('SEND_CHAT', { text });
  }, []);

  // Host kicks a player
  const handleKickPlayer = useCallback((playerId: string) => {
    multiplayer.dispatch('KICK_PLAYER', { playerId });
  }, []);

  const isHost = gameState ? gameState.hostId === multiplayer.myPlayerId : false;

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
      {/* Interactive 3D Ambient Space Universe */}
      <ThreeBackground />

      {/* Sleek, Compact Top Navigation */}
      <Header
        roomCode={gameState?.roomCode}
        isHost={isHost}
        onOpenRules={() => setIsRulesOpen(true)}
        onLogoClick={() => {
          if (!gameState) {
            setViewMode('home');
          }
        }}
      />

      {/* Main Game Screen Routing */}
      <main className="flex-1 flex flex-col justify-center relative z-20">
        {!gameState ? (
          /* PRE-GAME SCREENS */
          <>
            {viewMode === 'home' && (
              <HomeView
                onStartHostFlow={() => setViewMode('host')}
                onStartJoinFlow={() => setViewMode('join')}
                playerName={playerName}
                playerAvatar={playerAvatar}
                playerColor={playerColor}
                onRandomizeProfile={randomizeProfile}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
                errorMessage={errorMessage || undefined}
              />
            )}

            {viewMode === 'host' && (
              <HostScreen
                onBack={() => setViewMode('home')}
                onLaunchLobby={handleLaunchHostLobby}
                initialName={playerName}
                initialAvatar={playerAvatar}
                initialColor={playerColor}
                isConnecting={connectionStatus === 'connecting'}
              />
            )}

            {viewMode === 'join' && (
              <JoinScreen
                onBack={() => setViewMode('home')}
                onJoinLobby={handleJoinLobby}
                initialCode={prefilledRoomCode}
                initialName={playerName}
                initialAvatar={playerAvatar}
                initialColor={playerColor}
                isConnecting={connectionStatus === 'connecting'}
                errorMessage={errorMessage || undefined}
              />
            )}
          </>
        ) : (
          /* ACTIVE IN-ROOM STAGES */
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

      {/* Operative Profile Customizer Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        name={playerName}
        avatar={playerAvatar}
        color={playerColor}
        onSave={saveProfile}
      />
    </div>
  );
}
