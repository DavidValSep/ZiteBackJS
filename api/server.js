// Y2Back API - Descargas con cola y streaming de logs (SSE)
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');
const archiver = require('archiver');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Detección de yt-dlp (con cache en memoria)
let YTDLP_CMD = null; // 'yt-dlp' | 'python -m yt_dlp' | 'C:\\...\\yt-dlp.exe' | null
let YTDLP_VERSION = null;
function detectYtDlp() {
  if (YTDLP_CMD) return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
  try {
    // 0) Variable de entorno (preferida si está definida)
    const envPath = (process.env.YTDLP_PATH || process.env.Y2B_YTDLP || '').trim();
    if (envPath) {
      try {
        const val = envPath.replace(/^"|"$/g, ''); // quitar comillas si vienen
        const { spawnSync } = require('child_process');
        let base = val;
        let pre = [];
        if (base === 'python -m yt_dlp' || /^python(\.exe)?\s+-m\s+yt_?dlp$/i.test(base)) {
          const parts = base.split(/\s+/).filter(Boolean);
          base = parts.shift();
          pre = parts;
        }
        const r = spawnSync(base, [...pre, '--version'], { shell: false, windowsHide: true, encoding: 'utf8' });
        if ((r.status === 0 || r.status === null) && typeof r.stdout === 'string') {
          YTDLP_CMD = envPath;
          YTDLP_VERSION = r.stdout.trim() || null;
          return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
        }
      } catch (_) { /* ignorar y continuar con detección */ }
    }
    // 1) Ejecutable local junto al proyecto
    // Detectar plataforma y buscar binario correspondiente
    const isMac = process.platform === 'darwin';
    const isWin = process.platform === 'win32';
    
    // Windows
    if (isWin) {
      const localExe = path.join(__dirname, '..', 'yt-dlp.exe');
      if (fs.existsSync(localExe)) {
        const { spawnSync } = require('child_process');
        const r = spawnSync(localExe, ['--version'], { shell: true, windowsHide: true });
        if (r.status === 0) {
          YTDLP_CMD = localExe;
          YTDLP_VERSION = String(r.stdout || '').toString().trim() || null;
          return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
        }
      }
    }
    
    // macOS
    if (isMac) {
      const localMac = path.join(__dirname, '..', 'yt-dlp_macos');
      if (fs.existsSync(localMac)) {
        const { spawnSync } = require('child_process');
        const r = spawnSync(localMac, ['--version'], { shell: false });
        if (r.status === 0) {
          YTDLP_CMD = localMac;
          YTDLP_VERSION = String(r.stdout || '').toString().trim() || null;
          return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
        }
      }
    }
    
    // Linux (sin extensión)
    const localLinux = path.join(__dirname, '..', 'yt-dlp');
    if (fs.existsSync(localLinux)) {
      const { spawnSync } = require('child_process');
      const r = spawnSync(localLinux, ['--version'], { shell: false });
      if (r.status === 0) {
        YTDLP_CMD = localLinux;
        YTDLP_VERSION = String(r.stdout || '').toString().trim() || null;
        return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
      }
    }
    
    // 2) yt-dlp en PATH
    const { spawnSync } = require('child_process');
    let r = spawnSync('yt-dlp', ['--version'], { shell: true, windowsHide: true });
    if (r.status === 0) {
      // Intentar resolver ruta absoluta con 'where'
      try {
        const wr = spawnSync(process.env.COMSPEC || 'cmd.exe', ['/d','/s','/c','where yt-dlp'], { shell: false, windowsHide: true, encoding: 'utf8' });
        const out = (wr.stdout || '').toString().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        const exe = out.find(p => /yt-dlp\.(exe)$/i.test(p));
        if (exe && fs.existsSync(exe)) {
          YTDLP_CMD = exe; // usar ejecutable real
        } else {
          YTDLP_CMD = 'yt-dlp';
        }
      } catch (_) {
        YTDLP_CMD = 'yt-dlp';
      }
      YTDLP_VERSION = String(r.stdout || '').toString().trim() || null;
      return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
    }
    // 3) python -m yt_dlp
    r = spawnSync('python', ['-m', 'yt_dlp', '--version'], { shell: true, windowsHide: true });
    if (r.status === 0) {
      YTDLP_CMD = 'python -m yt_dlp';
      YTDLP_VERSION = String(r.stdout || '').toString().trim() || null;
      return { cmd: YTDLP_CMD, version: YTDLP_VERSION };
    }
  } catch (_) {}

  // Al finalizar el proceso, intentar matar descendencia (yt-dlp/ffmpeg) y cerrar SSE
  const gracefulShutdown = (why) => {
    try {
      for (const job of jobs.values()) {
        try {
          job.canceled = true;
          if (job.child && !job.child.killed) {
            try { job.child.kill('SIGTERM'); } catch (_) {}
            if (process.platform === 'win32' && job.child.pid) {
              try { spawn('taskkill', ['/PID', String(job.child.pid), '/T', '/F'], { windowsHide: true }); } catch (_) {}
            } else {
              try { job.child.kill('SIGKILL'); } catch (_) {}
            }
          }
          job.child = null;
          job.status = job.status === 'done' ? job.status : 'canceled';
          for (const r of job.subscribers) { try { r.end(); } catch (_) {} }
          job.subscribers.clear();
        } catch (_) {}
      }
    } catch (_) {}
  };
  process.on('SIGINT', () => { gracefulShutdown('SIGINT'); process.exit(0); });
  process.on('SIGTERM', () => { gracefulShutdown('SIGTERM'); process.exit(0); });
  process.on('exit', () => { gracefulShutdown('exit'); });
  YTDLP_CMD = null;
  YTDLP_VERSION = null;
  return { cmd: null, version: null };
}

