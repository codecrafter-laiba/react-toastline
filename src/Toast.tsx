import React from 'react';
import { toastStore } from './store';
import type { ToastRecord } from './types';

const ICONS: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
  default: '',
};

export function Toast({ toast }: { toast: ToastRecord }) {
  const isAlert = toast.type === 'error' || toast.type === 'warning';

  return (
    <div
      className={`toastline-toast toastline-toast--${toast.type}`}
      role={isAlert ? 'alert' : 'status'}
      aria-live={isAlert ? 'assertive' : 'polite'}
      onPointerEnter={() => toastStore.pause(toast.id)}
      onPointerLeave={() => toastStore.resume(toast.id)}
      data-testid="toastline-toast"
    >
      {toast.type !== 'default' && (
        <span className="toastline-toast__icon" aria-hidden="true">
          {ICONS[toast.type]}
        </span>
      )}
      <div className="toastline-toast__body">
        {toast.title && (
          <div className="toastline-toast__title">{toast.title}</div>
        )}
        <div className="toastline-toast__message">{toast.message}</div>
      </div>
      <button
        type="button"
        className="toastline-toast__close"
        aria-label="Dismiss notification"
        onClick={() => toastStore.dismiss(toast.id)}
      >
        ×
      </button>
      {toast.duration > 0 && (
        <span
          className="toastline-toast__progress"
          style={{
            animationDuration: `${toast.duration}ms`,
            animationPlayState: toast.pausedAt ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  );
}
