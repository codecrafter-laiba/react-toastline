import { useSyncExternalStore } from 'react';
import { toastStore } from './store';
import { toast } from './toast-api';
import type { ToastRecord } from './types';

export interface UseToastResult {
  /** Current active toasts, in case you want to render your own UI. */
  toasts: ToastRecord[];
  toast: typeof toast;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

/**
 * Hook form of the toast API. Purely a convenience wrapper — `toast()` works
 * fine without this hook too. Useful when a component wants to read the
 * current toast list (e.g. to render a custom notification center).
 */
export function useToast(): UseToastResult {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot
  );

  return {
    toasts,
    toast,
    dismiss: toastStore.dismiss.bind(toastStore),
    dismissAll: toastStore.dismissAll.bind(toastStore),
  };
}
