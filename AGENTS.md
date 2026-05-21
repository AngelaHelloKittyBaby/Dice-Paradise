# AGENTS.md

## 项目名称

投骰乐园（Dice Paradise）

---

# 0. Codex / AI 工作方式（最高优先级）

本文件是当前项目最高级开发规范。

所有 AI（Codex / ChatGPT / Cursor / Claude）在本项目中进行：*

* 代码生成
* 代码修改
* UI开发
* 重构
* 动效开发
* 游戏逻辑开发

时，必须优先遵守本文件。

---

## AI 开发原则

### 1. 先读代码再修改

修改前优先阅读：

* README.md
* package.json
* 当前页面
* 当前组件
* hooks
* stores
* types
* utils
* 本 AGENTS.md

禁止：

不看现有结构直接重构。

---

### 2. 尊重现有项目结构

禁止：

为了“更标准”而大规模无关重构。

必须：

基于现有结构扩展。

---

### 3. 保护用户代码

禁止：

```bash
git reset --hard
git checkout --
```

等会丢失用户修改的命令。

---

### 4. 修改范围最小化

仅修改：

当前需求相关文件。

不要：

顺手重构无关页面。

---

### 5. 页面职责单一

页面：

只负责：

* 页面布局
* 页面组合
* 页面级交互

复杂逻辑：

必须抽离：

* hooks
* stores
* utils

---

### 6. 所有复杂业务必须模块化

禁止：

一个页面几千行。

禁止：

所有逻辑写 page.tsx。

---

### 7. 修改后必须验证

至少执行：

```bash
npm run lint
```

涉及：

* 路由
* 类型
* 构建

时：

执行：

```bash
npm run build
```

---

---

# 1. 项目定位

《投骰乐园》是一个：

基于 Next.js + React + TypeScript 的：

## 多人在线网页骰子游戏大厅系统。

项目不是普通静态页面。

而是：

包含：

* 登录注册
* 游戏大厅
* 开房间
* 房间等待
* 人机对战
* 在线联机
* 游戏对局
* 游戏结算
* 排行榜
* 活动系统
* 个人中心
* 成就系统
* 每日任务
* 聊天展示
* 动态视觉系统
* 音效系统

的大型游戏前端工程。

---

# 2. 当前项目阶段（非常重要）

当前阶段：

## 后端接口尚未完成。

因此：

当前开发：

统一使用：

```txt
mock 数据
```

进行开发。

---

## 当前禁止事项

禁止：

* 真实后端请求
* 强依赖接口
* 写死 axios 请求
* 页面直接 fetch

---

## 当前正确开发方式

通过：

```txt
mocks/
hooks/
stores/
```

模拟真实业务。

后续接口完成后：

仅替换：

```txt
数据层
```

不重写 UI。

---

# 3. 当前项目不实现的功能

非常重要：

当前项目：

## 不实现好友系统。

包括：

* 加好友
* 好友在线
* 好友邀请
* 好友聊天
* 好友列表

如果 UI 图中出现：

好友在线区域。

可以：

* 删除
* 替换成系统消息
* 替换成大厅聊天
* 替换成在线玩家展示

但：

不要开发真实好友系统。

---

# 4. 技术栈

## 核心

* Next.js App Router
* React 18+
* TypeScript 5+

---

## 样式

* TailwindCSS
* CSS Modules
* clsx
* tailwind-merge

---

## 状态管理

* Zustand

---

## 动效

* Framer Motion
* CSS keyframes

---

## 音效

* Howler.js

---

## 图标

* lucide-react
* react-icons

---

## 后续预留（当前不强制）

* TanStack Query
* Axios
* Socket.IO

---

# 5. 最优项目结构（必须遵守）

