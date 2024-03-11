import { Publisher, Subjects, OrderCreatedEvent } from '@valeriom91-org/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
