import type { Event, EventListItem } from '@/types/event';

/** Mock 活动列表 */
export const mockEventList: EventListItem[] = [
  {
    id: 'event-001',
    title: '五一欢乐投骰节',
    type: 'special',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400',
    endDate: '2024-05-15T23:59:59Z',
  },
  {
    id: 'event-002',
    title: '每日登录奖励',
    type: 'daily',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
    endDate: '2024-12-31T23:59:59Z',
  },
  {
    id: 'event-003',
    title: '周末双倍金币',
    type: 'weekly',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1513171920199-dd67a80e685f?w=400',
    endDate: '2024-05-20T23:59:59Z',
  },
  {
    id: 'event-004',
    title: '快艇大师赛',
    type: 'limited',
    status: 'active',
    image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=400',
    endDate: '2024-05-20T23:59:59Z',
  },
];

/** Mock 活动详情 */
export const mockEventDetail: Event = {
  id: 'event-001',
  title: '五一欢乐投骰节',
  description: '活动期间完成指定任务，赢取丰厚奖励！收集节日徽章，解锁专属头像框。',
  type: 'special',
  status: 'active',
  image: 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400',
  startDate: '2024-05-01T00:00:00Z',
  endDate: '2024-05-15T23:59:59Z',
  tasks: [
    {
      id: 'task-001',
      description: '累计登录7天',
      target: 7,
      progress: 5,
      isCompleted: false,
      isClaimed: false,
      rewards: [{ type: 'coins', amount: 500, name: '金币', icon: '🪙' }],
    },
    {
      id: 'task-002',
      description: '完成10局游戏',
      target: 10,
      progress: 10,
      isCompleted: true,
      isClaimed: true,
      rewards: [{ type: 'gems', amount: 20, name: '钻石', icon: '💎' }],
    },
    {
      id: 'task-003',
      description: '获得3次快艇',
      target: 3,
      progress: 2,
      isCompleted: false,
      isClaimed: false,
      rewards: [{ type: 'avatar', amount: 1, itemId: 'avatar-fest', name: '节日头像框', icon: '🖼️' }],
    },
  ],
  rewards: [
    { type: 'coins', amount: 1000, name: '金币', icon: '🪙' },
    { type: 'gems', amount: 50, name: '钻石', icon: '💎' },
    { type: 'title', amount: 1, itemId: 'title-fest', name: '五一欢乐称号', icon: '🏆' },
  ],
};
