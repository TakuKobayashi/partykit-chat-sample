import { Hono } from 'hono'
import { partyserverMiddleware } from "hono-party";
import { Connection, Server, WSMessage } from "partyserver";

const honoApp = new Hono();
const apiApp = honoApp.basePath('/api')
const wsApp = honoApp.basePath('/ws')

// Multiple party servers
export class Chat extends Server {
  onConnect(connection: Connection) {
    console.log("Connected", connection.id, "to server", this.name);
  }

  onMessage(connection: Connection, message: WSMessage) {
    console.log("Message from", connection.id, ":", message);
    // Send the message to every other connection
    this.broadcast(message);
  }
}

wsApp.use(
  "*",
  partyserverMiddleware({ onError: (error) => console.error(error) })
);

apiApp.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default honoApp
