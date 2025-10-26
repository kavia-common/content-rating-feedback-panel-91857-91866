import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { deleteRating, getRating, submitRating } from '../services/ratingService';

// PUBLIC_INTERFACE
export function useRatingPanel({ contentId, initialVisible = false, autoDismissSeconds = 10, onDismiss }) {
  /** Manages rating state, prior rating check, toasts, and auto-dismiss timer with pause/resume. */
  const [visible, setVisible] = useState(initialVisible);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [remainingSeconds, setRemainingSeconds] = useState(autoDismissSeconds);
  const canAutoDismiss = useRef(true);
  const timerInterval = useRef(null);

  const startTimer = useCallback(() => {
    if (timerInterval.current) return;
    timerInterval.current = window.setInterval(() => {
      setRemainingSeconds((r) => {
        if (!visible) return r;
        if (!canAutoDismiss.current) return r;
        if (r <= 1) {
          window.clearInterval(timerInterval.current);
          timerInterval.current = null;
          onDismiss?.('timeout');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }, [onDismiss, visible]);

  const pauseTimer = useCallback(() => {
    canAutoDismiss.current = false;
  }, []);

  const resumeTimer = useCallback(() => {
    canAutoDismiss.current = true;
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const rec = await getRating(contentId);
        if (!mounted) return;
        if (rec?.rating) {
          setValue(rec.rating);
          setVisible(false);
        } else {
          setVisible(initialVisible);
        }
      } catch (e) {
        setError('No se pudo obtener tu calificación previa.');
        setVisible(initialVisible);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [contentId, initialVisible]);

  useEffect(() => {
    if (!visible) {
      if (timerInterval.current) {
        window.clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
      return;
    }
    setRemainingSeconds(autoDismissSeconds);
    startTimer();
    return () => {
      if (timerInterval.current) {
        window.clearInterval(timerInterval.current);
        timerInterval.current = null;
      }
    };
  }, [visible, autoDismissSeconds, startTimer]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message, key: Date.now() });
  }, []);

  const submit = useCallback(async (v) => {
    setLoading(true);
    setError(null);
    try {
      const rec = await submitRating(contentId, v);
      setValue(rec.rating);
      showToast('success', '¡Guardado!');
      onDismiss?.('rated');
    } catch (e) {
      setError('No se pudo guardar tu calificación.');
      showToast('error', 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }, [contentId, onDismiss, showToast]);

  const remove = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteRating(contentId);
      setValue(null);
      showToast('success', 'Calificación eliminada');
    } catch (e) {
      setError('No se pudo eliminar tu calificación.');
      showToast('error', 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  }, [contentId, showToast]);

  const clearToast = useCallback(() => setToast(null), []);

  return useMemo(() => ({
    visible,
    setVisible,
    loading,
    value,
    error,
    toast,
    clearToast,
    submit,
    remove,
    canAutoDismiss: canAutoDismiss.current,
    pauseTimer,
    resumeTimer,
    remainingSeconds,
  }), [visible, loading, value, error, toast, submit, remove, pauseTimer, resumeTimer, remainingSeconds, clearToast]);
}
