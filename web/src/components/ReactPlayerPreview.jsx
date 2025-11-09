import React from 'react';
import ReactPlayer from 'react-player';

// Simple preview using react-player.
// Props:
// - url?: full watch URL (preferred if provided)
// - videoId?: YouTube ID (used to build a watch URL if url not provided)
// - title?: optional title
export default function ReactPlayerPreview({ url, videoId, title }) {
  const finalUrl = url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : 'https://www.youtube.com/watch?v=BgMU9Vuj17Y');
  return (
    <div className="player" style={{ position: 'relative' }}>
      <ReactPlayer
        url={finalUrl}
        controls
        playing={false}
        light={true}
        width="100%"
        height="315px"
        config={{ youtube: { playerVars: { modestbranding: 1, rel: 0 } } }}
        onError={() => {/* silent */}}
        title={title || 'Vista previa'}
      />
    </div>
  );
}
