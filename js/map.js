/**
 * JALDRISHTI - Interactive Map Module
 * Displays geo-referenced river monitoring stations across India using Leaflet.js
 * with color-coded risk markers, dynamic telemetry popups, and station details inspection.
 */

window.JalMap = {
  mapInstance: null,
  markers: {},
  activeStationId: null,

  init() {
    this.renderSideList();
  },

  initLeafletMap() {
    const mapDiv = document.getElementById('river-map');
    if (!mapDiv) return;

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
      mapDiv.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-secondary); text-align:center; padding:2rem;">
          <p>Leaflet mapping library is initializing...</p>
        </div>
      `;
      return;
    }

    if (this.mapInstance) {
      this.mapInstance.invalidateSize();
      return;
    }

    // Default center on India (Lat: 21.5, Lng: 80.0, zoom 5)
    this.mapInstance = L.map('river-map', {
      zoomControl: true,
      attributionControl: false
    }).setView([22.0, 79.5], 5);

    // Dark water CartoDB / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(this.mapInstance);

    // Add Station Markers
    this.renderMarkers();
  },

  renderMarkers() {
    if (!this.mapInstance || typeof L === 'undefined') return;

    window.JalData.stations.forEach(st => {
      let pinColor = '#10b981'; // safe
      if (st.riskLevel === 'High' || st.riskLevel === 'Critical') {
        pinColor = '#ef4444';
      } else if (st.riskLevel === 'Medium') {
        pinColor = '#f59e0b';
      }

      // Custom HTML Marker Pin
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: ${pinColor};
            border: 3px solid #ffffff;
            box-shadow: 0 0 14px ${pinColor};
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <div style="width:6px; height:6px; border-radius:50%; background:#fff;"></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 200px; color: #0f172a; padding: 4px;">
          <h4 style="font-family:'Outfit',sans-serif; margin:0 0 4px; font-size:15px; color:#0f2a42; font-weight:700;">${st.name}</h4>
          <p style="margin:0 0 8px; font-size:12px; color:#64748b;">${st.river} River • ${st.city}</p>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;">
            <span><strong>WQI Index:</strong></span>
            <span style="font-weight:bold; color:${pinColor};">${Math.round(st.wqi)} (${st.wqiStatus})</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px;">
            <span><strong>Water Level:</strong></span>
            <span>${st.waterLevel.toFixed(2)} m</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:12px;">
            <span><strong>Turbidity:</strong></span>
            <span>${st.turbidity} NTU</span>
          </div>
          <button onclick="window.JalApp.selectAndInspect('${st.id}')" style="
            width:100%;
            padding:6px;
            background:#0284c7;
            color:white;
            border:none;
            border-radius:6px;
            font-size:12px;
            font-weight:600;
            cursor:pointer;
          ">Inspect Telemetry</button>
        </div>
      `;

      const marker = L.marker([st.lat, st.lng], { icon: customIcon })
        .addTo(this.mapInstance)
        .bindPopup(popupContent);

      this.markers[st.id] = marker;

      marker.on('click', () => {
        this.selectStationOnMap(st.id);
      });
    });
  },

  selectStationOnMap(stationId) {
    this.activeStationId = stationId;
    const st = window.JalData.stations.find(s => s.id === stationId);
    if (!st) return;

    if (this.mapInstance && this.markers[stationId]) {
      this.mapInstance.setView([st.lat, st.lng], 9, { animate: true });
      this.markers[stationId].openPopup();
    }

    this.renderSideCard(st);
  },

  renderSideList() {
    const listContainer = document.getElementById('map-stations-list');
    if (!listContainer) return;

    listContainer.innerHTML = window.JalData.stations.map(st => {
      const isHigh = st.riskLevel === 'High';
      const isMed = st.riskLevel === 'Medium';
      const badgeClass = isHigh ? 'badge-danger' : (isMed ? 'badge-warning' : 'badge-safe');

      return `
        <div class="station-card" style="padding:1rem; cursor:pointer;" onclick="window.JalMap.selectStationOnMap('${st.id}')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.4rem;">
            <strong style="font-size:0.92rem; color:var(--text-primary);">${st.name}</strong>
            <span class="badge ${badgeClass}" style="font-size:0.65rem;">${st.riskLevel}</span>
          </div>
          <div style="font-size:0.75rem; color:var(--text-secondary); display:flex; justify-content:space-between;">
            <span>${st.river} River</span>
            <span>WQI: <strong>${Math.round(st.wqi)}</strong></span>
          </div>
        </div>
      `;
    }).join('');
  },

  renderSideCard(st) {
    const detailsContainer = document.getElementById('map-focused-station-details');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
      <div class="card" style="border-color:var(--accent-cyan);">
        <div class="card-header">
          <div>
            <div class="card-title">${st.name}</div>
            <div class="card-subtitle">${st.river} River • ${st.city}, ${st.state}</div>
          </div>
          <span class="badge ${st.riskLevel === 'High' ? 'badge-danger' : (st.riskLevel === 'Medium' ? 'badge-warning' : 'badge-safe')}">
            ${st.riskLevel} Risk
          </span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem; font-size:0.85rem;">
          <div><span style="color:var(--text-muted);">Water Level:</span> <strong>${st.waterLevel.toFixed(2)}m</strong></div>
          <div><span style="color:var(--text-muted);">Water Temp:</span> <strong>${st.temperature}°C</strong></div>
          <div><span style="color:var(--text-muted);">Turbidity:</span> <strong>${st.turbidity} NTU</strong></div>
          <div><span style="color:var(--text-muted);">pH:</span> <strong>${st.pH}</strong></div>
        </div>
        <button class="btn btn-primary btn-sm" style="width:100%;" onclick="window.JalApp.selectAndInspect('${st.id}')">
          Open in Dashboard
        </button>
      </div>
    `;
  }
};
