import React from 'react';
import { FormControl, Input } from '@mui/joy';
import { Search } from '@mui/icons-material';

type SearchBarProps = {
  onSearch: (term: string) => void;
};

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <FormControl size="md">
      <Input
        placeholder="Filter business process and folder"
        startDecorator={<Search fontSize="small" />}
        onChange={event => onSearch(event.target.value)}
      />
    </FormControl>
  );
};
