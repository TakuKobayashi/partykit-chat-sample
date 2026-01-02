import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { partyserverMiddleware } from 'hono-party';
import { Connection, Server, WSMessage } from 'partyserver';
import crypto from 'crypto';

const honoApp = new Hono();
honoApp.use('*', partyserverMiddleware({ onError: (error) => console.error(error), options: { prefix: 'ws' } }));

const apiApp = honoApp.basePath('/api');
apiApp.use('*', cors());

// Multiple party servers
export class Chat extends Server {
  onConnect(connection: Connection) {
    // this.name がRoom名
    console.log('Connected', connection.id, 'to server', this.name);
  }

  onMessage(connection: Connection, message: WSMessage) {
    console.log('Message from', connection.id, ':', message);
    // Send the message to every other connection
    this.broadcast(message);
  }
}

apiApp.get('/', (c) => {
  return c.text('Hello Hono!');
});

apiApp.get('/rooms', (c) => {
  return c.json([
    {
      id: '1',
      name: '一般チャット',
      icon: '💬',
      description: '誰でも参加できるオープンな雑談ルーム',
      memberCount: 128,
      isPrivate: false,
      lastActivity: '2分前',
    },
    {
      id: '2',
      name: 'プロジェクトA',
      icon: '📊',
      description: 'プロジェクトAに関する議論・進捗報告',
      memberCount: 24,
      isPrivate: false,
      lastActivity: '5分前',
    },
    {
      id: '3',
      name: 'デザインチーム',
      icon: '🎨',
      description: 'デザイン関連の相談・レビュー',
      memberCount: 15,
      isPrivate: true,
      lastActivity: '15分前',
    },
    {
      id: '4',
      name: 'エンジニアリング',
      icon: '⚙️',
      description: '技術的な議論・コードレビュー',
      memberCount: 42,
      isPrivate: false,
      lastActivity: '1分前',
    },
    {
      id: '5',
      name: '経営会議',
      icon: '🏢',
      description: '経営陣のみ参加可能',
      memberCount: 8,
      isPrivate: true,
      lastActivity: '30分前',
    },
    {
      id: '6',
      name: 'ゲーム好き集まれ',
      icon: '🎮',
      description: 'ゲームの話題で盛り上がろう',
      memberCount: 67,
      isPrivate: false,
      lastActivity: '3分前',
    },
  ]);
});

apiApp.post('/account/signin', async (c) => {
  const userData = await c.req.json();
  userData.uuid = crypto.randomUUID();
  return c.json(userData);
});

export default honoApp;