src/
│
├── app/                                  # Next.js 页面路由入口
│   ├── login/                            # 登录注册页面
│   ├── lobby/                            # 游戏大厅页面
│   ├── room/                             # 创建房间 / 房间等待页面
│   ├── game/                             # 游戏对局页面
│   ├── result/                           # 游戏结算页面
│   ├── leaderboard/                      # 排行榜页面
│   ├── activity/                         # 活动页面
│   ├── profile/                          # 个人中心页面
│   ├── layout.tsx                        # 全局布局
│   └── page.tsx                          # 默认入口页
│
├── modules/                              # 业务模块
│   ├── auth/                             # 登录注册业务
│   ├── lobby/                            # 游戏大厅业务
│   ├── room/                             # 开房间 / 房间等待业务
│   ├── game/                             # 游戏对局业务
│   ├── result/                           # 结算弹窗业务
│   ├── leaderboard/                      # 排行榜业务
│   ├── activity/                         # 活动页业务
│   ├── profile/                          # 个人中心业务
│   ├── tasks/                            # 每日任务业务
│   ├── achievements/                     # 成就徽章业务
│   ├── chat/                             # 聊天 / 系统消息业务
│   ├── audio/                            # 音效控制业务
│   └── loading/                          # 加载动画业务
│
├── components/                           # 全局公共组件
│   ├── ui/                               # 基础 UI 组件：Button、Input、Modal、Tabs
│   ├── layout/                           # 通用布局组件：导航栏、页面容器、舞台布局
│   ├── animation/                        # 通用动画组件：淡入、浮动、发光
│   ├── modal/                            # 全局弹窗组件
│   ├── cards/                            # 通用卡片组件：玩家卡、活动卡、排行卡
│   ├── forms/                            # 表单组件：登录、注册、房间创建
│   └── effects/                          # 特效组件：粒子、云层、光效、暗角
│
├── mocks/                                # mock 假数据，接口未完成时使用
│   ├── user.mock.ts                      # 用户假数据
│   ├── lobby.mock.ts                     # 大厅假数据
│   ├── room.mock.ts                      # 房间假数据
│   ├── game.mock.ts                      # 游戏对局假数据
│   ├── leaderboard.mock.ts               # 排行榜假数据
│   ├── activity.mock.ts                  # 活动页假数据
│   ├── profile.mock.ts                   # 个人中心假数据
│   ├── task.mock.ts                      # 每日任务假数据
│   ├── achievement.mock.ts               # 成就假数据
│   └── chat.mock.ts                      # 聊天 / 系统消息假数据
│
├── hooks/                                # 自定义 Hooks
│   ├── useUser.ts                        # 用户数据逻辑
│   ├── useRoom.ts                        # 房间逻辑
│   ├── useGame.ts                        # 游戏对局逻辑
│   ├── useAudio.ts                       # 音效逻辑
│   ├── useModal.ts                       # 弹窗逻辑
│   └── useCountdown.ts                   # 倒计时逻辑
│
├── stores/                               # Zustand 全局状态
│   ├── user.store.ts                     # 用户状态
│   ├── room.store.ts                     # 房间状态
│   ├── game.store.ts                     # 游戏状态
│   ├── ui.store.ts                       # UI 状态
│   ├── audio.store.ts                    # 音效状态
│   ├── modal.store.ts                    # 弹窗状态
│   └── chat.store.ts                     # 聊天状态
│
├── utils/                                # 工具函数
│   ├── calculateScore.ts                 # 13 项计分规则计算
│   ├── dice.ts                           # 骰子随机、锁定、重掷逻辑
│   ├── format.ts                         # 格式化工具
│   ├── storage.ts                        # localStorage 工具
│   └── cn.ts                             # className 合并工具
│
├── constants/                            # 常量配置
│   ├── gameRules.ts                      # 游戏规则说明
│   ├── scoreItems.ts                     # 13 项计分配置
│   ├── routes.ts                         # 页面路由配置
│   ├── theme.ts                          # 主题颜色配置
│   └── assets.ts                         # 静态资源路径配置
│
├── types/                                # TypeScript 类型定义
│   ├── user.ts                           # 用户类型
│   ├── room.ts                           # 房间类型
│   ├── game.ts                           # 游戏类型
│   ├── score.ts                          # 分数类型
│   ├── leaderboard.ts                    # 排行榜类型
│   ├── activity.ts                       # 活动类型
│   ├── achievement.ts                    # 成就类型
│   ├── chat.ts                           # 聊天类型
│   └── common.ts                         # 通用类型
│
├── animations/                           # 全局动画配置
│   ├── float.animation.ts                # 漂浮动画
│   ├── glow.animation.ts                 # 发光动画
│   ├── dice.animation.ts                 # 骰子动画
│   ├── page.animation.ts                 # 页面切换动画
│   ├── shimmer.animation.ts              # 流光动画
│   └── cloud.animation.ts                # 云层动画
│
├── styles/                               # 全局样式
│   ├── globals.css                       # 全局 CSS
│   ├── animations.css                    # 全局动画样式
│   ├── effects.css                       # 光效 / 粒子 / 暗角样式
│   └── theme.css                         # 主题变量
│
├── assets/                               # 静态资源总目录
│   │
│   ├── images/                           # 图片资源总目录
│   │   │
│   │   ├── backgrounds/                  # 页面背景图
│   │   │   ├── login/                    # 登录注册背景图
│   │   │   │   └── login-bg.png
│   │   │   ├── lobby/                    # 游戏大厅背景图
│   │   │   │   └── lobby-bg.png
│   │   │   ├── room/                     # 房间等待页背景图
│   │   │   │   └── room-bg.png
│   │   │   ├── game/                     # 游戏对局背景图
│   │   │   │   └── game-bg.png
│   │   │   ├── leaderboard/              # 排行榜背景图
│   │   │   │   └── leaderboard-bg.png
│   │   │   ├── activity/                 # 活动页背景图
│   │   │   │   └── activity-bg.png
│   │   │   ├── profile/                  # 个人中心背景图
│   │   │   │   └── profile-bg.png
│   │   │   └── result/                   # 结算页 / 结算弹窗背景图
│   │   │       └── result-bg.png
│   │   │
│   │   ├── ui/                           # UI 装饰图片
│   │   │   ├── buttons/                  # 按钮底图、按钮装饰
│   │   │   ├── panels/                   # 面板底图、卡片底图
│   │   │   ├── frames/                   # 边框、头像框、排行框
│   │   │   ├── badges/                   # 徽章、称号、奖章
│   │   │   ├── icons/                    # 图片类图标
│   │   │   └── decorations/              # 装饰物：皇冠、奖杯、旗帜等
│   │   │
│   │   ├── dice/                         # 骰子图片素材
│   │   │   ├── dice-1.png                # 1 点骰子
│   │   │   ├── dice-2.png                # 2 点骰子
│   │   │   ├── dice-3.png                # 3 点骰子
│   │   │   ├── dice-4.png                # 4 点骰子
│   │   │   ├── dice-5.png                # 5 点骰子
│   │   │   └── dice-6.png                # 6 点骰子
│   │   │
│   │   ├── avatars/                      # 头像资源
│   │   │   ├── default-guest.png         # 默认游客头像
│   │   │   ├── default-player.png        # 默认玩家头像
│   │   │   └── ai-bot.png                # AI 机器人头像
│   │   │
│   │   ├── effects/                      # 特效图片
│   │   │   ├── glow/                     # 发光、光晕
│   │   │   ├── particles/                # 粒子、星光
│   │   │   ├── clouds/                   # 云层、雾气
│   │   │   ├── light/                    # 阳光、扫光、光束
│   │   │   └── shimmer/                  # 流光、海面反光
│   │   │
│   │   ├── illustrations/                # 插画角色
│   │   │   ├── mascot/                   # 吉祥物 / 骰子角色
│   │   │   ├── characters/               # 人物角色
│   │   │   └── empty/                    # 空状态插画
│   │   │
│   │   └── logo/                         # Logo 类图片
│   │       ├── logo.png                  # 项目 Logo
│   │       └── title.png                 # 游戏标题图
│   │
│   ├── icons/                            # SVG 图标资源
│   │   ├── nav/                          # 导航图标
│   │   ├── game/                         # 游戏功能图标
│   │   ├── activity/                     # 活动图标
│   │   └── common/                       # 通用图标
│   │
│   ├── audio/                            # 音频资源
│   │   ├── bgm/                          # 背景音乐
│   │   ├── sfx/                          # 操作音效
│   │   ├── dice/                         # 投骰音效
│   │   ├── reward/                       # 奖励音效
│   │   └── ui/                           # UI 点击 / hover 音效
│   │
│   └── fonts/                            # 字体资源
│       └── game-font.woff2               # 游戏字体
│
└── providers/                            # 全局 Provider
    ├── AppProvider.tsx                   # 应用级 Provider
    ├── AudioProvider.tsx                 # 音效 Provider
    ├── ThemeProvider.tsx                 # 主题 Provider
