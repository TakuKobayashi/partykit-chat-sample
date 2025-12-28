"use client"
import { useState, useRef, useEffect, CSSProperties } from 'react';
import { Send, Menu, Users, Hash, Settings, LogOut, Smile, Paperclip, MoreVertical, Plus, Lock, Globe, ArrowRight } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: string;
  avatar: string;
  time: string;
  color: string;
}

interface User {
  name: string;
  avatar: string;
  status: 'online' | 'away';
}

interface Room {
  id: string;
  name: string;
  icon: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  lastActivity: string;
}

interface Channel {
  name: string;
  icon: string;
  unread: number;
  active: boolean;
}

interface CurrentUser {
  name: string;
  avatar: string;
  color: string;
}

type Screen = 'login' | 'roomList' | 'chat';

export default function ChatApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [username, setUsername] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'みなさん、こんにちは！', sender: '田中太郎', avatar: '🧑', time: '10:30', color: '#3b82f6' },
    { id: 2, text: 'おはようございます！', sender: '山田花子', avatar: '👩', time: '10:31', color: '#ec4899' },
    { id: 3, text: 'プロジェクトの進捗について話し合いましょう', sender: '佐藤次郎', avatar: '👨', time: '10:32', color: '#10b981' },
  ]);
  const [input, setInput] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ name: '自分', avatar: '😊', color: '#a855f7' });
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
  const [availableRooms] = useState<Room[]>([
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
  ]);
  const [isTyping] = useState<string[]>(['山田花子']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    if (username.trim()) {
      const avatars = ['😊', '🙂', '😎', '🤓', '🥳', '🤗', '😇'];
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      setCurrentUser({ name: username, avatar: randomAvatar, color: '#a855f7' });
      setCurrentScreen('roomList');
    }
  };

  const handleJoinRoom = (room: Room): void => {
    setSelectedRoom(room);
    setCurrentScreen('chat');
  };

  const handleSend = (): void => {
    if (input.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: currentUser.name,
        avatar: currentUser.avatar,
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        color: currentUser.color
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
          color: randomResponse.color
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ログイン画面
  if (currentScreen === 'login') {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <div style={styles.loginIcon}>💬</div>
            <h1 style={styles.loginTitle}>ChatRoom</h1>
            <p style={styles.loginSubtitle}>リアルタイムチャットアプリケーション</p>
          </div>
          <form onSubmit={handleLogin} style={styles.loginForm}>
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
            <button type="submit" style={styles.loginButton} disabled={!username.trim()}>
              <span>ルーム一覧へ</span>
              <ArrowRight size={20} />
            </button>
          </form>
          <div style={styles.loginFooter}>
            <p style={styles.loginFooterText}>
              ユーザー名を入力して、チャットルームに参加しましょう
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Room一覧画面
  if (currentScreen === 'roomList') {
    return (
      <div style={styles.roomListContainer}>
        <div style={styles.roomListHeader}>
          <div style={styles.roomListHeaderContent}>
            <h1 style={styles.roomListTitle}>チャットルーム一覧</h1>
            <p style={styles.roomListSubtitle}>参加したいルームを選択してください</p>
          </div>
          <div style={styles.userBadge}>
            <div style={styles.userBadgeAvatar}>{currentUser.avatar}</div>
            <span style={styles.userBadgeName}>{currentUser.name}</span>
          </div>
        </div>
        
        <div style={styles.roomListContent}>
          <div style={styles.roomGrid}>
            {availableRooms.map((room) => (
              <div
                key={room.id}
                style={styles.roomCard}
                onClick={() => handleJoinRoom(room)}
              >
                <div style={styles.roomCardHeader}>
                  <div style={styles.roomCardIcon}>{room.icon}</div>
                  {room.isPrivate && (
                    <div style={styles.privateBadge}>
                      <Lock size={12} />
                    </div>
                  )}
                </div>
                <h3 style={styles.roomCardTitle}>{room.name}</h3>
                <p style={styles.roomCardDescription}>{room.description}</p>
                <div style={styles.roomCardFooter}>
                  <div style={styles.roomCardInfo}>
                    <Users size={16} />
                    <span>{room.memberCount}人</span>
                  </div>
                  <div style={styles.roomCardActivity}>
                    <div style={styles.activityDot}></div>
                    <span>{room.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button style={styles.createRoomButton}>
          <Plus size={20} />
          <span>新しいルームを作成</span>
        </button>
      </div>
    );
  }

  // チャット画面
  return (
    <div style={styles.container}>
      {/* 左サイドバー - チャンネル一覧 */}
      <div style={{...styles.leftSidebar, width: isSidebarOpen ? '256px' : '0'}}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.workspaceTitle}>
            <Hash color="#a855f7" size={24} style={{marginRight: '8px'}} />
            {selectedRoom?.name || 'ワークスペース'}
          </h2>
        </div>
        
        <div style={styles.roomsContainer}>
          <div style={styles.roomsContent}>
            <h3 style={styles.roomsLabel}>チャンネル</h3>
            <div style={styles.roomsList}>
              {channels.map((channel, idx) => (
                <div 
                  key={idx} 
                  style={channel.active ? styles.channelItemActive : styles.channelItem}
                >
                  <div style={styles.channelInfo}>
                    <span style={{fontSize: '16px'}}>{channel.icon}</span>
                    <span style={styles.channelName}>{channel.name}</span>
                  </div>
                  {channel.unread > 0 && (
                    <span style={styles.unreadBadge}>
                      {channel.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.sidebarFooter}>
          <button style={styles.footerButton} onClick={() => setCurrentScreen('roomList')}>
            <ArrowRight size={18} style={{transform: 'rotate(180deg)'}} />
            <span style={styles.footerButtonText}>ルーム一覧に戻る</span>
          </button>
          <button style={styles.footerButton}>
            <Settings size={18} />
            <span style={styles.footerButtonText}>設定</span>
          </button>
          <button style={styles.footerButton} onClick={() => setCurrentScreen('login')}>
            <LogOut size={18} />
            <span style={styles.footerButtonText}>ログアウト</span>
          </button>
        </div>
      </div>

      {/* メインチャットエリア */}
      <div style={styles.mainContent}>
        {/* ヘッダー */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={styles.menuButton}
            >
              <Menu size={24} />
            </button>
            <div style={styles.channelInfo}>
              <span style={{fontSize: '24px', marginRight: '8px'}}>💬</span>
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

        {/* メッセージエリア */}
        <div style={styles.messagesArea}>
          {messages.map((message) => (
            <div key={message.id} style={styles.messageRow} className="message-group">
              <div style={styles.messageAvatar}>
                {message.avatar}
              </div>
              <div style={styles.messageContent}>
                <div style={styles.messageHeader}>
                  <span style={{...styles.messageSender, color: message.color}}>
                    {message.sender}
                  </span>
                  <span style={styles.messageTime}>{message.time}</span>
                </div>
                <div style={styles.messageText}>
                  {message.text}
                </div>
              </div>
              <button style={styles.messageMoreButton} className="message-more">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
          
          {isTyping.length > 0 && (
            <div style={styles.typingIndicator}>
              <div style={styles.typingAvatar}>
                👩
              </div>
              <div style={styles.typingInfo}>
                <span style={styles.typingText}>{isTyping[0]}が入力中</span>
                <div style={styles.typingDots}>
                  <div style={{...styles.typingDot, animationDelay: '0ms'}}></div>
                  <div style={{...styles.typingDot, animationDelay: '150ms'}}></div>
                  <div style={{...styles.typingDot, animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 入力エリア */}
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
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                style={input.trim() ? styles.sendButton : styles.sendButtonDisabled}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 右サイドバー - オンラインユーザー */}
      <div style={styles.rightSidebar}>
        <div style={styles.usersHeader}>
          <h3 style={styles.usersTitle}>
            <Users size={18} style={{marginRight: '8px'}} />
            オンライン — {onlineUsers.filter(u => u.status === 'online').length}
          </h3>
        </div>
        <div style={styles.usersList}>
          {onlineUsers.map((user, idx) => (
            <div key={idx} style={styles.userItem}>
              <div style={styles.userAvatarWrapper}>
                <div style={styles.userAvatar}>
                  {user.avatar}
                </div>
                <div style={user.status === 'online' ? styles.statusOnline : styles.statusAway}></div>
              </div>
              <div style={styles.userInfo}>
                <p style={styles.userName}>{user.name}</p>
                <p style={styles.userStatus}>
                  {user.status === 'online' ? 'オンライン' : '離席中'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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

const styles: { [key: string]: CSSProperties } = {
  // ログイン画面
  loginContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  loginIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  loginTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: '0 0 8px 0',
  },
  loginSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  loginForm: {
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
  loginButton: {
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
  loginFooter: {
    marginTop: '24px',
    textAlign: 'center',
  },
  loginFooterText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },

  // Room一覧画面
  roomListContainer: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '24px',
  },
  roomListHeader: {
    maxWidth: '1200px',
    margin: '0 auto 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomListHeaderContent: {
    flex: 1,
  },
  roomListTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
  },
  roomListSubtitle: {
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
  roomListContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  roomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },
  roomCard: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #334155',
    cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  roomCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  roomCardIcon: {
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
  roomCardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
  },
  roomCardDescription: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: '0 0 16px 0',
    lineHeight: '1.5',
  },
  roomCardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #334155',
  },
  roomCardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#9ca3af',
    fontSize: '14px',
  },
  roomCardActivity: {
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
  createRoomButton: {
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
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
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
}