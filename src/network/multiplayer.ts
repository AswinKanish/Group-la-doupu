import { Peer, DataConnection } from 'peerjs';
import {
  GameState,
  GameAction,
  Player,
  NetworkMode,
} from '../types/game';
import {
  createInitialRoom,
  startNewRound,
  setTurnOrderAndProceed,
  proceedToClueGiving,
  handleClueSubmission,
  handlePassTurn,
  handleContinueOrVote,
  proceedToVoting,
  handleVoteCast,
  handleImposterGuess,
  sanitizeStateForPlayer,
  InternalRoomState,
} from '../game/engine';

export type StateListener = (state: GameState) => void;
export type ErrorListener = (error: string) => void;
export type ConnectionStatusListener = (status: 'disconnected' | 'connecting' | 'connected') => void;

class MultiplayerClient {
  private mode: NetworkMode = 'websocket';
  private ws: WebSocket | null = null;
  private peer: Peer | null = null;
  private p2pConnections: Map<string, DataConnection> = new Map(); // Host: guestId -> connection
  private p2pHostConnection: DataConnection | null = null; // Guest: connection to host
  private internalP2PRoom: InternalRoomState | null = null; // Used when this client is host in P2P mode
  private p2pTimerInterval: number | null = null;

  public myPlayerId: string = '';
  public currentRoomCode: string = '';
  public isHost: boolean = false;

  private stateListeners: Set<StateListener> = new Set();
  private errorListeners: Set<ErrorListener> = new Set();
  private statusListeners: Set<ConnectionStatusListener> = new Set();

  private connectionStatus: 'disconnected' | 'connecting' | 'connected' = 'disconnected';

  constructor() {
    this.myPlayerId = this.getOrCreatePlayerId();
  }

  private getOrCreatePlayerId(): string {
    try {
      const saved = localStorage.getItem('imposter_player_id');
      if (saved) return saved;
      const newId = 'p_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('imposter_player_id', newId);
      return newId;
    } catch {
      return 'p_' + Math.random().toString(36).substring(2, 9);
    }
  }

  public getMode(): NetworkMode {
    return this.mode;
  }

  public setMode(mode: NetworkMode) {
    this.mode = mode;
  }

  public onState(listener: StateListener) {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  public onError(listener: ErrorListener) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  public onStatus(listener: ConnectionStatusListener) {
    this.statusListeners.add(listener);
    listener(this.connectionStatus);
    return () => this.statusListeners.delete(listener);
  }

  private setStatus(status: 'disconnected' | 'connecting' | 'connected') {
    this.connectionStatus = status;
    this.statusListeners.forEach(l => l(status));
  }

  private emitError(err: string) {
    this.errorListeners.forEach(l => l(err));
  }

  private emitState(state: GameState) {
    this.stateListeners.forEach(l => l(state));
  }

  public async checkServerAvailability(): Promise<boolean> {
    try {
      const res = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        return data.status === 'ok';
      }
      return false;
    } catch {
      return false;
    }
  }

  // ==========================================
  // HOSTING A GAME
  // ==========================================
  public async hostGame(
    player: Omit<Player, 'id' | 'isHost' | 'isReady' | 'score' | 'connected'>,
    preferredMode?: NetworkMode
  ): Promise<string> {
    this.cleanup();
    this.isHost = true;
    this.setStatus('connecting');

    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.currentRoomCode = roomCode;

    const fullPlayer: Player = {
      ...player,
      id: this.myPlayerId,
      isHost: true,
      isReady: true,
      score: 0,
      connected: true,
    };

    let targetMode = preferredMode || this.mode;

    // Check if WebSocket server is available if websocket is selected
    if (targetMode === 'websocket') {
      const serverOk = await this.checkServerAvailability();
      if (!serverOk) {
        console.warn('Backend server not responding, falling back to WebRTC P2P (Vercel/Netlify mode)');
        targetMode = 'webrtc_p2p';
      }
    }

    this.mode = targetMode;

    if (targetMode === 'websocket') {
      return this.hostViaWebSocket(roomCode, fullPlayer);
    } else {
      return this.hostViaP2P(roomCode, fullPlayer);
    }
  }