---

# 6. 页面模块规范

---

# auth 登录注册模块

目录：

```txt
modules/auth/
```

负责：

* 登录
* 注册
* 表单验证
* 验证码
* 登录切换

组件：

```txt
LoginForm.tsx
RegisterForm.tsx
AuthTabs.tsx
MascotIntro.tsx
```

---

# lobby 游戏大厅模块

目录：

```txt
modules/lobby/
```

负责：

* 玩家信息
* 四个主入口
* 每日任务
* 排行榜
* 系统消息
* 动态背景

组件：

```txt
LobbyNavbar.tsx
ModeCards.tsx
TaskPanel.tsx
LobbyChat.tsx
NoticeBanner.tsx
PlayerInfoCard.tsx
AtmosphereLayer.tsx
```

---

# room 房间模块

目录：

```txt
modules/room/
```

负责：

* 创建房间
* 房间等待
* 玩家准备
* 房主开始游戏
* 房间聊天
* 倒计时（房主点击开始游戏之后倒计时3秒进入游戏）

组件：

```txt
RoomPlayerCard.tsx
RoomCountdown.tsx
RoomActions.tsx
RoomChat.tsx
RoomHeader.tsx
```

---

# game 游戏模块（核心）

目录：

```txt
modules/game/
```

负责：

