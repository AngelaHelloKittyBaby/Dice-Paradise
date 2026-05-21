'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dice5, LockKeyhole, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { mockCurrentPlayer } from '@/mocks';
import loginBackground from '@/assets/images/backgrounds/login/login-bg.png';
import { usePlayerStore } from '@/stores';
import styles from './login.module.scss';

type AuthTab = 'login' | 'register';

interface LoginFormState {
  account: string;
  password: string;
  rememberPassword: boolean;
}

interface RegisterFormState {
  username: string;
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
  acceptedAgreement: boolean;
}

interface LoginRequest {
  account: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  phone: string;
  code: string;
  password: string;
}

interface SendCodeRequest {
  phone: string;
}

interface MockApiResponse {
  success: true;
  message: string;
}

const MOCK_ENDPOINTS = {
  login: '/api/login',
  register: '/api/register',
  sendCode: '/api/send-code',
} as const;

const initialLoginForm: LoginFormState = {
  account: '',
  password: '',
  rememberPassword: true,
};

const initialRegisterForm: RegisterFormState = {
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  acceptedAgreement: false,
};

function wait(ms = 640): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

async function mockLogin(payload: LoginRequest): Promise<MockApiResponse> {
  console.info('POST', MOCK_ENDPOINTS.login, payload);
  await wait();

  return {
    success: true,
    message: '登录成功',
  };
}

async function mockRegister(payload: RegisterRequest): Promise<MockApiResponse> {
  console.info('POST', MOCK_ENDPOINTS.register, payload);
  await wait();

  return {
    success: true,
    message: '注册成功，请登录',
  };
}

async function mockSendCode(payload: SendCodeRequest): Promise<MockApiResponse> {
  console.info('POST', MOCK_ENDPOINTS.sendCode, payload);
  await wait(420);

  return {
    success: true,
    message: '验证码已发送',
  };
}