// Detección de FFmpeg (para combinar video+audio)
let FFMPEG_AVAILABLE = null;
let FFMPEG_CMD = null;
let FFMPEG_VERSION = null;
function detectFfmpeg(refresh = false) {
  if (!refresh && FFMPEG_AVAILABLE !== null) return FFMPEG_AVAILABLE;
  const { spawnSync } = require('child_process');
  try {
    // 0) Variable de entorno
    const envPath = (process.env.FFMPEG_PATH || process.env.Y2B_FFMPEG || '').trim();
    if (envPath) {
      try {
        const val = envPath.replace(/^"|"$/g, '');
        const r = spawnSync(val, ['-version'], { shell: false, windowsHide: true, encoding: 'utf8' });
        if (r.status === 0) {
          FFMPEG_AVAILABLE = true; FFMPEG_CMD = val; FFMPEG_VERSION = (r.stdout || '').split('\n')[0] || '';
          return true;
        }
      } catch (_) { /* continuar */ }
    }
    // 1) Binarios locales según plataforma
    const isMac = process.platform === 'darwin';
    const isWin = process.platform === 'win32';
    
    // Windows
    if (isWin) {
      const localExe = path.join(__dirname, '..', 'ffmpeg.exe');
      if (fs.existsSync(localExe)) {
        const r = spawnSync(localExe, ['-version'], { shell: false, windowsHide: true, encoding: 'utf8' });
        if (r.status === 0) {
          FFMPEG_AVAILABLE = true; FFMPEG_CMD = localExe; FFMPEG_VERSION = (r.stdout || '').split('\n')[0] || '';
          return true;
        }
      }
    }
    
    // macOS
    if (isMac) {
      const localMac = path.join(__dirname, '..', 'ffmpeg_macos');
      if (fs.existsSync(localMac)) {
        const r = spawnSync(localMac, ['-version'], { shell: false, encoding: 'utf8' });
        if (r.status === 0) {
          FFMPEG_AVAILABLE = true; FFMPEG_CMD = localMac; FFMPEG_VERSION = (r.stdout || '').split('\n')[0] || '';
          return true;
        }
      }
    }
    
    // Linux (sin extensión)
    const localLinux = path.join(__dirname, '..', 'ffmpeg');
    if (fs.existsSync(localLinux)) {
      const r = spawnSync(localLinux, ['-version'], { shell: false, encoding: 'utf8' });
      if (r.status === 0) {
        FFMPEG_AVAILABLE = true; FFMPEG_CMD = localLinux; FFMPEG_VERSION = (r.stdout || '').split('\n')[0] || '';
        return true;
      }
    }
    
    // 2) PATH del sistema (Windows/Linux/Mac)
    let r = spawnSync('ffmpeg', ['-version'], { shell: false, windowsHide: true, encoding: 'utf8' });
    if (r.status === 0) {
      // En Windows resolver ruta con 'where'
      try {
        const wr = spawnSync(process.env.COMSPEC || 'cmd.exe', ['/d','/s','/c','where ffmpeg'], { shell: false, windowsHide: true, encoding: 'utf8' });
        const out = (wr.stdout || '').toString().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        const exe = out.find(p => /ffmpeg\.(exe)$/i.test(p)) || 'ffmpeg';
        FFMPEG_CMD = exe;
      } catch (_) {
        FFMPEG_CMD = 'ffmpeg';
      }
      FFMPEG_AVAILABLE = true; FFMPEG_VERSION = (r.stdout || '').split('\n')[0] || '';
      return true;
    }
  } catch (_) {
    // noop
  }
  FFMPEG_AVAILABLE = false; FFMPEG_CMD = null; FFMPEG_VERSION = null;
  return false;
}

