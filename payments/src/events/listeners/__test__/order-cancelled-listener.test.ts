import { OrderCancelledEvent, OrderStatus } from '@valeriom91-org/common'
import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledListener } from '../order-cancelled-listener'
import mongoose from 'mongoose'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = new mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: orderId,
    version: 0,
    userId: 'testing',
    price: 10,
    status: OrderStatus.Created,
  })

  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'test',
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, order, data, msg }
}

it('updates the order info', async () => {
  const { listener, data, msg, order } = await setup()

  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
