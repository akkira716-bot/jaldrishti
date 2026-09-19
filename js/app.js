/**
 * JALDRISHTI - Core Application Orchestrator & Router
 * Manages view transitions, navigation state, station selection,
 * auth modal flows, and global notifications.
 */

window.JalApp = {
  currentView: 'dashboard',
  currentStationId: 'yamuna-delhi',
  currentUser: {
    name: 'Anandhan Akkira',
    role: 'River Basin Officer',
    email: 'anandhan.akkira@jaldrishti.gov.in',
    isLoggedIn: true
  },

  init() {
    this.setupNavigation();
    this.setupStationSelector();
    this.setupAuthModal();
    this.setupMobileMenu();

    // Initialize all feature modules
    if (window.JalDashboard) window.JalDashboard.init();
    if (window.JalMonitoring) window.JalMonitoring.init();
    if (window.JalAIDetection) window.JalAIDetection.init();
    if (window.JalAlerts) window.JalAlerts.init();
    if (window.JalMap) window.JalMap.init();
    if (window.JalReports) window.JalReports.init();
    if (window.JalSettings) window.JalSettings.init();

    // Handle initial route or hash
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`view-${hash}`)) {
      this.navigate(hash);
    } else {
      this.navigate('dashboard');
    }
  },

  setupNavigation() {
    // Desktop Sidebar navigation links
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const view = link.dataset.view;
        if (view) {
          this.navigate(view);
          this.closeMobileSidebar();
        }
      });
    });

    // Mobile bottom navigation items
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const view = btn.dataset.view;
        if (view) this.navigate(view);
      });
    });
  },

  navigate(viewName) {
    const targetViewEl = document.getElementById(`view-${viewName}`);
    if (!targetViewEl) return;

    this.currentView = viewName;
    window.location.hash = viewName;

    // Update active view visibility
    document.querySelectorAll('.view-container').forEach(view => {
      view.classList.remove('active');
    });
    targetViewEl.classList.add('active');

    // Update desktop sidebar active link
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Update mobile bottom nav active button
    document.querySelectorAll('.mobile-bottom-nav .mobile-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update Page Header Title
    const titleEl = document.getElementById('current-page-title');
    if (titleEl) {
      const titles = {
        'dashboard': 'Water Safety Command Dashboard',
        'monitoring': 'River Telemetry & Stream Gauges',
        'ai-detection': 'AI River Pollution Vision Scanner',
        'alerts': 'Real-Time Incident Alerts Center',
        'map': 'Geospatial River Basin Map',
        'reports': 'Historical Water Quality & Compliance Reports',
        'settings': 'Platform Settings & Safety Thresholds'
      };
      titleEl.textContent = titles[viewName] || 'JALDRISHTI';
    }

    // Trigger view-specific re-renders
    if (viewName === 'dashboard' && window.JalDashboard) {
      window.JalDashboard.renderDashboard();
    } else if (viewName === 'map' && window.JalMap) {
      setTimeout(() => window.JalMap.initLeafletMap(), 100);
    } else if (viewName === 'alerts' && window.JalAlerts) {
      window.JalAlerts.renderAlerts();
    } else if (viewName === 'reports' && window.JalReports) {
      window.JalReports.renderReportsTable();
    }
  },

  setupStationSelector() {
    const dropdown = document.getElementById('header-station-select');
    if (!dropdown) return;

    // Populate stations
    dropdown.innerHTML = window.JalData.stations.map(st => `
      <option value="${st.id}" ${st.id === this.currentStationId ? 'selected' : ''}>
        ${st.name}
      </option>
    `).join('');

    dropdown.addEventListener('change', (e) => {
      this.setStation(e.target.value);
    });
  },

  setStation(stationId) {
    this.currentStationId = stationId;
    const dropdown = document.getElementById('header-station-select');
    if (dropdown) dropdown.value = stationId;

    if (this.currentView === 'dashboard' && window.JalDashboard) {
      window.JalDashboard.renderDashboard();
    } else if (this.currentView === 'monitoring' && window.JalMonitoring) {
      window.JalMonitoring.renderStationsGrid();
    }
  },

  getCurrentStation() {
    return window.JalData.stations.find(s => s.id === this.currentStationId) || window.JalData.stations[0];
  },

  selectAndInspect(stationId) {
    this.setStation(stationId);
    this.navigate('dashboard');
  },

  viewOnMap(stationId) {
    this.navigate('map');
    setTimeout(() => {
      if (window.JalMap) window.JalMap.selectStationOnMap(stationId);
    }, 200);
  },

  setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (toggleBtn && sidebar && backdrop) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        backdrop.classList.toggle('active');
      });

      backdrop.addEventListener('click', () => {
        this.closeMobileSidebar();
      });
    }
  },

  closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
  },

  setupAuthModal() {
    const modal = document.getElementById('auth-modal');
    const openBtn = document.getElementById('open-auth-btn');
    const closeBtn = document.getElementById('close-auth-modal');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    // Switch between Login and Register tabs
    const tabLogin = document.getElementById('tab-btn-login');
    const tabRegister = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    if (tabLogin && tabRegister && formLogin && formRegister) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
      });

      tabRegister.addEventListener('click', () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formLogin.style.display = 'none';
        formRegister.style.display = 'block';
      });

      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.remove('active');
        this.showToast('Logged in successfully as Field Officer.', 'safe');
      });

      formRegister.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.remove('active');
        this.showToast('Account registered successfully. Welcome to JALDRISHTI!', 'safe');
      });
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let iconSvg = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    `;

    if (type === 'safe') {
      toast.style.borderColor = 'var(--status-safe)';
      toast.style.color = 'var(--status-safe)';
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      `;
    } else if (type === 'danger') {
      toast.style.borderColor = 'var(--status-danger)';
      toast.style.color = 'var(--status-danger)';
      iconSvg = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
          <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
    } else if (type === 'warning') {
      toast.style.borderColor = 'var(--status-warning)';
      toast.style.color = 'var(--status-warning)';
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-message" style="color:var(--text-primary);">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }
};

// Start application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.JalApp.init();
});
