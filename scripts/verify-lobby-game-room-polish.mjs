import { readFileSync } from 'node:fs';

const homePage = readFileSync('src/app/page.tsx', 'utf8');
const homeStyles = readFileSync('src/app/home-lobby.module.css', 'utf8');
const gamePage = readFileSync('src/app/game/page.tsx', 'utf8');
const gameStyles = readFileSync('src/app/game/game.module.css', 'utf8');
const roomPage = readFileSync('src/app/room/page.tsx', 'utf8');
const roomStyles = readFileSync('src/app/room/room.module.css', 'utf8');
const eventsPage = readFileSync('src/app/activity/page.tsx', 'utf8');
const leaderboardPage = readFileSync('src/app/leaderboard/page.tsx', 'utf8');
const rulesModal = readFileSync('src/components/game/GameRulesModal.tsx', 'utf8');
const chatComponent = readFileSync('src/components/ui/GameChat.tsx', 'utf8');
const chatStyles = readFileSync('src/components/ui/GameChat.module.css', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cssRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = Array.from(source.matchAll(new RegExp(`${escaped}\\s*\\{(?<body>[\\s\\S]*?)\\n\\}`, 'gm')));
  return matches.at(-1)?.groups?.body ?? '';
}

[
  'Sparkles',
  'Rocket',
  'CalendarCheck',
  'Trophy',
].forEach(icon => assert(homePage.includes(icon), `Home should import/use colorful ${icon} icon`));
assert(homePage.includes('iconTone'), 'Daily task data should carry per-task icon color classes');
assert(!homePage.includes("icon: CheckCircle },\n  { title: '累计投掷骰子20次'"), 'Daily task 1 and 3 should not reuse the same icon');
assert(cssRule(homeStyles, '.customizeButton .actionIconSlot').includes('linear-gradient'), 'Customize icon should have a colorful background');
assert(cssRule(homeStyles, '.customizeButton .actionIconSlot').includes('left: auto'), 'Customize icon should reset inherited horizontal offset');
assert(cssRule(homeStyles, '.customizeButton .actionIconSlot').includes('bottom: auto'), 'Customize icon should reset inherited vertical offset');
assert(homePage.includes('<GameChat'), 'Home should use the shared chat component');
assert(chatComponent.includes('emojiOptions'), 'Shared chat should provide emoji choices');
assert(cssRule(chatStyles, '.messages').includes('overflow-y: auto'), 'Shared chat messages should support vertical scrolling');
assert(cssRule(chatStyles, '.sendButton').includes('width: 54px'), 'Shared chat send button should be icon-centered');
assert(cssRule(homeStyles, '.headerNotice').includes('display: flex'), 'Home notice should align icon and text on one row');
assert(cssRule(homeStyles, '.headerNotice').includes('font-size: 16px'), 'Home notice text should be larger');
assert(cssRule(homeStyles, '.toolButton').includes('display: grid'), 'Home settings button should center its icon');
assert(cssRule(homeStyles, '.dailyTasks').includes('rgba(20, 40, 90, 0.96)'), 'Daily task panel should use the solid deep-blue lobby styling');
assert(cssRule(homeStyles, '.dailyTasks .panelHeader h2').includes('font-size: 26px'), 'Daily task title should be larger');
assert(cssRule(homeStyles, '.dailyTasks .panelHeader a').includes('font-size: 16px'), 'Daily task more link should be larger');

[
  'window.location.search',
  'useRoomStore',
  'mockRollDice',
  'mockSelectScore',
  'mockFetchGameEvents',
  'isRolling',
  'rollsLeft',
  'toggleDieLock',
  'handleRollDice',
  'handleSelectScore',
  'isRulesOpen',
  'isSoundEnabled',
  "router.push('/')",
  "mode === 'single'",
  'roomId',
  'scoreColumns',
].forEach(snippet => assert(gamePage.includes(snippet), `Game page missing behavior snippet: ${snippet}`));
assert(!gamePage.includes('长按骰子可连续投掷'), 'Game page should remove long-press hint');
assert(gamePage.includes('<GameRulesModal'), 'Game page should show shared rules modal');
assert(gamePage.includes('disabled={isRolling || rollsLeft <= 0}'), 'Roll button should be disabled while rolling or out of attempts');
assert(cssRule(gameStyles, '.diceFaceRolling').includes('diceThrow'), 'Dice rolling animation should use diceThrow keyframes');
assert(cssRule(gameStyles, '.eventPanel ul').includes('overflow-y: auto'), 'Game event list should support scrolling');
assert(cssRule(gameStyles, '.topActions button svg').includes('color'), 'Game top icons should have visible colors');

[
  'useRoomStore',
  'useRouter',
  'Copy',
  'GameRulesModal',
  'isSoundEnabled',
  'handleCopyRoomId',
  'handleStartGame',
  'mockStartRoomGame',
  'currentRoom?.members',
  'isHost',
  'roomId',
  'StarIcon',
].forEach(snippet => assert(roomPage.includes(snippet), `Room page missing behavior snippet: ${snippet}`));
assert(roomPage.includes('🎲'), 'Room logo should use the unified dice emoji mark');
assert(roomPage.includes("router.push(`/game?roomId=${roomId}`)"), 'Host start should route to matching game room');
assert(roomPage.includes("isHost ? '解散房间' : '退出房间'"), 'Room should show dismiss only for host, exit for guests');
assert(cssRule(roomStyles, '.playerCards').includes('justify-content: center'), 'Room player cards should center dynamically');
assert(!roomPage.includes('positionClass'), 'Room members should not rely on fixed four-card position classes');
assert(cssRule(roomStyles, '.copyButton').includes('cursor: pointer'), 'Room copy icon should be a clickable classic copy control');

assert(eventsPage.includes('className="grid h-screen min-h-screen place-items-center overflow-hidden bg-[#061b45]'), 'Events page side overflow should match home background color');
assert(leaderboardPage.includes('flex h-screen min-h-screen items-center justify-center'), 'Leaderboard page should center its 1920 stage');

[
  "import { AnimatePresence, motion } from 'framer-motion';",
  'Anchor',
  '计分规则（标准版）',
  '上层数字区（共6格）',
  '下层组合区（共7格）',
  '额外奖励',
  '通用补充规则',
  '上层6格总分 ≥ 63 分',
  '额外奖励 35 分',
  '重复快艇',
  '后续每次额外 +100 分',
  '最终总分 =',
  'max-h-[760px]',
  'overflow-y-auto',
  'scrollbarWidth: "none"',
  'backdrop-blur-[12px]',
  'bg-white/88',
  'border-[#8fd8ff]',
  'drop-shadow',
].forEach(snippet => assert(rulesModal.includes(snippet), `Rules modal missing snippet: ${snippet}`));

[
  '三条',
  '四条',
  '葫芦',
  '小顺子',
  '大顺子',
  '快艇',
  '机会',
].forEach(ruleName => assert(rulesModal.includes(ruleName), `Rules modal missing lower rule: ${ruleName}`));

assert(gamePage.includes('<GameRulesModal open={isRulesOpen}'), 'Game page should use the shared rules modal');
assert(roomPage.includes('<GameRulesModal open={isRulesOpen}'), 'Room page should use the shared rules modal');
