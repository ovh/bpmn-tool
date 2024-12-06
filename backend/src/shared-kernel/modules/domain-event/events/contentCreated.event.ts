import { DomainEvent } from '../domain-event';

type ContentCreatedEventPayload = {
  contentId: string;
  processId: string;
};
export class ContentCreatedEvent extends DomainEvent<ContentCreatedEventPayload> {
  constructor({
    id,
    payload,
  }: {
    id: string;
    payload: ContentCreatedEventPayload;
  }) {
    super(id, payload, ContentCreatedEvent.name);
  }
}
