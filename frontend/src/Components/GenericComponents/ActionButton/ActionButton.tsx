import React from 'react';
import { Button } from '@mui/joy';
import { Link } from 'react-router-dom';

type ActionButtonProps = {
  to?: string;
  onClick?: () => void;
  content: string;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const ActionButton = ({
  to,
  onClick,
  content,
  label,
  leftIcon,
  rightIcon,
}: ActionButtonProps) => {
  const linkProps = to
    ? {
        component: Link,
        to,
      }
    : {};

  return (
    <Button
      {...linkProps}
      variant="outlined"
      color="neutral"
      startDecorator={leftIcon}
      endDecorator={rightIcon}
      aria-label={label}
      sx={{
        paddingBlock: 0,
      }}
      onClick={onClick}
    >
      {content}
    </Button>
  );
};
