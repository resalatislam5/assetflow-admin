import type { UploadFile } from 'antd/es/upload';
import { imageUrl } from './quarry';

export const cleanImageKey = (url?: string): string => {
  if (!url) return '';
  return url.trim().replace(/^https?:\/\/[^\/]+\//, '').replace(/^\/+/, '');
};

/**
 * Convert a single image URL or array of URLs to Ant Design UploadFile format
 * @param images - string URL or array of string URLs
 * @returns UploadFile[]
 */
export const toUploadFileList = (
  images: string | string[] | undefined,
): UploadFile[] => {
  if (!images) return [];

  const urls = Array.isArray(images) ? images : [images];

  return urls.map((url, index) => {
    const relativeKey = cleanImageKey(url);
    return {
      uid: `-upload-${index}`,
      name: relativeKey.split('/').pop() || `file-${index}`,
      status: 'done',
      url: relativeKey ? `${imageUrl}${relativeKey}` : '',
      response: relativeKey,
    };
  });
};
