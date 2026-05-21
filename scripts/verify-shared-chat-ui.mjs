import { existsSync, readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const componentPath = 'src/components/ui/GameChat.tsx';
const stylePath = 'src/components/ui/GameChat.module.css';

assert(existsSync(componentPath), 'Missing shared GameChat component');
assert(existsSync(stylePath), 'Missing shared GameChat module styles');

const component = readFileSync(componentPath, 'utf8');
const styles = readFileSync(stylePath, 'utf8');
const uiIndex = readFileSync('src/components/ui/index.ts', 'utf8');
const homePage = readFileSync('src/app/page.tsx', 'utf8');
const homeStyles = readFileSync('src/app/home-lobby.module.css', 'utf8');
const roomPage = readFileSync('src/app/room/page.tsx', 'utf8');
const roomStyles = readFileSync('src/app/room/room.module.css', 'utf8');
const gamePage = readFileSync('src/app/game/page.tsx', 'utf8');
const gameStyles = readFileSync('src/app/game/game.module.css', 'utf8');

function cssRule(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = Array.from(source.matchAll(new RegExp(`${escaped}\\s*\\{(?<body>[\\s\\S]*?)\\n\\}`, 'gm')));
  return matches.at(-1)?.groups?.body ?? '';
}

[
  "'use client';",
  'export interface GameChatMessage',
  'emojiOptions',
  'isEmojiPickerOpen',
  'handleEmojiSelect',
  'handleSendMessage',
  "import defaultAvatar from '@/assets/images/avatars/default-player.png';",
  "message.type === 'system'",
].forEach(snippet => {
  assert(component.includes(snippet), `GameChat missing behavior snippet: ${snippet}`);
});

assert(uiIndex.includes("export { GameChat } from './GameChat';"), 'GameChat must be exported from components/ui');
assert(uiIndex.includes('GameChatMessage'), 'GameChatMessage type must be exported from components/ui');

assert(cssRule(styles, '.chatShell').includes('#071b38'), 'Shared chat shell should use the deep navy reference color');
assert(cssRule(styles, '.messages').includes('overflow-y: auto'), 'Shared chat messages should scroll vertically');
assert(cssRule(styles, '.systemMessage').includes('#ffd85a'), 'System messages should be yellow');
assert(cssRule(styles, '.author').includes('#55d8ff'), 'Player names should be blue');
assert(cssRule(styles, '.messageText').includes('#ffffff'), 'Player messages should be white');
assert(cssRule(styles, '.avatar').includes('background-size: cover'), 'Player messages should render avatars');
assert(cssRule(styles, '.emojiPicker').includes('grid-template-columns'), 'Emoji picker should show selectable emoji grid');

[
  [homePage, 'home page'],
  [roomPage, 'room page'],
  [gamePage, 'game page'],
].forEach(([source, label]) => {
  assert(source.includes("import { GameChat"), `${label} should import the shared GameChat`);
  assert(source.includes('<GameChat'), `${label} should render the shared GameChat`);
});

assert(!homePage.includes('styles.chatMessages'), 'Home page should not render bespoke chat message markup');
assert(!roomPage.includes('styles.chatMessages'), 'Room page should not render bespoke chat message markup');
assert(!gamePage.includes('styles.chatMessages'), 'Game page should not render bespoke chat message markup');
assert(!gamePage.includes('  Send,'), 'Game page should not import bespoke chat send icon');
assert(!gamePage.includes('  Smile,'), 'Game page should not import bespoke chat smile icon');

[
  [homeStyles, 'home styles'],
  [roomStyles, 'room styles'],
  [gameStyles, 'game styles'],
].forEach(([source, label]) => {
  assert(!source.includes('.chatMessages'), `${label} should not duplicate shared chat message styles`);
  assert(!source.includes('.chatInputRow'), `${label} should not duplicate shared chat input styles`);
});

assert(homeStyles.includes('width: 400px'), 'Home chat wrapper should use the compact dock placement that avoids the main buttons');
assert(homeStyles.includes('z-index: 5'), 'Home chat wrapper should stay below the main action cards');
assert(cssRule(roomStyles, '.chatPanel').includes('width: 430px'), 'Room chat wrapper should keep room placement');
assert(cssRule(gameStyles, '.chatPanel').includes('width: 424px'), 'Game chat wrapper should keep game placement');
