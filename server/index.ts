import express from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './routers'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'API funcionando en Render' })
})

app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: ({ req, res }) => ({ req, res, user: null })
}))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})Bajá hasta abajo → "Commit new file" → botón verde "Commit changes"Render va a hacer deploy automático en 2 min.Después de hacer commit, andá a Render y revisá:
Settings → Start Command debe ser tsx server/index.tsSi dice otra cosa, cambialo y guardá.¿Ya viste el botón "Add file"?
