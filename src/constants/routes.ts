/** 路由路径 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  GAME: '/game',
  ROOM: '/room',
  ROOM_LIST: '/room/list',
  RESULT: '/result',
  LEADERBOARD: '/leaderboard',
  EVENTS: '/activity',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

/** 路由名称 */
export const ROUTE_NAMES: Record<string, string> = {
  '/': '首页',
  '/login': '登录',
  '/register': '注册',
  '/game': '对局',
  '/room': '房间',
  '/room/list': '房间列表',
  '/result': '结算',
  '/leaderboard': '排行榜',
  '/activity': '活动',
  '/profile': '个人中心',
  '/settings': '设置',
};
