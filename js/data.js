/**
 * JALDRISHTI - Core Data Store & Preset Definitions
 * Contains realistic sensor telemetry, river monitoring stations across India,
 * AI vision demo presets, alerts, and historical logs.
 */

window.JalData = {
  // River Monitoring Stations
  stations: [
    {
      id: 'yamuna-delhi',
      name: 'Yamuna - Okhla Barrage',
      river: 'Yamuna',
      city: 'Delhi NCR',
      state: 'Delhi',
      lat: 28.544,
      lng: 77.309,
      riskLevel: 'High',
      wqi: 42,
      wqiStatus: 'Poor',
      waterLevel: 204.85,
      levelUnit: 'm',
      waterLevelThreshold: 205.33,
      temperature: 27.4,
      pH: 8.4,
      turbidity: 52,
      turbidityUnit: 'NTU',
      dissolvedOxygen: 2.1,
      doUnit: 'mg/L',
      flowRate: 312,
      lastUpdated: '2 mins ago',
      sensorStatus: 'Active'
    },
    {
      id: 'ganga-varanasi',
      name: 'Ganga - Dashashwamedh Ghat',
      river: 'Ganga',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      lat: 25.307,
      lng: 83.010,
      riskLevel: 'Medium',
      wqi: 64,
      wqiStatus: 'Moderate',
      waterLevel: 68.4,
      levelUnit: 'm',
      waterLevelThreshold: 71.26,
      temperature: 24.8,
      pH: 7.7,
      turbidity: 29,
      turbidityUnit: 'NTU',
      dissolvedOxygen: 5.6,
      doUnit: 'mg/L',
      flowRate: 840,
      lastUpdated: '1 min ago',
      sensorStatus: 'Active'
    },
    {
      id: 'brahmaputra-guwahati',
      name: 'Brahmaputra - Guwahati Port',
      river: 'Brahmaputra',
      city: 'Guwahati',
      state: 'Assam',
      lat: 26.185,
      lng: 91.753,
      riskLevel: 'Low',
      wqi: 82,
      wqiStatus: 'Good',
      waterLevel: 49.30,
      levelUnit: 'm',
      waterLevelThreshold: 51.50,
      temperature: 21.2,
      pH: 7.3,
      turbidity: 18,
      turbidityUnit: 'NTU',
      dissolvedOxygen: 7.4,
      doUnit: 'mg/L',
      flowRate: 4850,
      lastUpdated: 'Just now',
      sensorStatus: 'Active'
    },
    {
      id: 'godavari-rajahmundry',
      name: 'Godavari - Godavari Arch Bridge',
      river: 'Godavari',
      city: 'Rajahmundry',
      state: 'Andhra Pradesh',
      lat: 17.000,
      lng: 81.780,
      riskLevel: 'Low',
      wqi: 76,
      wqiStatus: 'Good',
      waterLevel: 14.25,
      levelUnit: 'm',
      waterLevelThreshold: 17.50,
      temperature: 26.5,
      pH: 7.5,
      turbidity: 21,
      turbidityUnit: 'NTU',
      dissolvedOxygen: 6.5,
      doUnit: 'mg/L',
      flowRate: 1420,
      lastUpdated: '3 mins ago',
      sensorStatus: 'Active'
    },
    {
      id: 'narmada-bharuch',
      name: 'Narmada - Golden Bridge',
      river: 'Narmada',
      city: 'Bharuch',
      state: 'Gujarat',
      lat: 21.705,
      lng: 72.998,
      riskLevel: 'Medium',
      wqi: 59,
      wqiStatus: 'Moderate',
      waterLevel: 8.95,
      levelUnit: 'm',
      waterLevelThreshold: 11.20,
      temperature: 28.1,
      pH: 8.1,
      turbidity: 36,
      turbidityUnit: 'NTU',
      dissolvedOxygen: 4.8,
      doUnit: 'mg/L',
      flowRate: 980,
      lastUpdated: '4 mins ago',
      sensorStatus: 'Active'
    },
    {
      id: 'kaveri-trichy',
      name: 'Kaveri - Grand Anicut (Kallanai)',
      river: 'Kaveri',
      city: 'Tiruchirappalli',
      state: 'Tamil Nadu',
      lat: 10.835,
      lng: 78.818,
      riskLevel: 'Low',
      wqi: 89,
      wqiStatus: 'Excellent',
      waterLevel: 19.50,
      levelUnit: 'm',
      waterLevelThreshold: 22.00,
      temperature: 27.2,
      pH: 7.2,
      turbidity: 11,
      turbidityUnit: 'NTU',
      dissolvedOxygen: 7.9,
      doUnit: 'mg/L',
      flowRate: 640,
      lastUpdated: 'Just now',
      sensorStatus: 'Active'
    }
  ],

  // 24-Hour Historical Trend Points for Charts
  trends24h: {
    labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
    pH: [7.9, 7.8, 8.0, 8.2, 8.5, 8.4, 8.3, 8.4],
    turbidity: [44, 46, 48, 55, 59, 54, 50, 52],
    waterLevel: [204.6, 204.65, 204.7, 204.75, 204.8, 204.85, 204.82, 204.85],
    dissolvedOxygen: [3.4, 3.2, 2.9, 2.5, 2.0, 2.1, 2.3, 2.1]
  },

  // AI Pollution Detection Presets
  aiPresets: {
    plastic: {
      id: 'plastic',
      name: 'Plastic Debris & Litter',
      imagePath: 'assets/images/plastic_debris.jpg',
      pollutionType: 'Solid Waste & Non-Biodegradable Plastic Flotilla',
      severity: 'High',
      severityColor: '#ef4444',
      confidence: 94.6,
      parametersImpacted: ['Turbidity', 'Microplastic Index', 'Surface Aeration'],
      recommendations: [
        'Deploy surface containment boom barrier across section km 14.',
        'Mobilize automated river trash skimmer boat crew.',
        'Inspect upstream storm-water outfalls for illicit trash dumping.'
      ],
      boxes: [
        { x: 0.20, y: 0.45, w: 0.62, h: 0.42, label: 'Polyethylene Bottle Clustered Layer' },
        { x: 0.52, y: 0.48, w: 0.16, h: 0.20, label: 'Synthetic Film Bag' },
        { x: 0.65, y: 0.22, w: 0.28, h: 0.26, label: 'Bank Debris Accumulation' }
      ]
    },
    chemical: {
      id: 'chemical',
      name: 'Industrial Chemical Effluent',
      imagePath: 'assets/images/chemical_effluent.jpg',
      pollutionType: 'Point-Source Chemical Wastewater & Surfactant Foam Discharge',
      severity: 'Critical',
      severityColor: '#dc2626',
      confidence: 97.4,
      parametersImpacted: ['Dissolved Oxygen (Severe Drop)', 'pH Spike', 'Heavy Metals Risk'],
      recommendations: [
        'Issue immediate cease-and-desist to local industrial discharge pipelines.',
        'Notify State Pollution Control Board (SPCB) emergency response team.',
        'Temporarily divert downstream municipal drinking intake valves.'
      ],
      boxes: [
        { x: 0.04, y: 0.35, w: 0.34, h: 0.55, label: 'Industrial Outfall Pipeline' },
        { x: 0.32, y: 0.52, w: 0.42, h: 0.38, label: 'Chemical Foam & Hydrocarbon Sheen' }
      ]
    },
    algae: {
      id: 'algae',
      name: 'Algae Bloom (Eutrophication)',
      imagePath: 'assets/images/algae_bloom.jpg',
      pollutionType: 'Microcystis Cyanobacteria (Harmful Algal Bloom)',
      severity: 'Medium',
      severityColor: '#f59e0b',
      confidence: 89.2,
      parametersImpacted: ['Dissolved Oxygen (Nocturnal Anoxia)', 'Chlorophyll-a', 'Sunlight Penetration'],
      recommendations: [
        'Deploy micro-bubble oxygen aeration systems.',
        'Monitor nocturnal dissolved oxygen saturation thresholds.',
        'Regulate upstream agricultural phosphorus and nitrogen fertilizer runoff.'
      ],
      boxes: [
        { x: 0.08, y: 0.18, w: 0.82, h: 0.72, label: 'Dense Cyanobacterial Mat' }
      ]
    },
    pristine: {
      id: 'pristine',
      name: 'Clean Pristine River',
      imagePath: 'assets/images/pristine_river.jpg',
      pollutionType: 'Natural Uncontaminated River Flow',
      severity: 'Low',
      severityColor: '#10b981',
      confidence: 96.8,
      parametersImpacted: ['None (Optimal Baseline)'],
      recommendations: [
        'River baseline is healthy and complies with Class-A water safety standards.',
        'Continue standard 24/7 automated telemetry surveillance.',
        'No emergency remediation actions required.'
      ],
      boxes: []
    }
  },

  // Alerts Database
  alerts: [
    {
      id: 'alt-101',
      stationId: 'yamuna-delhi',
      stationName: 'Yamuna - Okhla Barrage',
      category: 'Pollution',
      title: 'Critical Ammonia & Turbidity Surge',
      description: 'Turbidity jumped to 52 NTU with acute Dissolved Oxygen depletion (2.1 mg/L) detected downstream.',
      severity: 'Critical',
      time: '12 mins ago',
      timestamp: '2026-09-19T10:48:00',
      acknowledged: false
    },
    {
      id: 'alt-102',
      stationId: 'yamuna-delhi',
      stationName: 'Yamuna - Okhla Barrage',
      category: 'Water-Level',
      title: 'Water Level Approaching Warning Mark',
      description: 'Stream gauge measured 204.85 m (Warning limit: 205.33 m) due to heavy upstream catchment runoff.',
      severity: 'Warning',
      time: '45 mins ago',
      timestamp: '2026-09-19T10:15:00',
      acknowledged: false
    },
    {
      id: 'alt-103',
      stationId: 'narmada-bharuch',
      stationName: 'Narmada - Golden Bridge',
      category: 'Unsafe-Water',
      title: 'Elevated Saline Ingress & pH Deviation',
      description: 'Tidal surge elevated pH to 8.1 with increased conductivity readings.',
      severity: 'Warning',
      time: '2 hours ago',
      timestamp: '2026-09-19T08:55:00',
      acknowledged: true
    },
    {
      id: 'alt-104',
      stationId: 'ganga-varanasi',
      stationName: 'Ganga - Dashashwamedh Ghat',
      category: 'Pollution',
      title: 'BOD / Fecal Coliform Anomaly',
      description: 'Sudden spike in organic load near bathing ghat monitored; advisories dispatched to district authorities.',
      severity: 'Warning',
      time: '4 hours ago',
      timestamp: '2026-09-19T06:50:00',
      acknowledged: true
    },
    {
      id: 'alt-105',
      stationId: 'kaveri-trichy',
      stationName: 'Kaveri - Grand Anicut',
      category: 'Sensor',
      title: 'Routine Sensor Calibration Complete',
      description: 'Optical turbidity sensor and DO probe calibrated successfully. Signal strength at 98%.',
      severity: 'Info',
      time: '6 hours ago',
      timestamp: '2026-09-19T04:30:00',
      acknowledged: true
    }
  ],

  // Historical Telemetry Records for Reports
  historicalRecords: [
    { date: '2026-09-19 10:00', station: 'Yamuna - Okhla Barrage', river: 'Yamuna', wqi: 42, temp: '27.4°C', ph: 8.4, turbidity: '52 NTU', do: '2.1 mg/L', status: 'Poor' },
    { date: '2026-09-19 06:00', station: 'Yamuna - Okhla Barrage', river: 'Yamuna', wqi: 45, temp: '26.8°C', ph: 8.2, turbidity: '48 NTU', do: '2.5 mg/L', status: 'Poor' },
    { date: '2026-09-18 18:00', station: 'Ganga - Dashashwamedh Ghat', river: 'Ganga', wqi: 64, temp: '25.1°C', ph: 7.7, turbidity: '29 NTU', do: '5.6 mg/L', status: 'Moderate' },
    { date: '2026-09-18 12:00', station: 'Ganga - Dashashwamedh Ghat', river: 'Ganga', wqi: 66, temp: '25.6°C', ph: 7.6, turbidity: '27 NTU', do: '5.8 mg/L', status: 'Moderate' },
    { date: '2026-09-18 06:00', station: 'Brahmaputra - Guwahati Port', river: 'Brahmaputra', wqi: 82, temp: '21.0°C', ph: 7.3, turbidity: '18 NTU', do: '7.4 mg/L', status: 'Good' },
    { date: '2026-09-17 18:00', station: 'Brahmaputra - Guwahati Port', river: 'Brahmaputra', wqi: 84, temp: '21.4°C', ph: 7.2, turbidity: '17 NTU', do: '7.5 mg/L', status: 'Good' },
    { date: '2026-09-17 12:00', station: 'Godavari - Rajahmundry', river: 'Godavari', wqi: 76, temp: '26.9°C', ph: 7.5, turbidity: '21 NTU', do: '6.5 mg/L', status: 'Good' },
    { date: '2026-09-17 06:00', station: 'Narmada - Golden Bridge', river: 'Narmada', wqi: 59, temp: '27.8°C', ph: 8.1, turbidity: '36 NTU', do: '4.8 mg/L', status: 'Moderate' },
    { date: '2026-09-16 18:00', station: 'Kaveri - Grand Anicut', river: 'Kaveri', wqi: 89, temp: '27.2°C', ph: 7.2, turbidity: '11 NTU', do: '7.9 mg/L', status: 'Excellent' },
    { date: '2026-09-16 12:00', station: 'Kaveri - Grand Anicut', river: 'Kaveri', wqi: 91, temp: '27.4°C', ph: 7.1, turbidity: '10 NTU', do: '8.1 mg/L', status: 'Excellent' }
  ]
};
