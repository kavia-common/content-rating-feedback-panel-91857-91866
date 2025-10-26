import React, { useEffect, useRef } from 'react';
import { CountdownTimer } from './CountdownTimer';
import { NotificationToast } from './NotificationToast';
import { RatingButton } from './RatingButton';
import { useFocusNav } from '../hooks/useFocusNav';

// PUBLIC_INTERFACE
export const RatingPanel = ({
  contentId,
  visible,
  loading = false,
  selected,
  error,
  toast,
  autoDismissSeconds = 10,
  onClose,
  onSubmit,
  onRemove,
  onToastHide,
  onFocusActivity,
}) => {
  /** Full-screen overlay with rating controls, focus navigation and countdown. */
  const containerRef = useRef(null);
  const nav = useFocusNav(containerRef, { selector: '.crp-rating-btn, .crp-close, .crp-action', stopPropagation: true });

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        nav.focusFirst();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    const onKey = (e) => {
      if (!visible) return;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Enter') {
        const active = document.activeElement;
        active?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, onClose]);

  const handleFocusIn = () => onFocusActivity?.(true);
  const handleFocusOut = () => onFocusActivity?.(false);

  if (!visible) return null;

  return (
    <div className="crp-overlay" role="dialog" aria-modal="true" aria-labelledby="rating-title">
      <div
        className="crp-panel"
        ref={containerRef}
        onMouseEnter={() => onFocusActivity?.(true)}
        onMouseLeave={() => onFocusActivity?.(false)}
      >
        <div className="crp-panel-header">
          <div className="crp-title" id="rating-title">
            ¿Qué te pareció este contenido?
          </div>
          <button
            className="crp-close crp-focusable"
            onClick={onClose}
            aria-label="Cerrar"
            onFocus={handleFocusIn}
            onBlur={handleFocusOut}
          >
            Cerrar
          </button>
        </div>

        <div className="crp-panel-body">
          {error && (
            <div className="crp-note" role="alert" style={{ color: 'var(--crp-error)', fontWeight: 700 }}>
              {error}
            </div>
          )}

          <div className="crp-rating-row" onFocus={handleFocusIn} onBlur={handleFocusOut}>
            <RatingButton
              value="like"
              label="Me gusta"
              active={selected === 'like'}
              onSelect={onSubmit}
              onFocus={handleFocusIn}
              onBlur={handleFocusOut}
            />
            <RatingButton
              value="love"
              label="Me encanta"
              active={selected === 'love'}
              onSelect={onSubmit}
              onFocus={handleFocusIn}
              onBlur={handleFocusOut}
            />
            <RatingButton
              value="dislike"
              label="No me gusta"
              active={selected === 'dislike'}
              onSelect={onSubmit}
              onFocus={handleFocusIn}
              onBlur={handleFocusOut}
            />

            {toast && (
              <NotificationToast
                key={toast.key}
                type={toast.type}
                message={toast.message}
                visible={true}
                onHide={onToastHide}
              />
            )}
          </div>

          <div className="crp-actions">
            <button
              className="crp-btn secondary crp-action crp-focusable"
              onClick={onRemove}
              disabled={loading || !selected}
              aria-disabled={loading || !selected}
              aria-label="Eliminar calificación"
              onFocus={handleFocusIn}
              onBlur={handleFocusOut}
            >
              Eliminar
            </button>
          </div>

          <div className="crp-note">
            Puedes cambiar tu calificación en cualquier momento.
          </div>

          <CountdownTimer
            seconds={autoDismissSeconds}
            running={true}
            onComplete={onClose}
          />
        </div>
      </div>
    </div>
  );
};
