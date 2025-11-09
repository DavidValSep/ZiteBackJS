// YoutubeEmbed.jsx
import ReactPlayer from 'react-player';

// Props:
// - url?: string  (YouTube watch URL)
// - videoId?: string (YouTube ID)
// Si no se provee, usa un video por defecto.
export default function YoutubeEmbed({ url, videoId }) {
  const finalUrl = url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  return (
    <div style={{ maxWidth: 640 }}>
      <ReactPlayer
        url={finalUrl}
        controls
        width="100%"
        height="360px"
      />
    </div>
  );
}
