import { Comment } from '../../../src/modules/ResourceContext/domain/Comment/Comment';

export const generateComments = (limit: number, resourceId: string) => {
  return new Array(limit).fill('').map(
    () =>
      new Comment({
        comment: 'Hello :)',
        createdBy: 'jest-user',
        resourceId,
      }),
  );
};
