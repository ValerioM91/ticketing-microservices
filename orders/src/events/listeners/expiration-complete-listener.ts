import { Message } from 'node-nats-streaming'
import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  NotFoundError,
  OrderStatus,
} from '@valeriom91-org/common'
import { Order } from '../../models/order'
import { queueGroupName } from './queue-group-name'
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher'

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
  queueGroupName = queueGroupName

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId)

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack()
    }

    order.set({ status: OrderStatus.Cancelled })

    await order.save()

    // Emit an event saying this order was cancelled!
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    })

    msg.ack()
  }
}