* 棋盘
* 投骰子
* 锁定骰子
* 13 项计分
* 回合切换
* 玩家排行
* 对局逻辑

组件：

```txt
GameBoard.tsx
DicePanel.tsx
DiceItem.tsx
ScoreTable.tsx
PlayerRankPanel.tsx
GameEventPanel.tsx
```

---

# result 结算模块

目录：

```txt
modules/result/
```

负责：

* 最终排名
* 分数明细
* 再来一局
* 分享战绩

组件：

```txt
ResultModal.tsx
ResultRankList.tsx
ResultActions.tsx
```

---

# leaderboard 排行榜模块

目录：

```txt
modules/leaderboard/
```

负责：

* 历史最高分
* 胜率排行
* 总对局排行

组件：

```txt
LeaderboardTable.tsx
LeaderboardTabs.tsx
MyRankBar.tsx
```

---

# activity 活动模块

目录：

```txt
modules/activity/
```

负责：

* 每日任务
* 每日签到
* 城堡探索
* 积分奖励

组件：

```txt
ActivityBanner.tsx
CastleProgress.tsx
DailySign.tsx
RewardPool.tsx
```

---

# profile 个人中心模块

目录：

```txt
modules/profile/
```

负责：

* 数据总览
* 成就徽章
* 历史记录
* 用户信息

组件：

```txt
ProfileHeader.tsx
StatsOverview.tsx
AchievementPanel.tsx
HistoryPanel.tsx
```

---

# 7. mock 数据规范（当前最重要）

目录：

```txt
mocks/
```

原则：

* 所有页面必须使用 mock 数据
* mock 数据禁止写页面内部
* mock 数据字段尽量贴近未来真实接口
* 页面通过 hooks 获取数据
* 后续只替换数据层

错误：

```tsx
const data = [...]
```

正确：

```tsx
const { user } = useUser()
```

---

# 8. Zustand 状态管理规范

目录：

```txt
stores/
```

必须拆分：

```txt
user.store.ts
room.store.ts
game.store.ts
ui.store.ts
audio.store.ts
chat.store.ts
```

禁止：

所有状态放一个 store。

---

# 9. TypeScript 规范

禁止：

```ts
any
```

必须：

所有业务定义类型。

目录：

```txt
types/
```

必须包含：

```txt
user.ts
room.ts
game.ts
score.ts
leaderboard.ts
activity.ts
achievement.ts
chat.ts
```

---

# 10. 游戏规则规范（核心）

核心文件：

```txt
utils/calculateScore.ts
utils/dice.ts
constants/scoreItems.ts
```

禁止：

在组件内部直接写计分逻辑。

---

## 必须支持的规则

* 一点
* 二点
* 三点
* 四点
* 五点
* 六点
* 三条
* 四条
* 满堂红
* 小顺
* 大顺
* 快艇
* 机会

---

## 必须支持

* 3 次投掷
* 锁定骰子
* 回合切换
* 13 项全部结束后结算

---

# 11. UI 风格规范（非常重要）

整体风格：

