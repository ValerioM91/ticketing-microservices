import express, { Request, Response } from 'express'
import { NotAuthorizedError, NotFoundError, requiredAuth } from '@valeriom91-org/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders/:orderId', requiredAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id
  const { orderId } = req.params

  const order = await Order.findById(orderId).populate('ticket')

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  if (order.userId !== userId) {
    throw new NotAuthorizedError()
  }

  res.send(order)
})

export { router as showOrderRouter }
