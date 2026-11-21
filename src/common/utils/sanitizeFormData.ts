// utils/sanitizeFormData.ts
import dayjs, { Dayjs } from 'dayjs';

/* ----------------------------------------------------
 *  Types
 * -------------------------------------------------- */
export interface SanitizeOptions<T extends object> {
  dateFormat?:
    | 'YYYY-MM-DD'
    | 'YYYY-MM-DD HH:mm:ss'
    | 'YYYY-MM-DD HH:mm'
    | 'YYYY-MM-DDTHH:mm:ssZ';
  removeZero?: boolean;
  removeFalse?: boolean;
  removeNaN?: boolean;
  ignoreKeys?: readonly (keyof T | string)[]; // keys to drop entirely
  fileKeys?: readonly (keyof T | string)[]; // keys that must be treated as file / file[]
}

/* ----------------------------------------------------
 *  Utilities
 * -------------------------------------------------- */
const isEmptyValue = <T extends object>(
  value: unknown,
  {
    removeZero = false,
    removeFalse = false,
    removeNaN = false,
  }: SanitizeOptions<T>,
): boolean =>
  value === null ||
  value === undefined ||
  value === '' ||
  (removeZero && value === 0) ||
  (removeFalse && value === false) ||
  (removeNaN && typeof value === 'number' && Number.isNaN(value));

const sanitizeValue = <T extends object>(
  value: unknown,
  opts: SanitizeOptions<T>,
): unknown => {
  // keep File / Blob intact
  if (value instanceof File || value instanceof Blob) return value;

  // format Dayjs
  if (dayjs.isDayjs(value))
    return (value as Dayjs).format(opts.dateFormat ?? 'YYYY-MM-DD');

  // recurse arrays
  if (Array.isArray(value))
    return value
      .map((v) => sanitizeValue(v, opts))
      .filter(
        (v) =>
          !isEmptyValue(v, opts) &&
          !(typeof v === 'object' && v !== null && Object.keys(v).length === 0),
      );

  // recurse objects
  if (typeof value === 'object' && value !== null) {
    const nested: Record<string, unknown> = {};
    Object.entries(value).forEach(([k, v]) => {
      if (opts.ignoreKeys?.includes(k as keyof T)) return;
      const cleaned = sanitizeValue(v, opts);
      const isEmptyObject = (v: unknown) =>
        typeof v === 'object' &&
        v !== null &&
        !Array.isArray(v) &&
        Object.keys(v).length === 0;

      if (!isEmptyValue(cleaned, opts) && !isEmptyObject(cleaned))
        nested[k] = cleaned;
    });
    return nested;
  }

  // primitives
  return value;
};

const isAntUploadItem = (v: unknown): v is { originFileObj: File } =>
  typeof v === 'object' && v !== null && 'originFileObj' in v && (v as { originFileObj: unknown }).originFileObj instanceof File;

const pushFile = (fd: FormData, key: string, file: File | Blob) => {
  fd.append(key, file);
};

/* ----------------------------------------------------
 *  Main helper
 * -------------------------------------------------- */
export const sanitizeFormData = <T extends object>(
  values: T,
  options: SanitizeOptions<T> = {},
): FormData => {
  const opts: SanitizeOptions<T> = { dateFormat: 'YYYY-MM-DD', ...options };
  const cleaned = sanitizeValue(values, opts);

  const formData = new FormData();

  const append = (key: string, val: unknown) => {
    /* ---- 1. Forced file keys -------------------- */
    if (opts.fileKeys?.includes(key)) {
      const list = Array.isArray(val) ? val : [val];
      list.forEach((item) => {
        if (isAntUploadItem(item)) pushFile(formData, key, item.originFileObj);
        else if (item instanceof File) pushFile(formData, key, item);
      });
      return;
    }

    /* ---- 2. Ant Design Upload single item ------- */

    if (isAntUploadItem(val)) {
      pushFile(formData, key, val.originFileObj);
      return;
    }

    /* ---- 3. Native File / Blob ------------------ */
    if (val instanceof File || val instanceof Blob) {
      pushFile(formData, key, val);
      return;
    }

    /* ---- 4. Array / Object → JSON --------------- */
    if (
      Array.isArray(val) ||
      (typeof val === 'object' && val !== null && !(val instanceof File))
    ) {
      formData.append(key, JSON.stringify(val));
      return;
    }

    /* ---- 5. Primitive --------------------------- */
    formData.append(key, String(val));
  };

  Object.entries(cleaned as Record<string, unknown>).forEach(([k, v]) => {
    if (opts.ignoreKeys?.includes(k as keyof T)) return;
    append(k, v);
  });

  return formData;
};
