import type { Player, PlayerStats } from './player';

export interface AuthLoginRequest {
  account: string;
  password: string;
}

export interface AuthRegisterRequest {
  nickname: string;
  phone: string;
  password: string;
}

export interface AuthUserResponse {
  id: number;
  nickname?: string;
  points: number;
  total_games: number;
  total_wins: number;
  highest_score: number;
}

export interface AuthSuccessResponse {
  access_token: string;
  token_type: string;
  user: AuthUserResponse;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  player: Player;
  stats: PlayerStats;
}
