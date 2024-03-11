import { PaymentCreatedEvent, Publisher, Subjects } from '@valeriom91-org/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
