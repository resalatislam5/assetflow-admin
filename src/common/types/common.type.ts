export interface Response<T> {
  success: boolean;
  total?: number;
  unreadCount?: number;
  data?: T;
  message?: string;
}
