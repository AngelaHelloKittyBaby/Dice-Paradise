import { readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const page = readFileSync('src/app/page.tsx', 'utf8');
const roomPage = readFileSync('src/app/room/page.tsx', 'utf8');
const modal = readFileSync('src/components/game/RoomHallModal.tsx', 'utf8');
const floatingDice = readFileSync('src/components/game/FloatingDice.tsx', 'utf8');
const particles = readFileSync('src/components/game/MagicParticles.tsx', 'utf8');
const roomCard = readFileSync('src/components/game/RoomCard.tsx', 'utf8');
const roomStore = readFileSync('src/stores/roomStore.ts', 'utf8');

assert(page.includes('LogIn,'), 'homepage must import LogIn for the existing join-room dialog');
assert(
  /const closeRoomModeDialog = \(\) => \{[\s\S]*setIsRoomModeOpen\(false\)/.test(page),
  'closing room dialogs must close the join-room dialog state too'
);
assert(
  /onClick=\{card\.opensAiMode \? \(\) => setIsAiModeOpen\(true\) : card\.createsRoom \? openRoomModeDialog : handleLocalGameStart\}/.test(
    page
  ),
  'the homepage create-room action must open the room hall modal'
);

assert(modal.includes("roomchoice.png"), 'room hall modal must use roomchoice.png');
assert(modal.includes('<FloatingDice />'), 'room hall modal must include the floating dice area');
assert(modal.includes('<MagicParticles />'), 'room hall modal must include magic particles');
assert(modal.includes('AnimatePresence'), 'room hall modal must animate open/close with AnimatePresence');
assert(modal.includes('aria-label="关闭房间大厅"'), 'room hall modal close control needs an accessible close label');
assert(!modal.includes('✕'), 'room hall modal close control should use an icon, not visible text');
assert(modal.includes('选择房间模式'), 'room hall modal must show only the reference subtitle text');

assert(floatingDice.includes("y: [-12, 12]"), 'golden dice must use the requested floating y range');
assert(!floatingDice.includes("backgroundImage: `url(${magicCircle.src})`"), 'FloatingDice should render the circle image without duplicate inline style props');
assert(floatingDice.includes("repeatType: 'mirror'"), 'golden dice float animation must mirror repeat');

assert(!particles.includes('Math.random'), 'magic particles must be deterministic to avoid hydration mismatch');
assert(/Array\.from\(\{ length: 28 \}/.test(particles), 'magic particles should render 28 particles');

assert(roomCard.includes('whileHover={!disabled ? { scale: 1.05, y: -5 } : undefined}'), 'room cards must float up and scale on hover');
assert(roomCard.includes('创建房间'), 'create card must show the reference label');
assert(roomCard.includes('加入房间'), 'join card must show the reference label');

assert(!roomStore.includes('createOnlineRoom'), 'room creation must stay mock-only while backend is unavailable');
assert(!roomStore.includes('joinOnlineRoom'), 'room joining must stay mock-only while backend is unavailable');
assert(
  roomPage.includes('const updateRoomMembers = useRoomStore(state => state.updateRoomMembers);'),
  'room page must select updateRoomMembers before removing players'
);
assert(!roomPage.includes("from '@/modules/room/roomApi'"), 'room page must not call real room backend APIs yet');

console.log('Room hall modal verification passed.');
