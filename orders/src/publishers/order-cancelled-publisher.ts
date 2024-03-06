import { Publisher, Subjects, OrderCancelledEvent } from '@valeriom91-org/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
