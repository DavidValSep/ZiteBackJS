// Gestor de tema y esquema de color
class ThemeManager {
  constructor() {
  this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme();
    // Listener para el botón de tema (solo día/noche)
    setTimeout(() => {
      try {
        const btn = document.getElementById('themeToggle');
        if (btn && !btn.__y2Hooked) {
          btn.addEventListener('click', () => this.toggleTheme());
          btn.__y2Hooked = true;
        }
      } catch {}
    }, 0);
  }

  applyTheme() {
    const html = document.documentElement;
    html.setAttribute('data-theme', this.currentTheme);
    // Compat con clases "dark" si alguna vez usamos Tailwind
    if (this.currentTheme === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.saveAndApply();
  }

  saveAndApply() {
    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();
  }
}

window.themeManager = new ThemeManager();
export default window.themeManager;