// Estado en memoria (suficiente para dev)
const jobs = new Map(); // id -> { id, createdAt, status, kind, url, quality, logs:[], code:null, subscribers:Set, child:null, outputFiles:[] }

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function createApp() {
  const app = express();
  // CORS configurable por entorno para permitir SPA en hosting compartido
  // Variables soportadas: CORS_ORIGINS o Y2B_CORS_ORIGINS (coma separadas). Ej: "https://mi-sitio.com,https://otro.com"
  const ORIGINS_ENV = (process.env.CORS_ORIGINS || process.env.Y2B_CORS_ORIGINS || '*').trim();
  const ALLOWED_ORIGINS = ORIGINS_ENV === '*' ? ['*'] : ORIGINS_ENV.split(',').map(s => s.trim()).filter(Boolean);
  const corsOptions = {
    origin: (origin, cb) => {
      // Permitir herramientas sin origen (curl, postman)
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error('CORS: origin no permitido'), false);
    },
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: false,
    maxAge: 86400
  };
  app.use(cors(corsOptions));
  // Preflight para cualquier ruta
  app.options('*', cors(corsOptions));

  app.use(express.json());

  // Cache simple en memoria para búsquedas rápidas (TTL 60s)
  const searchCache = new Map(); // key: q -> { ts:number, items:Array }

  // Helper: descarga HTML con timeout y headers adecuados
  function fetchHtml(url, timeoutMs = 3500) {
    return new Promise((resolve, reject) => {
      try {
        const u = new URL(url);
        const opts = {
          hostname: u.hostname,
          path: u.pathname + (u.search || ''),
          protocol: u.protocol,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
          }
        };
        const req = https.request(opts, (r) => {
          if ((r.statusCode || 0) >= 300 && (r.statusCode || 0) < 400 && r.headers.location) {
            try {
              // Follow one redirect de forma simple
              return resolve(fetchHtml(new URL(r.headers.location, `${u.protocol}//${u.host}`).toString(), timeoutMs));
            } catch (e) {
              return reject(e);
            }
          }
          let buf = '';
          r.on('data', (c) => { buf += c.toString(); });
          r.on('end', () => resolve(buf));
        });
        req.setTimeout(timeoutMs, () => {
          try { req.destroy(new Error('timeout')); } catch (_) {}
          reject(new Error('timeout'));
        });
        req.on('error', reject);
        req.end();
      } catch (e) {
        reject(e);
      }
    });
  }

  // Helper: oEmbed rápido (sin API key) con timeout
  function fetchOembedQuick(targetUrl, timeoutMs = 1500) {
    return new Promise((resolve, reject) => {
      try {
        const oembedUrl = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(targetUrl);
        const reqOpts = new URL(oembedUrl);
        reqOpts.headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
          'Accept': 'application/json'
        };
        const r = https.get(reqOpts, (resp) => {
          let buf = '';
          resp.on('data', (c) => { buf += c.toString(); });
          resp.on('end', () => {
            try {
              if ((resp.statusCode || 0) >= 200 && (resp.statusCode || 0) < 300) {
                const j = JSON.parse(buf);
                return resolve({
                  id: '',
                  title: j.title,
                  author: j.author_name,
                  duration: '',
                  description: '',
                  thumbnail: j.thumbnail_url,
                  url: targetUrl,
                  formats: []
                });
              }
              return reject(new Error('HTTP ' + (resp.statusCode || 500)));
            } catch (e) {
              return reject(e);
            }
          });
        });
        r.setTimeout(timeoutMs, () => { try { r.destroy(new Error('timeout')); } catch (_) {} reject(new Error('timeout')); });
        r.on('error', reject);
      } catch (e) { reject(e); }
    });
  }

  // Extraer JSON robustamente desde "ytInitialData = {...};" en HTML
  function extractInitialData(html) {
    const marker = 'ytInitialData';
    const i = html.indexOf(marker);
    if (i === -1) throw new Error('ytInitialData no encontrado');
    let j = html.indexOf('{', i);
    if (j === -1) throw new Error('ytInitialData sin objeto');
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let k = j; k < html.length; k++) {
      const ch = html[k];
      if (inStr) {
        if (esc) { esc = false; continue; }
        if (ch === '\\') { esc = true; continue; }
        if (ch === '"') { inStr = false; continue; }
        continue;
      }
      if (ch === '"') { inStr = true; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          const jsonStr = html.slice(j, k + 1);
          return JSON.parse(jsonStr);
        }
      }
    }
    throw new Error('No se pudo cerrar ytInitialData');
  }

  // Navegar el initialData y recoger videoRenderers
  function pickVideosFromInitialData(obj, limit = 20) {
    const out = [];
    function pushVR(vr) {
      try {
        const vid = vr.videoId;
        if (!vid) return;
        const title = (vr.title && Array.isArray(vr.title.runs) && vr.title.runs[0]?.text) || '';
        const author = (vr.ownerText && Array.isArray(vr.ownerText.runs) && vr.ownerText.runs[0]?.text) || '';
        const duration = vr.lengthText?.simpleText || '';
        const thumb = (vr.thumbnail && Array.isArray(vr.thumbnail.thumbnails) && vr.thumbnail.thumbnails.pop()?.url) || '';
        out.push({
          id: vid,
          title,
          author,
          duration,
          thumbnail: thumb,
          viewCount: Number(vr.viewCountText?.simpleText?.replace(/[^0-9]/g, '') || 0) || 0,
          url: `https://www.youtube.com/watch?v=${vid}`
        });
      } catch (_) {}
    }
    try {
      const contents = obj?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
      for (const c of contents) {
        const items = c?.itemSectionRenderer?.contents || [];
        for (const it of items) {
          const vr = it.videoRenderer;
          if (vr) pushVR(vr);
          if (out.length >= limit) return out;
        }
        if (out.length >= limit) break;
      }
    } catch (_) {}
    return out.slice(0, limit);
  }

  async function quickSearchYouTube(q, limit, excludeIdsArr) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}&hl=es&gl=ES`;
    const html = await fetchHtml(url, 3500);
    const initial = extractInitialData(html);
    let items = pickVideosFromInitialData(initial, Math.max(limit, 20));
    if (Array.isArray(excludeIdsArr) && excludeIdsArr.length) {
      const set = new Set(excludeIdsArr);
      items = items.filter(it => it.id && !set.has(it.id));
    }
    return items.slice(0, limit);
  }

  app.get('/api/health', (_req, res) => {
    const { cmd, version } = detectYtDlp();
    // Recalcular FFmpeg (una vez por proceso normalmente, pero para salud es barato)
    detectFfmpeg(true);
    res.json({
      ok: true,
      name: 'Y2Back API',
      port: PORT,
      node_env: process.env.NODE_ENV || 'development',
      time: new Date().toISOString(),
      yt_dlp: { available: !!cmd, command: cmd, version },
      ffmpeg: { available: !!FFMPEG_CMD, command: FFMPEG_CMD, version: FFMPEG_VERSION }
    });
  });

  app.get('/api/info', (_req, res) => {
    res.json({ 
      port: PORT,
      node_env: process.env.NODE_ENV || 'development',
      version: '3.1.0'
    });
  });

  // Iniciar descarga
  app.post('/api/download', (req, res) => {
    const { url, kind = 'video', quality, format } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ ok: false, error: 'Falta parámetro url' });
    }

    // Mapear kind a flags del CLI
    let modeFlag = '--video';
    if (kind === 'audio' || kind === 'music') modeFlag = '--music';
    else if (kind === 'todo' || kind === 'all') modeFlag = '--all';

    const id = makeId();
    const job = {
      id,
      createdAt: Date.now(),
      status: 'running',
      canceled: false,
      kind,
      url,
      quality: quality || null,
      logs: [],
      code: null,
      subscribers: new Set(),
      child: null,
      outputFiles: [],
    };
    jobs.set(id, job);

    // Descarga directa con yt-dlp (preferida para fiabilidad)
    function runAttempt(pass) {
      const det = detectYtDlp();
      if (!det.cmd) {
        job.status = 'error';
        job.code = -127;
        for (const res of job.subscribers) { try { res.write(`data: ${JSON.stringify({ type: 'done', ok: false, code: -127, error: 'yt-dlp no encontrado' })}\n\n`); res.end(); } catch (_) {} }
        job.subscribers.clear();
        return;
      }
      const outBase = path.join(__dirname, '..', 'medios', job.kind === 'music' ? 'Music' : 'Video');
      try { fs.mkdirSync(outBase, { recursive: true }); } catch (_) {}
  const outTpl = path.join(outBase, '%(title)s.%(ext)s');
      const yargs = ['--progress', '--newline', '--no-color'];
      if (job.kind === 'music') {
        yargs.push('-f', 'bestaudio');
        if (format && typeof format === 'string') {
          // intentar extraer audio sólo si existe ffmpeg; si no, dejar el contenedor nativo
          // yargs.push('-x', '--audio-format', format); // opcional: desactivado para evitar fallos
        }
      } else {
        // Preferir flujo con audio + video. Si hay ffmpeg, combinamos; si no, elegir progresivo con audio.
        const sel = quality && quality !== 'auto' ? String(quality).replace(/[^0-9]/g, '') : '';
        const hasFfmpeg = detectFfmpeg();
        if (hasFfmpeg) {
          const bestSel = sel ? `bv*+ba/b[height<=${sel}][acodec!=none]/b[acodec!=none]/best` : 'bv*+ba/b[height<=1080][acodec!=none]/b[acodec!=none]/best';
          yargs.push('-f', bestSel);
          // Sugerir contenedor final si el usuario eligió formato mp4/mkv/webm
          if (format && /^(mp4|mkv|webm)$/i.test(String(format))) {
            yargs.push('--merge-output-format', String(format).toLowerCase());
          }
        } else {
          // Sin ffmpeg: elegir un formato único que incluya audio
          const progSel = sel
            ? `b[height<=${sel}][acodec!=none]/b[acodec!=none]/best`
            : 'b[height<=1080][acodec!=none]/b[acodec!=none]/best';
          yargs.push('-f', progSel);
        }
      }
      yargs.push('-o', outTpl, url);

      // Preparar comando de forma segura (evitar shell para no romper paths/plantillas)
      let baseCmd = det.cmd || 'yt-dlp';
      let preArgs = [];
      // Solo dividir cuando usamos 'python -m yt_dlp';
      // si es una ruta absoluta al .exe con espacios, NO dividir el path.
      if (baseCmd === 'python -m yt_dlp' || /^python(\.exe)?\s+-m\s+yt_?dlp$/i.test(baseCmd)) {
        const parts = baseCmd.split(/\s+/).filter(Boolean);
        baseCmd = parts.shift();
        preArgs = parts; // e.g., ['-m','yt_dlp']
      }
      const finalArgs = [...preArgs, ...yargs];

      const child = spawn(baseCmd, finalArgs, {
        cwd: path.join(__dirname, '..'),
        shell: false,
        windowsHide: true,
      });
      job.child = child;

      // Emitir evento de archivo listo y registrar en job.outputFiles
      function fileDone(absPath) {
        try {
          const abs = path.resolve(absPath);
          if (!fs.existsSync(abs)) return;
          const rel = path.relative(path.join(__dirname, '..'), abs);
          const size = fs.statSync(abs).size;
          if (!job.outputFiles.find(f => f.abs === abs)) {
            job.outputFiles.push({ abs, rel, size });
          }
          const index = job.outputFiles.findIndex(f => f.abs === abs);
          const payload = { type: 'file', index, name: path.basename(abs), sizeBytes: size };
          for (const res of job.subscribers) {
            try { res.write(`data: ${JSON.stringify(payload)}\n\n`); } catch (_) {}
          }
        } catch (_) {}
      }

      let lastDest = null; // ruta más reciente reportada por yt-dlp

      const pushLog = (line) => {
        const msg = String(line);
        job.logs.push(msg);
        // Heurística: capturar rutas de archivo generadas por y2back/yt-dlp
        try {
          const m = msg.match(/(?:medios|media)[\\\/]([^\n\r]+\.(?:mp4|webm|mkv|mp3|m4a|wav|ogg|opus|webp|jpg|png))/i);
          if (m) {
            const rel = m[0].replace(/^[^A-Za-z0-9._\-\\\/]+/, '');
            const abs = path.isAbsolute(rel) ? rel : path.join(__dirname, '..', rel);
            if (!job.outputFiles.find(f => f.abs === abs)) {
              job.outputFiles.push({ abs, rel });
            }
          }

          // Detectar rutas candidatas
          const dest = msg.match(/\[download\]\s+Destination:\s+(.+?\.(mp4|webm|mkv|mp3|m4a|wav|ogg|opus))/i);
          if (dest && dest[1]) {
            const p = dest[1].replace(/["']/g, '').trim();
            // Guardar como candidato; se confirmará al terminar (100%) o si ya existe
            lastDest = path.isAbsolute(p) ? p : path.join(path.join(__dirname, '..'), p);
            if (fs.existsSync(lastDest) && fs.statSync(lastDest).size > 0) {
              fileDone(lastDest);
            }
          }
          const merge = msg.match(/Merging formats into\s+"(.+?\.(mp4|webm|mkv))"/i);
          if (merge && merge[1]) {
            const p = merge[1];
            const abs = path.isAbsolute(p) ? p : path.join(path.join(__dirname, '..'), p);
            // Esperar un instante y confirmar tamaño
            setTimeout(() => { try { fileDone(abs); } catch(_) {} }, 200);
          }
          const extract = msg.match(/\[ExtractAudio\].*Destination:\s+(.+?\.(mp3|m4a|ogg|opus|wav))/i);
          if (extract && extract[1]) {
            const p = extract[1];
            const abs = path.isAbsolute(p) ? p : path.join(path.join(__dirname, '..'), p);
            setTimeout(() => { try { fileDone(abs); } catch(_) {} }, 200);
          }
          const already = /has already been downloaded/i.test(msg);
          const at100 = /\[download\]\s+100%/i.test(msg);
          if (at100 && lastDest) {
            const cand = lastDest; lastDest = null;
            setTimeout(() => { try { fileDone(cand); } catch(_) {} }, 200);
          }
          // Progreso: [download]  12.3% of  2.21MiB at ...
          const p = msg.match(/\[download\]\s+(\d{1,3}(?:\.\d+)?)%\s+of\s+([0-9.,]+)\s*([KMG]?i?B)/i) || msg.match(/\[download\]\s+(\d{1,3}(?:\.\d+)?)%/);
          if (p) {
            const percent = Math.min(100, Math.max(0, Number(p[1])));
            let totalBytes = null;
            let downloadedBytes = null;
            // Si hay tamaño total, convertir a bytes
            if (p.length >= 4) {
              const n = Number(String(p[2]).replace(',', '.'));
              const unit = String(p[3]).toUpperCase();
              const unitMap = { B: 1, KB: 1000, KIB: 1024, MB: 1000**2, MIB: 1024**2, GB: 1000**3, GIB: 1024**3 };
              const mul = unitMap[unit] || 1;
              totalBytes = Math.round(n * mul);
              downloadedBytes = Math.round(totalBytes * (percent / 100));
            }
            job.progress = percent;
            if (totalBytes != null) {
              job.totalBytes = totalBytes;
              job.downloadedBytes = downloadedBytes;
            }
            const evt = { type: 'progress', value: percent };
            if (totalBytes != null) Object.assign(evt, { totalBytes, downloadedBytes });
            for (const res of job.subscribers) {
              try { res.write(`data: ${JSON.stringify(evt)}\n\n`); } catch (_) {}
            }
          }
        } catch (_) {}
        for (const res of job.subscribers) {
          try { res.write(`data: ${JSON.stringify({ type: 'log', data: msg })}\n\n`); } catch (_) {}
        }
      };

      child.stdout.on('data', (d) => pushLog(d.toString()));
      child.stderr.on('data', (d) => pushLog(d.toString()));

      // Log de diagnóstico inicial (comando, args y plantilla de salida)
      try {
        const diag = `\n[diag] cmd: ${baseCmd}\n[diag] preArgs: ${JSON.stringify(preArgs)}\n[diag] args: ${JSON.stringify(yargs)}\n[diag] outTpl: ${outTpl}\n`;
        pushLog(diag);
      } catch (_) {}

      child.on('error', (err) => {
        try { pushLog(`\n[error] spawn: ${err && err.message ? err.message : String(err)}`); } catch(_){}
        if (job.canceled) return; // si se canceló, no reportar error
        job.status = 'error';
        job.code = -2;
        for (const res of job.subscribers) {
          try { res.write(`data: ${JSON.stringify({ type: 'done', ok: false, code: -2, error: 'spawn-error' })}\n\n`); res.end(); } catch (_) {}
        }
        job.subscribers.clear();
      });

      child.on('exit', async (code) => {
        if (job.canceled) {
          // Cancelado: no reintentar, no reportar más
          return;
        }
        if (code === 0) {
          job.status = 'done';
          job.code = 0;
          // Completar metadatos de archivos
          try {
            job.outputFiles = job.outputFiles
              .filter(f => f && f.abs && fs.existsSync(f.abs))
              .map(f => ({ ...f, size: fs.statSync(f.abs).size }));
            // Si no logramos detectar, escanear "medios" por archivos recientes
            if (!job.outputFiles.length) {
              const mediaRoot = path.join(__dirname, '..', 'medios');
              const exts = new Set(['.mp4','.webm','.mkv','.mp3','.m4a','.wav','.ogg','.opus']);
              const picked = [];
              const since = job.createdAt - 5000;
              const walk = (dir) => {
                try {
                  for (const n of fs.readdirSync(dir)) {
                    const full = path.join(dir, n);
                    const st = fs.statSync(full);
                    if (st.isDirectory()) { walk(full); continue; }
                    if (!exts.has(path.extname(full).toLowerCase())) continue;
                    if (st.mtimeMs >= since) picked.push({ abs: full, rel: path.relative(path.join(__dirname, '..'), full), size: st.size });
                  }
                } catch (_) {}
              };
              if (fs.existsSync(mediaRoot)) walk(mediaRoot);
              // quedarse con los más recientes (máx 3)
              picked.sort((a,b) => (b.size||0) - (a.size||0));
              job.outputFiles = picked.slice(0, 3);
            }
          } catch (_) {}
          for (const res of job.subscribers) {
            try { res.write(`data: ${JSON.stringify({ type: 'done', ok: true })}\n\n`); res.end(); } catch (_) {}
          }
          job.subscribers.clear();
        } else if (pass === 1) {
          // Reintento con "best" (para selector de calidad demasiado alto)
          pushLog('\n⚠️ Primer intento falló. Reintentando con calidad "best"...');
          runAttempt(2);
        } else {
          job.status = 'error';
          job.code = code ?? -1;
          for (const res of job.subscribers) {
            try { res.write(`data: ${JSON.stringify({ type: 'done', ok: false, code })}\n\n`); res.end(); } catch (_) {}
          }
          job.subscribers.clear();
        }
      });
    }

    runAttempt(1);
    res.json({ ok: true, jobId: id });
  });

  // Estado simple
  app.get('/api/jobs/:id', (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).json({ ok: false, error: 'No existe' });
    res.json({ ok: true, id: job.id, status: job.status, code: job.code });
  });

  // Cancelar un job (mata el proceso)
  app.post('/api/jobs/:id/cancel', (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).json({ ok: false, error: 'No existe' });
    try {
      job.canceled = true;
      if (job.child && !job.child.killed) {
        try { job.child.kill('SIGTERM'); } catch (_) {}
        // Windows: matar árbol de procesos (yt-dlp -> ffmpeg)
        if (process.platform === 'win32' && job.child.pid) {
          try { spawn('taskkill', ['/PID', String(job.child.pid), '/T', '/F'], { windowsHide: true }); } catch (_) {}
        } else {
          try { job.child.kill('SIGKILL'); } catch (_) {}
        }
      }
      job.child = null;
      job.status = 'canceled';
      // Notificar a suscriptores y cerrar SSE
      for (const r of job.subscribers) {
        try { r.write(`data: ${JSON.stringify({ type: 'done', ok: false, code: 'canceled' })}\n\n`); r.end(); } catch (_) {}
      }
      job.subscribers.clear();
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ ok: false, error: e.message });
    }
  });

  // Cancelar todos los jobs en curso (mata procesos)
  app.post('/api/jobs/cancel-all', (req, res) => {
    let count = 0;
    for (const job of jobs.values()) {
      try {
        if (job && job.status === 'running' && job.child && !job.child.killed) {
          job.canceled = true;
          try { job.child.kill('SIGTERM'); } catch (_) {}
          if (process.platform === 'win32' && job.child.pid) {
            try { spawn('taskkill', ['/PID', String(job.child.pid), '/T', '/F'], { windowsHide: true }); } catch (_) {}
          } else {
            try { job.child.kill('SIGKILL'); } catch (_) {}
          }
          job.child = null;
          job.status = 'canceled';
          for (const r of job.subscribers) {
            try { r.write(`data: ${JSON.stringify({ type: 'done', ok: false, code: 'canceled' })}\n\n`); r.end(); } catch (_) {}
          }
          job.subscribers.clear();
          count++;
        }
      } catch (_) {}
    }
    return res.json({ ok: true, canceled: count });
  });

  // Listar completados (nombre + tamaño) — incluye jobs en curso con archivos ya listos
  app.get('/api/completed', (_req, res) => {
    const items = [];
    for (const job of jobs.values()) {
      if (Array.isArray(job.outputFiles) && job.outputFiles.length) {
        // Exponer por índice
        items.push({
          jobId: job.id,
          files: job.outputFiles.map((f, idx) => ({
            index: idx,
            name: path.basename(f.abs),
            sizeBytes: f.size || 0
          }))
        });
      }
    }
    res.json({ ok: true, items });
  });

  // Streaming seguro del archivo (con soporte de rangos para HTML5 video/audio)
  app.get('/api/jobs/:id/files/:index', (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).end();
    const idx = Number(req.params.index || 0);
    const f = (job.outputFiles || [])[idx];
    if (!f || !f.abs || !fs.existsSync(f.abs)) return res.status(404).end();

    const filePath = f.abs;
    const stat = fs.statSync(filePath);
    const range = req.headers.range;

    const mime = (() => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.mp4') return 'video/mp4';
      if (ext === '.webm') return 'video/webm';
      if (ext === '.mkv') return 'video/x-matroska';
      if (ext === '.mp3') return 'audio/mpeg';
      if (ext === '.m4a') return 'audio/mp4';
      if (ext === '.ogg' || ext === '.opus') return 'audio/ogg';
      return 'application/octet-stream';
    })();

  if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      if (isNaN(start) || isNaN(end) || start > end) return res.status(416).end();
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mime,
        'Cache-Control': 'no-store'
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      const wantDownload = String(req.query.dl || req.query.download || '').toLowerCase() === '1' || String(req.query.dl || '').toLowerCase() === 'true';
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': mime,
        'Cache-Control': 'no-store',
        'Content-Disposition': `${wantDownload ? 'attachment' : 'inline'}; filename*=UTF-8''${encodeURIComponent(path.basename(filePath))}`
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });

  // Descargar todos los archivos de un job como ZIP
  app.get('/api/jobs/:id/archive.zip', (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).json({ ok: false, error: 'No existe' });
    const files = (job.outputFiles || []).filter(f => f && f.abs && fs.existsSync(f.abs));
    if (!files.length) return res.status(404).json({ ok: false, error: 'Sin archivos listos' });

    const zipName = `y2back-${job.id}.zip`;
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(zipName)}`,
      'Cache-Control': 'no-store'
    });

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => { try { res.destroy(err); } catch (_) {} });
    archive.pipe(res);
    for (const f of files) {
      try {
        const name = path.basename(f.abs);
        archive.file(f.abs, { name });
      } catch (_) {}
    }
    archive.finalize();
  });

  // Búsqueda optimizada: RACE entre HTML (ytInitialData) y yt-dlp, con tope global ~5s
  app.get('/api/search', async (req, res) => {
    const q = String(req.query.q || '').trim();
    const count = Math.max(1, Math.min(60, Number(req.query.count || 12)));
    const page = Math.max(0, Number(req.query.page || 0));
    const excludeIds = (() => {
      try { return Array.isArray(req.query.excludeIds) ? req.query.excludeIds : (req.query.excludeIds ? String(req.query.excludeIds).split(',') : []); } catch { return []; }
    })();
  if (!q) return res.status(400).json({ ok: false, error: 'falta q' });
  if (q.length < 3) return res.status(400).json({ ok: false, error: 'mínimo 3 caracteres' });
    const now = Date.now();
    const TTL = 60_000;
    const cacheHit = page === 0 ? searchCache.get(q) : null;

    if (cacheHit && (now - cacheHit.ts) < TTL) {
      const filtered = cacheHit.items.filter(it => !excludeIds.includes(it.id));
      const slice = filtered.slice(0, count);
      return res.json({ ok: true, items: slice, page, count, total: filtered.length, cache: true });
    }

    const det = detectYtDlp();

    // Página >0: sólo yt-dlp con timeout duro, para paginar correctamente
    if (page > 0) {
      if (!det.cmd) return res.json({ ok: true, items: [], page, count, total: 0, warn: 'yt-dlp no disponible' });
      const effective = count * (page + 1);
      const yargs = ['-J', `ytsearch${effective}:${q}`];
      let yout = '';
      let yerr = '';
      let responded = false;
      // Spawn robusto para búsqueda paginada
      let searchCmd = det.cmd || 'yt-dlp';
      let searchPre = [];
      if (searchCmd === 'python -m yt_dlp' || /^python(\.exe)?\s+-m\s+yt_?dlp$/i.test(searchCmd)) {
        const parts = searchCmd.split(/\s+/).filter(Boolean);
        searchCmd = parts.shift();
        searchPre = parts;
      }
      const y = spawn(searchCmd, [...searchPre, ...yargs], { cwd: path.join(__dirname, '..'), shell: false, windowsHide: true });
      const timer = setTimeout(() => {
        if (responded) return;
        responded = true;
        try { y.kill('SIGTERM'); } catch (_) {}
        return res.json({ ok: true, items: [], page, count, total: 0, warn: 'timeout' });
      }, 4500);
      y.stdout.on('data', (d) => { yout += d.toString(); });
      y.stderr.on('data', (d) => { yerr += d.toString(); });
      return y.on('close', () => {
        if (responded) return;
        clearTimeout(timer);
        try {
          const json = JSON.parse(yout || '{}');
          let items = Array.isArray(json.entries) ? json.entries : [];
          items = items.map((v) => ({
            id: v.id || v.url || v.webpage_url || '',
            title: v.title || '',
            author: v.uploader || v.channel || '',
            duration: v.duration || v.duration_string || '',
            thumbnail: v.thumbnail || (Array.isArray(v.thumbnails) ? v.thumbnails[0]?.url : '') || '',
            viewCount: v.view_count || v.viewCount || 0,
            url: v.webpage_url || (v.id ? `https://www.youtube.com/watch?v=${v.id}` : '')
          }));
          const filtered = items.filter(it => it.id && !excludeIds.includes(it.id));
          const start = page * count;
          const slice = filtered.slice(start, start + count);
          responded = true;
          return res.json({ ok: true, items: slice, page, count, total: filtered.length, warn: yerr || undefined });
        } catch (ee) {
          responded = true;
          return res.json({ ok: true, items: [], page, count, total: 0, warn: yerr || ee.message || 'search-failed' });
        }
      });
    }

    // Página 0: correr en paralelo y responder con el primero (<~5s)
    let yProc = null;
    const effective = count; // para primer página basta con count
    const yargs = det.cmd ? ['-J', `ytsearch${effective}:${q}`] : null;

    const ytdlpPromise = new Promise((resolve) => {
      if (!det.cmd || !yargs) return resolve({ ok: true, items: [], warn: 'yt-dlp no disponible', source: 'ytdlp' });
      let yout = '';
      let yerr = '';
      let searchCmd0 = det.cmd || 'yt-dlp';
      let searchPre0 = [];
      if (searchCmd0 === 'python -m yt_dlp' || /^python(\.exe)?\s+-m\s+yt_?dlp$/i.test(searchCmd0)) {
        const parts = searchCmd0.split(/\s+/).filter(Boolean);
        searchCmd0 = parts.shift();
        searchPre0 = parts;
      }
      yProc = spawn(searchCmd0, [...searchPre0, ...yargs], { cwd: path.join(__dirname, '..'), shell: false, windowsHide: true });
      const t = setTimeout(() => {
        try { yProc && yProc.kill('SIGTERM'); } catch (_) {}
        return resolve({ ok: true, items: [], warn: 'timeout', source: 'ytdlp' });
      }, 4500);
      yProc.stdout.on('data', (d) => { yout += d.toString(); });
      yProc.stderr.on('data', (d) => { yerr += d.toString(); });
      yProc.on('close', () => {
        clearTimeout(t);
        try {
          const json = JSON.parse(yout || '{}');
          let items = Array.isArray(json.entries) ? json.entries : [];
          items = items.map((v) => ({
            id: v.id || v.url || v.webpage_url || '',
            title: v.title || '',
            author: v.uploader || v.channel || '',
            duration: v.duration || v.duration_string || '',
            thumbnail: v.thumbnail || (Array.isArray(v.thumbnails) ? v.thumbnails[0]?.url : '') || '',
            viewCount: v.view_count || v.viewCount || 0,
            url: v.webpage_url || (v.id ? `https://www.youtube.com/watch?v=${v.id}` : '')
          }));
          const filtered = items.filter(it => it.id && !excludeIds.includes(it.id));
          const slice = filtered.slice(0, count);
          return resolve({ ok: true, items: slice, page, count, total: filtered.length, warn: yerr || undefined, source: 'ytdlp' });
        } catch (ee) {
          return resolve({ ok: true, items: [], page, count, total: 0, warn: yerr || ee.message || 'search-failed', source: 'ytdlp' });
        }
      });
    });

    const htmlPromise = (async () => {
      try {
        const items = await quickSearchYouTube(q, count, excludeIds);
        searchCache.set(q, { ts: now, items });
        return { ok: true, items, page, count, total: items.length, source: 'html' };
      } catch (e) {
        return { ok: true, items: [], page, count, total: 0, warn: e.message || 'html-failed', source: 'html' };
      }
    })();

    let settled = false;
    const globalTimer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { yProc && yProc.kill('SIGTERM'); } catch (_) {}
      return res.json({ ok: true, items: [], page, count, total: 0, warn: 'timeout' });
    }, 4900);

    try {
      const first = await Promise.race([htmlPromise, ytdlpPromise]);
      if (settled) return; // ya respondimos
      settled = true;
      clearTimeout(globalTimer);
      // Si ganó HTML, matar yt-dlp si sigue
      if (first.source === 'html') {
        try { yProc && yProc.kill('SIGTERM'); } catch (_) {}
      }
      return res.json(first);
    } catch (e) {
      if (!settled) {
        settled = true;
        clearTimeout(globalTimer);
        try { yProc && yProc.kill('SIGTERM'); } catch (_) {}
        return res.json({ ok: true, items: [], page, count, total: 0, warn: e.message || 'search-failed' });
      }
    }
  });

  // Formatos disponibles
  app.get('/api/formats', (req, res) => {
    const targetUrl = String(req.query.url || '').trim();
    if (!targetUrl) return res.status(400).json({ ok: false, error: 'falta url' });
  const det = detectYtDlp();
  if (!det.cmd) return res.status(500).json({ ok: false, error: 'yt-dlp no disponible en PATH ni python -m yt_dlp' });
  const ytdlp = det.cmd;
  // Usar -J para volcar JSON completo con lista de formatos
  const args = ['-J', targetUrl];
    let out = '';
    let err = '';
  // Spawn robusto para /api/formats
  let fmtCmd = ytdlp || 'yt-dlp';
  let fmtPre = [];
  if (fmtCmd === 'python -m yt_dlp' || /^python(\.exe)?\s+-m\s+yt_?dlp$/i.test(fmtCmd)) {
    const parts = fmtCmd.split(/\s+/).filter(Boolean);
    fmtCmd = parts.shift();
    fmtPre = parts;
  }
  const child = spawn(fmtCmd, [...fmtPre, ...args], { cwd: path.join(__dirname, '..'), shell: false, windowsHide: true });
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', (d) => { err += d.toString(); });
    child.on('close', () => {
      try {
        // yt-dlp -j -F emite un JSON; parsear
        const json = JSON.parse(out);
        const fmts = (json.formats || []).map(f => ({
          itag: f.format_id,
          ext: f.ext,
          height: f.height || null,
          fps: f.fps || null,
          vcodec: f.vcodec,
          acodec: f.acodec,
          size: f.filesize || f.filesize_approx || null,
          format_note: f.format_note
        }));
        res.json({ ok: true, formats: fmts });
      } catch (e) {
        res.status(500).json({ ok: false, error: err || e.message, raw: out.slice(0, 5000) });
      }
    });
  });

  // OEmbed de YouTube (sin API key): metadatos de previsualización
  app.get('/api/oembed', (req, res) => {
    const targetUrl = String(req.query.url || '').trim();
    if (!targetUrl) return res.status(400).json({ ok: false, error: 'falta url' });
    const oembedUrl = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent(targetUrl);
    const reqOpts = new URL(oembedUrl);
    reqOpts.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      'Accept': 'application/json'
    };
    https.get(reqOpts, (r) => {
      let buf = '';
      r.on('data', (c) => { buf += c.toString(); });
      r.on('end', () => {
        if (r.statusCode && r.statusCode >= 200 && r.statusCode < 300) {
          try {
            const json = JSON.parse(buf);
            return res.json({ ok: true, data: {
              title: json.title,
              author: json.author_name,
              author_url: json.author_url,
              thumbnail: json.thumbnail_url,
              provider: json.provider_name,
              html: json.html
            }});
          } catch (e) {
            return res.json({ ok: false, error: e.message });
          }
        } else {
          return res.json({ ok: false, error: `HTTP ${r.statusCode || 500}` });
        }
      });
    }).on('error', (e) => {
      return res.json({ ok: false, error: e.message });
    });
  });

  // Forzar corte a nivel sistema (Windows): mata por nombre de imagen
  app.post('/api/system/kill-downloaders', async (req, res) => {
    const result = { ok: true, platform: process.platform, actions: [] };
    if (process.platform === 'win32') {
      const killOne = (image, extra = []) => new Promise((resolve) => {
        try {
          const p = spawn('taskkill', ['/IM', image, '/F', ...extra], { windowsHide: true });
          let out = '', err = '';
          p.stdout.on('data', d => { out += d.toString(); });
          p.stderr.on('data', d => { err += d.toString(); });
          p.on('close', (code) => { result.actions.push({ image, code, out, err }); resolve(); });
        } catch (e) { result.actions.push({ image, error: String(e.message || e) }); resolve(); }
      });
      await killOne('yt-dlp.exe', ['/T']);
      await killOne('ffmpeg.exe', ['/T']);
      // Además, intentar matar procesos hijos registrados en jobs
      for (const job of jobs.values()) {
        try { if (job.child && job.child.pid) spawn('taskkill', ['/PID', String(job.child.pid), '/T', '/F'], { windowsHide: true }); } catch (_) {}
      }
      return res.json(result);
    } else {
      // En Unix-like: intentar pkill
      const execKill = (cmd, args) => new Promise((resolve) => {
        try {
          const p = spawn(cmd, args, { windowsHide: true });
          let out = '', err = '';
          p.stdout.on('data', d => { out += d.toString(); });
          p.stderr.on('data', d => { err += d.toString(); });
          p.on('close', (code) => { result.actions.push({ cmd: [cmd, ...args].join(' '), code, out, err }); resolve(); });
        } catch (e) { result.actions.push({ cmd: [cmd, ...args].join(' '), error: String(e.message || e) }); resolve(); }
      });
      await execKill('pkill', ['-f', 'yt-dlp']);
      await execKill('pkill', ['-f', 'ffmpeg']);
      return res.json(result);
    }
  });

  // Información detallada de un solo video (rápida): yt-dlp -J con timeout
  app.get('/api/info', (req, res) => {
    let target = String(req.query.url || req.query.id || '').trim();
    if (!target) return res.status(400).json({ ok: false, error: 'falta url|id' });
    if (/^[a-zA-Z0-9_-]{11}$/.test(target)) {
      target = `https://www.youtube.com/watch?v=${target}`;
    }
    const det = detectYtDlp();
    if (!det.cmd) {
      return res.status(500).json({ ok: false, error: 'yt-dlp no disponible' });
    }
    const args = ['-J', target];
    let out = '';
    let err = '';
    let responded = false;
    // Spawn robusto (sin shell) respetando 'python -m'
    let infoCmd = det.cmd || 'yt-dlp';
    let infoPre = [];
    if (infoCmd === 'python -m yt_dlp' || /^python(\.exe)?\s+-m\s+yt_?dlp$/i.test(infoCmd)) {
      const parts = infoCmd.split(/\s+/).filter(Boolean);
      infoCmd = parts.shift();
      infoPre = parts;
    }
    const y = spawn(infoCmd, [...infoPre, ...args], { cwd: path.join(__dirname, '..'), shell: false, windowsHide: true });
    const timer = setTimeout(async () => {
      if (responded) return;
      responded = true;
      try { y.kill('SIGTERM'); } catch (_) {}
      try {
        const fallback = await fetchOembedQuick(target, 1500);
        return res.json({ ok: true, info: fallback, warn: 'timeout' });
      } catch (_) {
        return res.json({ ok: true, info: null, warn: 'timeout' });
      }
    }, 4500);
    y.stdout.on('data', (d) => { out += d.toString(); });
    y.stderr.on('data', (d) => { err += d.toString(); });
    y.on('close', () => {
      if (responded) return;
      clearTimeout(timer);
      try {
        const json = JSON.parse(out || '{}');
        const info = {
          id: json.id || '',
          title: json.title || '',
          author: json.uploader || json.channel || '',
          duration: json.duration || json.duration_string || '',
          description: json.description || '',
          thumbnail: json.thumbnail || (Array.isArray(json.thumbnails) ? json.thumbnails.slice(-1)[0]?.url : '') || '',
          url: json.webpage_url || (json.id ? `https://www.youtube.com/watch?v=${json.id}` : target),
          formats: Array.isArray(json.formats) ? json.formats.map(f => ({
            itag: f.format_id,
            ext: f.ext,
            height: f.height || null,
            fps: f.fps || null,
            vcodec: f.vcodec,
            acodec: f.acodec,
            size: f.filesize || f.filesize_approx || null,
            note: f.format_note || f.format || ''
          })) : []
        };
        responded = true;
        return res.json({ ok: true, info, warn: err || undefined });
      } catch (ee) {
        (async () => {
          if (responded) return;
          responded = true;
          try {
            const fallback = await fetchOembedQuick(target, 1500);
            return res.json({ ok: true, info: fallback, warn: err || ee.message || 'parse-failed' });
          } catch (_) {
            return res.json({ ok: false, error: err || ee.message || 'parse-failed' });
          }
        })();
      }
    });
  });

  // Streaming de logs vía SSE
  app.get('/api/jobs/:id/stream', (req, res) => {
    const job = jobs.get(req.params.id);
    if (!job) return res.status(404).end();
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Enviar logs previos
    for (const line of job.logs) {
      res.write(`data: ${JSON.stringify({ type: 'log', data: line })}\n\n`);
    }
    job.subscribers.add(res);

    req.on('close', () => {
      job.subscribers.delete(res);
    });
  });

  // Servir la Web App (Vite build) si existe
  try {
    const distDir = path.join(__dirname, '..', 'web', 'dist');
    if (fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'))) {
      const csp = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "frame-src https://www.youtube.com https://www.youtube.com/embed",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ');

      app.use(express.static(distDir, {
        maxAge: '1h',
        index: 'index.html',
        setHeaders(res) {
          res.setHeader('Content-Security-Policy', csp);
        }
      }));
      // Cualquier ruta no-API sirve la SPA
      app.get(/^(?!\/api\/).*/, (_req, res) => {
        res.setHeader('Content-Security-Policy', csp);
        res.sendFile(path.join(distDir, 'index.html'));
      });
    } else {
      // Mensaje amable si no hay build
      app.get('/', (_req, res) => {
        res.status(200).type('html').send(`<!doctype html>
          <html lang="es"><head><meta charset="utf-8"/>
          <title>Así es Y2Back - API Backend</title>
          <meta name="description" content="Rápido, simple y sin rodeos — Tus contenidos, donde quieras y como quieras."/>
          <style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,"Helvetica Neue",Arial;max-width:720px;margin:40px auto;padding:0 16px;line-height:1.5}code{background:#f5f5f5;padding:2px 6px;border-radius:4px}footer{margin-top:40px;padding-top:20px;border-top:1px solid #e0e0e0;text-align:center;color:#666;font-size:0.9em}a{color:#0066cc;text-decoration:none}a:hover{text-decoration:underline}</style>
          </head><body>
            <h1>Así es Y2Back...</h1>
            <p><strong>Rápido, simple y sin rodeos — Tus contenidos, donde quieras y como quieras.</strong></p>
            <p>El frontend aún no está compilado.</p>
            <ol>
              <li>En otra terminal: <code>npm run web:dev</code> (desarrollo en <a href="http://127.0.0.1:5173" target="_blank">127.0.0.1:5173</a>)</li>
              <li>O construye la web: <code>npm run web:build</code> y vuelve aquí a <a href="/">/</a>.</li>
            </ol>
            <p>Salud: <a href="/api/health">/api/health</a></p>
            <footer>
              Así es <a href="https://susitio.cl/y2back">Y2Back</a> v3.1.0 - Desarrollado por DavidValSep de <a href="https://susitio.cl/">SuSitio</a>
            </footer>
          </body></html>`);
      });
    }
  } catch (_) {
    // Ignorar errores de detección de build
  }

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Y2Back API escuchando en http://127.0.0.1:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`PUERTO CONFIGURADO: ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = { createApp };
