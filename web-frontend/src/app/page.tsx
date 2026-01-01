'use client';

import { useState, CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    if (username.trim()) {
      const avatars = ['😊', '🙂', '😎', '🤓', '🥳', '🤗', '😇'];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      const userData = {
        name: username,
        avatar: randomAvatar,
        color: '#a855f7',
      };
      axios.post(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/account/signin`, userData).then((response) => {
        window.localStorage.setItem('login_user_data', JSON.stringify(response.data));
      });
      window.localStorage.setItem('login_user_data', JSON.stringify(userData));
      // ルーム一覧へ遷移
      router.push('/rooms');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>💬</div>
          <h1 style={styles.title}>ChatRoom</h1>
          <p style={styles.subtitle}>リアルタイムチャットアプリケーション</p>
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="名前を入力してください"
              style={styles.input}
              autoFocus
            />
          </div>
          <button type="submit" style={styles.button} disabled={!username.trim()}>
            <span>ルーム一覧へ</span>
            <ArrowRight size={20} />
          </button>
        </form>
        <div style={styles.footer}>
          <p style={styles.footerText}>ユーザー名を入力して、チャットルームに参加しましょう</p>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
};
