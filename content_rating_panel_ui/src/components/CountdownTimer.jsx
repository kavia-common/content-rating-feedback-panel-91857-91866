import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export const CountdownTimer = ({ seconds, running, onComplete }) => {
  /** Accessible countdown timer that can be paused/resumed via `running`. */
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (intervalRef.current) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
          onComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [running, onComplete]);

  return (
    <div className="crp-timer" role="timer" aria-live="polite" aria-atomic="true">
      <span>Se cerrará en</span>
      <div className="crp-chip" aria-label={`Quedan ${remaining} segundos`}>
        {remaining}s
      </div>
    </div>
  );
};
