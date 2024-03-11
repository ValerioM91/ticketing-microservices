import { Listener, OrderCreatedEvent, Subjects } from '@valeriom91-org/common'
import { queueGroupName } from './queue-group-name'
import { type Message } from 'node-nats-streaming'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log()
    await expirationQueue.add(
      { orderId: data.id },
      { delay: new Date(data.expiresAt).getTime() - new Date().getTime() }
    )

    msg.ack()
  }
}
