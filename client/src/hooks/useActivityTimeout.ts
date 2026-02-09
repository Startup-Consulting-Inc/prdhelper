/**
 * useActivityTimeout Hook
 *
 * Tracks user activity and triggers a callback after a specified period of inactivity.
 * Used for automatic session timeout to log out inactive users.
 * Shows a warning before the actual timeout to give users a chance to stay active.
 *
 * @param onTimeout - Callback function to execute when inactivity timeout is reached
 * @param timeoutDuration - Duration in milliseconds before timeout (default: 1 hour)
 * @param enabled - Whether activity tracking is enabled (default: true)
 * @param onWarning - Optional callback fired before timeout to warn the user
 * @param warningDuration - Time in ms before timeout to show warning (default: 5 minutes)
 */

import { useEffect, useRef, useCallback } from 'react';

const DEFAULT_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const DEFAULT_WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes before timeout
const DEBOUNCE_DELAY = 500; // Debounce activity events to avoid excessive timer resets

export function useActivityTimeout(
  onTimeout: () => void,
  timeoutDuration: number = DEFAULT_TIMEOUT,
  enabled: boolean = true,
  onWarning?: () => void,
  warningDuration: number = DEFAULT_WARNING_BEFORE
) {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const warningIdRef = useRef<NodeJS.Timeout | null>(null);
  const debounceIdRef = useRef<NodeJS.Timeout | null>(null);

  // Reset the inactivity timer
  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    if (warningIdRef.current) {
      clearTimeout(warningIdRef.current);
    }

    // Set warning timer (fires before timeout)
    if (onWarning && timeoutDuration > warningDuration) {
      warningIdRef.current = setTimeout(() => {
        onWarning();
      }, timeoutDuration - warningDuration);
    }

    // Set actual timeout
    timeoutIdRef.current = setTimeout(() => {
      onTimeout();
    }, timeoutDuration);
  }, [onTimeout, onWarning, timeoutDuration, warningDuration]);

  // Handle activity with debouncing to avoid excessive timer resets
  const handleActivity = useCallback(() => {
    // Clear existing debounce timer
    if (debounceIdRef.current) {
      clearTimeout(debounceIdRef.current);
    }

    // Debounce the timer reset
    debounceIdRef.current = setTimeout(() => {
      resetTimer();
    }, DEBOUNCE_DELAY);
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) {
      // Clean up timers if tracking is disabled
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (warningIdRef.current) {
        clearTimeout(warningIdRef.current);
      }
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current);
      }
      return;
    }

    // Activity events to track
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Start the initial timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      // Remove event listeners
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      // Clear timers
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      if (warningIdRef.current) {
        clearTimeout(warningIdRef.current);
      }
      if (debounceIdRef.current) {
        clearTimeout(debounceIdRef.current);
      }
    };
  }, [enabled, resetTimer, handleActivity]);
}