export default function LoginPage() {
  const router = useRouter();
  const loginPlayer = usePlayerStore(state => state.login);
  const [activeTab, setActiveTab] = useState<AuthTab>('register');
  const [loginForm, setLoginForm] = useState<LoginFormState>(initialLoginForm);
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(initialRegisterForm);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('mode=login')) {
      setActiveTab('login');
    }

    if (window.location.search.includes('mode=register')) {
      setActiveTab('register');
    }
  }, []);

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const updateLoginForm = <Key extends keyof LoginFormState>(
    key: Key,
    value: LoginFormState[Key]
  ) => {
    setLoginForm(current => ({
      ...current,
      [key]: value,
    }));
  };

  const updateRegisterForm = <Key extends keyof RegisterFormState>(
    key: Key,
    value: RegisterFormState[Key]
  ) => {
    setRegisterForm(current => ({
      ...current,
      [key]: value,
    }));
  };

  const validateLogin = () => {
    if (!loginForm.account.trim()) return '请输入用户名或手机号';
    if (!loginForm.password.trim()) return '请输入密码';
    return '';
  };

  const validateRegister = () => {
    if (!registerForm.username.trim()) return '请输入用户名';
    if (!registerForm.phone.trim()) return '请输入手机号';
    if (!registerForm.code.trim()) return '请输入验证码';
    if (!registerForm.password.trim()) return '请输入密码';
    if (!registerForm.confirmPassword.trim()) return '请再次输入密码';
    if (registerForm.password !== registerForm.confirmPassword) return '两次输入的密码不一致';
    if (!registerForm.acceptedAgreement) return '请先阅读并同意用户协议';
    return '';
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationMessage = validateLogin();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await mockLogin({
        account: loginForm.account.trim(),
        password: loginForm.password,
      });

      loginPlayer(mockCurrentPlayer);
      setSuccessMessage(response.message);
      router.push('/');
    } catch {
      setErrorMessage('登录失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const validationMessage = validateRegister();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await mockRegister({
        username: registerForm.username.trim(),
        phone: registerForm.phone.trim(),
        code: registerForm.code.trim(),
        password: registerForm.password,
      });

      setSuccessMessage(response.message);
      setRegisterForm(initialRegisterForm);
      setActiveTab('login');
    } catch {
      setErrorMessage('注册失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendCode = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!registerForm.phone.trim()) {
      setErrorMessage('请输入手机号后再获取验证码');
      return;
    }

    setIsSendingCode(true);

    try {
      const response = await mockSendCode({
        phone: registerForm.phone.trim(),
      });
      setSuccessMessage(response.message);
    } catch {
      setErrorMessage('验证码发送失败，请稍后重试');
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <main className={styles.pageShell}>
      <section
        className={styles.stage}
        aria-label="投骰乐园登录注册页"
        style={{ backgroundImage: `url(${loginBackground.src})` }}
      >
        <div className={styles.brandMark} aria-label="投骰乐园">
          <span className={styles.logoDice}>
            <Dice5 size={46} strokeWidth={2.6} />
          </span>
          <span>
            投骰乐园
            <small>DICE PARADISE</small>
          </span>
        </div>

        <aside className={styles.welcomePanel} aria-label="欢迎文案">
          <h1>
            <span>欢迎来到</span>
            投骰乐园！
          </h1>
          <p>创建账号，开启你的投掷冒险之旅！</p>
          <div className={styles.dialogBubble}>
            嗨！我是白小骰，
            <br />
            很高兴认识你！
          </div>
        </aside>

        <section className={styles.authCard} aria-label="登录注册表单">
          <div className={styles.tabs} role="tablist" aria-label="账号操作">
            <span
              className={`${styles.tabIndicator} ${
                activeTab === 'login' ? styles.tabIndicatorLogin : styles.tabIndicatorRegister
              }`}
            />
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'login'}
              className={`${styles.tabButton} ${activeTab === 'login' ? styles.tabActive : ''}`}
              onClick={() => switchTab('login')}
            >
              登录
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'register'}
              className={`${styles.tabButton} ${activeTab === 'register' ? styles.tabActive : ''}`}
              onClick={() => switchTab('register')}
            >
              注册
            </button>
          </div>

          <div className={styles.formPanel}>
            {activeTab === 'register' ? (
              <form key="register" className={styles.authForm} onSubmit={handleRegisterSubmit}>
                <label className={styles.fieldRow}>
                  <span>
                    <UserRound size={24} />
                    用户名
                  </span>
                  <input
                    type="text"
                    value={registerForm.username}
                    onChange={event => updateRegisterForm('username', event.target.value)}
                    placeholder="请输入用户名"
                    autoComplete="username"
                  />
                  <small>4-16位字符，可使用字母、数字、下划线</small>
                </label>

                <label className={styles.fieldRow}>
                  <span>
                    <Phone size={24} />
                    手机号
                  </span>
                  <div className={styles.codeInputGroup}>
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={event => updateRegisterForm('phone', event.target.value)}
                      placeholder="请输入手机号"
                      autoComplete="tel"
                    />
                    <button type="button" onClick={handleSendCode} disabled={isSendingCode}>
                      {isSendingCode ? '发送中' : '获取验证码'}
                    </button>
                  </div>
                </label>

                <label className={styles.fieldRow}>
                  <span>
                    <ShieldCheck size={24} />
                    验证码
                  </span>
                  <input
                    type="text"
                    value={registerForm.code}
                    onChange={event => updateRegisterForm('code', event.target.value)}
                    placeholder="请输入验证码"
                    inputMode="numeric"
                  />
                </label>

                <label className={styles.fieldRow}>
                  <span>
                    <LockKeyhole size={24} />
                    密码
                  </span>
                  <input
                    type="password"
                    value={registerForm.password}
                    onChange={event => updateRegisterForm('password', event.target.value)}
                    placeholder="请输入密码"
                    autoComplete="new-password"
                  />
                  <small>6-20位字符，需包含字母和数字</small>
                </label>

                <label className={styles.fieldRow}>
                  <span>
                    <LockKeyhole size={24} />
                    确认密码
                  </span>
                  <input
                    type="password"
                    value={registerForm.confirmPassword}
                    onChange={event => updateRegisterForm('confirmPassword', event.target.value)}
                    placeholder="请再次输入密码"
                    autoComplete="new-password"
                  />
                </label>

                <label className={styles.agreementRow}>
                  <input
                    type="checkbox"
                    checked={registerForm.acceptedAgreement}
                    onChange={event => updateRegisterForm('acceptedAgreement', event.target.checked)}
                  />
                  <span>
                    我已阅读并同意 <a href="/terms">《用户协议》</a> 和{' '}
                    <a href="/privacy">《隐私政策》</a>
                  </span>
                </label>

                {(errorMessage || successMessage) && (
                  <p className={errorMessage ? styles.errorMessage : styles.successMessage}>
                    {errorMessage || successMessage}
                  </p>
                )}

                <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                  <Dice5 size={30} />
                  {isSubmitting ? '注册中...' : '立即注册'}
                  <Dice5 size={30} />
                </button>

                <p className={styles.switchHint}>
                  已有账号？
                  <button type="button" onClick={() => switchTab('login')}>
                    立即登录
                  </button>
                </p>
              </form>
            ) : (
              <form key="login" className={styles.authForm} onSubmit={handleLoginSubmit}>
                <label className={styles.fieldRow}>
                  <span>
                    <UserRound size={24} />
                    用户名 / 手机号
                  </span>
                  <input
                    type="text"
                    value={loginForm.account}
                    onChange={event => updateLoginForm('account', event.target.value)}
                    placeholder="请输入用户名或手机号"
                    autoComplete="username"
                  />
                </label>

                <label className={styles.fieldRow}>
                  <span>
                    <LockKeyhole size={24} />
                    密码
                  </span>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={event => updateLoginForm('password', event.target.value)}
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                </label>

                <div className={styles.loginOptions}>
                  <label>
                    <input
                      type="checkbox"
                      checked={loginForm.rememberPassword}
                      onChange={event => updateLoginForm('rememberPassword', event.target.checked)}
                    />
                    记住密码
                  </label>
                  <button type="button">忘记密码</button>
                </div>

                {(errorMessage || successMessage) && (
                  <p className={errorMessage ? styles.errorMessage : styles.successMessage}>
                    {errorMessage || successMessage}
                  </p>
                )}

                <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
                  <Dice5 size={30} />
                  {isSubmitting ? '登录中...' : '立即登录'}
                  <Dice5 size={30} />
                </button>

                <p className={styles.switchHint}>
                  没有账号？
                  <button type="button" onClick={() => switchTab('register')}>
                    立即注册
                  </button>
                </p>
              </form>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
