import { existsSync, readFileSync } from 'node:fs';

const page = readFileSync('src/app/leaderboard/page.tsx', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const requiredSnippets = [
  "'use client'",
  "import board1Background from '@/assets/images/ui/panels/leaderboard-card-1.png';",
  "import board2Background from '@/assets/images/ui/panels/leaderboard-card-2.png';",
  "import board3Background from '@/assets/images/ui/panels/leaderboard-card-3.png';",
  "import board4Background from '@/assets/images/ui/panels/leaderboard-card-4.png';",
  "import leaderboardBackground from '@/assets/images/backgrounds/leaderboard/leaderboard-bg.png';",
  "import { ResponsiveStage } from '@/components/layout';",
  'interface LeaderboardApiResponse',
  'const mockLeaderboardApiResponse',
  'useState<LeaderboardType>',
  'setActiveBoard',
  'activeBoardData',
  'handlePlayerProfileClick',
  'isAuthPromptOpen',
  "router.push('/profile')",
  "router.push('/login?mode=login')",
  "router.push('/login?mode=register')",
  'data-leaderboard-card',
  'data-leaderboard-menu',
  'data-leaderboard-sidebar',
  'data-leaderboard-table',
  'data-player-entry',
  'leaderboardBackground.src',
  'DICE PARADISE',
  'rgba(12,92,255,0.18)',
];

requiredSnippets.forEach(snippet => {
  assert(page.includes(snippet), `Missing leaderboard UI snippet: ${snippet}`);
});

[
  'highestScore',
  'totalGames',
  'totalWins',
  'winRate',
].forEach(type => {
  assert(page.includes(type), `Missing leaderboard type: ${type}`);
});

[
  'board1Background.src',
  'board2Background.src',
  'board3Background.src',
  'board4Background.src',
].forEach(background => {
  assert(page.includes(background), `Missing stat card background: ${background}`);
});

[
  'src/assets/images/ui/panels/leaderboard-card-1.png',
  'src/assets/images/ui/panels/leaderboard-card-2.png',
  'src/assets/images/ui/panels/leaderboard-card-3.png',
  'src/assets/images/ui/panels/leaderboard-card-4.png',
  'src/assets/images/backgrounds/leaderboard/leaderboard-bg.png',
].forEach(path => {
  assert(existsSync(path), `Missing required image asset: ${path}`);
});

assert(page.includes('min-h-screen') && page.includes('overflow-hidden'), 'Page must fill the screen and hide scrollbars');
assert(page.includes('<ResponsiveStage') && page.includes('designWidth={1920}') && page.includes('designHeight={1080}'), 'Page must use the shared 1920x1080 responsive desktop stage');
assert(page.includes('origin-top-left'), 'Leaderboard stage should scale from the same origin as other stages');
assert(page.includes('hover:-translate-y-[3px]'), 'Cards and buttons need hover lift animation');
assert(!page.includes('#2490ff_0%'), 'Leaderboard background image must not be covered by an opaque blue gradient');
assert(!page.includes('backdrop-blur-[12px]'), 'Leaderboard top bar should use a low-transparency solid style, not heavy transparent blur');
assert(!page.includes('function DiceMascot'), 'Left bottom dice mascot should be removed');
assert(!page.includes('<DiceMascot'), 'Left bottom dice mascot should not render');
assert(!page.includes('ChevronDown'), 'Top-right player entry should not render a dropdown arrow');
assert(!page.includes('Plus'), 'Star amount entry should not render a plus button');
