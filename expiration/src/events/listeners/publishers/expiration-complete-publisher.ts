import { Subjects, Publisher, ExpirationCompleteEvent } from '@valeriom91-org/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
