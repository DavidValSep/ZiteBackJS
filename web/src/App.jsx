import React, { useEffect, useMemo, useState } from 'react';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import { API_BASE } from './config';
import { api } from './api';
import themeManager from './theme.js';
// Eliminado bloque visible de YoutubeLightbox; inicializamos GLightbox desde aquí

function extractYouTubeId(input) {
  if (!input) return '';
  try {
    // Accept raw ID too
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const url = new URL(input);
    // youtu.be/VIDEO
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] || '';
    }
    // youtube.com/watch?v=VIDEO or /embed/VIDEO
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    const parts = url.pathname.split('/');
    const embedIdx = parts.findIndex((p) => p === 'embed');
    if (embedIdx !== -1 && parts[embedIdx + 1]) return parts[embedIdx + 1];
  } catch (e) {
    // ignore
  }
  return '';
}

export default function App() {
  const MIN_SEARCH = 3;
  const [url, setUrl] = useState('');
  const [quality, setQuality] = useState('720p');
  const [kind, setKind] = useState('video'); // video | audio | todo
  const [format, setFormat] = useState('mp4');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [tasks, setTasks] = useState([]); // cola de descargas
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [count, setCount] = useState(12);
  const [page, setPage] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [completed, setCompleted] = useState([]);
  const [modal, setModal] = useState({ open: false, src: '', kind: 'file' });
  const [oembed, setOembed] = useState(null);
  const [info, setInfo] = useState(null);
  const [infoLoadingId, setInfoLoadingId] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [wikiInfo, setWikiInfo] = useState(null);
  const [selected, setSelected] = useState(() => {
    try { return JSON.parse(localStorage.getItem('y2back-selected') || '{}'); } catch { return {}; }
  }); // id -> true, persistido en LocalStorage
  const [formatsModal, setFormatsModal] = useState({ open: false, url: '', formats: [], loading: false, title: '', selectedType: 'video', thumbnail: '' });
  const [searchWarn, setSearchWarn] = useState('');
  const [playerLoaded, setPlayerLoaded] = useState(false);
  const [fallback, setFallback] = useState(false);
  const [playerKey, setPlayerKey] = useState(0);
  // Demos desactivados en producción: ReactPlayer/YoutubeEmbed removidos
  const [ack, setAck] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ackFiles') || '{}'); } catch { return {}; }
  });
  const [health, setHealth] = useState(null);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || themeManager.currentTheme || 'light'; } catch { return 'light'; }
  });
  // Consola global desactivada (mantener UI limpia)
  // const [consoleLogs, setConsoleLogs] = useState([]);
  // Toasts (notificaciones discretas)
  const [toasts, setToasts] = useState([]);
  // Clave de reinit para GLightbox basada en los resultados (ids/urls)
  const resultsKey = useMemo(() => {
    try {
      return (results || []).map(r => r?.id || r?.url || '').join('|');
    } catch { return String(results?.length || 0); }
  }, [results]);

  // (se mueve más abajo tras definir videoId y playerSrc)

  // Util: formatear bytes con unidades automáticas (IEC)
  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 0) return '';
    const units = ['B','KiB','MiB','GiB','TiB'];
    let v = bytes;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    const decimals = (i > 0 && v < 10) ? 1 : 0;
    return `${v.toFixed(decimals)} ${units[i]}`;
  }

  function addToast({ type = 'info', title, text, ttl = 4000 }) {
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`;
    const item = { id, type, title: title || (type === 'success' ? 'Completado' : type === 'error' ? 'Error' : 'Aviso'), text: text || '' };
    setToasts((prev) => [...prev, item]);
    if (ttl > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter(t => t.id !== id));
      }, ttl);
    }
  }
  function removeToast(id) { setToasts((prev) => prev.filter(t => t.id !== id)); }
  

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const playerSrc = useMemo(() => {
    if (!videoId) return '';
    const host = 'https://www.youtube.com';
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      playsinline: '1',
      modestbranding: '1',
      rel: '0',
      enablejsapi: '1',
      cc_load_policy: '1'
    });
    return `${host}/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  // Inicializar GLightbox para todos los anchors con clase .glightbox
  useEffect(() => {
    const lb = GLightbox({ selector: '.glightbox' });
    return () => { try { lb.destroy(); } catch(_){} };
  }, [resultsKey, videoId]);

  // Persistir selecciones en LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('y2back-selected', JSON.stringify(selected));
    } catch (_) {}
  }, [selected]);

  // Watchdog: si el iframe no carga en X segundos, mostrar placeholder
  useEffect(() => {
    setPlayerLoaded(false);
    setFallback(false);
    setPlayerKey((k) => k + 1);
    if (!videoId) return;
    const t = setTimeout(() => {
      if (!playerLoaded) setFallback(true);
    }, 5000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Cargar metadatos de previsualización (oEmbed) para soporte rápido de previews
  useEffect(() => {
    setOembed(null);
    if (!videoId) return;
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/api/oembed', { params: { url: watchUrl } });
        if (!cancelled && data && data.ok) setOembed(data.data);
      } catch (_) { /* silencioso */ }
    })();
    return () => { cancelled = true; };
  }, [videoId]);

  // Health check básico del backend (incluye disponibilidad de yt-dlp)
  useEffect(() => {
    let stop = false;
    const tick = async () => {
      try {
        const { data } = await api.get('/api/health');
        if (!stop) setHealth(data || null);
      } catch (_) {}
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => { stop = true; clearInterval(t); };
  }, []);

  async function callDownload(reqKind, targetUrl, opts = {}) {
    const useUrl = (targetUrl || url || '').trim();
    const id = extractYouTubeId(useUrl);
    if (!id) return;
    const tempId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const formatArg = opts.format ?? format;
    const qualityArg = opts.quality ?? quality;
    const task = { id: tempId, url: useUrl, kind: reqKind, quality: qualityArg, format: formatArg, status: 'starting', logs: [] };
    setTasks((prev) => [task, ...prev]);
    setLoading(true);
    setStatus('Procesando…');
    try {
      const { data } = await api.post('/api/download', { url: useUrl, kind: reqKind, quality: qualityArg, format: formatArg });
      if (!data || data.ok === false || !data.jobId) {
        const errMsg = (data && (data.error || data.warn)) ? String(data.error || data.warn) : 'Fallo al iniciar descarga';
        updateTask(task.id, { status: 'error', logs: [`${errMsg}\n`] });
        setStatus(`Error: ${errMsg}`);
        addToast({ type: 'error', text: errMsg });
        return;
      }
      const jobId = data.jobId;
      // Conectar a SSE para logs
      attachStream(task.id, jobId);
      setStatus('Descarga en curso…');
    } catch (err) {
      updateTask(task.id, { status: 'error' });
      console.error('[ERROR] No se pudo contactar la API:', err.message);
      addToast({ type: 'error', text: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  }

  function updateTask(id, patch) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  

  function attachStream(localId, jobId) {
    try {
      const es = new EventSource(`${API_BASE}/api/jobs/${jobId}/stream`);
      updateTask(localId, { status: 'running' });
      updateTask(localId, { jobId });
      es.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'log') {
            // Silenciar logs para una UI más limpia
            // setTasks((prev) => prev.map((t) => (t.id === localId ? { ...t, logs: [...t.logs, String(msg.data)] } : t)));
          } else if (msg.type === 'progress') {
            setTasks((prev) => prev.map((t) => (t.id === localId ? { ...t, progress: msg.value, totalBytes: msg.totalBytes, downloadedBytes: msg.downloadedBytes } : t)));
          } else if (msg.type === 'file') {
            // Al detectar un archivo listo, refrescar lista de completados
            (async () => {
              try {
                const { data } = await api.get('/api/completed');
                if (data && data.ok) setCompleted(data.items || []);
              } catch (_) {}
            })();
          } else if (msg.type === 'done') {
            const nextStatus = msg.ok ? 'done' : (msg.code === 'canceled' ? 'canceled' : 'error');
            updateTask(localId, { status: nextStatus });
            if (msg.ok) {
              // Refrescar completados y notificar
              (async () => {
                try {
                  const { data } = await api.get('/api/completed');
                  if (data && data.ok) setCompleted(data.items || []);
                  addToast({ type: 'success', text: 'Descarga lista' });
                } catch (_) {
                  addToast({ type: 'success', text: 'Descarga finalizada' });
                }
              })();
            } else {
              if (msg.code === 'canceled') {
                addToast({ type: 'info', text: 'Descarga cancelada' });
              } else {
                addToast({ type: 'error', text: 'Descarga falló' });
              }
            }
            es.close();
          }
        } catch {
          // mensajes no JSON
          // Silenciar logs sueltos
        }
      };
      es.onerror = () => {
        // Si se corta, no romper la UI; quedará el estado que tuviera
        try { es.close(); } catch {}
        // No mostrar mensajes extra; mantener UI mínima
      };
    } catch (_) {}
  }

  // Buscar resultados
  const INITIAL_PAGES_FOR_12 = 2; // 12 por página -> 24 en la primera búsqueda

  async function doSearch(reset = true, termOverride) {
    const termRaw = (termOverride ?? searchTerm);
    const term = (termRaw || '').trim();
    if (!term) return;
    if (term.length < MIN_SEARCH) {
      setStatus(`Escribe al menos ${MIN_SEARCH} caracteres para buscar`);
      return;
    }
    try {
      setSearchLoading(true);
      const excludeIds = reset ? [] : results.map(r => r.id).filter(Boolean);

      // Normalización ligera para ayudar a coincidencias: colapsar espacios
      const q = term.replace(/\s+/g, ' ');

      if (reset) {
        // Cargar múltiples páginas al inicio si count === 12 (12 por página => 24 iniciales)
        const pagesToLoad = (count === 12) ? INITIAL_PAGES_FOR_12 : 1;
        const collected = [];
        let lastWarn = '';
        for (let p = 0; p < pagesToLoad; p++) {
          const { data } = await api.get('/api/search', { params: { q, count, page: p, excludeIds: (p === 0 ? excludeIds : collected.map(r => r.id).filter(Boolean)).join(',') } });
          if (data && data.ok) {
            const items = data.items || [];
            for (const it of items) {
              if (!collected.find(x => (x.id || x.url) === (it.id || it.url))) collected.push(it);
            }
            if (data.warn) lastWarn = String(data.warn);
          } else {
            console.error('[ERROR] Búsqueda falló:', data?.error || 'desconocido');
            addToast({ type: 'error', text: 'Error en la búsqueda. Intenta nuevamente.' });
            break;
          }
        }
        setResults(collected);
        setPage(pagesToLoad - 1);
        setSearchWarn(lastWarn);
      } else {
        const nextPage = page + 1;
        const { data } = await api.get('/api/search', { params: { q, count, page: nextPage, excludeIds: excludeIds.join(',') } });
        if (data && data.ok) {
          const newItems = (data.items || []).filter(it => !(results.find(x => (x.id || x.url) === (it.id || it.url))));
          setResults((prev) => [...prev, ...newItems]);
          setPage(nextPage);
          setSearchWarn(data.warn ? String(data.warn) : '');
        } else {
          console.error('[ERROR] Búsqueda siguiente página:', data?.error || 'desconocido');
          addToast({ type: 'error', text: 'Error cargando más resultados.' });
        }
      }
    } catch (e) {
      console.error('[ERROR] Error buscando:', e.message);
      addToast({ type: 'error', text: 'Error de búsqueda.' });
    } finally {
      setSearchLoading(false);
    }
  }

  async function fetchInfoFor(urlOrId, idForLoading) {
    try {
      setInfo(null);
      setWikiInfo(null);
      setInfoLoadingId(idForLoading || '');
      const { data } = await api.get('/api/info', { params: { url: urlOrId } });
      if (data && data.ok && data.info) {
        setInfo(data.info);
        setInfoOpen(true);
        // Buscar info del artista en Wikipedia
        if (data.info.author || data.info.uploader || data.info.channel) {
          const artist = data.info.author || data.info.uploader || data.info.channel;
          fetchWikipediaInfo(artist);
        }
      } else {
        setInfo({ error: data?.error || data?.warn || 'No disponible' });
        setInfoOpen(true);
      }
    } catch (e) {
      console.error('[ERROR] Error consultando info:', e.message);
      setInfo({ error: 'Error consultando información' });
      setInfoOpen(true);
    } finally {
      setInfoLoadingId('');
    }
  }

  async function fetchWikipediaInfo(artistName) {
    try {
      const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(artistName)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();
      
      if (searchData.query?.search?.length > 0) {
        const pageId = searchData.query.search[0].pageid;
        const extractUrl = `https://es.wikipedia.org/w/api.php?action=query&pageids=${pageId}&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`;
        const extractRes = await fetch(extractUrl);
        const extractData = await extractRes.json();
        
        const page = extractData.query?.pages?.[pageId];
        if (page?.extract) {
          setWikiInfo({
            title: page.title,
            extract: page.extract,
            url: `https://es.wikipedia.org/?curid=${pageId}`
          });
        }
      }
    } catch (e) {
      console.error('[INFO] No se pudo obtener info de Wikipedia:', e.message);
      // No es crítico, solo info adicional
    }
  }

  // Cargar formatos disponibles para un video y abrir modal
  async function loadFormats(item) {
    try {
      setFormatsModal({ open: true, url: item.url, formats: [], loading: true, title: item.title || '', selectedType: 'video', thumbnail: item.thumbnail || '' });
      const { data } = await api.get('/api/formats', { params: { url: item.url } });
      if (data && data.ok) {
        setFormatsModal({ open: true, url: item.url, formats: data.formats || [], loading: false, title: item.title || '', selectedType: 'video', thumbnail: item.thumbnail || '' });
      } else {
        setFormatsModal({ open: true, url: item.url, formats: [], loading: false, title: item.title || '', selectedType: 'video', thumbnail: item.thumbnail || '' });
        addToast({ type: 'error', text: data?.error || 'No se encontraron formatos' });
      }
    } catch (e) {
      setFormatsModal({ open: true, url: item.url, formats: [], loading: false, title: item.title || '', selectedType: 'video', thumbnail: item.thumbnail || '' });
      addToast({ type: 'error', text: 'Error consultando formatos' });
    }
  }

  async function startDownloadWithFormat(formatObj, kindParam = 'video') {
    try {
      setFormatsModal(prev => ({ ...prev, open: false }));
      const opts = { format: String(formatObj.ext || formatObj.itag || formatObj.format_note || ''), quality: formatObj.height || '' };
      await callDownload(kindParam, formatsModal.url, opts);
    } catch (e) {
      addToast({ type: 'error', text: 'Error iniciando descarga' });
    }
  }

  // Selección de resultados
  function toggleSelect(item) {
    const key = item.id || item.url;
    if (!key) return;
    setSelected((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key]; else next[key] = true;
      return next;
    });
  }
  function clearSelection() { setSelected({}); }
  function selectAllResults() {
    const next = {};
    for (const r of results) {
      const key = r.id || r.url; if (key) next[key] = true;
    }
    setSelected(next);
  }
  function getSelectedItems() {
    const keys = new Set(Object.keys(selected || {}));
    return results.filter(r => keys.has(r.id || r.url));
  }

  // Poll de completados
  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const { data } = await api.get('/api/completed');
        if (data.ok) setCompleted(data.items || []);
      } catch (_) {}
    }, 4000);
    return () => clearInterval(t);
  }, []);

  // Acciones de tareas
  async function cancelTask(t) {
    if (!t.jobId) return;
    try {
      await api.post(`/api/jobs/${t.jobId}/cancel`);
      // Esperar confirmación vía SSE; marcar como "cancelando" para feedback
      updateTask(t.id, { status: 'canceling' });
    } catch (e) {
      console.error('[ERROR] No se pudo cancelar tarea:', e.message);
      addToast({ type: 'error', text: 'Error al cancelar descarga.' });
    }
  }

  function deleteTask(t) {
    setTasks(prev => prev.filter(x => x.id !== t.id));
  }

  function playJob(jobId, index = 0) {
    const src = `${API_BASE}/api/jobs/${jobId}/files/${index}`;
    markAck(jobId, index);
    setModal({ open: true, src, kind: 'file' });
  }

  function markAck(jobId, index) {
    const key = `${jobId}:${index}`;
    setAck((prev) => {
      const next = { ...prev, [key]: true };
      try { localStorage.setItem('ackFiles', JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function restartTask(t) {
    setUrl(t.url);
    callDownload(t.kind, t.url);
  }

  // Botón inteligente: si es URL/ID → Descargar; si no → Buscar
  async function handleSmartAction() {
    try {
      setSmartLoading(true);
      const maybeId = extractYouTubeId(url);
      if (maybeId) {
        await callDownload(kind, url);
      } else if (url.trim()) {
        const t = url.trim();
        if (t.length < MIN_SEARCH) {
          setStatus(`Escribe al menos ${MIN_SEARCH} caracteres para buscar`);
        } else {
          // Primero hacer la búsqueda, luego actualizar searchTerm
          await doSearch(true, t);
          setSearchTerm(t);
        }
      }
    } finally {
      setSmartLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div className="header-top">
          <div className="row" style={{alignItems:'center', gap:10, minHeight:64}}>
            <img src="/icon-192x192.png" alt="Y2Back" style={{height:'100%', maxHeight:128, alignSelf:'stretch', borderRadius:6, objectFit:'contain'}} />
            <div>
              <h1 style={{margin:0}}>Así es Y2Back...</h1>
              <p className="muted" style={{margin:0}}>Rápido, simple y sin rodeos — Tus contenidos, donde quieras y como quieras.</p>
            </div>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <button
              id="themeToggle"
              className="theme-toggle-btn"
              title="Cambiar tema"
              onClick={() => { themeManager.toggleTheme(); setTheme(prev => prev === 'light' ? 'dark' : 'light'); }}
              style={{
                background: theme === 'light' ? '#fff' : undefined,
                color: theme === 'light' ? '#111' : undefined,
                border: theme === 'light' ? '1px solid rgba(0,0,0,0.2)' : undefined
              }}
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <section className="card">
        <label htmlFor="url">URL o ID de YouTube</label>
        <div className="row wrap" style={{gap:12, alignItems:'flex-start'}}>
          <form className="row" style={{flex:1, minWidth:'300px'}} onSubmit={(e) => { e.preventDefault(); handleSmartAction(); }}>
            <input
              id="url"
              name="url"
              type="text"
              placeholder="https://youtu.be/… o dQw4w9WgXcQ"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setSearchTerm(e.target.value); }}
            />
            <button type="submit" disabled={smartLoading || !url.trim()} className={`${smartLoading ? 'animate-bounce' : ''} theme-button-primary`}>
              {extractYouTubeId(url) ? (smartLoading ? 'Descargando…' : 'Buscar / Descargar') : (smartLoading ? 'Buscando…' : 'Buscar / Descargar')}
            </button>
          </form>

          {/* Podrías tener suerte - al lado del buscador */}
          {results.length > 0 && (
            <div style={{flex:'0 0 auto', minWidth:'220px', maxWidth:'280px'}}>
              <div style={{fontSize:13, fontWeight:600, marginBottom:8, color:'var(--accent)'}}>Podrías tener suerte…</div>
              {results[0].thumbnail && (
                <a
                  href={results[0].url}
                  className="glightbox"
                  data-type="video"
                  data-gallery="search"
                  data-title={results[0].title || 'Video'}
                  style={{display:'block', position:'relative'}}
                  aria-label="Abrir video"
                >
                  <img src={results[0].thumbnail} alt="thumb" style={{width:'100%', borderRadius:8, aspectRatio:'16/9', objectFit:'cover'}} />
                  <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none'}}>
                    <svg width="52" height="38" viewBox="0 0 84 60" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.3}}>
                      <rect rx="12" width="84" height="60" fill="#FF0000"/>
                      <polygon points="34,18 34,42 56,30" fill="#FFFFFF"/>
                    </svg>
                  </div>
                </a>
              )}
              <div style={{marginTop:8, fontSize:13, fontWeight:600, lineHeight:1.3}} title={results[0].title}>{(results[0].title || '').slice(0,80)}{(results[0].title || '').length > 80 ? '…' : ''}</div>
              <button className="theme-button-primary" style={{marginTop:8, width:'100%', fontSize:12}} onClick={() => { setUrl(results[0].url); setTimeout(() => callDownload('video', results[0].url), 100); }}>Descargar</button>
            </div>
          )}
        </div>

        <div className="row wrap">
          <label className="quality">
            Calidad
            <select value={quality} onChange={(e) => setQuality(e.target.value)}>
              {['auto','2160p','1440p','1080p','720p','480p','360p'].map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </label>

          <label className="quality">
            Tipo
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="todo">Todo</option>
            </select>
          </label>

          <label className="quality">
            Formato
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              {(kind === 'audio'
                ? ['mp3','m4a','opus','ogg']
                : ['mp4','mkv','webm']
              ).map(f => (
                <option key={f} value={f}>{f.toUpperCase()}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="layout" style={{display:'flex', gap:12}}>
        <div className="left-col" style={{flex:'0 0 30%'}}>
          {!!completed.length && (
            <div className="card">
              <h2>Listos para descarga</h2>
              <p className="muted small">Consejo: usa ZIP para descargar todo el job en un solo archivo. Si prefieres varios archivos, tu navegador podría pedir permiso para descargas múltiples.</p>
              <div style={{display:'grid', gap:12}}>
                {completed.map((c) => (
                  <div key={c.jobId} className="card" style={{padding:12}}>
                    <div className="row wrap" style={{alignItems:'center', justifyContent:'space-between', gap:8}}>
                      <div className="muted small">Job: {c.jobId}</div>
                      <a href={`${API_BASE}/api/jobs/${c.jobId}/archive.zip?dl=1`} target="_blank" rel="noreferrer" download>
                        <button className="theme-button-primary">Descargar ZIP del job</button>
                      </a>
                    </div>
                    <ul style={{marginTop:8}}>
                      {(Array.isArray(c.files) ? c.files.filter(f => f && f.name && (!Number.isFinite(f.sizeBytes) || f.sizeBytes > 0)) : []).map((f) => {
                        const key = `${c.jobId}:${f.index}`;
                        const isNew = !ack[key];
                        const sizeMB = Number.isFinite(f.sizeBytes) ? (f.sizeBytes / (1024*1024)) : NaN;
                        return (
                          <li
                            key={`${c.jobId}-${f.index}`}
                            className={`${isNew ? 'ready-accent' : ''}`}
                            style={{display:'block', width:'100%', gap:8, margin:'6px 0', border:'1px solid var(--border)', borderRadius:10, padding:12}}
                          >
                            <div className="row wrap" style={{gap:8, alignItems:'center'}}>
                              <span style={{flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis'}}>
                                {f.name}{' '}
                                {Number.isFinite(sizeMB) ? `— ${sizeMB.toFixed(1)} MB` : ''}
                              </span>
                              <div style={{width:'100%', display:'grid', gridTemplateColumns:'1fr', gap:8}}>
                                <button onClick={() => playJob(c.jobId, f.index)} style={{width:'100%'}}>Reproducir</button>
                                <a href={`${API_BASE}/api/jobs/${c.jobId}/files/${f.index}?dl=1`} target="_blank" rel="noreferrer" download onClick={() => markAck(c.jobId, f.index)} style={{display:'block', width:'100%'}}>
                                  <button style={{width:'100%'}}>Descargar</button>
                                </a>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

  <div className="right-col" style={{flex:'1 1 70%'}}>
          {/* Derecha: Resultados arriba y Acciones por selección */}
          {/* Resultados (usar el input superior como término cuando no es URL válida) */}
          <div className="card">
            <h2>Resultados</h2>
            <div className="row wrap" style={{alignItems:'center', gap:8}}>
              <div className="row wrap" style={{gap:8}}>
                <button onClick={selectAllResults}>Seleccionar todo</button>
                <button onClick={clearSelection}>Limpiar selección</button>
                <div className="muted small">Selec.: {Object.keys(selected).length}</div>
              </div>
              <div style={{marginLeft:'auto'}} className="row wrap">
                <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
                  {[12,24,36,48,60].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <button disabled={searchLoading || !(String(url || '').trim().length >= MIN_SEARCH)} onClick={() => doSearch(true, url)} className={searchLoading ? 'animate-bounce' : ''}>
                  {searchLoading ? 'Buscando…' : 'Buscar'}
                </button>
                <button disabled={searchLoading || !results.length} onClick={() => doSearch(false)} className={searchLoading ? 'animate-bounce' : ''}>Buscar más</button>
              </div>
            </div>
            {/* Te puede interesar ahora se muestra en el panel izquierdo */}
            <div className="results-grid">
              {results.map((r) => (
                <div key={r.id || r.url} className="card" style={{padding: 8, position:'relative', display:'flex', flexDirection:'column'}}>
                  <label style={{position:'absolute', top:8, left:8}}>
                    <input type="checkbox" checked={!!selected[(r.id||r.url)]} onChange={() => toggleSelect(r)} />
                  </label>
                  {r.thumbnail && (
                    <a
                      href={r.url}
                      className="glightbox"
                      data-type="video"
                      data-gallery="search"
                      data-title={r.title || 'Video'}
                      style={{display:'block', position:'relative'}}
                      aria-label="Abrir video"
                    >
                      <img
                        src={r.thumbnail}
                        alt="thumb"
                        style={{width:'100%', borderRadius:6, aspectRatio:'16/9', objectFit:'cover'}}
                      />
                      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none'}}>
                        <svg width="72" height="52" viewBox="0 0 84 60" xmlns="http://www.w3.org/2000/svg" style={{opacity:0.3}}>
                          <rect rx="12" width="84" height="60" fill="#FF0000"/>
                          <polygon points="34,18 34,42 56,30" fill="#FFFFFF"/>
                        </svg>
                      </div>
                    </a>
                  )}
                  <a
                    href={r.url}
                    className="glightbox"
                    data-type="video"
                    data-gallery="search"
                    data-title={r.title || 'Video'}
                    style={{marginTop:8, fontWeight:600, color:'inherit', textDecoration:'none'}}
                  >
                    {r.title}
                  </a>
                  <div className="muted small">{r.author}</div>
                  <div style={{flex:1}} />
                  <div className="row wrap" style={{marginTop:8, justifyContent:'center', gap:8}}>
                    <button onClick={() => { setUrl(r.url); fetchInfoFor(r.url, r.id || r.url); }} className={infoLoadingId === (r.id || r.url) ? 'animate-bounce' : ''}>Ver ficha</button>
                    <button onClick={() => { setUrl(r.url); loadFormats(r); }} className={formatsModal.loading ? 'animate-bounce' : ''}>Descargar</button>
                  </div>
                </div>
              ))}
              {!searchLoading && results.length === 0 && !!searchWarn && (
                <div className="muted small" style={{padding:8}}>
                  No se pudieron obtener resultados ahora (motor de búsqueda). Intenta de nuevo en unos segundos.
                </div>
              )}
            </div>
          </div>

          {tasks.filter(t => t.status !== 'done').length > 0 && (
            <div className="card" style={{marginTop:12}}>
              <h2>En proceso</h2>
              <div className="row wrap" style={{justifyContent:'flex-end', gap:8, marginBottom:8}}>
                <button onClick={async () => {
                  try {
                    await api.post('/api/jobs/cancel-all');
                    setTasks(prev => prev.map(t => (t.status !== 'done' ? { ...t, status: 'canceling' } : t)));
                  } catch (e) {
                    addToast({ type: 'error', text: 'No se pudo cancelar todo' });
                  }
                }}>Cancelar todas</button>
                <button onClick={async () => {
                  try {
                    await api.post('/api/system/kill-downloaders');
                    setTasks(prev => prev.map(t => (t.status !== 'done' ? { ...t, status: 'canceling' } : t)));
                    addToast({ type: 'info', text: 'Corte forzado enviado' });
                  } catch (e) {
                    addToast({ type: 'error', text: 'No se pudo forzar el corte' });
                  }
                }}>Forzar corte (sistema)</button>
              </div>
              <ul className="tasks">
                {tasks.filter(t => t.status !== 'done').map((t) => (
                  <li key={t.id} className={`task ${t.status}`}>
                    <div className="task-head">
                      <div className="spinner" aria-hidden />
                      <div className="task-sub muted">{t.status}</div>
                    </div>
                    <div className="progress-wrap">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.max(0, Math.min(100, t.progress || 0))}%` }}
                      />
                    </div>
                    <div className="muted small" style={{marginTop:6}}>
                      {typeof t.downloadedBytes === 'number' && typeof t.totalBytes === 'number'
                        ? (<span>{formatBytes(t.downloadedBytes)} / {formatBytes(t.totalBytes)}</span>)
                        : (<span>{Math.round(t.progress || 0)}%</span>)}
                    </div>
                    <div className="row wrap" style={{marginTop:8}}>
                      {t.status === 'running' && (
                        <button onClick={() => cancelTask(t)}>Cancelar</button>
                      )}
                      <button onClick={() => restartTask(t)}>Reintentar</button>
                      <button onClick={() => deleteTask(t)}>Eliminar</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Acciones: aplican a los seleccionados */}
          <div className="card actions" style={{marginTop:12}}>
            <div style={{display:'flex', gap:16, alignItems:'flex-start'}}>
              <a href="https://susitio.cl/" target="_blank" rel="noreferrer" title="Y2Back — SuSitio.cl" style={{display:'block', flexShrink:0}}>
                <img src="/icon-192x192.png" alt="Y2Back" style={{width:80, height:80, borderRadius:6, objectFit:'contain'}} />
              </a>
              <div style={{flex:1, minWidth:0}}>
                <div className="row wrap" style={{alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:12}}>
                  <h2 style={{margin:0}}>Acciones</h2>
                  <div className="muted small">Selec.: {Object.keys(selected).length} {Object.keys(selected).length > 1 && '📦'}</div>
                </div>
                <div className="row wrap" style={{gap:8, marginBottom:12}}>
                  <button onClick={selectAllResults} style={{fontSize:12, padding:'6px 10px'}}>Seleccionar todo</button>
                  <button onClick={clearSelection} style={{fontSize:12, padding:'6px 10px'}}>Limpiar</button>
                </div>
                <div className="buttons">
                  <button disabled={!Object.keys(selected).length || loading} onClick={() => { const items = getSelectedItems(); setStatus(`Lanzando ${items.length} descarga(s) de video…`); items.forEach(it => callDownload('video', it.url)); }} className={loading ? 'animate-bounce' : ''}>Descargar Video {Object.keys(selected).length > 1 && '(ZIP)'}</button>
                  <button disabled={!Object.keys(selected).length || loading} onClick={() => { const items = getSelectedItems(); setStatus(`Lanzando ${items.length} descarga(s) de audio…`); items.forEach(it => callDownload('audio', it.url)); }} className={loading ? 'animate-bounce' : ''}>Descargar Audio {Object.keys(selected).length > 1 && '(ZIP)'}</button>
                  <button disabled={!Object.keys(selected).length || loading} onClick={() => { const items = getSelectedItems(); setStatus(`Lanzando ${items.length} descarga(s) completas…`); items.forEach(it => callDownload('todo', it.url)); }} className={loading ? 'animate-bounce' : ''}>Descargar Todo {Object.keys(selected).length > 1 && '(ZIP)'}</button>
                </div>
                <p className="muted small" style={{marginTop:12}}>Marca múltiples resultados en la lista y luego usa los botones de descarga.</p>
                {status && <div className="status">{status}</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
      
        {/* Modal simple para reproducción HTML5 */}
        {modal.open && (
          <div className="modal" onClick={() => setModal({ open:false, src:'', kind:'file' })} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
            <div style={{width:'90vw', height:'90vh', background:'#000'}} onClick={(e)=>e.stopPropagation()}>
              {modal.kind === 'yt' ? (
                <iframe
                  title="yt-modal"
                  src={modal.src}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{width:'100%', height:'100%'}}
                />
              ) : (
                <video src={modal.src} controls autoPlay style={{width:'100%', height:'100%', objectFit:'contain'}} onLoadedMetadata={(e)=>{ try { e.currentTarget.currentTime = 20; } catch(_){} }} />
              )}
            </div>
          </div>
        )}
        {/* Modal tipo tooltip para Ficha */}
        {infoOpen && (
          <div className="modal" onClick={() => setInfoOpen(false)} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', padding: '20px', zIndex:1001, overflow:'auto'}}>
            <div className="card" style={{width: 'min(900px, 95vw)', maxHeight:'90vh', overflow:'auto', background: 'var(--card)'}} onClick={(e)=>e.stopPropagation()}>
              <div style={{display:'flex', flexDirection:'column', gap:16}}>
                {/* Imagen 40vw */}
                {info?.thumbnail && (
                  <div style={{display:'flex', justifyContent:'center'}}>
                    <img 
                      src={info.thumbnail.replace(/default\.jpg$/, 'maxresdefault.jpg').replace(/hqdefault\.jpg$/, 'maxresdefault.jpg')} 
                      alt="thumbnail" 
                      style={{width:'40vw', minWidth:'280px', maxWidth:'100%', borderRadius:12, objectFit:'cover', aspectRatio:'16/9'}}
                      onError={(e) => { e.target.src = info.thumbnail; }}
                    />
                  </div>
                )}
                
                {/* Info del video */}
                <div>
                  <h2 style={{margin:'0 0 8px 0', color:'var(--accent)'}}>{info?.title || 'Ficha'}</h2>
                  <div className="muted small" style={{marginBottom:8}}>
                    {info?.author || info?.uploader || info?.channel}
                    {info?.duration ? (` • Duración: ${info.duration}`) : ''}
                    {info?.view_count ? (` • ${Number(info.view_count).toLocaleString()} vistas`) : ''}
                  </div>
                  
                  {(info?.channel_url || info?.uploader_url) && (
                    <div className="small" style={{marginBottom:12}}>
                      <a href={(info.channel_url || info.uploader_url)} target="_blank" rel="noreferrer" style={{color:'var(--accent)', textDecoration:'none'}}>
                        🔗 Ver canal en YouTube
                      </a>
                    </div>
                  )}
                  
                  {info?.description && (
                    <div style={{marginBottom:16}}>
                      <div style={{fontWeight:600, marginBottom:6}}>Descripción:</div>
                      <div className="muted small" style={{maxHeight:200, overflow:'auto', whiteSpace:'pre-wrap', background:'var(--bg)', padding:12, borderRadius:8}}>
                        {info.description}
                      </div>
                    </div>
                  )}
                  
                  {/* Info de Wikipedia del artista */}
                  {wikiInfo && (
                    <div style={{marginTop:16, padding:12, background:'var(--bg)', borderRadius:8, border:'1px solid var(--border)'}}>
                      <div style={{fontWeight:600, marginBottom:6, display:'flex', alignItems:'center', gap:8}}>
                        📚 Sobre {wikiInfo.title}
                        <a href={wikiInfo.url} target="_blank" rel="noreferrer" style={{fontSize:'12px', color:'var(--accent)', textDecoration:'none'}}>
                          (Wikipedia)
                        </a>
                      </div>
                      <div className="muted small" style={{maxHeight:150, overflow:'auto', lineHeight:1.6}}>
                        {wikiInfo.extract}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="row wrap" style={{justifyContent:'flex-end', gap:8}}>
                  <button onClick={() => setInfoOpen(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal de selección de formatos */}
        {formatsModal.open && (
          <div className="modal" onClick={() => setFormatsModal(prev => ({ ...prev, open: false }))} style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', zIndex:1002}}>
            <div className="card" style={{width: 'min(900px, 95vw)', maxHeight:'85vh', overflow:'auto', background: 'var(--card)'}} onClick={(e)=>e.stopPropagation()}>
              {/* Header con miniatura */}
              <div style={{display:'flex', gap:12, marginBottom:16}}>
                {formatsModal.thumbnail && (
                  <div style={{flex:'0 0 auto'}}>
                    <img 
                      src={formatsModal.thumbnail} 
                      alt="thumb" 
                      style={{width:'120px', height:'68px', borderRadius:8, objectFit:'cover'}}
                    />
                  </div>
                )}
                <div style={{flex:1, minWidth:0}}>
                  <h2 style={{margin:'0 0 4px 0', color:'var(--accent)'}}>Descargar</h2>
                  <div style={{fontWeight:600, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{formatsModal.title}</div>
                  <div className="muted small" style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{formatsModal.url}</div>
                </div>
                <button onClick={() => setFormatsModal(prev => ({ ...prev, open: false }))} style={{flex:'0 0 auto', height:'fit-content'}}>×</button>
              </div>
              
              {formatsModal.loading ? (
                <div className="muted small">Consultando formatos disponibles…</div>
              ) : (!formatsModal.formats || formatsModal.formats.length === 0) ? (
                <div className="muted small">No se encontraron formatos disponibles.</div>
              ) : (
                <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:16}}>
                  {/* Columna izquierda: Tipo */}
                  <div>
                    <div style={{fontWeight:600, marginBottom:12}}>Tipo de descarga</div>
                    <div style={{display:'flex', flexDirection:'column', gap:8}}>
                      <button 
                        onClick={() => setFormatsModal(prev => ({ ...prev, selectedType: 'video' }))}
                        style={{
                          textAlign:'left',
                          background: formatsModal.selectedType === 'video' ? 'var(--accent)' : 'var(--card)',
                          color: formatsModal.selectedType === 'video' ? '#fff' : 'var(--text)',
                          border: '1px solid ' + (formatsModal.selectedType === 'video' ? 'var(--accent)' : 'var(--border)')
                        }}
                      >
                        🎬 Video
                      </button>
                      <button 
                        onClick={() => setFormatsModal(prev => ({ ...prev, selectedType: 'audio' }))}
                        style={{
                          textAlign:'left',
                          background: formatsModal.selectedType === 'audio' ? 'var(--accent)' : 'var(--card)',
                          color: formatsModal.selectedType === 'audio' ? '#fff' : 'var(--text)',
                          border: '1px solid ' + (formatsModal.selectedType === 'audio' ? 'var(--accent)' : 'var(--border)')
                        }}
                      >
                        🎵 Audio
                      </button>
                      <button 
                        onClick={() => setFormatsModal(prev => ({ ...prev, selectedType: 'thumbnail' }))}
                        style={{
                          textAlign:'left',
                          background: formatsModal.selectedType === 'thumbnail' ? 'var(--accent)' : 'var(--card)',
                          color: formatsModal.selectedType === 'thumbnail' ? '#fff' : 'var(--text)',
                          border: '1px solid ' + (formatsModal.selectedType === 'thumbnail' ? 'var(--accent)' : 'var(--border)')
                        }}
                      >
                        🖼️ Imagen
                      </button>
                    </div>
                  </div>
                  
                  {/* Columna derecha: Formatos/Calidades */}
                  <div>
                    <div style={{fontWeight:600, marginBottom:12}}>
                      {formatsModal.selectedType === 'video' && 'Calidad de video'}
                      {formatsModal.selectedType === 'audio' && 'Calidad de audio'}
                      {formatsModal.selectedType === 'thumbnail' && 'Miniaturas disponibles'}
                    </div>
                    
                    {formatsModal.selectedType === 'thumbnail' ? (
                      <div className="muted small">
                        <p>Las miniaturas se descargan automáticamente con el video.</p>
                        <p>También puedes hacer click derecho en la imagen del resultado y seleccionar "Guardar imagen como..."</p>
                      </div>
                    ) : (
                      <div style={{display:'grid', gap:8, maxHeight:'400px', overflow:'auto'}}>
                        {(() => {
                          const filteredFormats = formatsModal.formats.filter(f => {
                            if (formatsModal.selectedType === 'audio') {
                              return f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none');
                            } else {
                              // video: mostrar formatos con video
                              const hasFFmpeg = health?.ffmpeg?.available;
                              if (hasFFmpeg) {
                                // Con ffmpeg: mostrar todos los formatos de video
                                return f.vcodec && f.vcodec !== 'none';
                              } else {
                                // Sin ffmpeg: solo formatos que ya tienen audio incluido
                                return f.vcodec && f.vcodec !== 'none' && f.acodec && f.acodec !== 'none';
                              }
                            }
                          });
                          
                          // Ordenar por calidad (altura descendente para video, aproximación para audio)
                          const sorted = filteredFormats.sort((a, b) => {
                            if (formatsModal.selectedType === 'video') {
                              return (b.height || 0) - (a.height || 0);
                            } else {
                              // Para audio, ordenar por tamaño aprox
                              return (b.size || 0) - (a.size || 0);
                            }
                          });
                          
                          return sorted.map((f, idx) => (
                            <div key={idx} style={{display:'flex', alignItems:'center', justifyContent:'space-between', border:'1px solid var(--border)', padding:10, borderRadius:8, background:'var(--bg)'}}>
                              <div style={{flex:1}}>
                                <div style={{fontWeight:600}}>
                                  {formatsModal.selectedType === 'video' && f.height ? `${f.height}p` : ''}
                                  {formatsModal.selectedType === 'video' && !f.height ? f.format_note || f.ext : ''}
                                  {formatsModal.selectedType === 'audio' && (f.format_note || f.ext || 'Audio')}
                                  {f.fps ? ` ${f.fps}fps` : ''}
                                </div>
                                <div className="muted small">
                                  {f.ext ? `${f.ext.toUpperCase()}` : ''}
                                  {f.size ? ` • ${formatBytes(f.size)}` : ''}
                                  {formatsModal.selectedType === 'video' && f.vcodec ? ` • ${f.vcodec}` : ''}
                                  {f.acodec && f.acodec !== 'none' ? ` • ${f.acodec}` : ''}
                                  {formatsModal.selectedType === 'video' && (!f.acodec || f.acodec === 'none') && !health?.ffmpeg?.available ? ' • ⚠️ Sin audio (requiere FFmpeg)' : ''}
                                </div>
                              </div>
                              <div style={{marginLeft:12}}>
                                <button 
                                  onClick={() => startDownloadWithFormat(f, formatsModal.selectedType === 'audio' ? 'audio' : 'video')} 
                                  className={loading ? 'animate-bounce' : ''}
                                >
                                  Descargar
                                </button>
                              </div>
                            </div>
                          ));
                        })()}
                        {formatsModal.formats.filter(f => {
                          if (formatsModal.selectedType === 'audio') {
                            return f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none');
                          } else {
                            const hasFFmpeg = health?.ffmpeg?.available;
                            if (hasFFmpeg) {
                              return f.vcodec && f.vcodec !== 'none';
                            } else {
                              return f.vcodec && f.vcodec !== 'none' && f.acodec && f.acodec !== 'none';
                            }
                          }
                        }).length === 0 && (
                          <div className="muted small" style={{padding:12}}>
                            {formatsModal.selectedType === 'audio' ? 'No hay formatos de audio disponibles.' : 'No hay formatos de video disponibles.'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      

      <footer className="footer">
        <span>
          Así es <a href="/landing.html" target="_self" rel="noreferrer">Y2Back</a> v3.1.0 - Desarrollado por DavidValSep de <a href="https://susitio.cl/" target="_blank" rel="noreferrer">SuSitio</a>
        </span>
      </footer>
      {/* Toasts */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`} role="status">
            <div>
              <div className="title">{t.title}</div>
              {t.text && <div className="text">{t.text}</div>}
            </div>
            <button className="close" onClick={() => removeToast(t.id)} aria-label="Cerrar">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
