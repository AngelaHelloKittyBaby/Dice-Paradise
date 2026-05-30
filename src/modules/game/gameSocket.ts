import { WS_URL } from '@/config/api';
import type { ApiGameMode, ApiGamePlayer, ApiGameStatusData, GameStatusSnapshot } from '@/types/gameApi';
import { normalizeGameStatus } from './gameApi';

const API_VERSION_PATH = '/api/v1';
const GAME_WS_PATH = `${API_VERSION_PATH}/game/ws`;

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : null;
}

function readOptionalString(value: unknown) {
  if (value === null || value === undefined) return null;
  return typeof value === 'string' || typeof value === 'number' ? String(value) : null;
}

function readNumberArray(value: unknown) {
  return Array.isArray(value) && value.every(item => typeof item === 'number') ? value : undefined;
}

function readBooleanArray(value: unknown) {
  return Array.isArray(value) && value.every(item => typeof item === 'boolean') ? value : undefined;
}

function normalizeGameWsBaseUrl(baseUrl: string) {
  const trimmedUrl = baseUrl.trim().replace(/\/+$/, '');
  const withoutLegacyWsPath = trimmedUrl.endsWith('/ws') ? trimmedUrl.slice(0, -3) : trimmedUrl;

  return withoutLegacyWsPath.endsWith(API_VERSION_PATH)
    ? withoutLegacyWsPath.slice(0, -API_VERSION_PATH.length)
    : withoutLegacyWsPath;
}

function toApiGamePlayer(value: unknown): ApiGamePlayer | null {
  if (!isRecord(value)) return null;

  const playerId = readOptionalString(value.playerId ?? value.player_id);
  const name = readString(value.name) ?? readString(value.username);

  if (!playerId || !name) return null;

  return {
    playerId,
    name,
    isAi: Boolean(value.isAi ?? value.is_ai),
    scores: isRecord(value.scores) ? value.scores : undefined,
    totalScore:
      typeof value.totalScore === 'number'
        ? value.totalScore
        : typeof value.total_score === 'number'
          ? value.total_score
          : undefined,
  };
}

function toApiGameStatusData(value: unknown): ApiGameStatusData | null {
  if (!isRecord(value)) return null;

  const gameId = readOptionalString(value.gameId ?? value.game_id);
  const gameMode = readString(value.gameMode ?? value.game_mode);
  const status = readString(value.status);
  const players = Array.isArray(value.players) ? value.players.map(toApiGamePlayer) : null;

  if (!gameId || !gameMode || !status || !players || players.some(item => item === null)) return null;

  return {
    gameId,
    gameMode: gameMode as ApiGameMode,
    currentPlayer: readOptionalString(value.currentPlayer ?? value.current_player),
    players: players as ApiGamePlayer[],
    dice: readNumberArray(value.dice),
    diceLocked: readBooleanArray(value.diceLocked ?? value.dice_locked),
    rollsLeft:
      typeof value.rollsLeft === 'number'
        ? value.rollsLeft
        : typeof value.rolls_left === 'number'
          ? value.rolls_left
          : undefined,
    status,
    createdAt: readOptionalString(value.createdAt ?? value.created_at),
    finishedAt: readOptionalString(value.finishedAt ?? value.finished_at),
  };
}

function getSocketPayloadCandidate(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;

  return payload.data ?? payload.gameState ?? payload.game_state ?? payload.state ?? payload;
}

export function buildGameWebSocketUrl(gameId: string, playerId: string) {
  const baseUrl = normalizeGameWsBaseUrl(WS_URL);
  const encodedGameId = encodeURIComponent(gameId);
  const encodedPlayerId = encodeURIComponent(playerId);

  return `${baseUrl}${GAME_WS_PATH}/${encodedGameId}/${encodedPlayerId}`;
}

export function parseGameSocketStatusMessage(message: string): GameStatusSnapshot | null {
  try {
    const payload = JSON.parse(message) as unknown;
    const data = toApiGameStatusData(getSocketPayloadCandidate(payload));

    return data ? normalizeGameStatus(data) : null;
  } catch {
    return null;
  }
}
