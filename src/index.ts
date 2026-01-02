import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { partyserverMiddleware } from 'hono-party';
import { Connection, Server, WSMessage } from 'partyserver';
import crypto from "crypto";

const honoApp = new Hono();
honoApp.use('*', partyserverMiddleware({ onError: (error) => console.error(error), options: { prefix: "ws" }}));

const apiApp = honoApp.basePath('/api');
apiApp.use('*', cors())

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

apiApp.post('/account/signin', async (c) => {
  const userData = await c.req.json();
  userData.uuid = crypto.randomUUID();
  return c.json(userData);
});

export default honoApp;
