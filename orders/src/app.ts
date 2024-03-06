import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, currentUser } from '@valeriom91-org/common'
import cookieSession from 'cookie-session'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes'
import { cancelOrderRouter } from './routes/cancel'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }))

app.use(currentUser)

app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(cancelOrderRouter)
app.use(indexOrderRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
