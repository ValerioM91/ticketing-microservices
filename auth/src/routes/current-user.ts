import express from 'express'
import { currentUser } from '@valeriom91-org/common'

const router = express.Router()

router.get('/api/users/currentUser', currentUser, async (req, res) => {
  return res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
