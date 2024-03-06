import { Publisher, Subjects, TicketCreatedEvent } from '@valeriom91-org/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
