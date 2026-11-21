import dayjs, { Dayjs } from 'dayjs';

export const DATE_FORMAT = 'DD MMM YYYY';
export const DATE_TIME_FORMAT = 'DD MMM YYYY, hh:mm A';
export const API_DATE_FORMAT = 'YYYY-MM-DD';
export const API_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const formatDate = (
  date: Dayjs | string | number | Date | null | undefined,
  showTime = false,
): string => {
  if (!date) return '';
  const parsed = dayjs(date);
  if (!parsed.isValid()) return '';
  return parsed.format(showTime ? DATE_TIME_FORMAT : DATE_FORMAT);
};

export const formatDateTime = (
  date: Dayjs | string | number | Date | null | undefined,
): string => {
  return formatDate(date, true);
};

export const getDatePickerFormat = (showTime = false): string => {
  return showTime ? DATE_TIME_FORMAT : DATE_FORMAT;
};

export const parseDatePickerValue = (
  value: Dayjs | string | number | Date | null | undefined,
): Dayjs | null => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
};

export const formatDatePickerForApi = (
  date: Dayjs | null | undefined,
  includeTime = false,
): string => {
  if (!date || !dayjs.isDayjs(date) || !date.isValid()) return '';
  return date.format(includeTime ? API_DATE_TIME_FORMAT : API_DATE_FORMAT);
};

export const getDatePickerProps = (showTime = false) => ({
  format: showTime ? DATE_TIME_FORMAT : DATE_FORMAT,
  showTime: showTime ? { format: 'hh:mm A' } : false,
});

