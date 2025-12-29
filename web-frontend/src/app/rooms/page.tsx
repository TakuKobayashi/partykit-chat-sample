'use client';

import { useState, useEffect, CSSProperties } from 'react';
import { Users, Lock, Plus } from 'lucide-react';
import { useRouter } from "next/navigation";
import type { Room, CurrentUser } from '../types';

export default function RoomsPage() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  const availableRooms: Room[] = [
    {
      id: '1',
      name: '一般チャット',
      icon: '💬',
      description: '誰でも参加できるオープンな雑談ルーム',
      memberCount: 128,
      isPrivate: false,
      lastActivity: '2分前'
    },
    {
      id: '2',
      name: 'プロジェクトA',
      icon: '📊',
      description: 'プロジェクトAに関する議論・進捗報告',
      memberCount: 24,
      isPrivate: false,
      lastActivity: '5分前'
    },
    {
      id: '3',
      name: 'デザインチーム',
      icon: '🎨',
      description: 'デザイン関連の相談・レビュー',
      memberCount: 15,
      isPrivate: true,
      lastActivity: '15分前'
    },
    {
      id: '4',
      name: 'エンジニアリング',
      icon: '⚙️',
      description: '技術的な議論・コードレビュー',
      memberCount: 42,
      isPrivate: false,
      lastActivity: '1分前'
    },
    {
      id: '5',
      name: '経営会議',
      icon: '🏢',
      description: '経営陣のみ参加可能',
      memberCount: 8,
      isPrivate: true,
      lastActivity: '30分前'
    },
    {
      id: '6',
      name: 'ゲーム好き集まれ',
      icon: '🎮',
      description: 'ゲームの話題で盛り上がろう',
      memberCount: 67,
      isPrivate: false,
      lastActivity: '3分前'
    },
  ];

  useEffect(() => {
    const userData = (window as any).__chatUserData;
    if (!userData) {
      window.location.href = '/';
    } else {
      setCurrentUser(userData);
    }
  }, []);

  const handleJoinRoom = (room: Room): void => {
    (window as any).__selectedRoom = room;
    router.push(`/chat?roomId=${encodeURIComponent(room.id)}`);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>チャットルーム一覧</h1>
          <p style={styles.subtitle}>参加したいルームを選択してください</p>
        </div>
        <div style={styles.userBadge}>
          <div style={styles.userBadgeAvatar}>{currentUser.avatar}</div>
          <span style={styles.userBadgeName}>{currentUser.name}</span>
        </div>
      </div>
      
      <div style={styles.content}>
        <div style={styles.grid}>
          {availableRooms.map((room) => (
            <div
              key={room.id}
              style={styles.card}
              onClick={() => handleJoinRoom(room)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>{room.icon}</div>
                {room.isPrivate && (
                  <div style={styles.privateBadge}>
                    <Lock size={12} />
                  </div>
                )}
              </div>
              <h3 style={styles.cardTitle}>{room.name}</h3>
              <p style={styles.cardDescription}>{room.description}</p>
              <div style={styles.cardFooter}>
                <div style={styles.cardInfo}>
                  <Users size={16} />
                  <span>{room.memberCount}人</span>
                </div>
                <div style={styles.cardActivity}>
                  <div style={styles.activityDot}></div>
                  <span>{room.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button style={styles.createButton}>
        <Plus size={20} />
        <span>新しいルームを作成</span>
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px',
  },
  header: {
    maxWidth: '1200px',
    margin: '0 auto 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#9ca3af',
    margin: 0,
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
  },
  userBadgeAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  userBadgeName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
    cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  cardIcon: {
    fontSize: '48px',
  },
  privateBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: '#ef4444',
    borderRadius: '8px',
    color: 'white',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #334155',
  },
  cardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  cardActivity: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    maxWidth: '1200px',
    margin: '32px auto 0',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};