import express, { Request, Response } from 'express'
import { requiredAuth } from '@valeriom91-org/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', requiredAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id

  const orders = await Order.find({
    userId,
  }).populate('ticket')

  res.send(orders)
})

export { router as indexOrderRouter }
