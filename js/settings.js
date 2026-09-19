/**
 * JALDRISHTI - Profile & Settings Module
 * Handles user profile preferences, safety threshold limits,
 * notification channel toggles, and UI theme switching.
 */

window.JalSettings = {
  theme: 'dark',

  init() {
    this.setupListeners();
    this.loadSavedSettings();
  },

  setupListeners() {
    // Theme toggle
    const themeSelect = document.getElementById('setting-theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.setTheme(e.target.value);
      });
    }

    // Threshold Sliders dynamic values
    const phSlider = document.getElementById('setting-threshold-ph');
    const phValDisplay = document.getElementById('threshold-ph-val');
    if (phSlider && phValDisplay) {
      phSlider.addEventListener('input', (e) => {
        phValDisplay.textContent = e.target.value;
      });
    }

    const turbSlider = document.getElementById('setting-threshold-turb');
    const turbValDisplay = document.getElementById('threshold-turb-val');
    if (turbSlider && turbValDisplay) {
      turbSlider.addEventListener('input', (e) => {
        turbValDisplay.textContent = `${e.target.value} NTU`;
      });
    }

    // Save profile form
    const profileForm = document.getElementById('profile-settings-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('setting-user-name');
        const roleInput = document.getElementById('setting-user-role');
        if (nameInput) {
          document.querySelectorAll('.user-name').forEach(el => el.textContent = nameInput.value);
        }
        if (roleInput) {
          document.querySelectorAll('.user-role').forEach(el => el.textContent = roleInput.value);
        }
        window.JalApp.showToast('Profile settings updated successfully.', 'safe');
      });
    }

    // Save threshold form
    const thresholdForm = document.getElementById('threshold-settings-form');
    if (thresholdForm) {
      thresholdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.JalApp.showToast('Safety alert thresholds saved.', 'safe');
      });
    }
  },

  setTheme(newTheme) {
    this.theme = newTheme;
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('jaldrishti_theme', newTheme);
    window.JalApp.showToast(`Theme switched to ${newTheme} mode.`, 'info');
  },

  loadSavedSettings() {
    const savedTheme = localStorage.getItem('jaldrishti_theme') || 'dark';
    const themeSelect = document.getElementById('setting-theme-select');
    if (themeSelect) themeSelect.value = savedTheme;
    this.setTheme(savedTheme);
  }
};
