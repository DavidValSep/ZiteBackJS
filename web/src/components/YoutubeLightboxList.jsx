// YoutubeLightboxList.jsx
import { useEffect, useRef } from 'react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

// items: Array<{ href: string, title?: string, type?: string }>
export default function YoutubeLightboxList({ items = [] }) {
  const lbRef = useRef(null);

  useEffect(() => {
    // Destruir instancia previa
    try { lbRef.current && lbRef.current.destroy(); } catch (e) {}
    // Crear nueva instancia con elementos explícitos
    lbRef.current = GLightbox({
      elements: (items || []).map((it) => ({
        href: it.href,
        type: it.type || 'video',
        title: it.title || ''
      }))
    });
    return () => {
      try { lbRef.current && lbRef.current.destroy(); } catch (e) {}
      lbRef.current = null;
    };
  }, [JSON.stringify(items)]);

  return (
    <div className="row wrap" style={{ gap: 8 }}>
      {(items || []).map((it, idx) => (
        <button key={idx}
          onClick={() => { try { lbRef.current && lbRef.current.openAt(idx); } catch {} }}
          title={it.title || `Video ${idx + 1}`}
        >
          {it.title ? `Abrir: ${it.title}` : `Abrir video ${idx + 1}`}
        </button>
      ))}
      {(!items || items.length === 0) && (
        <div className="muted small">Sin elementos para mostrar</div>
      )}
    </div>
  );
}
