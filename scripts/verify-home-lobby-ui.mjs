import { existsSync, readFileSync } from 'node:fs';

const page = readFileSync('src/app/page.tsx', 'utf8');
const loginPage = readFileSync('src/app/login/page.tsx', 'utf8');
const styles = readFileSync('src/app/home-lobby.module.css', 'utf8');
const uiIndex = readFileSync('src/components/ui/index.ts', 'utf8');
const playerStore = readFileSync('src/stores/playerStore.ts', 'utf8');
const avatarComponent = readFileSync('src/components/ui/Avatar.tsx', 'utf8');
const roomPage = readFileSync('src/app/room/page.tsx', 'utf8');
const mockData = readFileSync('src/mocks/data.ts', 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function cssRule(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = styles.match(new RegExp(`${escaped}\\s*\\{(?<body>[\\s\\S]*?)\\n\\}`, 'm'));
  return match?.groups?.body ?? '';
}

const headerTools = page.match(
  /<section className=\{styles\.headerTools\}[\s\S]*?<\/section>/
)?.[0];

const expectedActionBackgroundImports = [
  "import beganGameBackground from '@/assets/images/ui/buttons/begangame.png';",
  "import beganRoomBackground from '@/assets/images/ui/buttons/beganroom.png';",
  "import beganRebotBackground from '@/assets/images/ui/buttons/beganrebot.png';",
  "import activeBackground from '@/assets/images/ui/buttons/active.png';",
  "import defaultAvatar from '@/assets/images/avatars/default-player.png';",
];

expectedActionBackgroundImports.forEach(importLine => {
  assert(page.includes(importLine), `Missing action card background import: ${importLine}`);
});

assert(page.includes('backgroundImage: beganGameBackground.src'), 'Start game card needs begangame.png');
assert(page.includes('backgroundImage: beganRoomBackground.src'), 'Room card needs beganroom.png');
assert(page.includes('backgroundImage: beganRebotBackground.src'), 'AI card needs beganrebot.png');
assert(page.includes('backgroundImage: activeBackground.src'), 'Events card needs active.png');
assert(page.includes("'--action-bg'"), 'Action cards need to expose background image CSS variable');
assert(!page.includes('heroIcon'), 'Action cards should not keep the old middle hero icon data');
assert(!page.includes('const HeroIcon'), 'Action cards should not render the old middle hero icon');
assert(!page.includes('actionImageSlot'), 'Action cards should not render the old middle image slot');
assert(styles.includes('.actionCard::before'), 'Action card background needs a pseudo layer');
assert(
  styles.includes('background-image: var(--action-bg)'),
  'Action card pseudo layer needs the CSS variable background'
);
assert(!styles.includes('.actionImageSlot'), 'Old middle action image slot styles should be removed');

assert(existsSync('src/components/ui/StarIcon.tsx'), '缺少统一的黄色星星组件');
assert(uiIndex.includes("export * from './StarIcon';"), 'StarIcon 需要从 components/ui 聚合导出');
assert(page.includes('StarIcon') && page.includes("from '@/components/ui';"), '首页需要使用统一 StarIcon');
assert(!page.includes('  Star,'), '首页不要直接从 lucide-react 引入 Star');
assert(headerTools, '找不到首页右上角工具栏');
assert((headerTools.match(/styles\.toolButton/g) ?? []).length === 1, '右上角只保留星星数值和第二个设置图标');
assert(headerTools.includes('currencyPill'), '右上角需要保留星星数值入口');
assert(headerTools.includes('Settings'), '右上角需要保留设置图标');
assert(!/Mail|Users|MoreHorizontal|Wifi/.test(headerTools), '右上角不应再保留后续工具图标');
assert(
  page.includes('const playerAvatar = hasUserSession && player?.avatar ? player.avatar : defaultAvatar.src'),
  '左上角用户头像需要使用统一默认头像作为游客/空头像兜底'
);
assert(page.includes('style={{ backgroundImage: `url(${playerAvatar})` }}'), '左上角用户头像需要渲染图片背景');
assert(!page.includes('<Dice5 size={48}'), '左上角头像占位内不应显示骰子图标');
assert(cssRule('.avatarSlot').includes('background-size: cover'), '首页头像需要以 cover 显示默认图');
assert(cssRule('.playerStars').includes('display: inline-flex'), '用户信息星星和数字需要并行显示');
assert(cssRule('.currencyPill').includes('color: #ffffff'), '右上角数值胶囊文字需要保持页面内高对比色');
assert(cssRule('.startGame .actionIconSlot').includes('#1c91ff'), '开始游戏主按钮图标需要使用亮蓝色');
assert(cssRule('.createRoom .actionIconSlot').includes('#ffaf25'), '开房间主按钮图标需要使用金橙色');
assert(cssRule('.botBattle .actionIconSlot').includes('#21c978'), '人机对战主按钮图标需要使用绿色');
assert(cssRule('.events .actionIconSlot').includes('#9558ff'), '活动主按钮图标需要使用紫色');
assert(cssRule('.dailyTasks').includes('rgba(20, 40, 90, 0.96)'), '右侧每日任务面板需要使用低透明深蓝实体底色');
assert(cssRule('.dailyTasks').includes('backdrop-filter: none'), '右侧每日任务面板不应再依赖透明毛玻璃底色');
assert(cssRule('.taskItem').includes('#ffffff'), '每日任务列表项需要有明亮的白蓝卡片底色');
assert(avatarComponent.includes("import defaultAvatar from '@/assets/images/avatars/default-player.png';"), '复用头像组件需要接入统一默认头像');
assert(avatarComponent.includes('const avatarSrc = src || defaultAvatar.src'), '复用头像组件需要在 src 为空时兜底默认头像');
assert(roomPage.includes("import defaultAvatar from '@/assets/images/avatars/default-player.png';"), '房间页空头像需要接入统一默认头像');
assert(roomPage.includes('getMemberAvatar(member.avatar)'), '房间页玩家头像需要通过统一兜底函数渲染');
assert(mockData.includes("avatar: ''"), '默认 mock 用户不应使用第三方头像，方便统一显示 default-avatar');
assert(page.includes('useRouter'), '首页用户信息卡需要使用路由跳转');
assert(page.includes('isAuthPromptOpen'), '游客点击用户信息卡时需要弹出登录提示');
assert(page.includes('handlePlayerProfileClick'), '用户信息卡点击逻辑需要集中处理');
assert(page.includes("router.push('/profile')"), '已登录用户点击用户信息卡需要跳转个人中心');
assert(page.includes("router.push('/login?mode=login')"), '游客选择登录需要跳转登录页的登录 Tab');
assert(page.includes("router.push('/login?mode=register')"), '游客选择注册需要跳转注册页');
assert(page.includes('onKeyDown={handlePlayerProfileKeyDown}'), '用户信息卡需要支持键盘触发');
assert(page.includes('role="dialog"'), '游客提示需要使用对话框语义');
assert(page.includes('登录账号'), '游客提示需要提供登录按钮');
assert(page.includes('注册账号'), '游客提示需要提供注册按钮');
assert(page.includes('暂不登录'), '游客提示需要提供取消按钮');
assert(cssRule('.playerProfile').includes('cursor: pointer'), '用户信息卡需要有可点击反馈');
assert(cssRule('.authPromptOverlay').includes('position: absolute'), '游客提示需要在大厅画布内覆盖显示');
assert(loginPage.includes("window.location.search.includes('mode=register')"), '注册入口需要打开注册标签');
assert(loginPage.includes("window.location.search.includes('mode=login')"), '登录入口需要打开登录标签');
assert(playerStore.includes('isLoggedIn: state.isLoggedIn'), '游客登录态需要随 playerStore 一起持久化');
