import { getCommentQueries } from './Comment';
import { getContentQueries } from './Content';
import { getResourceQueries } from './Resource';

export const getQueries = () => [
  ...getResourceQueries(),
  ...getContentQueries(),
  ...getCommentQueries(),
];