  // ==========================================
  // JOINING A GAME
  // ==========================================
  public async joinGame(
    roomCode: string,
    player: Omit<Player, 'id' | 'isHost' | 'isReady' | 'score' | 'connected'>,
    preferredMode?: NetworkMode
  ): Promise<void> {
    this.cleanup();
    this.isHost = false;
    this.setStatus('connecting');

    const cleanCode = roomCode.trim().toUpperCase();
    this.currentRoomCode = cleanCode;

    const fullPlayer: Player = {
      ...player,
      id: this.myPlayerId,
      isHost: false,
      isReady: false,
      score: 0,
      connected: true,
    };

    let targetMode = preferredMode || this.mode;

    if (targetMode === 'websocket') {
      const serverOk = await this.checkServerAvailability();
      if (!serverOk) {
        targetMode = 'webrtc_p2p';
      }
    }

    this.mode = targetMode;

    if (targetMode === 'websocket') {
      return this.joinViaWebSocket(cleanCode, fullPlayer);
    } else {
      return this.joinViaP2P(cleanCode, fullPlayer);
    }
  }

  // ==========================================
  // WEBSOCKET IMPLEMENTATION
  // ==========================================
  private hostViaWebSocket(roomCode: string, player: Player): Promise<string> {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.setStatus('connected');
          this.sendWS({
            type: 'CREATE_ROOM',
            roomCode,
            senderId: this.myPlayerId,
            payload: { player },
          });
          resolve(roomCode);
        };

