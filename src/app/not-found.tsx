import Link from 'next/link';
import { ResponsiveStage } from '@/components/layout';
import lobbyBackground from '@/assets/images/backgrounds/lobby/lobby-bg.png';

export default function NotFound() {
  return (
    <ResponsiveStage
      backgroundImage={lobbyBackground.src}
      className="flex items-center justify-center"
    >
      <div className="text-center p-8 bg-black/60 backdrop-blur-md rounded-3xl border-2 border-white/20 shadow-2xl">
        <h1 className="text-8xl font-black text-white mb-4 drop-shadow-glow">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">哎呀，页面迷路了</h2>
        <p className="text-white/80 mb-8 text-lg">
          你访问的页面似乎漂流到了远方的海岛...
        </p>
        <Link 
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          返回游戏大厅
        </Link>
      </div>
    </ResponsiveStage>
  );
}
