import React, { FC, ReactNode } from 'react';

type ConditionalRenderProps = {
  condition: boolean;
  children: ReactNode;
};
export const ConditionalRender: FC<ConditionalRenderProps> = ({
  condition,
  children,
}) => {
  if (!condition) {
    return <></>;
  }

  return children;
};
