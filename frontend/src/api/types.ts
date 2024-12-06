export type ApiSortCommand = {
  by: string;
  order: 'ASC' | 'DESC';
};

export type ApiQuery = {
  filters?: Record<string, string>;
  sort?: ApiSortCommand;
};
