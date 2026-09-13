import { toastStore } from './store';
import type { ToastOptions } from './types';

type ToastFn = ((message: string, options?: ToastOptions) => string) & {
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

/**
 * Fire a toast from anywhere — a component, an event handler, an axios
 * interceptor, a redux middleware, etc. No hook, no context, no provider
 * lookup required at the call site (the ToastProvider mounted anywhere in
 * the tree will pick it up).
 */
const toastBase = (message: string, options?: ToastOptions): string =>
  toastStore.add(message, options);

export const toast = toastBase as ToastFn;

toast.success = (message, options) =>
  toastStore.add(message, { ...options, type: 'success' });

toast.error = (message, options) =>
  toastStore.add(message, { ...options, type: 'error' });

toast.info = (message, options) =>
  toastStore.add(message, { ...options, type: 'info' });

toast.warning = (message, options) =>
  toastStore.add(message, { ...options, type: 'warning' });

toast.dismiss = (id: string) => toastStore.dismiss(id);
toast.dismissAll = () => toastStore.dismissAll();
