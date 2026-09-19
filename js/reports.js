/**
 * JALDRISHTI - Reports & Analytics Module
 * Provides historical water quality logs, filters by river station & date range,
 * water safety compliance summaries, and report generation with CSV and Print export.
 */

window.JalReports = {
  currentFilterStation: 'all',
  currentFilterRange: 'all',

  init() {
    this.renderReportsTable();
    this.setupListeners();
  },

  setupListeners() {
    // Station dropdown filter
    const stationFilter = document.getElementById('report-station-filter');
    if (stationFilter) {
      stationFilter.addEventListener('change', (e) => {
        this.currentFilterStation = e.target.value;
        this.renderReportsTable();
      });
    }

    // Date range filter
    const dateFilter = document.getElementById('report-date-filter');
    if (dateFilter) {
      dateFilter.addEventListener('change', (e) => {
        this.currentFilterRange = e.target.value;
        this.renderReportsTable();
      });
    }

    // Export CSV button
    const csvBtn = document.getElementById('btn-export-csv');
    if (csvBtn) {
      csvBtn.addEventListener('click', () => {
        this.exportCSV();
      });
    }

    // Print Report button
    const printBtn = document.getElementById('btn-print-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Generate Executive Report Button
    const genBtn = document.getElementById('btn-generate-report-modal');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        this.showExecutiveSummaryModal();
      });
    }
  },

  getFilteredRecords() {
    let records = window.JalData.historicalRecords;

    if (this.currentFilterStation !== 'all') {
      records = records.filter(r => r.station.toLowerCase().includes(this.currentFilterStation.toLowerCase()));
    }

    return records;
  },

  renderReportsTable() {
    const tbody = document.getElementById('reports-table-body');
    const recordCountEl = document.getElementById('reports-record-count');
    if (!tbody) return;

    const records = this.getFilteredRecords();

    if (recordCountEl) {
      recordCountEl.textContent = `Showing ${records.length} records`;
    }

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:2rem; color:var(--text-muted);">
            No historical records found matching your filters.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(r => {
      let statusBadge = 'badge-safe';
      if (r.status === 'Poor') statusBadge = 'badge-danger';
      else if (r.status === 'Moderate') statusBadge = 'badge-warning';

      return `
        <tr>
          <td><strong style="color:var(--text-secondary);">${r.date}</strong></td>
          <td><strong>${r.station}</strong></td>
          <td>${r.river}</td>
          <td><span style="font-weight:700;">${r.wqi}</span></td>
          <td>${r.ph}</td>
          <td>${r.turbidity}</td>
          <td>${r.do}</td>
          <td><span class="badge ${statusBadge}">${r.status}</span></td>
        </tr>
      `;
    }).join('');
  },

  exportCSV() {
    const records = this.getFilteredRecords();
    if (records.length === 0) {
      window.JalApp.showToast('No records available to export.', 'warning');
      return;
    }

    const headers = ['Date & Time', 'Monitoring Station', 'River', 'WQI', 'pH', 'Turbidity', 'Dissolved Oxygen', 'Water Status'];
    const rows = records.map(r => [
      `"${r.date}"`,
      `"${r.station}"`,
      `"${r.river}"`,
      r.wqi,
      r.ph,
      `"${r.turbidity}"`,
      `"${r.do}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jaldrishti_water_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.JalApp.showToast('Water monitoring report exported as CSV.', 'safe');
  },

  showExecutiveSummaryModal() {
    const records = this.getFilteredRecords();
    const avgWQI = (records.reduce((acc, r) => acc + r.wqi, 0) / records.length).toFixed(1);
    const poorCount = records.filter(r => r.status === 'Poor').length;

    const modalBody = document.getElementById('report-modal-content');
    if (modalBody) {
      modalBody.innerHTML = `
        <div style="font-size:0.9rem; line-height:1.6;">
          <div style="padding:1rem; background:rgba(6,182,212,0.08); border-radius:var(--radius-md); border:1px solid rgba(6,182,212,0.25); margin-bottom:1.25rem;">
            <h4 style="color:var(--accent-cyan); margin-bottom:0.35rem;">Automated River Water Quality Synthesis</h4>
            <p style="color:var(--text-secondary); font-size:0.85rem;">Generated on ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.25rem;">
            <div class="card" style="padding:1rem;">
              <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Composite Mean WQI</span>
              <div style="font-size:1.8rem; font-weight:800; color:${avgWQI < 50 ? 'var(--status-danger)' : (avgWQI < 75 ? 'var(--status-warning)' : 'var(--status-safe)')};">${avgWQI}</div>
            </div>
            <div class="card" style="padding:1rem;">
              <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Critical Incidents</span>
              <div style="font-size:1.8rem; font-weight:800; color:${poorCount > 0 ? 'var(--status-danger)' : 'var(--status-safe)'};">${poorCount}</div>
            </div>
          </div>
          <p style="margin-bottom:0.75rem; color:var(--text-secondary);">
            <strong>Regulatory Compliance:</strong> According to National River Conservation Directorate (NRCD) Class-B Bathing & Ecosystem standards, stations with turbidity &gt; 30 NTU and Dissolved Oxygen &lt; 4.0 mg/L require active localized containment.
          </p>
          <div style="display:flex; justify-content:flex-end; gap:0.75rem; margin-top:1.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('report-exec-modal').classList.remove('active')">Close</button>
            <button class="btn btn-primary btn-sm" onclick="window.JalReports.exportCSV()">Download Dataset</button>
          </div>
        </div>
      `;
      document.getElementById('report-exec-modal').classList.add('active');
    }
  }
};
