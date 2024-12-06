import { IsNotEmpty } from 'class-validator';

export type PublishContentCommandParams = {
  resourceId: string;
  contentId: string;
};

export class PublishContentCommand {
  updatedBy: string;

  @IsNotEmpty()
  pngContent: string;
}
