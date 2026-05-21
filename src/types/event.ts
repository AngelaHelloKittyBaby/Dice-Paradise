/** 活动类型 */
export type EventType = 'daily' | 'weekly' | 'special' | 'limited';

/** 活动状态 */
export type EventStatus = 'upcoming' | 'active' | 'ended';

/** 活动奖励 */
export interface EventReward {
  type: 'coins' | 'gems' | 'avatar' | 'title';
  amount: number;
  itemId?: string;
  name: string;
  icon: string;
}

/** 活动任务 */
export interface EventTask {
  id: string;
  description: string;
  target: number;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  rewards: EventReward[];
}

/** 活动信息 */
export interface Event {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  image: string;
  startDate: string;
  endDate: string;
  tasks: EventTask[];
  rewards: EventReward[];
}

/** 活动列表项 */
export interface EventListItem {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  image: string;
  endDate: string;
}
