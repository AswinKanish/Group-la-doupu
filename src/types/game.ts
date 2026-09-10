export type GamePhase =
  | 'lobby'
  | 'host_order'       // Host arranges player clue order at start of every round
  | 'role_reveal'      // Secret role card shown
  | 'clue_giving'      // Sequential clue giving one by one in host-selected order
  | 'round_prompt'     // After each clue round: "Continue (give another round of clues) or Vote?"
  | 'voting'           // Players vote to identify the imposter
  | 'imposter_guess'   // Caught imposter attempts to guess the secret word
  | 'verdict';         // Winner announced and round summary

export interface Player {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isHost: boolean;
  isReady: boolean;
  score: number;
  connected: boolean;
}

export interface GameSettings {
  imposterCount: number; // 1 or 2
  allowImposterGuess: boolean; // If caught, imposter gets a chance to guess the secret word
}

export interface ClueEntry {
  playerId: string;
  playerName: string;
  playerColor: string;
  clue: string;
  clueRound: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  isSystem?: boolean;
  timestamp: number;
}

export interface VerdictDetails {
  ejectedPlayerId: string | null;
  ejectedPlayerName: string | null;
  wasImposter: boolean;
  isTie: boolean;
  voteCounts: Record<string, number>; // playerId -> count
  imposters: { id: string; name: string }[];
  secretWord: string;
  imposterGuess?: string;
  imposterGuessSuccess?: boolean;
  winner: 'crew' | 'imposter';
}

export interface GameState {
  roomCode: string;
  phase: GamePhase;
  settings: GameSettings;
  players: Player[];
  hostId: string;
  roundNumber: number;        // Overall game round (Round 1, 2, 3...)
  clueRoundNumber: number;    // Clue round counter within current game (Clue round 1, 2, 3...)
  turnOrder: string[];        // Order decided by host at start of every round
  currentTurnIndex: number;   // Index in turnOrder of active player
  currentTurnPlayerId: string | null;
  clues: ClueEntry[];
  votes: Record<string, string | null>; // voterId -> targetPlayerId (null = skip)
  continueVotes: Record<string, 'continue' | 'vote'>; // player votes on whether to continue clues or vote
  winner: 'crew' | 'imposter' | null;
  verdictDetails: VerdictDetails | null;
  chatMessages: ChatMessage[];
  usedWords: string[];        // List of all secret words used so far in this room (never repeated)

  // Secret role fields (populated only for authorized player)
  myRole?: 'crew' | 'imposter';
  mySecretWord?: string | null; // null for imposter
}

export type NetworkMode = 'websocket' | 'webrtc_p2p';

export interface GameAction {
  type:
    | 'CREATE_ROOM'
    | 'JOIN_ROOM'
    | 'UPDATE_SETTINGS'
    | 'TOGGLE_READY'
    | 'START_GAME'
    | 'SET_TURN_ORDER'             // Host sets order of players for the round
    | 'START_CLUES'                // Moves from role_reveal to clue_giving
    | 'SUBMIT_CLUE'
    | 'PASS_TURN'
    | 'CHOOSE_CONTINUE_OR_VOTE'    // 'continue' or 'vote'
    | 'START_VOTING'               // Direct transition to voting
    | 'CAST_VOTE'
    | 'IMPOSTER_GUESS'
    | 'NEXT_ROUND'
    | 'RETURN_TO_LOBBY'
    | 'SEND_CHAT'
    | 'KICK_PLAYER';
  payload?: any;
  senderId: string;
  roomCode?: string;
}
