/**
 * JALDRISHTI - River Monitoring Module
 * Manages all river monitoring stations, parameter stream gauges,
 * live telemetry simulation with natural sensor fluctuations, and station inspection.
 */

window.JalMonitoring = {
  liveSimulationActive: true,
  simulationInterval: null,

  init() {
    this.renderStationsGrid();
    this.setupControls();
    this.startLiveSimulation();
  },

  setupControls() {
    // Station Search Input
    const searchInput = document.getElementById('monitoring-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        this.filterStations(query);
      });
    }

    // Live Stream Toggle Button
    const simToggle = document.getElementById('toggle-live-sim');
    if (simToggle) {
      simToggle.addEventListener('click', () => {
        this.liveSimulationActive = !this.liveSimulationActive;
        if (this.liveSimulationActive) {
          this.startLiveSimulation();
          simToggle.textContent = 'Pause Live Telemetry';
          simToggle.classList.replace('btn-secondary', 'btn-primary');
          window.JalApp.showToast('Live telemetry stream active', 'info');
        } else {
          this.stopLiveSimulation();
          simToggle.textContent = 'Resume Live Telemetry';
          simToggle.classList.replace('btn-primary', 'btn-secondary');
          window.JalApp.showToast('Live telemetry stream paused', 'warning');
        }
      });
    }
  },

  renderStationsGrid(filteredStations = null) {
    const container = document.getElementById('monitoring-stations-grid');
    if (!container) return;

    const stations = filteredStations || window.JalData.stations;

    if (stations.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:0.75rem; opacity:0.5;">
            <circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <p>No river stations found matching your search.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = stations.map(st => {
      const isDanger = st.riskLevel === 'High' || st.riskLevel === 'Critical';
      const isWarn = st.riskLevel === 'Medium';
      const riskClass = isDanger ? 'badge-danger' : (isWarn ? 'badge-warning' : 'badge-safe');

      return `
        <div class="station-card ${window.JalApp.currentStationId === st.id ? 'selected' : ''}" 
             onclick="window.JalMonitoring.selectStation('${st.id}')">
          <div class="station-card-top">
            <div>
              <div class="station-card-title">${st.name}</div>
              <div class="station-card-location">${st.river} River • ${st.city}, ${st.state}</div>
            </div>
            <span class="badge ${riskClass}">${st.riskLevel} Risk</span>
          </div>

          <div class="parameters-mini-table">
            <div class="param-mini-box">
              <span class="param-mini-label">Water Level</span>
              <span class="param-mini-val" id="st-level-${st.id}">${st.waterLevel.toFixed(2)} ${st.levelUnit}</span>
            </div>
            <div class="param-mini-box">
              <span class="param-mini-label">WQI Score</span>
              <span class="param-mini-val" style="color: ${st.wqi < 50 ? 'var(--status-danger)' : (st.wqi < 75 ? 'var(--status-warning)' : 'var(--status-safe)')}" id="st-wqi-${st.id}">
                ${Math.round(st.wqi)} (${st.wqiStatus})
              </span>
            </div>
            <div class="param-mini-box">
              <span class="param-mini-label">Turbidity</span>
              <span class="param-mini-val" id="st-turb-${st.id}">${st.turbidity} ${st.turbidityUnit}</span>
            </div>
            <div class="param-mini-box">
              <span class="param-mini-label">Dissolved O₂</span>
              <span class="param-mini-val" id="st-do-${st.id}">${st.dissolvedOxygen.toFixed(1)} ${st.doUnit}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
            <span style="display: flex; align-items: center; gap: 0.35rem;">
              <span class="pulsing-dot" style="width:6px; height:6px; background:var(--status-safe);"></span> 
              Sensor: ${st.sensorStatus}
            </span>
            <span id="st-time-${st.id}">${st.lastUpdated}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  filterStations(query) {
    const filtered = window.JalData.stations.filter(st => 
      st.name.toLowerCase().includes(query) ||
      st.river.toLowerCase().includes(query) ||
      st.city.toLowerCase().includes(query) ||
      st.state.toLowerCase().includes(query)
    );
    this.renderStationsGrid(filtered);
  },

  selectStation(stationId) {
    window.JalApp.setStation(stationId);
    this.renderStationsGrid();
    window.JalApp.showToast(`Switched to ${stationId}`, 'info');
  },

  startLiveSimulation() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      if (!this.liveSimulationActive) return;

      // Add subtle realistic fluctuations to all stations
      window.JalData.stations.forEach(st => {
        // slight jitter in level (+/- 0.02)
        st.waterLevel += (Math.random() - 0.49) * 0.04;
        st.waterLevel = Math.max(1, Math.round(st.waterLevel * 100) / 100);

        // slight jitter in temp (+/- 0.1)
        st.temperature += (Math.random() - 0.5) * 0.15;
        st.temperature = Math.round(st.temperature * 10) / 10;

        // slight jitter in turbidity
        if (Math.random() > 0.6) {
          st.turbidity += Math.floor((Math.random() - 0.48) * 3);
          st.turbidity = Math.max(2, Math.min(180, st.turbidity));
        }

        st.lastUpdated = 'Just now';

        // Update DOM elements if present on monitoring page
        const levelEl = document.getElementById(`st-level-${st.id}`);
        if (levelEl) levelEl.textContent = `${st.waterLevel.toFixed(2)} ${st.levelUnit}`;

        const turbEl = document.getElementById(`st-turb-${st.id}`);
        if (turbEl) turbEl.textContent = `${st.turbidity} ${st.turbidityUnit}`;

        const doEl = document.getElementById(`st-do-${st.id}`);
        if (doEl) doEl.textContent = `${st.dissolvedOxygen.toFixed(1)} ${st.doUnit}`;

        const timeEl = document.getElementById(`st-time-${st.id}`);
        if (timeEl) timeEl.textContent = 'Just now';
      });

      // Synchronize active dashboard view
      if (window.JalApp.currentView === 'dashboard') {
        window.JalDashboard.renderDashboard();
      }
    }, 3500);
  },

  stopLiveSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }
};
