// YoutubeLightbox.jsx
import { useEffect } from 'react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

export default function YoutubeLightbox({ url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', title = 'Video YouTube', gallery = 'videos', children, refreshKey }) {
  useEffect(() => {
    // (Re)inicializa para capturar anchors dinámicos en la página
    const lightbox = GLightbox({ selector: '.glightbox' });
    return () => {
      try { lightbox.destroy(); } catch (e) {}
    };
  }, [refreshKey]);

  return (
    <div style={{ padding: 16 }}>
      <a
        href={url}
        className="glightbox"
        data-type="video"
        data-title={title}
        data-gallery={gallery}
      >
        {children || '▶️ Ver video (GLightbox)'}
      </a>
    </div>
  );
}
