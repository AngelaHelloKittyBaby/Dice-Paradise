import { existsSync, readFileSync } from 'node:fs';

const pagePath = 'src/app/login/page.tsx';
const stylePath = 'src/app/login/login.module.scss';
const loginImagePath = 'src/assets/images/backgrounds/login/login-bg.png';

const page = readFileSync(pagePath, 'utf8');
const styles = existsSync(stylePath) ? readFileSync(stylePath, 'utf8') : '';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(existsSync(stylePath), '登录页必须使用 src/app/login/login.module.scss');
assert(existsSync(loginImagePath), '背景图必须放在 src/assets/images/backgrounds/login/login-bg.png');
assert(page.includes("'use client';"), '登录页必须是客户端组件');
assert(page.includes("import loginBackground from '@/assets/images/backgrounds/login/login-bg.png';"), '登录页需要从 src/assets 引入背景图');
assert(page.includes("import { useRouter } from 'next/navigation';"), '登录成功必须使用 useRouter 跳转');
assert(page.includes("import styles from './login.module.scss';"), '登录页必须引入 SCSS Module');
assert(page.includes("type AuthTab = 'login' | 'register';"), '需要定义登录/注册 Tab 类型');
assert(page.includes('interface LoginFormState'), '需要定义登录表单类型');
assert(page.includes('interface RegisterFormState'), '需要定义注册表单类型');
assert(page.includes('function mockLogin'), '需要预留 mockLogin()');
assert(page.includes('function mockRegister'), '需要预留 mockRegister()');
assert(page.includes('function mockSendCode'), '需要预留 mockSendCode()');
assert(page.includes("'/api/login'"), '需要预留 POST /api/login');
assert(page.includes("'/api/register'"), '需要预留 POST /api/register');
assert(page.includes("'/api/send-code'"), '需要预留 POST /api/send-code');
assert(page.includes("useState<AuthTab>('register')"), '默认必须显示注册表单');
assert(page.includes("router.push('/')"), '登录成功后必须跳转首页');
assert(page.includes('handleLoginSubmit'), '需要登录提交逻辑');
assert(page.includes('handleRegisterSubmit'), '需要注册提交逻辑');
assert(page.includes('handleSendCode'), '需要获取验证码逻辑');
assert(page.includes("setActiveTab('login')"), '注册成功后必须切换到登录 Tab');
assert(page.includes('用户名 / 手机号'), '登录表单需要账号字段');
assert(page.includes('确认密码'), '注册表单需要确认密码字段');
assert(page.includes('用户协议'), '注册表单需要用户协议 checkbox');
assert(page.includes('已有账号？') && page.includes('立即登录'), '注册表单需要登录切换入口');
assert(page.includes('没有账号？') && page.includes('立即注册'), '登录表单需要注册切换入口');
assert(page.includes('style={{ backgroundImage: `url(${loginBackground.src})` }}'), '背景必须使用 src/assets 图片路径');
assert(styles.includes('background-size: cover'), '背景必须全屏 cover');
assert(styles.includes('overflow: hidden'), '页面不可滚动');
assert(styles.includes('aspect-ratio: 16 / 9'), '页面需要按 16:9 适配');
assert(styles.includes('width: min(760px'), '卡片宽度需要约 760px');
assert(styles.includes('border-radius: 36px'), '卡片圆角需要 36px');
assert(styles.includes('backdrop-filter: blur(20px)'), '卡片需要玻璃拟态 blur(20px)');
assert(styles.includes('@keyframes pageFadeIn'), '页面进入需要淡入动画');
assert(styles.includes('@keyframes cardEnter'), '卡片进入需要 scale 动画');
assert(styles.includes('@keyframes formIn'), '表单切换需要 opacity + translateY 动画');
assert(styles.includes('@keyframes buttonGlow'), '主按钮需要呼吸发光动画');
