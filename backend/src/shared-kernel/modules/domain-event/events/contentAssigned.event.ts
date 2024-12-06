import { DomainEvent } from '../domain-event';

type ContentAssignedEventPayload = {
  processId: string;
  status: 'published';
};
export class ContentAssignedEvent extends DomainEvent<ContentAssignedEventPayload> {
  constructor({
    id,
    payload,
  }: {
    id: string;
    payload: ContentAssignedEventPayload;
  }) {
    super(id, payload, ContentAssignedEvent.name);
  }
}
