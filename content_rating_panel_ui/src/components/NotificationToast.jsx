import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export const NotificationToast = ({ type, message, visible, autoHideMs = 1800, onHide }) => {
  /** Small floating toast positioned by parent, with auto-hide. */
  const [show, setShow] = useState(visible);

  useEffect(() => setShow(visible), [visible]);

  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => {
      setShow(false);
      onHide?.();
    }, autoHideMs);
    return () => window.clearTimeout(t);
  }, [show, autoHideMs, onHide]);

  if (!show) return null;
  return (
    <div className={`crp-toast ${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
};
