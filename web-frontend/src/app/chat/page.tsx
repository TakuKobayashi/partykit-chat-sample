'use client';

import { useState, useRef, useEffect, CSSProperties, Suspense } from 'react';
import { Send, Menu, Users, Hash, Settings, LogOut, Smile, Paperclip, MoreVertical, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { WebSocket } from "partysocket";
import { usePartySocket } from "partysocket/react";
import type { Message, User, Channel, CurrentUser, Room } from '../types';

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const socket = usePartySocket({
    host: "localhost:8787",
    party: "chat",
    room: "general",
    prefix: "ws",
  });
  socket.onopen = (event) => {
    console.log("open");
    console.log(event);
    socket.send("hello");
  }
  socket.onmessage = (event) => {
    console.log(`onmessage:${event.data}`);
    console.log(event);
  }
  /*
  const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSCOKET_ROOT_URL}`);
  ws.addEventListener("open", () => {
    console.log("open")
    ws.send("hello!");
  });
  */

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'みなさん、こんにちは！', sender: '田中太郎', avatar: '🧑', time: '10:30', color: '#3b82f6' },
    { id: 2, text: 'おはようございます！', sender: '山田花子', avatar: '👩', time: '10:31', color: '#ec4899' },
    { id: 3, text: 'プロジェクトの進捗について話し合いましょう', sender: '佐藤次郎', avatar: '👨', time: '10:32', color: '#10b981' },
  ]);
  const [input, setInput] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [onlineUsers] = useState<User[]>([
    { name: '田中太郎', avatar: '🧑', status: 'online' },
    { name: '山田花子', avatar: '👩', status: 'online' },
    { name: '佐藤次郎', avatar: '👨', status: 'online' },
    { name: '鈴木一郎', avatar: '🧔', status: 'away' },
    { name: '高橋美咲', avatar: '👧', status: 'online' },
  ]);
  const [channels] = useState<Channel[]>([
    { name: '一般', icon: '💬', unread: 0, active: true },
    { name: 'プロジェクトA', icon: '📊', unread: 3, active: false },
    { name: 'デザイン', icon: '🎨', unread: 0, active: false },
    { name: 'エンジニアリング', icon: '⚙️', unread: 7, active: false },
    { name: '雑談', icon: '☕', unread: 0, active: false },
  ]);
  const [isTyping] = useState<string[]>(['山田花子']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = window.localStorage.getItem('login_user_data');
    const roomData = (window as any).__selectedRoom;

    if (!userData) {
      router.push('/');
    } else {
      setCurrentUser(JSON.parse(userData));
    }

    if (roomData) {
      setSelectedRoom(roomData);
    }
  }, []);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (): void => {
    if (input.trim() && currentUser) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: currentUser.name,
        avatar: currentUser.avatar,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        color: currentUser.color,
      };
      setMessages([...messages, newMessage]);
      setInput('');

      setTimeout(() => {
        const responses = [
          { text: 'いいですね！', sender: '田中太郎', avatar: '🧑', color: '#3b82f6' },
          { text: '賛成です', sender: '山田花子', avatar: '👩', color: '#ec4899' },
          { text: 'それで進めましょう', sender: '佐藤次郎', avatar: '👨', color: '#10b981' },
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const aiResponse: Message = {
          id: messages.length + 2,
          text: randomResponse.text,
          sender: randomResponse.sender,
          avatar: randomResponse.avatar,
          time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          color: randomResponse.color,
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = (): void => {
    window.localStorage.removeItem('login_user_data');
    delete (window as any).__selectedRoom;
    router.push('/');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div style={styles.container}>
      {/* 左サイドバー */}
      <div style={{ ...styles.leftSidebar, width: isSidebarOpen ? '256px' : '0' }}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.workspaceTitle}>
            <Hash color="#a855f7" size={24} style={{ marginRight: '8px' }} />
            {selectedRoom?.name || 'ワークスペース'}
          </h2>
        </div>

        <div style={styles.roomsContainer}>
          <div style={styles.roomsContent}>
            <h3 style={styles.roomsLabel}>チャンネル</h3>
            <div style={styles.roomsList}>
              {channels.map((channel, idx) => (
                <div key={idx} style={channel.active ? styles.channelItemActive : styles.channelItem}>
                  <div style={styles.channelInfo}>
                    <span style={{ fontSize: '16px' }}>{channel.icon}</span>
                    <span style={styles.channelName}>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && <span style={styles.unreadBadge}>{channel.unread}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.sidebarFooter}>
          <button style={styles.footerButton} onClick={() => router.push('/rooms')}>
            <ArrowLeft size={18} />
            <span style={styles.footerButtonText}>ルーム一覧に戻る</span>
          </button>
          <button style={styles.footerButton}>
            <Settings size={18} />
            <span style={styles.footerButtonText}>設定</span>
          </button>
          <button style={styles.footerButton} onClick={handleLogout}>
            <LogOut size={18} />
            <span style={styles.footerButtonText}>ログアウト</span>
          </button>
        </div>
      </div>

      {/* メインチャットエリア */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={styles.menuButton}>
              <Menu size={24} />
            </button>
            <div style={styles.channelInfoHeader}>
              <span style={{ fontSize: '24px', marginRight: '8px' }}>💬</span>
              <div>
                <h1 style={styles.channelNameHeader}>一般</h1>
                <p style={styles.onlineCount}>{onlineUsers.length}人がオンライン</p>
              </div>
            </div>
          </div>
          <button style={styles.moreButton}>
            <MoreVertical size={24} />
          </button>
        </div>

        <div style={styles.messagesArea}>
          {messages.map((message) => (
            <div key={message.id} style={styles.messageRow} className="message-group">
              <div style={styles.messageAvatar}>{message.avatar}</div>
              <div style={styles.messageContent}>
                <div style={styles.messageHeader}>
                  <span style={{ ...styles.messageSender, color: message.color }}>{message.sender}</span>
                  <span style={styles.messageTime}>{message.time}</span>
                </div>
                <div style={styles.messageText}>{message.text}</div>
              </div>
              <button style={styles.messageMoreButton} className="message-more">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}

          {isTyping.length > 0 && (
            <div style={styles.typingIndicator}>
              <div style={styles.typingAvatar}>👩</div>
              <div style={styles.typingInfo}>
                <span style={styles.typingText}>{isTyping[0]}が入力中</span>
                <div style={styles.typingDots}>
                  <div style={{ ...styles.typingDot, animationDelay: '0ms' }}></div>
                  <div style={{ ...styles.typingDot, animationDelay: '150ms' }}></div>
                  <div style={{ ...styles.typingDot, animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <button style={styles.inputButton}>
                <Paperclip size={20} />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを #一般 に送信"
                rows={1}
                style={styles.textarea}
              />
              <button style={styles.inputButton}>
                <Smile size={20} />
              </button>
              <button onClick={handleSend} disabled={!input.trim()} style={input.trim() ? styles.sendButton : styles.sendButtonDisabled}>
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 右サイドバー */}
      <div style={styles.rightSidebar}>
        <div style={styles.usersHeader}>
          <h3 style={styles.usersTitle}>
            <Users size={18} style={{ marginRight: '8px' }} />
            オンライン — {onlineUsers.filter((u) => u.status === 'online').length}
          </h3>
        </div>
        <div style={styles.usersList}>
          {onlineUsers.map((user, idx) => (
            <div key={idx} style={styles.userItem}>
              <div style={styles.userAvatarWrapper}>
                <div style={styles.userAvatar}>{user.avatar}</div>
                <div style={user.status === 'online' ? styles.statusOnline : styles.statusAway}></div>
              </div>
              <div style={styles.userInfo}>
                <p style={styles.userName}>{user.name}</p>
                <p style={styles.userStatus}>{user.status === 'online' ? 'オンライン' : '離席中'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .message-group .message-more {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .message-group:hover .message-more {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

export default function ChatPage() {
  return (
    <div style={styles.container}>
      <Suspense fallback={<div>読み込み中...</div>}>
        <ChatContent />
      </Suspense>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  // チャット画面
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  leftSidebar: {
    transition: 'width 0.3s',
    backgroundColor: '#1e293b',
    borderRight: '1px solid #334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '16px',
    borderBottom: '1px solid #334155',
  },
  workspaceTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
  },
  roomsContainer: {
    flex: 1,
    overflowY: 'auto',
  },
  roomsContent: {
    padding: '16px',
  },
  roomsLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  roomsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  channelItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
    color: '#d1d5db',
  },
  channelItemActive: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#9333ea',
    color: 'white',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  channelName: {
    fontSize: '14px',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
    color: 'white',
    fontSize: '12px',
    borderRadius: '12px',
    padding: '2px 8px',
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#d1d5db',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%',
  },
  footerButtonText: {
    fontSize: '14px',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuButton: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#d1d5db',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  channelNameHeader: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'white',
    margin: 0,
  },
  onlineCount: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  moreButton: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#d1d5db',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageRow: {
    display: 'flex',
    gap: '12px',
    animation: 'fade-in 0.3s ease-out',
  },
  messageAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '4px',
  },
  messageSender: {
    fontWeight: '600',
    fontSize: '15px',
  },
  messageTime: {
    fontSize: '12px',
    color: '#6b7280',
  },
  messageText: {
    color: '#e5e7eb',
    lineHeight: '1.5',
    fontSize: '15px',
  },
  messageMoreButton: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  typingIndicator: {
    display: 'flex',
    gap: '12px',
    animation: 'fade-in 0.3s ease-out',
  },
  typingAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  typingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  typingText: {
    fontSize: '14px',
    color: '#9ca3af',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#9ca3af',
    borderRadius: '50%',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  inputArea: {
    padding: '16px',
    backgroundColor: '#1e293b',
    borderTop: '1px solid #334155',
  },
  inputContainer: {
    maxWidth: '1024px',
    margin: '0 auto',
  },
  inputWrapper: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    backgroundColor: '#334155',
    borderRadius: '8px',
    padding: '8px',
  },
  inputButton: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#9ca3af',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  textarea: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontSize: '15px',
    resize: 'none',
    minHeight: '24px',
    maxHeight: '200px',
    fontFamily: 'inherit',
  },
  sendButton: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#9333ea',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.2s',
  },
  sendButtonDisabled: {
    padding: '8px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#9333ea',
    color: 'white',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.5,
  },
  rightSidebar: {
    width: '256px',
    backgroundColor: '#1e293b',
    borderLeft: '1px solid #334155',
    overflowY: 'auto',
  },
  usersHeader: {
    padding: '16px',
    borderBottom: '1px solid #334155',
  },
  usersTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
  },
  usersList: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  userAvatarWrapper: {
    position: 'relative',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },
  statusOnline: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #1e293b',
    backgroundColor: '#10b981',
  },
  statusAway: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid #1e293b',
    backgroundColor: '#eab308',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '14px',
    color: '#e5e7eb',
    margin: 0,
  },
  userStatus: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
};
