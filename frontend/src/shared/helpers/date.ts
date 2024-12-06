import { format } from 'date-fns';

const getDate = (date: string | Date) => {
  let dateToFormat = date;

  if (typeof dateToFormat === 'string') {
    dateToFormat = new Date(dateToFormat);
  }

  return dateToFormat;
};

export const formatDate = (date: string | Date) => {
  try {
    return format(getDate(date), 'LLL, dd yyyy');
  } catch (err) {
    return 'Invalid date';
  }
};

export const formatDateTime = (date: string | Date) => {
  try {
    return format(getDate(date), 'LLL, dd yyyy, k:mm');
  } catch (err) {
    return 'Invalid date';
  }
};
