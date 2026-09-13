import React, { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { toastStore } from './store';
import { Toast } from './Toast';
import type { ToastPosition } from './types';

export interface ToastProviderProps {
  /** Where the toast stack renders. Defaults to 'bottom-right'. */
  position?: ToastPosition;
  /** Cap the number of visible toasts; older ones are dropped. Default: 5. */
  maxVisible?: number;
  /** Mount node for the portal. Defaults to document.body. */
  container?: HTMLElement;
}

/**
 * Mount once near the root of your app. Everything else (`toast(...)`,
 * `useToast()`) works from anywhere in the tree — no children prop needed,
 * this component only renders the notification viewport.
 */
export function ToastProvider({
  position = 'bottom-right',
  maxVisible = 5,
  container,
}: ToastProviderProps) {
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot
  );

  if (typeof document === 'undefined') return null;

  const visible = toasts.slice(-maxVisible);
  const target = container ?? document.body;

  return createPortal(
    <div
      className={`toastline-viewport toastline-viewport--${position}`}
      data-testid="toastline-viewport"
    >
      {visible.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>,
    target
  );
}
