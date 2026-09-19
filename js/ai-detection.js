/**
 * JALDRISHTI - AI Pollution Detection Suite
 * Handles drag-and-drop / file upload, sample river preset selection,
 * simulated computer-vision inference scanning animation, bounding box canvas drawing,
 * pollution classification, risk severity, confidence meter, and actionable recommendations.
 */

window.JalAIDetection = {
  currentPreset: 'plastic',
  isScanning: false,

  init() {
    this.setupDropzone();
    this.setupPresets();
    // Load default preset initially
    this.loadPreset('plastic');
  },

  setupDropzone() {
    const dropzone = document.getElementById('ai-dropzone');
    const fileInput = document.getElementById('ai-file-input');

    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        this.handleCustomImageUpload(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        this.handleCustomImageUpload(e.target.files[0]);
      }
    });
  },

  setupPresets() {
    document.querySelectorAll('.sample-preset-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (this.isScanning) return;
        const presetId = e.currentTarget.dataset.preset;
        this.loadPreset(presetId);
      });
    });

    const scanBtn = document.getElementById('trigger-scan-btn');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        this.runInference();
      });
    }
  },

  loadPreset(presetId) {
    const preset = window.JalData.aiPresets[presetId];
    if (!preset) return;

    this.currentPreset = presetId;

    // Update preset card active state
    document.querySelectorAll('.sample-preset-card').forEach(card => {
      card.classList.toggle('active', card.dataset.preset === presetId);
    });

    // Update viewport image
    const imgEl = document.getElementById('scanner-preview-img');
    if (imgEl) {
      imgEl.src = preset.imagePath;
      imgEl.onload = () => {
        this.clearCanvas();
        this.renderResults(preset, false);
      };
    }
  },

  handleCustomImageUpload(file) {
    if (!file.type.startsWith('image/')) {
      window.JalApp.showToast('Please upload a valid image file (JPG/PNG).', 'danger');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imgEl = document.getElementById('scanner-preview-img');
      if (imgEl) {
        imgEl.src = e.target.result;
        imgEl.onload = () => {
          this.clearCanvas();
          // Generate a dynamic realistic analysis for custom user upload
          this.currentPreset = 'custom';
          document.querySelectorAll('.sample-preset-card').forEach(c => c.classList.remove('active'));
          
          window.JalApp.showToast('Image uploaded. Ready for AI inspection.', 'info');
          this.runInference({
            id: 'custom',
            name: file.name,
            pollutionType: 'Suspicious Surface Turbidity & Particle Accumulation',
            severity: 'Medium',
            severityColor: '#f59e0b',
            confidence: (86 + Math.random() * 8).toFixed(1),
            parametersImpacted: ['Suspended Solids', 'Water Transmittance'],
            recommendations: [
              'Deploy on-site field testing kit to corroborate optical sensor reading.',
              'Check upstream discharge outfalls within 2 km radius.',
              'Sample water for total dissolved solids (TDS) and biological oxygen demand (BOD).'
            ],
            boxes: [
              { x: 0.25, y: 0.35, w: 0.5, h: 0.35, label: 'Unclassified Anomaly Cluster' }
            ]
          });
        };
      }
    };
    reader.readAsDataURL(file);
  },

  runInference(customData = null) {
    if (this.isScanning) return;
    this.isScanning = true;

    const sweepLine = document.getElementById('radar-sweep-line');
    const scanStatusText = document.getElementById('scan-status-text');
    const scanBtn = document.getElementById('trigger-scan-btn');
    const resultsContainer = document.getElementById('ai-results-panel');

    if (sweepLine) sweepLine.style.display = 'block';
    if (scanBtn) {
      scanBtn.disabled = true;
      scanBtn.textContent = 'Scanning Water Surface...';
    }
    this.clearCanvas();

    const stages = [
      'Normalizing spectral reflectance layers...',
      'Segmenting water surface boundary...',
      'Computing neural anomaly probability tensor...',
      'Synthesizing risk classification...'
    ];

    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      if (scanStatusText && stageIdx < stages.length) {
        scanStatusText.textContent = stages[stageIdx++];
      }
    }, 450);

    setTimeout(() => {
      clearInterval(stageInterval);
      if (sweepLine) sweepLine.style.display = 'none';
      if (scanBtn) {
        scanBtn.disabled = false;
        scanBtn.textContent = 'Re-Analyze Image';
      }
      this.isScanning = false;

      const dataToRender = customData || window.JalData.aiPresets[this.currentPreset];
      this.renderResults(dataToRender, true);
      this.drawBoundingBoxes(dataToRender.boxes);
      window.JalApp.showToast(`AI Detection Complete: ${dataToRender.severity} Risk`, dataToRender.severity === 'Critical' ? 'danger' : 'safe');
    }, 2000);
  },

  renderResults(preset, animated = true) {
    const typeEl = document.getElementById('ai-pollution-type');
    const severityBadge = document.getElementById('ai-severity-badge');
    const confValEl = document.getElementById('ai-confidence-val');
    const confBarEl = document.getElementById('ai-confidence-bar');
    const recsListEl = document.getElementById('ai-recommendations-list');
    const statusText = document.getElementById('scan-status-text');

    if (typeEl) typeEl.textContent = preset.pollutionType;

    if (severityBadge) {
      severityBadge.className = 'badge';
      if (preset.severity === 'Critical' || preset.severity === 'High') {
        severityBadge.classList.add('badge-danger');
      } else if (preset.severity === 'Medium') {
        severityBadge.classList.add('badge-warning');
      } else {
        severityBadge.classList.add('badge-safe');
      }
      severityBadge.textContent = `${preset.severity} Severity`;
    }

    if (confValEl) confValEl.textContent = `${preset.confidence}%`;
    if (confBarEl) {
      confBarEl.style.width = animated ? '0%' : `${preset.confidence}%`;
      setTimeout(() => {
        confBarEl.style.width = `${preset.confidence}%`;
      }, 50);
    }

    if (recsListEl) {
      recsListEl.innerHTML = preset.recommendations.map(rec => `
        <li style="display:flex; align-items:flex-start; gap:0.5rem; margin-bottom:0.45rem; font-size:0.85rem; color:var(--text-secondary);">
          <span style="color:var(--accent-cyan); font-weight:bold; margin-top:2px;">•</span>
          <span>${rec}</span>
        </li>
      `).join('');
    }

    if (statusText) {
      statusText.textContent = `Analysis complete • Confidence: ${preset.confidence}%`;
    }
  },

  drawBoundingBoxes(boxes) {
    const canvas = document.getElementById('detection-canvas');
    const img = document.getElementById('scanner-preview-img');
    if (!canvas || !img || !boxes) return;

    const rect = img.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach(box => {
      const x = box.x * canvas.width;
      const y = box.y * canvas.height;
      const w = box.w * canvas.width;
      const h = box.h * canvas.height;

      // Draw bounding box
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.8)';
      ctx.shadowBlur = 8;
      ctx.strokeRect(x, y, w, h);

      // Label background
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
      const text = `${box.label}`;
      ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
      const textMetrics = ctx.measureText(text);
      const textW = textMetrics.width + 12;
      const textH = 18;

      ctx.fillRect(x, Math.max(0, y - textH), textW, textH);

      // Label text
      ctx.fillStyle = '#031320';
      ctx.fillText(text, x + 6, Math.max(12, y - 5));
    });
  },

  clearCanvas() {
    const canvas = document.getElementById('detection-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};
