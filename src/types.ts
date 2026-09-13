export type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  /** Provide to update/replace an existing toast with the same id. */
  id?: string;
  type?: ToastType;
  /** Optional bold title rendered above the message. */
  title?: string;
  /** Auto-dismiss after this many ms. Set to 0 to persist until dismissed manually. */
  duration?: number;
}

export interface ToastRecord {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration: number;
  createdAt: number;
  /** Set while the timer is paused (e.g. on hover). */
  pausedAt?: number;
  /** ms left on the countdown, updated each time it's paused. */
  remaining: number;
  /** Timestamp the current countdown segment last (re)started. */
  resumedAt: number;
}

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type Listener = () => void;
