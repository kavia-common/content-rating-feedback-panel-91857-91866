import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './styles/index.css';
import { applyThemeToDocument } from './theme';
import { RatingPanel } from './components/RatingPanel';
import { useRatingPanel } from './hooks/useRatingPanel';

// PUBLIC_INTERFACE
function App() {
  /** Demo page that simulates an "end of event" and shows RatingPanel. */
  const [eventEnded, setEventEnded] = useState(false);
  const [theme, setTheme] = useState('light');
  const contentId = 'demo-content-123';

  useEffect(() => {
    applyThemeToDocument();
  }, []);

  useEffect(() => {
    document.title = 'Demo - Content Rating Panel';
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const panel = useRatingPanel({
    contentId,
    initialVisible: false,
    autoDismissSeconds: 10,
    onDismiss: (reason) => {
      // For demo: hide panel on any dismiss
      setShowPanel(false);
      if (reason === 'timeout') {
        setStatus(`Panel cerrado por inactividad.`);
      } else if (reason === 'rated') {
        setStatus('Gracias por calificar.');
      } else {
        setStatus('Panel cerrado.');
      }
    },
  });

  const [showPanel, setShowPanel] = useState(false);
  const [status, setStatus] = useState('');
  const demoRef = useRef(null);

  const simulateEndOfEvent = () => {
    setEventEnded(true);
    // Check if previous rating exists handled in hook; just show panel if not hidden
    setShowPanel(true);
    panel.setVisible(true);
    setStatus('Evento finalizado. Por favor califica el contenido.');
  };

  const onClosePanel = useCallback(() => {
    setShowPanel(false);
    panel.setVisible(false);
    setStatus('Panel cerrado.');
  }, [panel]);

  const onFocusActivity = useCallback((active) => {
    // Pause auto-dismiss while user is interacting
    if (active) panel.pauseTimer();
    else panel.resumeTimer();
  }, [panel]);

  const onToastHide = () => panel.clearToast();

  const submit = (v) => panel.submit(v);
  const remove = () => panel.remove();

  const headerNote = useMemo(() => (
    <p style={{ color: '#334155', maxWidth: 900, margin: '10px auto 0' }}>
      Este demo simula una aplicación de TV VOD. Pulsa "Terminar evento" para mostrar el panel de calificación.
      Navega con las flechas, Enter para seleccionar, y Esc/Back para cerrar. El panel no se mostrará si ya calificaste este contenido.
    </p>
  ), []);

  return (
    <div className="App" style={{ minHeight: '100vh', position: 'relative' }}>
      <header className="App-header" ref={demoRef} style={{ minHeight: '100vh' }}>
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
          aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
          {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>

        <h1 style={{ marginBottom: 6 }}>Panel de Calificación</h1>
        {headerNote}

        <div style={{
          marginTop: 28,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            className="crp-btn primary crp-focusable"
            onClick={simulateEndOfEvent}
            aria-label="Terminar evento"
          >
            Terminar evento
          </button>

          <button
            className="crp-btn secondary crp-focusable"
            onClick={() => {
              setEventEnded(false);
              setShowPanel(false);
              panel.setVisible(false);
              setStatus('Reiniciado');
            }}
          >
            Reiniciar demo
          </button>
        </div>

        {status && (
          <div style={{ marginTop: 16 }}>
            <span className="crp-chip" role="status" aria-live="polite">{status}</span>
          </div>
        )}

        <div style={{ height: 24 }} />

        <div style={{
          width: 'min(900px, 90vw)',
          background: '#fff',
          borderRadius: 16,
          padding: 16,
          boxShadow: 'var(--crp-shadow-sm)',
          border: '1px solid rgba(17,24,39,0.06)'
        }}>
          <div style={{ fontWeight: 800, color: '#334155', marginBottom: 8 }}>Ventana PIP (simulada)</div>
          <div style={{
            height: 200,
            background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(245,158,11,0.25))',
            borderRadius: 12
          }} />
        </div>

        <RatingPanel
          contentId={contentId}
          visible={showPanel && panel.visible}
          loading={panel.loading}
          selected={panel.value}
          error={panel.error}
          toast={panel.toast}
          autoDismissSeconds={10}
          onClose={onClosePanel}
          onSubmit={submit}
          onRemove={remove}
          onToastHide={onToastHide}
          onFocusActivity={onFocusActivity}
        />
      </header>
    </div>
  );
}

export default App;
