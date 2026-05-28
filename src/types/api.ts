/** 通用API响应 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** 登录请求 */
export interface LoginRequest {
  nickname: string;
  password: string;
}

/** 注册请求 */
export interface RegisterRequest {
  nickname: string;
  password: string;
}

/** 登录响应 */
export type LoginResponse = import('./authApi').AuthSuccessResponse;

/** 注册响应 */
export type RegisterResponse = import('./authApi').AuthSuccessResponse;

/** 排行榜响应 */
export interface LeaderboardResponse {
  rankings: import('./player').LeaderboardPlayer[];
  myRank?: number;
  myScore?: number;
}
