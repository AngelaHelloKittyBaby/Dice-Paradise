import axios from 'axios';
import { createApiClient } from '@/modules/api/createApiClient';
import { GameApiError, normalizeGameStatus } from '@/modules/game/gameApi';
import type { GameResultData, PlayerScoreDetail, ResultHighlight } from '@/types/gameResult';
import type {
  FinalRankingResponseData,
  GameHighlightsResponseData,
  RematchRequest,
  RematchResponseData,
  RematchSnapshot,
  ScoreSummaryResponseData,
  SettlementPlayerRequest,
} from '@/types/settlementApi';

interface SettlementApiEnvelope<T> {
  code: number;
  msg: string;
  data: T;
}

const apiClient = createApiClient();

function isSettlementApiEnvelope(value: unknown): value is SettlementApiEnvelope<unknown> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'code' in value &&
      'msg' in value &&
      typeof (value as { code: unknown }).code === 'number' &&
      typeof (value as { msg: unknown }).msg === 'string'
  );
}

function unwrapSettlementApiResponse<T>(response: SettlementApiEnvelope<T>, fallbackMessage: string): T {
  if (response.code !== 200) {
    throw new GameApiError(response.msg || fallbackMessage, { code: response.code });
  }

  if (!response.data) {
    throw new GameApiError(fallbackMessage);
  }

  return response.data;
}

function ensureSettlementApiSuccess(response: SettlementApiEnvelope<unknown>, fallbackMessage: string) {
  if (response.code !== 200) {
    throw new GameApiError(response.msg || fallbackMessage, { code: response.code });
  }
}

function toSettlementApiError(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (isSettlementApiEnvelope(data)) {
      return new GameApiError(data.msg || fallbackMessage, {
        code: data.code,
        status: error.response?.status,
      });
    }

    return new GameApiError(error.message || fallbackMessage, {
      status: error.response?.status,
    });
  }

  return error instanceof Error ? error : new GameApiError(fallbackMessage);
}

function toBackendPlayerId(playerId: string | number) {
  const numericPlayerId = typeof playerId === 'number' ? playerId : Number(playerId);

  if (!Number.isInteger(numericPlayerId)) {
    throw new GameApiError('玩家 ID 不是后端可提交的数字 ID');
  }

  return numericPlayerId;
}

function normalizeRematchResponse(data: RematchResponseData): RematchSnapshot {
  return {
    newGameId: data.newGameId,
    gameState: normalizeGameStatus(data.gameState),
  };
}

function normalizeScoreSummary(data: ScoreSummaryResponseData): PlayerScoreDetail {
  return {
    upperScore: data.upperScore,
    bonusScore: data.upperBonus,
    upperTotal: data.upperSubtotal,
    lowerScore: data.lowerScore,
    extraReward: data.yahtzeeBonus,
    extraBonus: data.upperBonus,
    totalScore: data.totalScore,
  };
}

function normalizeHighlights(data: GameHighlightsResponseData): ResultHighlight[] {
  return [
    {
      id: 'yacht',
      icon: 'yacht',
      name: '快艇',
      value: data.yahtzeeCount,
      unit: '次',
    },
    {
      id: 'upper-bonus',
      icon: 'upperBonus',
      name: '上半区额外奖励',
      value: data.upperBonusScored > 0 ? 35 : 0,
      unit: '分',
      status: data.upperBonusScored > 0 ? '已获得' : '未获得',
    },
    {
      id: 'best-round',
      icon: 'bestRound',
      name: '最高单回合',
      value: data.highestRoundScore,
      unit: '分',
    },
  ];
}

export async function backToLobbySettlementGame(
  gameId: string,
  request: SettlementPlayerRequest
): Promise<void> {
  try {
    const response = await apiClient.post<SettlementApiEnvelope<null>>(`/settlement/${gameId}/back`, {
      player_id: toBackendPlayerId(request.player_id),
    });

    ensureSettlementApiSuccess(response.data, '返回首页失败');
  } catch (error) {
    throw toSettlementApiError(error, '返回首页失败');
  }
}

export async function getFinalRanking(gameId: string): Promise<FinalRankingResponseData['rankingList']> {
  try {
    const response = await apiClient.get<SettlementApiEnvelope<FinalRankingResponseData>>(
      `/settlement/${gameId}/final-ranking`
    );

    return unwrapSettlementApiResponse(response.data, '获取最终排名失败').rankingList;
  } catch (error) {
    throw toSettlementApiError(error, '获取最终排名失败');
  }
}

export async function getScoreSummary(
  gameId: string,
  playerId: string | number
): Promise<PlayerScoreDetail> {
  try {
    const response = await apiClient.get<SettlementApiEnvelope<ScoreSummaryResponseData>>(
      `/settlement/${gameId}/score-summary`,
      {
        params: {
          player_id: toBackendPlayerId(playerId),
        },
      }
    );

    return normalizeScoreSummary(unwrapSettlementApiResponse(response.data, '获取分数明细失败'));
  } catch (error) {
    throw toSettlementApiError(error, '获取分数明细失败');
  }
}

export async function getGameHighlights(
  gameId: string,
  playerId: string | number
): Promise<ResultHighlight[]> {
  try {
    const response = await apiClient.get<SettlementApiEnvelope<GameHighlightsResponseData>>(
      `/settlement/${gameId}/highlights`,
      {
        params: {
          player_id: toBackendPlayerId(playerId),
        },
      }
    );

    return normalizeHighlights(unwrapSettlementApiResponse(response.data, '获取精彩回顾失败'));
  } catch (error) {
    throw toSettlementApiError(error, '获取精彩回顾失败');
  }
}

export async function getSettlementResultData(gameId: string, ownerPlayerId: string | number): Promise<GameResultData> {
  const rankingList = await getFinalRanking(gameId);
  const playerIds = rankingList.map(player => player.playerId);
  const [details, highlights] = await Promise.all([
    Promise.all(playerIds.map(playerId => getScoreSummary(gameId, playerId))),
    Promise.all(
      playerIds.map(async playerId => {
        try {
          return await getGameHighlights(gameId, playerId);
        } catch (error) {
          console.warn(
            '[getSettlementResultData] 精彩回顾暂时不可用，已使用空数据:',
            error instanceof Error ? error.message : 'Unknown error'
          );
          return [];
        }
      })
    ),
  ]);
  const ownerId = toBackendPlayerId(ownerPlayerId);
  const playerDetails = Object.fromEntries(
    playerIds.map((playerId, index) => [playerId, details[index]])
  );
  const playerHighlights = Object.fromEntries(
    playerIds.map((playerId, index) => [playerId, highlights[index]])
  );

  return {
    players: rankingList
      .map(player => ({
        id: player.playerId,
        nickname: player.username,
        avatar: player.avatar,
        score: player.totalScore,
        isOwner: player.playerId === ownerId,
        rank: player.rank,
      }))
      .sort((first, second) => second.score - first.score || first.rank - second.rank),
    playerDetails,
    highlights: playerHighlights[ownerId] ?? highlights[0] ?? [],
    playerHighlights,
  };
}

export async function rematchSettlementGame(gameId: string, request: RematchRequest): Promise<RematchSnapshot> {
  try {
    const response = await apiClient.post<SettlementApiEnvelope<RematchResponseData>>(
      `/settlement/${gameId}/rematch`,
      {
        player_id: toBackendPlayerId(request.player_id),
      }
    );

    return normalizeRematchResponse(unwrapSettlementApiResponse(response.data, '再来一局失败'));
  } catch (error) {
    throw toSettlementApiError(error, '再来一局失败');
  }
}
