'use client';

import { useEffect, CSSProperties } from 'react';
import { Users, Lock, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import axios from 'axios';
import { roomsAtom, selectedRoomAtom } from '../atoms/rooms';
import { loginUserDataAtom } from '../atoms/users';
import type { Room } from '../types';

export default function RoomsPage() {
  const [availableRooms, setAvailableRooms] = useAtom(roomsAtom);
  const [selectRoom, setSelectRoom] = useAtom(selectedRoomAtom);
  const [loginUserData, setLoginUserData] = useAtom(loginUserDataAtom);
  const router = useRouter();

  useEffect(() => {
    if (!loginUserData || !loginUserData.id || loginUserData.status === 'away') {
      router.push('/');
    }
    if (availableRooms.length <= 0) {
      axios.get(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/rooms`).then((response) => {
        setAvailableRooms(response.data);
      });
    }
  }, [availableRooms]);

  const handleJoinRoom = (room: Room): void => {
    setSelectRoom(room);
    router.push(`/chat?roomId=${encodeURIComponent(room.id)}`);
  };

  if (!loginUserData) {
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
          <div style={styles.userBadgeAvatar}>{loginUserData.avatar}</div>
          <span style={styles.userBadgeName}>{loginUserData.name}</span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.grid}>
          {availableRooms.map((room) => (
            <div key={room.id} style={styles.card} onClick={() => handleJoinRoom(room)}>
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
