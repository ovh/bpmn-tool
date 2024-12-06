import React, { FC, ReactNode } from 'react';
import {
  Card as MuiCard,
  CardContent,
  AccordionGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  accordionSummaryClasses,
} from '@mui/joy';
import Typography from '@mui/joy/Typography';
import { DefaultVariantProp } from '@mui/joy/styles/types/variants';

type CardProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  variant?: DefaultVariantProp;
  accordion?: boolean;
};
export const Card: FC<CardProps> = ({
  title,
  variant = 'outlined',
  actions,
  accordion,
  children,
}) => {
  return (
    <MuiCard
      sx={{
        bgcolor: 'white',
        flexGrow: 0,
        [`& .${accordionSummaryClasses.button}:hover`]: {
          bgcolor: 'white',
        },
      }}
      variant={variant}
      component={accordion ? AccordionGroup : MuiCard}
    >
      <CardContent component={accordion ? Accordion : CardContent}>
        {accordion ? (
          <AccordionSummary>
            <Typography fontWeight="bold">{title}</Typography>
          </AccordionSummary>
        ) : (
          <Typography fontWeight="bold">{title}</Typography>
        )}
        {actions && actions}
        {accordion ? (
          <AccordionDetails>{children}</AccordionDetails>
        ) : (
          <>{children}</>
        )}
      </CardContent>
    </MuiCard>
  );
};
