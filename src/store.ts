import type { Listener, ToastOptions, ToastRecord, ToastType } from './types';

const DEFAULT_DURATION = 4000;

let idCounter = 0;
function genId(): string {
  idCounter += 1;
  return `toastline-${Date.now().toString(36)}-${idCounter}`;
}

/**
 * Plain-JS observable store. Deliberately has zero React imports so it can be
 * called from anywhere: event handlers, fetch/axios interceptors, redux
 * middleware, web workers (via postMessage bridging), etc. React components
 * subscribe to it with useSyncExternalStore.
 */
class ToastStore {
  private toasts: ToastRecord[] = [];
  private listeners = new Set<Listener>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): ToastRecord[] => this.toasts;

  getServerSnapshot = (): ToastRecord[] => [];

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private clearTimer(id: string) {
    const t = this.timers.get(id);
    if (t) {
      clearTimeout(t);
      this.timers.delete(id);
    }
  }

  private scheduleDismiss(record: ToastRecord) {
    this.clearTimer(record.id);
    if (record.duration <= 0) return; // 0 = persist
    const timer = setTimeout(() => this.dismiss(record.id), record.remaining);
    this.timers.set(record.id, timer);
  }

  add(message: string, options: ToastOptions = {}): string {
    const id = options.id ?? genId();
    const duration = options.duration ?? DEFAULT_DURATION;
    const existingIndex = this.toasts.findIndex((t) => t.id === id);

    const record: ToastRecord = {
      id,
      type: options.type ?? 'default',
      title: options.title,
      message,
      duration,
      createdAt: Date.now(),
      remaining: duration,
      resumedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      const next = this.toasts.slice();
      next[existingIndex] = record;
      this.toasts = next;
    } else {
      this.toasts = [...this.toasts, record];
    }

    this.scheduleDismiss(record);
    this.emit();
    return id;
  }

  dismiss(id: string) {
    this.clearTimer(id);
    const next = this.toasts.filter((t) => t.id !== id);
    if (next.length !== this.toasts.length) {
      this.toasts = next;
      this.emit();
    }
  }

  dismissAll() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.toasts = [];
    this.emit();
  }

  /** Pause the auto-dismiss countdown, e.g. on pointer-enter. */
  pause(id: string) {
    const record = this.toasts.find((t) => t.id === id);
    if (!record || record.duration <= 0 || record.pausedAt) return;
    this.clearTimer(id);
    // Subtract however long this countdown segment had already been
    // running before the pause, so we don't lose that elapsed time.
    const elapsedThisSegment = Date.now() - record.resumedAt;
    const remaining = Math.max(record.remaining - elapsedThisSegment, 0);
    const next = this.toasts.map((t) =>
      t.id === id ? { ...t, pausedAt: Date.now(), remaining } : t
    );
    this.toasts = next;
    this.emit();
  }

  /** Resume the auto-dismiss countdown, e.g. on pointer-leave. */
  resume(id: string) {
    const record = this.toasts.find((t) => t.id === id);
    if (!record || !record.pausedAt) return;
    // `remaining` already reflects time left as of the pause; just start a
    // fresh segment from now using that remaining duration.
    const next = this.toasts.map((t) =>
      t.id === id ? { ...t, pausedAt: undefined, resumedAt: Date.now() } : t
    );
    this.toasts = next;
    const updated = next.find((t) => t.id === id)!;
    this.scheduleDismiss(updated);
    this.emit();
  }
}

export const toastStore = new ToastStore();
export type { ToastType };