        this.ws.onmessage = (event) => {
          this.handleWSMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.error('WebSocket error:', err);
          this.setStatus('disconnected');
          this.emitError('WebSocket connection error. Switching to P2P mode...');
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = () => {
          this.setStatus('disconnected');
        };
      } catch (e: any) {
        reject(e);
      }
    });
  }

  private joinViaWebSocket(roomCode: string, player: Player): Promise<void> {
    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.setStatus('connected');
          this.sendWS({
            type: 'JOIN_ROOM',
            roomCode,
            senderId: this.myPlayerId,
            payload: { player },
          });
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleWSMessage(event.data);
        };

        this.ws.onerror = (err) => {
          console.error('WebSocket join error:', err);
          this.setStatus('disconnected');
          this.emitError('Failed to connect to room via server');
          reject(err);
        };

        this.ws.onclose = () => {
          this.setStatus('disconnected');
        };
      } catch (e: any) {
        reject(e);
      }
    });
  }

  private sendWS(action: GameAction) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(action));
    }
  }

  private handleWSMessage(dataStr: string) {
    try {
      const msg = JSON.parse(dataStr);
      if (msg.type === 'ROOM_STATE') {
        this.emitState(msg.state);
      } else if (msg.type === 'ERROR_MESSAGE') {
        this.emitError(msg.message);
      }
    } catch (e) {
      console.error('Failed to parse WS message:', e);
    }
  }

  // ==========================================
  // WEBRTC P2P IMPLEMENTATION (VERCEL/NETLIFY FREE)
  // ==========================================
  private getPeerIdForRoom(roomCode: string): string {
    return `imposter-v1-${roomCode.toLowerCase()}`;
  }

  private hostViaP2P(roomCode: string, player: Player): Promise<string> {
    return new Promise((resolve, reject) => {
      const peerId = this.getPeerIdForRoom(roomCode);

      try {
        this.peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' },
            ],
          },
        });

        this.peer.on('open', () => {
          this.setStatus('connected');
          this.internalP2PRoom = createInitialRoom(roomCode, player);
          this.broadcastP2PState();
          resolve(roomCode);
        });

        this.peer.on('connection', (conn) => {
          conn.on('open', () => {
            this.p2pConnections.set(conn.peer, conn);
          });

          conn.on('data', (data: any) => {
            this.handleP2PHostAction(data, conn);
          });

          conn.on('close', () => {
            this.p2pConnections.delete(conn.peer);
            this.handleP2PPlayerDisconnect(conn.peer);
          });

          conn.on('error', (err) => {
            console.error('P2P connection error:', err);
          });
        });

        this.peer.on('error', (err: any) => {
          console.error('PeerJS error:', err);
          if (err.type === 'unavailable-id') {
            this.emitError(`Room code ${roomCode} is already taken. Please try again.`);
          } else {
            this.emitError(`P2P Network error: ${err.type || 'Connection failed'}`);
          }
          this.setStatus('disconnected');
          reject(err);
        });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  private joinViaP2P(roomCode: string, player: Player): Promise<void> {
    return new Promise((resolve, reject) => {
      const hostPeerId = this.getPeerIdForRoom(roomCode);
      const myCustomPeerId = `imposter-guest-${this.myPlayerId}-${Math.random().toString(36).substring(2, 6)}`;

      try {
        this.peer = new Peer(myCustomPeerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' },
            ],
          },
        });

        this.peer.on('open', () => {
          const conn = this.peer!.connect(hostPeerId, {
            reliable: true,
          });

          this.p2pHostConnection = conn;

          conn.on('open', () => {
            this.setStatus('connected');
            // Send join action to host
            conn.send({
              type: 'JOIN_ROOM',
              roomCode,
              senderId: this.myPlayerId,
              payload: { player },
            });
            resolve();
          });

          conn.on('data', (data: any) => {
            if (data.type === 'ROOM_STATE') {
              this.emitState(data.state);
            } else if (data.type === 'ERROR_MESSAGE') {
              this.emitError(data.message);
            }
          });

          conn.on('close', () => {
            this.setStatus('disconnected');
            this.emitError('Host disconnected from the game.');
          });

          conn.on('error', (err) => {
            console.error('P2P connection error:', err);
            this.emitError('Failed to connect to host room. Ensure code is correct.');
            reject(err);
          });
        });

        this.peer.on('error', (err: any) => {
          console.error('PeerJS guest error:', err);
          this.setStatus('disconnected');
          this.emitError('Could not connect to room. Room might not exist or host is offline.');
          reject(err);
        });
      } catch (e: any) {
        reject(e);
      }
    });
  }

  // Host-side P2P game coordinator
  private handleP2PHostAction(action: GameAction, conn?: DataConnection) {
    if (!this.internalP2PRoom) return;

    switch (action.type) {
      case 'JOIN_ROOM': {
        const incomingPlayer: Player = action.payload.player;
        const existsIndex = this.internalP2PRoom.players.findIndex(p => p.id === incomingPlayer.id);

        if (existsIndex < 0 && this.internalP2PRoom.players.filter(p => p.connected).length >= 25) {
          if (conn) {
            conn.send({
              type: 'ERROR_MESSAGE',
              message: `Room is full (maximum 25 players reached).`,
            });
          }
          break;
        }

        if (existsIndex >= 0) {
          this.internalP2PRoom.players[existsIndex].connected = true;
          this.internalP2PRoom.players[existsIndex].name = incomingPlayer.name;
          this.internalP2PRoom.players[existsIndex].avatar = incomingPlayer.avatar;
          this.internalP2PRoom.players[existsIndex].color = incomingPlayer.color;
        } else {
          this.internalP2PRoom.players.push(incomingPlayer);
          this.internalP2PRoom.chatMessages.push({
            id: `join-${Date.now()}`,
            senderId: 'system',
            senderName: 'Game Master',
            senderColor: '#10b981',
            text: `${incomingPlayer.name} joined the game!`,
            isSystem: true,
            timestamp: Date.now(),
          });
        }
        this.broadcastP2PState();
        break;
      }

      case 'TOGGLE_READY': {
        const target = this.internalP2PRoom.players.find(p => p.id === action.senderId);
        if (target) {
          target.isReady = !target.isReady;
          this.broadcastP2PState();
        }
        break;
      }

      case 'UPDATE_SETTINGS': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom.settings = {
            ...this.internalP2PRoom.settings,
            ...action.payload.settings,
          };
          this.broadcastP2PState();
        }
        break;
      }

      case 'START_GAME': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom = startNewRound(this.internalP2PRoom);
          this.broadcastP2PState();
        }
        break;
      }

      case 'SET_TURN_ORDER': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom = setTurnOrderAndProceed(
            this.internalP2PRoom,
            action.payload.orderedPlayerIds
          );
          this.broadcastP2PState();
        }
        break;
      }

      case 'START_CLUES': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom = proceedToClueGiving(this.internalP2PRoom);
          this.broadcastP2PState();
        }
        break;
      }

      case 'SUBMIT_CLUE': {
        this.internalP2PRoom = handleClueSubmission(
          this.internalP2PRoom,
          action.senderId,
          action.payload.clue
        );
        this.broadcastP2PState();
        break;
      }

      case 'PASS_TURN': {
        this.internalP2PRoom = handlePassTurn(this.internalP2PRoom);
        this.broadcastP2PState();
        break;
      }

      case 'CHOOSE_CONTINUE_OR_VOTE': {
        this.internalP2PRoom = handleContinueOrVote(
          this.internalP2PRoom,
          action.senderId,
          action.payload.choice
        );
        this.broadcastP2PState();
        break;
      }

      case 'START_VOTING': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom = proceedToVoting(this.internalP2PRoom);
          this.broadcastP2PState();
        }
        break;
      }

      case 'CAST_VOTE': {
        this.internalP2PRoom = handleVoteCast(
          this.internalP2PRoom,
          action.senderId,
          action.payload.targetPlayerId
        );
        this.broadcastP2PState();
        break;
      }

      case 'IMPOSTER_GUESS': {
        this.internalP2PRoom = handleImposterGuess(
          this.internalP2PRoom,
          action.senderId,
          action.payload.guessedWord
        );
        this.broadcastP2PState();
        break;
      }

      case 'NEXT_ROUND': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom = startNewRound(this.internalP2PRoom);
          this.broadcastP2PState();
        }
        break;
      }

      case 'RETURN_TO_LOBBY': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          this.internalP2PRoom.phase = 'lobby';
          this.broadcastP2PState();
        }
        break;
      }

      case 'SEND_CHAT': {
        const sender = this.internalP2PRoom.players.find(p => p.id === action.senderId);
        if (sender && action.payload.text?.trim()) {
          this.internalP2PRoom.chatMessages.push({
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            senderId: sender.id,
            senderName: sender.name,
            senderColor: sender.color,
            text: action.payload.text.trim(),
            timestamp: Date.now(),
          });
          this.broadcastP2PState();
        }
        break;
      }

      case 'KICK_PLAYER': {
        if (action.senderId === this.internalP2PRoom.hostId) {
          const kickId = action.payload.playerId;
          this.internalP2PRoom.players = this.internalP2PRoom.players.filter(p => p.id !== kickId);
          this.broadcastP2PState();
        }
        break;
      }
    }
  }

  private handleP2PPlayerDisconnect(peerId: string) {
    if (!this.internalP2PRoom) return;
    this.broadcastP2PState();
  }

  private broadcastP2PState() {
    if (!this.internalP2PRoom) return;

    // Send to local host listener
    const hostSanitized = sanitizeStateForPlayer(this.internalP2PRoom, this.myPlayerId);
    this.emitState(hostSanitized);

    // Send customized sanitized state to each connected peer
    this.p2pConnections.forEach((conn) => {
      if (conn.open) {
        // Find which player this connection belongs to
        // We'll match or send based on the player ID
        const targetPlayer = this.internalP2PRoom!.players.find(p => conn.peer.includes(p.id));
        const targetId = targetPlayer ? targetPlayer.id : 'unknown';
        const sanitized = sanitizeStateForPlayer(this.internalP2PRoom!, targetId);

        conn.send({
          type: 'ROOM_STATE',
          state: sanitized,
        });
      }
    });
  }

  // ==========================================
  // DISPATCH GAME ACTIONS
  // ==========================================
  public dispatch(actionType: GameAction['type'], payload: any = {}) {
    const action: GameAction = {
      type: actionType,
      payload,
      senderId: this.myPlayerId,
      roomCode: this.currentRoomCode,
    };

    if (this.mode === 'websocket') {
      this.sendWS(action);
    } else {
      if (this.isHost) {
        this.handleP2PHostAction(action);
      } else if (this.p2pHostConnection && this.p2pHostConnection.open) {
        this.p2pHostConnection.send(action);
      }
    }
  }

  // ==========================================
  // CLEANUP
  // ==========================================
  public cleanup() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }

    if (this.p2pTimerInterval) {
      clearInterval(this.p2pTimerInterval);
      this.p2pTimerInterval = null;
    }

    if (this.p2pHostConnection) {
      try {
        this.p2pHostConnection.close();
      } catch {}
      this.p2pHostConnection = null;
    }

    this.p2pConnections.forEach(conn => {
      try {
        conn.close();
      } catch {}
    });
    this.p2pConnections.clear();

    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }

    this.internalP2PRoom = null;
    this.setStatus('disconnected');
  }
}

export const multiplayer = new MultiplayerClient();
