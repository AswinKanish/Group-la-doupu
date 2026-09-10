import {
  GameState,
  Player,
  GameSettings,
  GamePhase,
  ClueEntry,
  VerdictDetails,
  ChatMessage,
} from '../types/game';
import { getUniqueTamilNaduWord } from '../data/words';

export interface InternalRoomState extends GameState {
  secretWord: string;
  imposterIds: string[];
}

export function createInitialRoom(
  roomCode: string,
  hostPlayer: Player,
  settings?: Partial<GameSettings>
): InternalRoomState {
  const defaultSettings: GameSettings = {
    imposterCount: 1,
    allowImposterGuess: true,
    ...settings,
  };

  return {
    roomCode,
    phase: 'lobby',
    settings: defaultSettings,
    players: [hostPlayer],
    hostId: hostPlayer.id,
    roundNumber: 0,
    clueRoundNumber: 1,
    turnOrder: [hostPlayer.id],
    currentTurnIndex: 0,
    currentTurnPlayerId: null,
    secretWord: '',
    imposterIds: [],
    clues: [],
    votes: {},
    continueVotes: {},
    winner: null,
    verdictDetails: null,
    usedWords: [],
    chatMessages: [
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: '#6366f1',
        text: `Room ${roomCode} created! Share the code with friends to play.`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Starts a new overall game round:
 * 1. Picks a unique, non-repeated Tamil Nadu secret word.
 * 2. Assigns imposters.
 * 3. Advances to 'host_order' phase so the Host can decide the turn order!
 */
export function startNewRound(state: InternalRoomState): InternalRoomState {
  const activePlayers = state.players.filter(p => p.connected);
  const totalPlayers = activePlayers.length;

  // Decide imposter count (at most floor(total / 2), at least 1)
  const maxPossible = Math.max(1, Math.floor((totalPlayers - 1) / 2));
  const imposterCount = Math.min(state.settings.imposterCount, maxPossible);

  // Pick unique secret word that has never been used
  const { secretWord } = getUniqueTamilNaduWord(state.usedWords);
  const updatedUsedWords = [...state.usedWords, secretWord];

  // Randomly assign imposters
  const shuffledPlayers = [...activePlayers].sort(() => 0.5 - Math.random());
  const imposterIds = shuffledPlayers.slice(0, imposterCount).map(p => p.id);

  // Initial default turn order for host to review/modify
  const defaultTurnOrder = activePlayers.map(p => p.id);

  return {
    ...state,
    roundNumber: state.roundNumber + 1,
    clueRoundNumber: 1,
    phase: 'host_order', // Host arranges the turn order
    secretWord,
    imposterIds,
    turnOrder: defaultTurnOrder,
    currentTurnIndex: 0,
    currentTurnPlayerId: defaultTurnOrder[0] || null,
    clues: [],
    votes: {},
    continueVotes: {},
    winner: null,
    verdictDetails: null,
    usedWords: updatedUsedWords,
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: '#6366f1',
        text: `Game Round ${state.roundNumber + 1} started! Host is setting the turn order...`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Host sets the turn order and initiates role reveal
 */
export function setTurnOrderAndProceed(
  state: InternalRoomState,
  orderedPlayerIds: string[]
): InternalRoomState {
  // Validate orderedPlayerIds contains all active players
  const activePlayerIds = new Set(state.players.filter(p => p.connected).map(p => p.id));
  const validOrder = orderedPlayerIds.filter(id => activePlayerIds.has(id));

  // Add any missing players to the end
  activePlayerIds.forEach(id => {
    if (!validOrder.includes(id)) {
      validOrder.push(id);
    }
  });

  return {
    ...state,
    turnOrder: validOrder,
    phase: 'role_reveal',
    currentTurnIndex: 0,
    currentTurnPlayerId: validOrder[0] || null,
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: '#10b981',
        text: `Turn order confirmed by the Host! Check your secret role.`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Proceeds from role_reveal to clue_giving
 */
export function proceedToClueGiving(state: InternalRoomState): InternalRoomState {
  const firstPlayerId = state.turnOrder[0] || null;
  const firstPlayer = state.players.find(p => p.id === firstPlayerId);

  return {
    ...state,
    phase: 'clue_giving',
    currentTurnIndex: 0,
    currentTurnPlayerId: firstPlayerId,
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: '#6366f1',
        text: `Clue Round ${state.clueRoundNumber} begins! ${firstPlayer?.name || 'First player'} has the floor to give their clue.`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Handles sequential clue submission from the active player
 */
export function handleClueSubmission(
  state: InternalRoomState,
  playerId: string,
  clueText: string
): InternalRoomState {
  if (state.phase !== 'clue_giving' || state.currentTurnPlayerId !== playerId) {
    return state;
  }

  const player = state.players.find(p => p.id === playerId);
  if (!player) return state;

  const newClue: ClueEntry = {
    playerId,
    playerName: player.name,
    playerColor: player.color,
    clue: clueText.trim(),
    clueRound: state.clueRoundNumber,
    timestamp: Date.now(),
  };

  const newClues = [...state.clues, newClue];
  const nextIndex = state.currentTurnIndex + 1;

  if (nextIndex < state.turnOrder.length) {
    // Next player's turn
    const nextPlayerId = state.turnOrder[nextIndex];
    return {
      ...state,
      clues: newClues,
      currentTurnIndex: nextIndex,
      currentTurnPlayerId: nextPlayerId,
    };
  } else {
    // All players in this round have given their clue!
    // Prompt the group: Continue giving clues or proceed to vote?
    return {
      ...state,
      clues: newClues,
      phase: 'round_prompt',
      currentTurnIndex: 0,
      currentTurnPlayerId: null,
      continueVotes: {},
      chatMessages: [
        ...state.chatMessages,
        {
          id: `sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'Game Master',
          senderColor: '#f59e0b',
          text: `Round ${state.clueRoundNumber} clues are complete! Decide: Give another round of clues or proceed to Vote?`,
          isSystem: true,
          timestamp: Date.now(),
        },
      ],
    };
  }
}

/**
 * Allows the active player to pass or host to advance if someone is stuck
 */
export function handlePassTurn(state: InternalRoomState): InternalRoomState {
  if (state.phase !== 'clue_giving' || !state.currentTurnPlayerId) return state;

  const currentPlayer = state.players.find(p => p.id === state.currentTurnPlayerId);
  const nextIndex = state.currentTurnIndex + 1;

  if (nextIndex < state.turnOrder.length) {
    const nextPlayerId = state.turnOrder[nextIndex];
    return {
      ...state,
      currentTurnIndex: nextIndex,
      currentTurnPlayerId: nextPlayerId,
      chatMessages: [
        ...state.chatMessages,
        {
          id: `sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'Game Master',
          senderColor: '#94a3b8',
          text: `${currentPlayer?.name || 'Player'} passed their turn.`,
          isSystem: true,
          timestamp: Date.now(),
        },
      ],
    };
  } else {
    // Round complete
    return {
      ...state,
      phase: 'round_prompt',
      currentTurnIndex: 0,
      currentTurnPlayerId: null,
      continueVotes: {},
    };
  }
}

/**
 * Handles group decision after each round of clues:
 * 'continue' -> starts a new clue round (Round 2, 3, etc.)
 * 'vote' -> proceeds immediately to voting
 */
export function handleContinueOrVote(
  state: InternalRoomState,
  playerId: string,
  choice: 'continue' | 'vote'
): InternalRoomState {
  if (state.phase !== 'round_prompt') return state;

  const isHost = state.hostId === playerId;
  const newContinueVotes = {
    ...state.continueVotes,
    [playerId]: choice,
  };

  // If host explicitly made the decision, or if unanimous/majority:
  if (isHost || choice === 'vote') {
    if (choice === 'vote') {
      return proceedToVoting({
        ...state,
        continueVotes: newContinueVotes,
      });
    } else {
      // Host chose to continue giving clues!
      return startNextClueRound({
        ...state,
        continueVotes: newContinueVotes,
      });
    }
  }

  // Count votes from players
  const activePlayers = state.players.filter(p => p.connected);
  const votesList = Object.values(newContinueVotes);
  const voteToProceedCount = votesList.filter(v => v === 'vote').length;
  const continueCount = votesList.filter(v => v === 'continue').length;

  if (voteToProceedCount > activePlayers.length / 2) {
    return proceedToVoting({
      ...state,
      continueVotes: newContinueVotes,
    });
  } else if (continueCount >= activePlayers.length) {
    return startNextClueRound({
      ...state,
      continueVotes: newContinueVotes,
    });
  }

  return {
    ...state,
    continueVotes: newContinueVotes,
  };
}

/**
 * Starts the next clue round (e.g. Clue Round 2, 3, 4...)
 * Host can optionally re-order or retain turn order
 */
export function startNextClueRound(state: InternalRoomState): InternalRoomState {
  const nextClueRound = state.clueRoundNumber + 1;

  // Let host set the order for every round!
  return {
    ...state,
    clueRoundNumber: nextClueRound,
    phase: 'host_order', // Host decides order at start of every round
    currentTurnIndex: 0,
    currentTurnPlayerId: state.turnOrder[0] || null,
    continueVotes: {},
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: '#3b82f6',
        text: `Starting Clue Round ${nextClueRound}! Host, arrange or confirm player turn order.`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Advances to voting phase
 */
export function proceedToVoting(state: InternalRoomState): InternalRoomState {
  return {
    ...state,
    phase: 'voting',
    votes: {},
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: '#ef4444',
        text: `Voting has opened! Cast your vote for who you think is the Imposter.`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Handles casting votes
 */
export function handleVoteCast(
  state: InternalRoomState,
  voterId: string,
  targetPlayerId: string | null
): InternalRoomState {
  if (state.phase !== 'voting') return state;

  const newVotes = {
    ...state.votes,
    [voterId]: targetPlayerId,
  };

  const activePlayers = state.players.filter(p => p.connected);
  const hasEveryoneVoted = activePlayers.every(p => newVotes[p.id] !== undefined);

  const updatedState: InternalRoomState = {
    ...state,
    votes: newVotes,
  };

  if (hasEveryoneVoted) {
    return calculateVerdict(updatedState);
  }

  return updatedState;
}

/**
 * Calculates final verdict from votes
 */
export function calculateVerdict(state: InternalRoomState): InternalRoomState {
  const voteCounts: Record<string, number> = {};
  Object.values(state.votes).forEach(targetId => {
    if (targetId) {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    }
  });

  let maxVotes = 0;
  let topCandidates: string[] = [];

  Object.entries(voteCounts).forEach(([candidateId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      topCandidates = [candidateId];
    } else if (count === maxVotes) {
      topCandidates.push(candidateId);
    }
  });

  const isTie = topCandidates.length !== 1 || maxVotes === 0;
  const ejectedPlayerId = isTie ? null : topCandidates[0];
  const ejectedPlayer = ejectedPlayerId
    ? state.players.find(p => p.id === ejectedPlayerId)
    : null;

  const wasImposter = ejectedPlayerId
    ? state.imposterIds.includes(ejectedPlayerId)
    : false;

  const imposters = state.players
    .filter(p => state.imposterIds.includes(p.id))
    .map(p => ({ id: p.id, name: p.name }));

  // If Imposter caught & guess is enabled:
  if (wasImposter && state.settings.allowImposterGuess && ejectedPlayerId) {
    const verdictDetails: VerdictDetails = {
      ejectedPlayerId,
      ejectedPlayerName: ejectedPlayer?.name || null,
      wasImposter: true,
      isTie,
      voteCounts,
      imposters,
      secretWord: state.secretWord,
      winner: 'crew',
    };

    return {
      ...state,
      phase: 'imposter_guess',
      verdictDetails,
      chatMessages: [
        ...state.chatMessages,
        {
          id: `sys-${Date.now()}`,
          senderId: 'system',
          senderName: 'Game Master',
          senderColor: '#ef4444',
          text: `${ejectedPlayer?.name} was caught as the Imposter! But they have ONE chance to guess the secret word to steal the win!`,
          isSystem: true,
          timestamp: Date.now(),
        },
      ],
    };
  }

  // Regular verdict outcome
  const winner: 'crew' | 'imposter' = wasImposter ? 'crew' : 'imposter';

  const updatedPlayers = state.players.map(p => {
    let scoreDelta = 0;
    const isThisImposter = state.imposterIds.includes(p.id);

    if (winner === 'crew' && !isThisImposter) {
      scoreDelta = 2;
    } else if (winner === 'imposter' && isThisImposter) {
      scoreDelta = 3;
    }

    return {
      ...p,
      score: p.score + scoreDelta,
    };
  });

  const verdictDetails: VerdictDetails = {
    ejectedPlayerId,
    ejectedPlayerName: ejectedPlayer?.name || null,
    wasImposter,
    isTie,
    voteCounts,
    imposters,
    secretWord: state.secretWord,
    winner,
  };

  return {
    ...state,
    phase: 'verdict',
    players: updatedPlayers,
    winner,
    verdictDetails,
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: winner === 'crew' ? '#10b981' : '#ef4444',
        text: winner === 'crew'
          ? `Crew wins! The imposter was caught. Secret word was "${state.secretWord}".`
          : `Imposter wins! They fooled the crew. Secret word was "${state.secretWord}".`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Imposter guess logic (fuzzy match on secret word)
 */
export function handleImposterGuess(
  state: InternalRoomState,
  imposterId: string,
  guessedWord: string
): InternalRoomState {
  if (state.phase !== 'imposter_guess') return state;

  const normalize = (str: string) =>
    str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const isCorrect =
    normalize(guessedWord) === normalize(state.secretWord) ||
    state.secretWord.toLowerCase().includes(guessedWord.trim().toLowerCase()) ||
    guessedWord.toLowerCase().includes(state.secretWord.trim().toLowerCase());

  const winner: 'crew' | 'imposter' = isCorrect ? 'imposter' : 'crew';

  const updatedPlayers = state.players.map(p => {
    let scoreDelta = 0;
    const isThisImposter = state.imposterIds.includes(p.id);

    if (winner === 'crew' && !isThisImposter) {
      scoreDelta = 2;
    } else if (winner === 'imposter' && isThisImposter) {
      scoreDelta = 4;
    }

    return {
      ...p,
      score: p.score + scoreDelta,
    };
  });

  const verdictDetails: VerdictDetails = {
    ...state.verdictDetails!,
    imposterGuess: guessedWord,
    imposterGuessSuccess: isCorrect,
    winner,
  };

  return {
    ...state,
    phase: 'verdict',
    players: updatedPlayers,
    winner,
    verdictDetails,
    chatMessages: [
      ...state.chatMessages,
      {
        id: `sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Game Master',
        senderColor: isCorrect ? '#ef4444' : '#10b981',
        text: isCorrect
          ? `UNBELIEVABLE! The Imposter correctly guessed "${state.secretWord}" and stole the victory!`
          : `The Imposter guessed "${guessedWord}" incorrectly! The secret word was "${state.secretWord}". Crew wins!`,
        isSystem: true,
        timestamp: Date.now(),
      },
    ],
  };
}

/**
 * Sanitizes state to avoid leaking secrets over the network
 */
export function sanitizeStateForPlayer(
  state: InternalRoomState,
  playerId: string
): GameState {
  const isImposter = state.imposterIds.includes(playerId);
  const isGameOver = state.phase === 'verdict' || state.phase === 'lobby';

  const mySecretWord = isImposter ? null : state.secretWord;
  const myRole = isImposter ? 'imposter' : 'crew';

  return {
    roomCode: state.roomCode,
    phase: state.phase,
    settings: state.settings,
    players: state.players,
    hostId: state.hostId,
    roundNumber: state.roundNumber,
    clueRoundNumber: state.clueRoundNumber,
    turnOrder: state.turnOrder,
    currentTurnIndex: state.currentTurnIndex,
    currentTurnPlayerId: state.currentTurnPlayerId,
    clues: state.clues,
    votes: state.votes,
    continueVotes: state.continueVotes,
    winner: state.winner,
    verdictDetails: state.verdictDetails,
    chatMessages: state.chatMessages,
    usedWords: state.usedWords,
    myRole: state.phase === 'lobby' ? undefined : myRole,
    mySecretWord: isGameOver ? state.secretWord : mySecretWord,
  };
}
