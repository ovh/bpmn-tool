import { ContentStatusEnum } from '../../../../../../modules/ResourceContext/shared/types/Content';

export type ListContentQuery = {
  filters: {
    status?: ContentStatusEnum;
  };
};
