import { Publisher, Subjects, TicketUpdatedEvent } from '@valeriom91-org/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
