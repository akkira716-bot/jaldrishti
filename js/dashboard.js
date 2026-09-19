/**
 * JALDRISHTI - Dashboard Module
 * Handles WQI radial dial rendering, telemetry metrics, 
 * interactive SVG trend charts, and real-time station synchronization.
 */

window.JalDashboard = {
  currentChartMetric: 'turbidity',

  init() {
    this.renderDashboard();
    this.setupEventListeners();
  },

  setupEventListeners() {
    // Chart metric tab buttons
    document.querySelectorAll('.chart-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.chart-tab-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentChartMetric = e.currentTarget.dataset.metric;
        this.renderTrendChart();
      });
    });
  },

  renderDashboard() {
    const station = window.JalApp.getCurrentStation();
    if (!station) return;

    // 1. Render WQI Dial
    this.renderWQIDial(station.wqi, station.wqiStatus);

    // 2. Render Station Meta & Risk Level
    const nameEl = document.getElementById('dash-station-name');
    if (nameEl) nameEl.textContent = station.name;

    const locEl = document.getElementById('dash-station-location');
    if (locEl) locEl.textContent = `${station.river} River, ${station.city}, ${station.state}`;

    const riskBadge = document.getElementById('dash-risk-badge');
    if (riskBadge) {
      riskBadge.className = 'risk-level-badge';
      if (station.riskLevel === 'High' || station.riskLevel === 'Critical') {
        riskBadge.classList.add('badge-danger');
        riskBadge.innerHTML = `<span class="pulsing-dot" style="background:#ef4444"></span> Risk: High (${station.riskLevel})`;
      } else if (station.riskLevel === 'Medium') {
        riskBadge.classList.add('badge-warning');
        riskBadge.innerHTML = `<span class="pulsing-dot" style="background:#f59e0b"></span> Risk: Moderate`;
      } else {
        riskBadge.classList.add('badge-safe');
        riskBadge.innerHTML = `<span class="pulsing-dot" style="background:#10b981"></span> Risk: Low (Safe)`;
      }
    }

    // 3. Render 4 Quad Metric Cards
    this.updateMetricCard('metric-water-level', `${station.waterLevel.toFixed(2)}`, 'm', 
      station.waterLevel > (station.waterLevelThreshold - 0.5) ? 'danger' : 'safe',
      `Warn threshold: ${station.waterLevelThreshold}m`);

    this.updateMetricCard('metric-temp', `${station.temperature.toFixed(1)}`, '°C', 'info', 'Seasonal Avg: 26°C');

    this.updateMetricCard('metric-ph', `${station.pH.toFixed(1)}`, 'pH', 
      (station.pH < 6.5 || station.pH > 8.5) ? 'warning' : 'safe',
      'Normal Range: 6.5 - 8.5');

    this.updateMetricCard('metric-turbidity', `${station.turbidity}`, 'NTU', 
      station.turbidity > 30 ? 'warning' : 'safe',
      'Drinking Std: < 5 NTU');

    this.updateMetricCard('metric-do', `${station.dissolvedOxygen.toFixed(1)}`, 'mg/L',
      station.dissolvedOxygen < 4.0 ? 'danger' : 'safe',
      'Min Healthy DO: > 5 mg/L');

    // 4. Render Interactive Chart
    this.renderTrendChart();

    // 5. Render Recent Urgent Alerts
    this.renderRecentAlerts(station.id);
  },

  updateMetricCard(cardId, value, unit, statusType, note) {
    const el = document.getElementById(cardId);
    if (!el) return;
    const valEl = el.querySelector('.metric-value');
    if (valEl) valEl.textContent = value;
    const unitEl = el.querySelector('.metric-unit');
    if (unitEl) unitEl.textContent = unit;
    const noteEl = el.querySelector('.metric-note');
    if (noteEl) noteEl.textContent = note;
  },

  renderWQIDial(wqi, status) {
    const scoreEl = document.getElementById('dash-wqi-score');
    const statusPill = document.getElementById('dash-wqi-pill');
    const circle = document.getElementById('dash-wqi-circle');

    if (scoreEl) scoreEl.textContent = Math.round(wqi);

    // SVG circle circumference: 2 * PI * r (r=78 => ~490)
    const circumference = 2 * Math.PI * 78;
    if (circle) {
      circle.style.strokeDasharray = `${circumference}`;
      const offset = circumference - (wqi / 100) * circumference;
      circle.style.strokeDashoffset = `${offset}`;

      // Color gradation based on WQI
      let strokeColor = '#10b981'; // safe
      if (wqi < 50) {
        strokeColor = '#ef4444'; // poor
      } else if (wqi < 75) {
        strokeColor = '#f59e0b'; // moderate
      }
      circle.style.stroke = strokeColor;
    }

    if (statusPill) {
      statusPill.className = 'wqi-status-pill';
      if (wqi < 50) {
        statusPill.classList.add('badge-danger');
        statusPill.textContent = `${status} Water Quality`;
      } else if (wqi < 75) {
        statusPill.classList.add('badge-warning');
        statusPill.textContent = `${status} Water Quality`;
      } else {
        statusPill.classList.add('badge-safe');
        statusPill.textContent = `${status} Water Quality`;
      }
    }
  },

  renderTrendChart() {
    const svgContainer = document.getElementById('dash-svg-chart');
    if (!svgContainer) return;

    const data = window.JalData.trends24h;
    const metric = this.currentChartMetric;
    const values = data[metric] || data.turbidity;
    const labels = data.labels;

    const width = 600;
    const height = 180;
    const padding = { top: 20, right: 25, bottom: 30, left: 40 };

    const minVal = Math.min(...values) * 0.92;
    const maxVal = Math.max(...values) * 1.08;
    const valRange = maxVal - minVal || 1;

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Calculate coordinate points
    const points = values.map((val, idx) => {
      const x = padding.left + (idx / (values.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - minVal) / valRange) * chartH;
      return { x, y, val, label: labels[idx] };
    });

    const pathD = points.reduce((acc, pt, i) => {
      return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`;

    // Pick color based on metric
    let strokeColor = '#06b6d4';
    if (metric === 'turbidity') strokeColor = '#f59e0b';
    if (metric === 'dissolvedOxygen') strokeColor = '#10b981';
    if (metric === 'pH') strokeColor = '#38bdf8';

    let svgHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="svg-chart" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartFillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${padding.top + chartH/2}" x2="${width - padding.right}" y2="${padding.top + chartH/2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
        <line x1="${padding.left}" y1="${height - padding.bottom}" x2="${width - padding.right}" y2="${height - padding.bottom}" stroke="rgba(255,255,255,0.1)"/>

        <!-- Gradient Area Fill -->
        <path d="${areaD}" fill="url(#chartFillGrad)"/>

        <!-- Trend Line -->
        <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Data Point Circles and Labels -->
        ${points.map(pt => `
          <g class="chart-point-group">
            <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#0b1f30" stroke="${strokeColor}" stroke-width="2.5"/>
            <text x="${pt.x}" y="${height - 10}" fill="#64748b" font-size="10" text-anchor="middle" font-family="Plus Jakarta Sans">${pt.label}</text>
          </g>
        `).join('')}

        <!-- Y Axis Labels -->
        <text x="${padding.left - 8}" y="${padding.top + 4}" fill="#64748b" font-size="10" text-anchor="end">${maxVal.toFixed(1)}</text>
        <text x="${padding.left - 8}" y="${height - padding.bottom}" fill="#64748b" font-size="10" text-anchor="end">${minVal.toFixed(1)}</text>
      </svg>
    `;

    svgContainer.innerHTML = svgHTML;
  },

  renderRecentAlerts(stationId) {
    const listEl = document.getElementById('dash-recent-alerts-list');
    if (!listEl) return;

    const alerts = window.JalData.alerts.slice(0, 3);
    if (!alerts || alerts.length === 0) {
      listEl.innerHTML = `<div class="empty-state-text" style="color:var(--text-muted); font-size:0.85rem; padding:1rem;">No active alerts at this moment.</div>`;
      return;
    }

    listEl.innerHTML = alerts.map(alt => {
      const isDanger = alt.severity === 'Critical';
      const isWarn = alt.severity === 'Warning';
      const iconBg = isDanger ? 'var(--status-danger-bg)' : (isWarn ? 'var(--status-warning-bg)' : 'var(--status-info-bg)');
      const iconColor = isDanger ? 'var(--status-danger)' : (isWarn ? 'var(--status-warning)' : 'var(--status-info)');

      return `
        <div class="alert-row-item ${isDanger ? 'danger' : (isWarn ? 'warning' : '')}" onclick="window.JalApp.navigate('alerts')">
          <div class="alert-row-icon" style="background:${iconBg}; color:${iconColor};">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div class="alert-row-content">
            <div class="alert-row-title">${alt.title}</div>
            <div class="alert-row-time">${alt.stationName} • ${alt.time}</div>
          </div>
          <span class="badge ${isDanger ? 'badge-danger' : (isWarn ? 'badge-warning' : 'badge-info')}">${alt.severity}</span>
        </div>
      `;
    }).join('');
  }
};
