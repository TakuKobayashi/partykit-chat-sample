import { Hono } from 'hono'

const honoApp = new Hono();
const apiApp = honoApp.basePath('/api')

apiApp.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default honoApp
