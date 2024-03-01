import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@valeriom91-org/common'
import cookieSession from 'cookie-session'

const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' }))

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