* 海岛度假
* 高级游戏大厅
* 拟真卡通
* 蓝金色
* 高饱和
* 柔和阴影
* 游戏感

---

## UI 原则

必须：

* 清晰
* 高级
* 有层次
* 有沉浸感

禁止：

* 后台管理风
* 扁平过度
* 低级渐变
* 廉价发光

---

## 面板规范

排行榜、任务栏、计分板：

必须：

* 高可读性
* 不透明度较高
* 不影响文字阅读

禁止：

过度毛玻璃。

推荐：

```css
background: linear-gradient(
  180deg,
  rgba(20,40,90,0.96),
  rgba(10,20,50,0.94)
);
```

---

# 12. 动画规范（重点）

动画必须：

* 缓慢
* 柔和
* 高级
* 有呼吸感

---

## 推荐动画

* 页面淡入
* 卡片 hover 上浮
* 骰子旋转
* 云层漂浮
* 海面 shimmer
* 粒子漂浮
* 按钮 glow

---

## 动画文件

目录：

```txt
animations/
```

拆分：

```txt
float.animation.ts
dice.animation.ts
card.animation.ts
glow.animation.ts
```

---

## 动画性能规范

只允许：

```css
transform
opacity
filter
```

禁止：

```css
top
left
width
height
```

高频动画。

---

# 13. 动态背景规范

允许：

* 海鸥
* 热气球
* 云层
* 粒子
* 光点
* 波纹

优先：

* lucide-react
* react-icons
* SVG
* CSS gradient

不强依赖 PNG。

---

# 14. 响应式规范（重要）

项目：

## 仅适配电脑网页端。

核心方案：

```txt
固定16:9主舞台
+
外围动态延展
```

禁止：

移动端适配。

---

## 主舞台规范

```css
aspect-ratio: 16 / 9;
```

必须：

* 不拉伸
* 不变形
* 超宽屏自然延展

---

# 15. 音效系统规范

统一：

```txt
modules/audio/
hooks/useAudio.ts
stores/audio.store.ts
```

管理。

禁止：

```ts
new Audio()
```

直接写页面。

---

# 16. 组件规范

---

## 基础 UI

目录：

```txt
components/ui/
```

包括：

* Button
* Modal
* Input
* Tabs
* Tooltip

---

## 游戏组件

目录：

```txt
components/game/
```

包括：

* Dice
* ScoreBoard
* PlayerCard
* GameBoard

---

## 原则

* 一个组件职责单一
* props 类型完整
* 不滥用全局状态

---

# 17. 文件命名规范

| 类型    | 规则         |
| ----- | ---------- |
| 组件    | PascalCase |
| hooks | useXxx     |
| utils | camelCase  |
| 类型    | camelCase  |
| 常量    | camelCase  |

---

# 18. 开发流程

开发新功能时：

---

## 1. 分析需求

明确：

* 页面
* 状态
* 动画
* 规则
* mock 数据

---

## 2. 先写类型

目录：

```txt
types/
```

---

## 3. 再写 hooks / utils

---

## 4. 再写组件

---

## 5. 最后组合页面

---

# 19. 禁止事项（必须遵守）

禁止：

* 页面直接写 mock 数据
* 页面直接写复杂逻辑
* 一个组件几百行
* any 泛滥
* 大量 useEffect
* 滥用 Context
* 动画污染业务组件
* 直接操作 DOM
* 重型 canvas 粒子
* UI 文字看不清
* 实现好友系统

---

# 20. 当前开发优先级

---

## P0（最高）

* 登录注册
* 游戏大厅
* 房间等待
* 游戏对局
* 骰子逻辑
* 13 项计分
* 结算窗口

---

## P1

* 排行榜
* 活动页
* 个人中心
* 成就
* 历史记录

---

## P2

* 音效
* 动态背景
* 页面转场
* 本地存档

---

# 21. 最终目标

本项目最终目标：

不是普通前端页面。

而是：

## 高沉浸感多人在线网页骰子游戏大厅系统。

必须具备：

* 工程化
* 模块化
* 高性能
* 高沉浸感
* 游戏化 UI
* 动态氛围
* 可扩展架构

所有开发必须围绕：

* 可维护
* 可扩展
* UI 高还原
* 游戏体验
* 性能稳定

进行开发。
