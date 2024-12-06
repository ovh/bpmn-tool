import { DomainEvent } from '../domain-event';

type ContentPublishedEventPayload = {
  contentId: string;
  processId: string;
};
export class ContentPublishedEvent extends DomainEvent<ContentPublishedEventPayload> {
  constructor({
    id,
    payload,
  }: {
    id: string;
    payload: ContentPublishedEventPayload;
  }) {
    super(id, payload, ContentPublishedEvent.name);
  }
}
