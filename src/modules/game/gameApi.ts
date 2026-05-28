import { createApiClient } from '@/modules/api/createApiClient';
import type { DiceValue, ScoreCategory } from '@/types/game';
import type {
  ApiGameStatusData,
  ApiScoreCategory,
  CreateGameData,
  CreateGameRequest,
  GameStatusSnapshot,
  QuitGameRequest,
  ResetDiceRequest,
  RollDiceData,
  RollDiceRequest,
  RollDiceSnapshot,
  ToggleDiceLockData,
  ToggleDiceLockRequest,
  ToggleDiceLockSnapshot,
} from '@/types/gameApi';

interface GameApiEnvelope<T> {
  code: number;
  msg: string;
  data: T;
}

export class GameApiError extends Error {
  code?: number;
  status?: number;

  constructor(message: string, options: { code?: number; status?: number } = {}) {
    super(message);
    this.name = 'GameApiError';
    this.code = options.code;
    this.status = options.status;
  }
}

const apiClient = createApiClient();

const scoreKeyMap: Record<ApiScoreCategory, ScoreCategory> = {
  ones: 'ones',
  twos: 'twos',
  threes: 'threes',
  fours: 'fours',
  fives: 'fives',
  sixes: 'sixes',
  threeOfAKind: 'threeOfAKind',
  fourOfAKind: 'fourOfAKind',
  fullHouse: 'fullHouse',
  smallStraight: 'smallStraight',
  largeStraight: 'largeStraight',
  yahtzee: 'yacht',
  chance: 'chance',
};

function unwrapGameApiResponse<T>(response: GameApiEnvelope<T>, fallbackMessage: string): T {
  if (response.code !== 200) {
    throw new Error(response.msg || fallbackMessage);
  }

  if (!response.data) {
    throw new Error(fallbackMessage);
  }

  return response.data;
}

function ensureGameApiSuccess(response: GameApiEnvelope<unknown>, fallbackMessage: string) {
  if (response.code !== 200) {
    throw new Error(response.msg || fallbackMessage);
  }
}

function normalizeDiceValue(value: number): DiceValue {
  return value >= 1 && value <= 6 ? (value as DiceValue) : 1;
}

function normalizeDiceValues(dice: number[] | undefined): DiceValue[] {
  const normalizedDice = dice?.slice(0, 5).map(normalizeDiceValue) ?? [];

  return normalizedDice.length === 5 ? normalizedDice : [1, 1, 1, 1, 1];
}

function normalizeScores(scores: ApiGameStatusData['players'][number]['scores']) {
  return Object.entries(scores).reduce<Partial<Record<ScoreCategory, number>>>((result, [key, value]) => {
    if (value === null || value === undefined) return result;

    const category = scoreKeyMap[key as ApiScoreCategory];
    if (!category) return result;

    return {
      ...result,
      [category]: value,
    };
  }, {});
}

function normalizeDiceLocked(diceLocked: boolean[] | undefined, fallbackLocked?: boolean[]) {
  const hasValidFallback = fallbackLocked?.length === 5;
  const hasValidServerLocks = diceLocked?.length === 5;

  if (!hasValidServerLocks) {
    return hasValidFallback ? fallbackLocked : [false, false, false, false, false];
  }

  if (diceLocked.some(Boolean) || !hasValidFallback || !fallbackLocked.some(Boolean)) {
    return diceLocked;
  }

  return fallbackLocked;
}

export function normalizeGameStatus(data: ApiGameStatusData): GameStatusSnapshot {
  return {
    gameId: data.gameId,
    gameMode: data.gameMode,
    currentPlayer: data.currentPlayer ?? null,
    players: data.players.map(player => ({
      playerId: player.playerId,
      name: player.name,
      isAi: player.isAi,
      scores: normalizeScores(player.scores),
      totalScore: player.totalScore,
    })),
    dice: normalizeDiceValues(data.dice),
    diceLocked: normalizeDiceLocked(data.diceLocked),
    rollsLeft: data.rollsLeft,
    status: data.status,
    createdAt: data.createdAt ?? null,
    finishedAt: data.finishedAt ?? null,
  };
}

export function normalizeRollDiceData(data: RollDiceData, fallbackLocked?: boolean[]): RollDiceSnapshot {
  return {
    dice: normalizeDiceValues(data.dice),
    diceLocked: normalizeDiceLocked(data.diceLocked, fallbackLocked),
    rollsLeft: data.rollsLeft,
  };
}

export function normalizeToggleDiceLockData(data: ToggleDiceLockData, fallbackLocked?: boolean[]): ToggleDiceLockSnapshot {
  return {
    diceLocked: normalizeDiceLocked(data.diceLocked, fallbackLocked),
  };
}

export async function createGame(request: CreateGameRequest): Promise<CreateGameData> {
  console.log('🎮 [createGame] 发送请求:', JSON.stringify(request));
  try {
    const response = await apiClient.post<GameApiEnvelope<CreateGameData>>('/game/create', request);
    console.log('✅ [createGame] 成功响应:', JSON.stringify(response.data));
    return unwrapGameApiResponse(response.data, '游戏创建失败');
  } catch (error: any) {
    console.error('❌ [createGame] 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      request: error.config?.data,
    });
    throw error;
  }
}

export async function getGameStatus(gameId: string): Promise<GameStatusSnapshot> {
  const response = await apiClient.get<GameApiEnvelope<ApiGameStatusData>>(`/game/${gameId}`);
  return normalizeGameStatus(unwrapGameApiResponse(response.data, '获取游戏状态失败'));
}

export async function rollGameDice(gameId: string, request: RollDiceRequest): Promise<RollDiceSnapshot> {
  const response = await apiClient.post<GameApiEnvelope<RollDiceData>>(`/game/${gameId}/roll`, request);
  return normalizeRollDiceData(unwrapGameApiResponse(response.data, '掷骰子失败'), request.locked_dice);
}

export async function resetGameDice(gameId: string, request: ResetDiceRequest): Promise<RollDiceSnapshot> {
  const response = await apiClient.post<GameApiEnvelope<RollDiceData>>(`/game/${gameId}/dice/reset`, request);
  return normalizeRollDiceData(unwrapGameApiResponse(response.data, '重置骰子失败'));
}

export async function toggleGameDiceLock(
  gameId: string,
  request: ToggleDiceLockRequest
): Promise<ToggleDiceLockSnapshot> {
  const response = await apiClient.post<GameApiEnvelope<ToggleDiceLockData>>(
    `/game/${gameId}/dice/toggle`,
    request
  );
  return normalizeToggleDiceLockData(unwrapGameApiResponse(response.data, '切换骰子锁定失败'));
}

export async function quitGame(gameId: string, request: QuitGameRequest): Promise<void> {
  const response = await apiClient.post<GameApiEnvelope<null>>(`/game/${gameId}/quit`, request);
  ensureGameApiSuccess(response.data, '退出游戏失败');
}
