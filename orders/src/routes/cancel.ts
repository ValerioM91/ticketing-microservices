import express, { Request, Response } from 'express'
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requiredAuth,
} from '@valeriom91-org/common'
import { Order } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.patch('/api/orders/:orderId', requiredAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id
  const { orderId } = req.params

  const order = await Order.findById(orderId).populate('ticket')

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  if (order.userId !== userId) {
    throw new NotAuthorizedError()
  }

  order.status = OrderStatus.Cancelled
  await order.save()

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  })

  res.status(200).send(order)
})

export { router as cancelOrderRouter }
