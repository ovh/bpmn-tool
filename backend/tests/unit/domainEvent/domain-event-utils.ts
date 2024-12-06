import { ContentCreatedEvent } from '../../../src/shared-kernel/modules/domain-event/events/contentCreated.event';

export const generateContentSavedEvents = (
  limit: number,
  payload: ContentCreatedEvent['payload'],
) => {
  return new Array(limit).fill('').map(
    () =>
      new ContentCreatedEvent({
        id: Math.floor(Math.random() * 10000).toString(),
        payload,
      }),
  );
};
