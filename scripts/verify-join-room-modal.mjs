import { existsSync, readFileSync } from 'node:fs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const componentPath = 'src/components/game/JoinRoomModal.tsx';
assert(existsSync(componentPath), 'JoinRoomModal component must exist');

const modal = readFileSync(componentPath, 'utf8');
const page = readFileSync('src/app/page.tsx', 'utf8');
const index = readFileSync('src/components/game/index.ts', 'utf8');

assert(modal.includes("joinroomboard.png"), 'join modal must use joinroomboard.png directly');
assert(modal.includes("search.png"), 'join modal must use search.png directly');
assert(modal.includes('motion.'), 'join modal must use Framer Motion primitives');
assert(modal.includes('AnimatePresence'), 'join modal must animate open and close');
assert(modal.includes('duration: 4'), 'main join board must use the requested 4s floating animation');
assert(modal.includes('y: [-6, 6, -6]'), 'main join board must float with a closed y [-6, 6, -6] loop');
assert(modal.includes('duration: 12'), 'portal swirl must rotate over 12s');
assert(modal.includes('repeat: Infinity'), 'join modal effects must loop continuously');
assert(modal.includes('Array.from({ length: 44 }'), 'join modal must render 30-50 deterministic particles');
assert(modal.includes('joinRoomCode'), 'join modal must receive and render the existing room code value');
assert(modal.includes('roomNumberLabel'), 'join modal must reuse the existing room number label animation');
assert(modal.includes('onSubmit'), 'join modal form must submit through existing room join logic');
assert(modal.includes('searchInputFocused'), 'join modal must have focus-driven magic state');
assert(modal.includes('searchStage'), 'search image must be centered by a non-motion anchor so Framer Motion does not override translateX');
assert(modal.includes('joinButtonAnchor'), 'join button must be centered by a non-motion anchor so Framer Motion does not override translateX');
assert(!modal.includes("replace(/\\D/g, '')"), 'join room input must not silently discard non-numeric room codes');

assert(index.includes("export { JoinRoomModal } from './JoinRoomModal';"), 'JoinRoomModal must be exported');
assert(page.includes('JoinRoomModal'), 'homepage must render JoinRoomModal');
assert(page.includes('const [isJoinRoomModalOpen'), 'homepage must track the dedicated join modal state');
assert(
  /const handleRoomHallJoin = \(\) => \{[\s\S]*setIsRoomHallOpen\(false\)[\s\S]*setIsJoinRoomModalOpen\(true\)/.test(page),
  'clicking join in room hall must close room hall and open only the join modal'
);
assert(!page.includes('setIsRoomModeOpen(true);'), 'room hall join should not open the old room mode dialog');
assert(
  /gameCreateError && !isAiModeOpen && !isJoinRoomModalOpen/.test(page),
  'homepage toast must stay hidden while join modal is open'
);

console.log('Join room modal verification passed.');
