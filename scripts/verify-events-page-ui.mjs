import { existsSync, readFileSync } from 'node:fs';

const page = readFileSync('src/app/activity/page.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredSnippets = [
  "import activePageBackground from '@/assets/images/backgrounds/activity/activity-bg.png';",
  'backgroundImage: `url(${activePageBackground.src})`',
  'function ActivePage',
  'function SideTabs',
  'function TaskPanel',
  'function CastleProgressPanel',
  'function TaskItem',
  'function TitleRewardCard',
  'interface TaskApiResponse',
  'const mockTaskApiResponse',
  "useState<TaskType>('daily')",
  'data-task-panel',
  'data-castle-panel',
  'transition-all duration-300',
  'animate-[progressFill',
  'bg-gradient-to-br',
  'from-[#0b69ff] via-[#0758df] to-[#0437a4]',
  'from-[#041877] via-[#062caf] to-[#041877]',
  'castleRewardCards',
  'DICE PARADISE',
  'bg-[#f4f9ff]',
  'bg-[#e7f4ff]',
  'text-[#7b879c]',
];

requiredSnippets.forEach(snippet => {
  assert(page.includes(snippet), `Missing events UI snippet: ${snippet}`);
});

[
  'daily-login',
  'daily-battle',
  'daily-upgrade',
  'daily-ai',
  'daily-share',
  'weekly-checkin',
  'weekly-win',
  'weekly-expedition',
  'weekly-score',
  'weekly-friend',
].forEach(taskId => {
  assert(page.includes(taskId), `Missing task data id: ${taskId}`);
});

const taskPanelBlock = page.match(/function TaskPanel[\s\S]*?function CastleStageCard/)?.[0] ?? '';

assert(existsSync('src/assets/images/backgrounds/activity/activity-bg.png'), 'activepage background must be available in src assets');
assert(page.includes('w-[1920px]') && page.includes('h-[1080px]'), 'Events page must use a 1920x1080 stage');
assert(page.includes('overflow-hidden'), 'Events page must hide scrollbars');
assert(!taskPanelBlock.includes('TitleRewardCard'), 'Task panel should not render score summary cards');
assert(!taskPanelBlock.includes('castleRewardCards'), 'Task panel should only render task rows, not bottom reward cards');
assert(!page.includes('backdrop-blur-[14px]'), 'Main activity panels should use solid image-matched blue instead of glass blur');
assert(!page.includes('bg-white/82'), 'Task rows should use opaque light cards for readability');
assert(!page.includes('bg-white/12'), 'Castle progress content should use opaque light cards for readability');
assert(!page.includes('bg-slate-900/28'), 'Locked title cards should not use transparent dark glass');
assert(!page.includes('积分排行榜'), 'Right leaderboard panel should not be rendered');
assert(!page.includes('积分抽奖池'), 'Right lottery pool panel should not be rendered');
assert(!page.includes('洞穴奖励'), 'Bottom cave reward entries should not be rendered');
