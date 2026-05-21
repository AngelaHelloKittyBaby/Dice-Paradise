import { readFileSync } from 'node:fs';

const homePage = readFileSync('src/app/page.tsx', 'utf8');
const homeStyles = readFileSync('src/app/home-lobby.module.css', 'utf8');
const ambientComponent = readFileSync('src/components/layout/LobbyAmbientEffects.tsx', 'utf8');
const ambientStyles = readFileSync('src/components/layout/LobbyAmbientEffects.module.css', 'utf8');

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
  "import { motion } from 'framer-motion';",
  'Balloon',
  'motion.div',
  'motion.span',
  'cloudBanks',
  'ambientBirds',
  'ambientBalloons',
  'birdSilhouette',
  'waveSparkles',
].forEach(snippet => assert(ambientComponent.includes(snippet), `Ambient component missing snippet: ${snippet}`));

[
  '.cinematicEdgeGlow',
  '.volumetricLight',
  '.cloudLayer',
  '.mistLayer',
  '.edgeParticles',
  '.ambientBird',
  '.ambientBalloon',
  '.sunSweep',
  '.stageVignette',
  'mix-blend-mode',
  'mask-image',
  'will-change',
  'translate3d',
  'animation: edgeBreath 8.5s',
  'animation: cloudDrift 8s',
  'animation: sunSweep 6.8s',
  'animation: seaFlash 2.8s',
  'floorSparkles',
].forEach(snippet => assert(ambientStyles.includes(snippet), `Ambient styles missing snippet: ${snippet}`));

[
  '.gameLobbyPage::before',
  '.gameLobbyPage::after',
  '.lobbyViewport::before',
  '.lobbyViewport::after',
  'radial-gradient',
  'linear-gradient',
  'blur',
  'mask-image',
].forEach(snippet => assert(homeStyles.includes(snippet), `Home edge atmosphere missing snippet: ${snippet}`));

[
  cssRule(homeStyles, '.playerProfile'),
  cssRule(homeStyles, '.sidePanel'),
  cssRule(homeStyles, '.dailyTasks'),
  cssRule(homeStyles, '.currencyPill'),
  cssRule(homeStyles, '.customizeButton'),
].forEach((body, index) => {
  assert(body.includes('0.9') || body.includes('0.94') || body.includes('0.96') || body.includes('0.97'), `Panel ${index} should use low transparency around 0.9-0.97`);
});

assert(cssRule(homeStyles, '.actionCard::after').includes('cardSheen'), 'Action cards should have a subtle sweep light');
assert(homeStyles.includes('.actionIconSlot svg') && homeStyles.includes('animation: iconFloat 9s'), 'Action icons should have a gentle floating animation');
assert(ambientComponent.includes('opacity: [0.7, 0.98, 0.76]'), 'Bird animation should be visible to the eye');
assert(ambientComponent.includes('duration: 6.6 + index * 0.65'), 'Bird animation duration should be short enough to notice');
assert(ambientComponent.includes('duration: 8.2 + index * 1.1'), 'Balloon animation duration should be short enough to notice');
assert(cssRule(homeStyles, '.mainActions').includes('z-index: 7'), 'Main action cards should stay above chat and ambient effects');
assert(homeStyles.includes('width: 400px'), 'Home chat dock should be shortened to avoid action cards');
assert(homeStyles.includes('z-index: 5'), 'Home chat dock should stay below main action cards');
assert(!ambientStyles.includes('animation: oceanGlow 5s'), 'Atmosphere animations should not use fast 5s loops');
assert(homePage.includes('<LobbyAmbientEffects />'), 'Home page should render the shared ambient effects below UI');
