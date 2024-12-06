export enum SortCommandOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export type SortCommand = {
  by?: string;
  order?: SortCommandOrderEnum;
};
