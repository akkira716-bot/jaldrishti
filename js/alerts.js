/**
 * JALDRISHTI - Alerts Management Module
 * Filterable alert center for pollution events, high water level warnings,
 * unsafe water advisories, severity badges, and acknowledgment states.
 */

window.JalAlerts = {
  currentFilter: 'all',

  init() {
    this.renderAlerts();
    this.setupListeners();
    this.updateBadges();
  },

  setupListeners() {
    // Filter pill buttons
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-pill-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.dataset.filter;
        this.renderAlerts();
      });
    });

    // Mark All Acknowledged
    const ackAllBtn = document.getElementById('btn-ack-all');
    if (ackAllBtn) {
      ackAllBtn.addEventListener('click', () => {
        window.JalData.alerts.forEach(a => a.acknowledged = true);
        this.renderAlerts();
        this.updateBadges();
        window.JalApp.showToast('All alerts marked as acknowledged.', 'info');
      });
    }
  },

  renderAlerts() {
    const listContainer = document.getElementById('alerts-feed-container');
    if (!listContainer) return;

    let alerts = window.JalData.alerts;

    // Apply Filter
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'unack') {
        alerts = alerts.filter(a => !a.acknowledged);
      } else {
        alerts = alerts.filter(a => a.severity.toLowerCase() === this.currentFilter.toLowerCase());
      }
    }

    if (alerts.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 3.5rem 1rem; color: var(--text-muted); background: var(--bg-surface-glass); border-radius: var(--radius-lg);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.75rem; opacity:0.5;">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h4 style="color:var(--text-primary); margin-bottom:0.25rem;">No Alerts in this Category</h4>
          <p style="font-size:0.85rem;">All river water sensors are reporting normal parameters or alerts have been resolved.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = alerts.map(alt => {
      const isCritical = alt.severity === 'Critical';
      const isWarning = alt.severity === 'Warning';
      const sevClass = isCritical ? 'badge-danger' : (isWarning ? 'badge-warning' : 'badge-info');

      return `
        <div class="alert-card-detailed ${isCritical ? 'critical' : (isWarning ? 'warning' : '')} ${alt.acknowledged ? 'acknowledged' : ''}">
          <div style="display:flex; align-items:flex-start; gap:1rem; flex:1;">
            <div class="alert-row-icon" style="background:${isCritical ? 'var(--status-danger-bg)' : (isWarning ? 'var(--status-warning-bg)' : 'var(--status-info-bg)')}; color:${isCritical ? 'var(--status-danger)' : (isWarning ? 'var(--status-warning)' : 'var(--status-info)')}; margin-top:2px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.35rem;">
                <span style="font-weight:700; font-size:1.05rem; color:var(--text-primary);">${alt.title}</span>
                <span class="badge ${sevClass}">${alt.severity}</span>
                <span class="badge badge-secondary" style="background:rgba(255,255,255,0.06);">${alt.category}</span>
                ${alt.acknowledged ? '<span class="badge" style="background:rgba(148,163,184,0.15); color:var(--text-muted);">Acknowledged</span>' : ''}
              </div>
              <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:0.5rem; line-height:1.4;">
                ${alt.description}
              </p>
              <div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:1rem;">
                <span>📍 Station: <strong>${alt.stationName}</strong></span>
                <span>⏱ ${alt.time}</span>
              </div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.5rem; flex-shrink:0;">
            ${!alt.acknowledged ? `
              <button class="btn btn-secondary btn-sm" onclick="window.JalAlerts.acknowledgeAlert('${alt.id}')">
                Acknowledge
              </button>
            ` : `
              <button class="btn btn-secondary btn-sm" disabled style="opacity:0.5;">
                Resolved
              </button>
            `}
            <button class="btn btn-primary btn-sm" onclick="window.JalApp.viewOnMap('${alt.stationId}')">
              View on Map
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  acknowledgeAlert(alertId) {
    const alert = window.JalData.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      this.renderAlerts();
      this.updateBadges();
      window.JalApp.showToast(`Alert #${alertId} acknowledged`, 'info');
    }
  },

  updateBadges() {
    const unackCount = window.JalData.alerts.filter(a => !a.acknowledged).length;
    const badgeEl = document.getElementById('nav-alerts-badge');
    if (badgeEl) {
      badgeEl.textContent = unackCount;
      badgeEl.style.display = unackCount > 0 ? 'inline-block' : 'none';
    }
  }
};
