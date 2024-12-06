import React, { FC } from 'react';
import { Avatar, Card, CardContent, Typography, Box, Divider } from '@mui/joy';
import { format, isToday, isYesterday } from 'date-fns';

import type { Comment } from '../../../Types';
import { formatDateTime } from '../../../shared/helpers/date';

const computeSince = (date: Date | string) => {
  let dateToCompute = date;

  if (typeof dateToCompute === 'string') {
    dateToCompute = new Date(dateToCompute);
  }

  if (isToday(dateToCompute)) {
    return `posted today at ${format(dateToCompute, 'k:mm')}`;
  }

  if (isYesterday(dateToCompute)) {
    return `posted yesterday at ${format(dateToCompute, 'k:mm')}`;
  }

  return `posted on ${formatDateTime(dateToCompute)}`;
};

type CommentCardProps = {
  comment: Comment;
};
export const CommentCard: FC<CommentCardProps> = ({ comment }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        boxShadow: 'sm',
        '&:hover': {
          borderColor: 'neutral.solidHoverBg',
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Avatar size="sm" />
          <Typography fontSize="lg" fontWeight="lg">
            {comment.createdBy}
          </Typography>
          <Typography fontSize="x-small" color="neutral">
            {computeSince(comment.createdAt)}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ textJustify: 'auto' }}>
          <Typography level="body-md">{comment.comment}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
