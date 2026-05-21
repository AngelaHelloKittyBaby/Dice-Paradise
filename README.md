# 投骰乐园 (Dice Paradise)

经典快艇骰子（Yacht Dice）游戏网页版，支持单人练习、本地多人、在线联机等多种模式。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5
- **UI库**: React 18
- **样式**: Tailwind CSS 3
- **状态管理**: Zustand
- **网络请求**: Axios
- **实时通信**: Socket.IO Client

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 项目结构

```
dice-paradise/
├── src/
│   ├── app/               # Next.js App Router 页面
│   │   ├── page.tsx       # 首页（游戏大厅）
│   │   ├── game/          # 对局页面
│   │   ├── room/          # 房间页面
│   │   ├── result/        # 结算页面
│   │   ├── leaderboard/   # 排行榜
│   │   ├── activity/      # 活动中心
│   │   └── profile/       # 个人中心
│
│   ├── components/        # 可复用组件
│   │   ├── ui/            # 基础 UI 组件
│   │   ├── game/          # 游戏专用组件
│   │   └── layout/        # 布局组件
│
│   ├── hooks/             # 自定义 Hooks
│   ├── stores/            # Zustand 状态管理
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── constants/         # 常量配置
│   ├── mocks/             # Mock 数据
│   └── assets/            # 静态资源
```

## 游戏规则

快艇骰子是一种策略性骰子游戏，每局游戏共13回合，玩家需要将投掷的骰子组合填入计分板中。

### 计分类别

**上半部分**:
- 一点 ~ 六点：对应点数的总和
- 小计 ≥ 63分可获得35分奖励

**下半部分**:
- 三条：三个相同点数，得所有骰子总和
- 四条：四个相同点数，得所有骰子总和
- 葫芦：三个相同 + 两个相同，得25分
- 小顺：四个连续数字，得30分
- 大顺：五个连续数字，得40分
- 快艇：五个全部相同，得50分
- 机会：任意组合，得所有骰子总和

## 开发规范

详见 [AGENTS.md](AGENTS.md)

## License

MIT
