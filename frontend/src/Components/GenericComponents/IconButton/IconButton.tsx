import React, { FC, ReactElement } from 'react';
import { IconButton as MUIIconButton } from '@mui/joy';
import { ColorPaletteProp } from '@mui/joy/styles/types';
import { DefaultVariantProp } from '@mui/joy/styles/types/variants';
import { Link } from 'react-router-dom';

type IconButtonProps = {
  onClick?: () => void;
  icon: ReactElement;
  variant?: DefaultVariantProp;
  color?: ColorPaletteProp;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  to?: string;
  tooltip?: {
    title: string;
  };
};
export const IconButton: FC<IconButtonProps> = ({
  icon,
  size = 'sm',
  variant = 'outlined',
  color = 'neutral',
  title,
  to,
  onClick,
}) => {
  let routerLinkProps = {};

  if (to) {
    routerLinkProps = {
      component: Link,
      to,
    };
  }

  return (
    <MUIIconButton
      {...routerLinkProps}
      size={size}
      variant={variant}
      onClick={event => {
        event.stopPropagation();
        onClick?.();
      }}
      color={color}
      title={title}
    >
      {icon}
    </MUIIconButton>
  );
};
