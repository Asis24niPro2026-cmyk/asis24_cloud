import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './routers'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
}))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
