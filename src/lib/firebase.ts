import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test as mandated by guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is unreachable.');
      return false;
    }
    // If document doesn't exist, it still successfully pinged Firestore
    return true;
  }
}

// Run test connection silently on load
testConnection().catch(() => {});

// Match Record Interface
export interface CloudMatchRecord {
  id: string;
  roomCode: string;
  winner: 'crew' | 'imposter';
  secretWord: string;
  imposterNames: string[];
  playerCount: number;
  roundNumber: number;
  createdAt?: any;
}

// Leaderboard Record Interface
export interface CloudLeaderboardRecord {
  playerId: string;
  playerName: string;
  gamesPlayed: number;
  wins: number;
  imposterWins: number;
  detectiveWins: number;
  updatedAt?: any;
}

// Save match record to Firestore
export async function saveMatchToFirestore(match: Omit<CloudMatchRecord, 'id' | 'createdAt'>): Promise<string | null> {
  const matchId = 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `matches/${matchId}`;
  try {
    await setDoc(doc(db, 'matches', matchId), {
      ...match,
      createdAt: serverTimestamp(),
    });
    return matchId;
  } catch (error) {
    console.error('Failed to save match to Firestore:', error);
    try {
      handleFirestoreError(error, OperationType.CREATE, path);
    } catch {
      // Non-fatal fallback for client experience
    }
    return null;
  }
}

// Update or create player leaderboard entry
export async function updatePlayerStatsInFirestore(
  playerId: string,
  playerName: string,
  won: boolean,
  wasImposter: boolean
): Promise<void> {
  const safePlayerId = playerId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `leaderboard/${safePlayerId}`;
  try {
    const existingRef = doc(db, 'leaderboard', safePlayerId);
    let gamesPlayed = 1;
    let wins = won ? 1 : 0;
    let imposterWins = won && wasImposter ? 1 : 0;
    let detectiveWins = won && !wasImposter ? 1 : 0;

    const snap = await getDocFromServer(existingRef).catch(() => null);
    if (snap && snap.exists()) {
      const data = snap.data();
      gamesPlayed = (data.gamesPlayed || 0) + 1;
      wins = (data.wins || 0) + (won ? 1 : 0);
      imposterWins = (data.imposterWins || 0) + (won && wasImposter ? 1 : 0);
      detectiveWins = (data.detectiveWins || 0) + (won && !wasImposter ? 1 : 0);
    }

    await setDoc(existingRef, {
      playerId: safePlayerId,
      playerName: playerName.slice(0, 30),
      gamesPlayed,
      wins,
      imposterWins,
      detectiveWins,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to update player stats in Firestore:', error);
  }
}

// Fetch recent matches
export async function fetchRecentMatches(): Promise<CloudMatchRecord[]> {
  try {
    const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'), limit(15));
    const snapshot = await getDocs(q);
    const records: CloudMatchRecord[] = [];
    snapshot.forEach((docSnap) => {
      records.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });
    return records;
  } catch (error) {
    console.warn('Could not fetch matches from Firestore:', error);
    return [];
  }
}

// Fetch top players
export async function fetchLeaderboard(): Promise<CloudLeaderboardRecord[]> {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('wins', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    const records: CloudLeaderboardRecord[] = [];
    snapshot.forEach((docSnap) => {
      records.push(docSnap.data() as CloudLeaderboardRecord);
    });
    return records;
  } catch (error) {
    console.warn('Could not fetch leaderboard from Firestore:', error);
    return [];
  }
}
