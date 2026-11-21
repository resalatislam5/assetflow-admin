import dayjs, { Dayjs } from 'dayjs';
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  API_DATE_FORMAT,
  API_DATE_TIME_FORMAT,
  formatDate,
  formatDateTime,
  getDatePickerFormat,
  parseDatePickerValue,
  formatDatePickerForApi,
  getDatePickerProps,
} from './dateFormat';

export {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  API_DATE_FORMAT,
  API_DATE_TIME_FORMAT,
  formatDate,
  formatDateTime,
  getDatePickerFormat,
  parseDatePickerValue,
  formatDatePickerForApi,
  getDatePickerProps,
};

/**
 * Format date & time using dayjs
 * @param date - Date | string | number
 * @param format - dayjs format string
 * @returns formatted date string
 */

export const dateAndTimeFormat = (
  date: string | number | Date | Dayjs | null | undefined,
  format:
    | 'DD MMM YYYY, hh:mm A'
    | 'DD MMM YYYY'
    | 'DD-MM-YYYY'
    | string = DATE_FORMAT,
): string => {
  if (!date) return '';
  const parsed = dayjs(date);
  if (!parsed.isValid()) return '';
  return parsed.format(format);
};

export const capitalizeFirstLetter = (value: string) => {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export const dateForPost = (
  date: string | number | Date | undefined | Dayjs | null,
): string => {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD');
};

const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];
const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function convertBelow100(n: number): string {
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
}

function convertBelow1000(n: number): string {
  if (n < 100) return convertBelow100(n);
  return (
    ones[Math.floor(n / 100)] +
    ' Hundred' +
    (n % 100 ? ' ' + convertBelow100(n % 100) : '')
  );
}

function convertInteger(n: number): string {
  if (n === 0) return 'Zero';

  let result = '';

  if (n >= 10000000) {
    result += convertBelow1000(Math.floor(n / 10000000)) + ' Crore ';
    n %= 10000000;
  }
  if (n >= 100000) {
    result += convertBelow1000(Math.floor(n / 100000)) + ' Lakh ';
    n %= 100000;
  }
  if (n >= 1000) {
    result += convertBelow1000(Math.floor(n / 1000)) + ' Thousand ';
    n %= 1000;
  }
  if (n > 0) {
    result += convertBelow1000(n);
  }

  return result.trim();
}

export function numberToWords(
  amount: number | string | undefined,
  mainUnit: string = 'Taka',
  subUnit: string = 'Poisha',
  subUnitDivisor: number = 100,
): string {
  if (isNaN(Number(amount)) || Number(amount) < 0) return 'Invalid Amount';

  const totalSub = Math.round(Number(amount) * subUnitDivisor);
  const main = Math.floor(totalSub / subUnitDivisor);
  const sub = totalSub % subUnitDivisor;

  if (main === 0 && sub === 0) return `Zero ${mainUnit} Only`;

  let result = '';
  if (main > 0) result += `${convertInteger(main)} ${mainUnit}`;
  if (sub > 0)
    result += `${main > 0 ? ' and ' : ''}${convertInteger(sub)} ${subUnit}`;

  return result + ' Only';
}

export const getOrdinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
/**
 * Formate phone number for whatsapp
 */
export const formatForWhatsApp = (phone: string) => {
  return phone.replace(/\D/g, '');
};

/**
 * Formate label for display
 * remove underscore and capitalize first letter
 */
export const formatLabel = (text: string) => {
  return text
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getDateTime = () => {
  return dayjs().format('DD-MM-YYYY hh:mm A');
};

export const timeAgo = (date: string | undefined) => {
  if (!date) return '';
  const now = new Date();
  const givenDate = new Date(date);
  const seconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(months / 12);
  return `${years} years ago`;
};
