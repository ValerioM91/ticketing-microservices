import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requiredAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@valeriom91-org/common'
import { Order } from '../models/order'

const router = express.Router()

router.post(
  '/api/payments',
  requiredAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order')
    }

    res.send({ success: true })
  }
)

export { router as createChargeRouter }