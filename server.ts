import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
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
} from './src/game/engine';
import { GameAction, Player } from './src/types/game';

interface ClientConnection {
  ws: WebSocket;
  playerId: string;
  roomCode: string;
  isAlive: boolean;
}

const rooms = new Map<string, InternalRoomState>();
const clients = new Map<WebSocket, ClientConnection>();

function broadcastRoomState(roomCode: string) {
  const room = rooms.get(roomCode);
  if (!room) return;

  clients.forEach((client) => {
    if (client.roomCode === roomCode && client.ws.readyState === WebSocket.OPEN) {
      const sanitized = sanitizeStateForPlayer(room, client.playerId);
      client.ws.send(
        JSON.stringify({
          type: 'ROOM_STATE',
          state: sanitized,
        })
      );
    }
  });
}

function handleGameAction(action: GameAction, ws: WebSocket) {
  const roomCode = action.roomCode?.toUpperCase();
  if (!roomCode) return;

  switch (action.type) {
    case 'CREATE_ROOM': {
      const player: Player = action.payload.player;
      const initialRoom = createInitialRoom(roomCode, player);
      rooms.set(roomCode, initialRoom);

      clients.set(ws, {
        ws,
        playerId: player.id,
        roomCode,
        isAlive: true,
      });

      broadcastRoomState(roomCode);
      break;
    }

    case 'JOIN_ROOM': {
      let room = rooms.get(roomCode);
      if (!room) {
        ws.send(
          JSON.stringify({
            type: 'ERROR_MESSAGE',
            message: `Room "${roomCode}" not found. Check the code or create a new game.`,
          })
        );
        return;
      }

      const player: Player = action.payload.player;
      const existingIdx = room.players.findIndex(p => p.id === player.id);

      if (existingIdx < 0 && room.players.filter(p => p.connected).length >= 25) {
        ws.send(
          JSON.stringify({
            type: 'ERROR_MESSAGE',
            message: `Room "${roomCode}" is full (maximum 25 players reached).`,
          })
        );
        return;
      }

      if (existingIdx >= 0) {
        room.players[existingIdx].connected = true;
        room.players[existingIdx].name = player.name;
        room.players[existingIdx].avatar = player.avatar;
        room.players[existingIdx].color = player.color;
      } else {
        room.players.push(player);
        room.chatMessages.push({
          id: `join-${Date.now()}`,
          senderId: 'system',
          senderName: 'Game Master',
          senderColor: '#10b981',
          text: `${player.name} joined the game!`,
          isSystem: true,
          timestamp: Date.now(),
        });
      }

      clients.set(ws, {
        ws,
        playerId: player.id,
        roomCode,
        isAlive: true,
      });

      broadcastRoomState(roomCode);
      break;
    }

    case 'UPDATE_SETTINGS': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        room.settings = {
          ...room.settings,
          ...action.payload.settings,
        };
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'TOGGLE_READY': {
      const room = rooms.get(roomCode);
      if (room) {
        const player = room.players.find(p => p.id === action.senderId);
        if (player) {
          player.isReady = !player.isReady;
          broadcastRoomState(roomCode);
        }
      }
      break;
    }

    case 'START_GAME': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        rooms.set(roomCode, startNewRound(room));
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'SET_TURN_ORDER': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        rooms.set(
          roomCode,
          setTurnOrderAndProceed(room, action.payload.orderedPlayerIds)
        );
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'START_CLUES': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        rooms.set(roomCode, proceedToClueGiving(room));
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'SUBMIT_CLUE': {
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(
          roomCode,
          handleClueSubmission(room, action.senderId, action.payload.clue)
        );
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'PASS_TURN': {
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(roomCode, handlePassTurn(room));
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'CHOOSE_CONTINUE_OR_VOTE': {
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(
          roomCode,
          handleContinueOrVote(room, action.senderId, action.payload.choice)
        );
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'START_VOTING': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        rooms.set(roomCode, proceedToVoting(room));
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'CAST_VOTE': {
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(
          roomCode,
          handleVoteCast(room, action.senderId, action.payload.targetPlayerId)
        );
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'IMPOSTER_GUESS': {
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(
          roomCode,
          handleImposterGuess(room, action.senderId, action.payload.guessedWord)
        );
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'NEXT_ROUND': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        rooms.set(roomCode, startNewRound(room));
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'RETURN_TO_LOBBY': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        room.phase = 'lobby';
        broadcastRoomState(roomCode);
      }
      break;
    }

    case 'SEND_CHAT': {
      const room = rooms.get(roomCode);
      if (room) {
        const sender = room.players.find(p => p.id === action.senderId);
        if (sender && action.payload.text?.trim()) {
          room.chatMessages.push({
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            senderId: sender.id,
            senderName: sender.name,
            senderColor: sender.color,
            text: action.payload.text.trim(),
            timestamp: Date.now(),
          });
          broadcastRoomState(roomCode);
        }
      }
      break;
    }

    case 'KICK_PLAYER': {
      const room = rooms.get(roomCode);
      if (room && action.senderId === room.hostId) {
        const kickId = action.payload.playerId;
        room.players = room.players.filter(p => p.id !== kickId);
        broadcastRoomState(roomCode);
      }
      break;
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json());

  // API Health Endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      roomsCount: rooms.size,
      connectedClients: clients.size,
    });
  });

  // WebSocket Server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (messageData: string) => {
      try {
        const parsed = JSON.parse(messageData.toString());
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG' }));
          const c = clients.get(ws);
          if (c) c.isAlive = true;
          return;
        }

        if (parsed.action) {
          handleGameAction(parsed.action, ws);
        }
      } catch (err) {
        console.error('WebSocket message parsing error:', err);
      }
    });

    ws.on('close', () => {
      const client = clients.get(ws);
      if (client) {
        const room = rooms.get(client.roomCode);
        if (room) {
          const player = room.players.find(p => p.id === client.playerId);
          if (player) {
            player.connected = false;
            broadcastRoomState(client.roomCode);
          }
        }
        clients.delete(ws);
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket client error:', err);
    });
  });

  // Heartbeat interval to check alive connections
  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const c = clients.get(ws);
      if (c && !c.isAlive) {
        ws.terminate();
        clients.delete(ws);
        return;
      }
      if (c) c.isAlive = false;
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(heartbeatInterval);
  });

  // Vite middleware in dev mode; static in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
