import { CommentController } from './comment.controller';
import { ContentController } from './content.controller';
import { ResourceController } from './resource.controller';
import { ExportController } from './export.controller';
import { HealthCheckController } from './healthcheck.controller';

export const getControllers = () => [
  HealthCheckController,
  ResourceController,
  ContentController,
  CommentController,
  ExportController,
];
