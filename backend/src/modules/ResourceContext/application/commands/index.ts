import { getCommentCommands } from './Comment';
import { getContentCommands } from './Content';
import { getResourceCommands } from './Resource';

export const getCommands = () => [
  ...getResourceCommands(),
  ...getContentCommands(),
  ...getCommentCommands(),
];
