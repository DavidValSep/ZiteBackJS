// Resolución robusta del API_BASE:
// 1) Si viene VITE_API_BASE, lo usamos siempre.
// 2) Si estamos en el navegador y el origen NO es la API (por ejemplo, preview de Vite en 4173/4174),
//    y no hay VITE_API_BASE, asumimos API local en http://127.0.0.1:3000.
// 3) En otros casos, usamos el mismo origen (self) para evitar problemas de CSP.
let resolved = 'http://localhost:3000';
if (typeof window !== 'undefined') {
	const o = window.location.origin;
	const isLocalPreview = /localhost|127\.0\.0\.1/i.test(window.location.hostname) && !/:(3000)(\/|$)/.test(o);
	resolved = isLocalPreview ? 'http://127.0.0.1:3000' : o;
}
export const API_BASE = import.meta.env.VITE_API_BASE || resolved;
