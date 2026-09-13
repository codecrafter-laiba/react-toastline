import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { toastStore } from '../store';

describe('toastStore', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    toastStore.dismissAll();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast and notifies subscribers', () => {
    const listener = vi.fn();
    const unsubscribe = toastStore.subscribe(listener);

    const id = toastStore.add('Saved successfully', { type: 'success' });

    expect(listener).toHaveBeenCalledTimes(1);
    expect(toastStore.getSnapshot()).toHaveLength(1);
    expect(toastStore.getSnapshot()[0]).toMatchObject({
      id,
      type: 'success',
      message: 'Saved successfully',
    });

    unsubscribe();
  });

  it('auto-dismisses after the given duration', () => {
    toastStore.add('Bye soon', { duration: 1000 });
    expect(toastStore.getSnapshot()).toHaveLength(1);

    vi.advanceTimersByTime(999);
    expect(toastStore.getSnapshot()).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(toastStore.getSnapshot()).toHaveLength(0);
  });

  it('never auto-dismisses when duration is 0', () => {
    toastStore.add('Sticks around', { duration: 0 });
    vi.advanceTimersByTime(1000 * 60 * 60);
    expect(toastStore.getSnapshot()).toHaveLength(1);
  });

  it('dismiss() removes a specific toast by id', () => {
    const id1 = toastStore.add('First');
    toastStore.add('Second');

    toastStore.dismiss(id1);

    const remaining = toastStore.getSnapshot();
    expect(remaining).toHaveLength(1);
    expect(remaining[0]?.message).toBe('Second');
  });

  it('dismissAll() clears every toast and cancels timers', () => {
    toastStore.add('A');
    toastStore.add('B');
    toastStore.dismissAll();
    expect(toastStore.getSnapshot()).toHaveLength(0);

    // advancing timers afterwards should not throw or resurrect toasts
    vi.advanceTimersByTime(10000);
    expect(toastStore.getSnapshot()).toHaveLength(0);
  });

  it('pause() stops the countdown and resume() continues it', () => {
    const id = toastStore.add('Hover me', { duration: 1000 });

    vi.advanceTimersByTime(500);
    toastStore.pause(id);

    // even after a long wait while paused, the toast survives
    vi.advanceTimersByTime(5000);
    expect(toastStore.getSnapshot()).toHaveLength(1);

    toastStore.resume(id);
    vi.advanceTimersByTime(499);
    expect(toastStore.getSnapshot()).toHaveLength(1);

    vi.advanceTimersByTime(2);
    expect(toastStore.getSnapshot()).toHaveLength(0);
  });

  it('reusing an id replaces the existing toast in place', () => {
    toastStore.add('Original', { id: 'fixed-id' });
    toastStore.add('Updated', { id: 'fixed-id' });

    const snapshot = toastStore.getSnapshot();
    expect(snapshot).toHaveLength(1);
    expect(snapshot[0]?.message).toBe('Updated');
  });
});
