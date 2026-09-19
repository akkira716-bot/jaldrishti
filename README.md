# 🌊 JALDRISHTI - AI-Powered River Monitoring & Water Safety Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-emerald?style=for-the-badge&logo=github)](https://akkira716-bot.github.io/jaldrishti/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/akkira716-bot/jaldrishti)

🔗 **Live Public Demo**: [https://akkira716-bot.github.io/jaldrishti/](https://akkira716-bot.github.io/jaldrishti/)

**JALDRISHTI** (जलदृष्टि) is a responsive, modern web application designed for real-time river condition monitoring, early pollution anomaly detection, automated multi-level alerts, and water safety analytics.

Developed with a clean water-themed ocean-and-emerald design system, it provides environmental officers, river basin authorities, and community monitors with immediate visibility into aquatic ecosystems.

---

## 🚀 Key Features

1. **Water Safety Dashboard**
   - Radial Water Quality Index (WQI) gauge dial (0–100 score with dynamic color gradations).
   - Real-time physical and chemical sensor metrics:
     - **Water Level** (m above base with flood threshold indicators)
     - **Water Temperature** (°C)
     - **pH Level** (6.5 – 8.5 safety range)
     - **Turbidity** (NTU optical sensor readings)
     - **Dissolved Oxygen** (mg/L aquatic life sustainability gauge)
   - Interactive 24-hour telemetry trend sparkline chart with tabs for Turbidity, pH, Water Level, and Dissolved Oxygen.
   - Live station selector and immediate priority alert feed.

2. **River Monitoring & Telemetry Matrix**
   - Multi-station overview cards covering major river basins (Yamuna, Ganga, Brahmaputra, Godavari, Narmada, Kaveri).
   - Real-time stream gauge status and threshold diagnostics.
   - Built-in live telemetry stream simulation with natural sensor fluctuations and live status toggle.
   - Station search and filtering by name, river, or state.

3. **AI River Pollution Vision Scanner**
   - Image uploader supporting drag-and-drop or local file selection.
   - Instant sample river test presets:
     - 🛢️ *Plastic Debris & Clustered Flotilla*
     - 🏭 *Industrial Chemical Effluent Discharge*
     - 🌿 *Toxic Algae Bloom (Eutrophication)*
     - 💧 *Clean Pristine River Flow*
   - Simulated computer vision multi-phase radar sweep scanning animation.
   - HTML5 canvas overlay with bounding boxes and anomaly tags.
   - Classification output: Pollution Category, Severity Rating (*Low, Medium, High, Critical*), Confidence percentage, and mitigation recommendations.
   - Prominent disclaimer clarifying simulated AI logic for demo purposes.

4. **Real-Time Incident Alerts Center**
   - Categorized alert feed (*Pollution Surges, High Water / Flood Threats, Unsafe Water / Salinity, Sensor Health*).
   - Severity filters: All Incidents, Critical, Warning, and Pending Action.
   - Interactive Acknowledge buttons and "View on Map" direct links.
   - Live badge counter in sidebar navigation.

5. **Geospatial River Basin Map**
   - Powered by Leaflet.js with high-contrast CartoDB dark water tiles.
   - Geographic coordinates across major Indian river stations.
   - Color-coded risk marker pins (*Emerald = Safe, Amber = Warning, Red = Critical*).
   - Dynamic popups with quick telemetry inspection buttons.

6. **Historical Reports & Analytics**
   - Filterable data table by river station and date range.
   - Water safety compliance summary against CPCB and WHO standards.
   - Automated executive synthesis generator modal.
   - One-click CSV dataset export and printable PDF-ready report formatting.

7. **Profile & Platform Settings**
   - Officer profile credentials and jurisdiction details.
   - Configurable safety threshold sliders for maximum pH and turbidity limits.
   - Dark Ocean and Aqua Light theme switcher.
   - Emergency contact directory (CPCB Hotline, NDRF, Basin Technical Desk).

8. **Authentication Modal**
   - Tabbed sign-in and registration forms with role allocation (*River Basin Officer, Research Scientist, Citizen Monitor*).

---

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5 (Accessible ARIA landmarks, mobile drawer, responsive containers).
- **Styling**: Vanilla CSS3 (Custom properties, glassmorphism, responsive grid, fluid typography, dark/light theme).
- **Logic**: Modern Vanilla JavaScript (ES6+ modular structure, event driven, state synchronization).
- **Geospatial**: Leaflet.js for interactive mapping.
- **Visual Assets**: Custom high-resolution photorealistic river photography for AI vision test presets.

---

## 💻 Running the Platform Locally

To launch JALDRISHTI locally without external dependencies:

```bash
# Using Python's built-in HTTP server:
python -m http.server 3000

# Then open in your browser:
http://localhost:3000
```

Alternatively, you can open `index.html` directly in any modern web browser.

---

## 📱 Mobile Responsiveness

The application is fully responsive across mobile, tablet, and desktop viewports:
- Mobile drawer navigation with hamburger toggle.
- Bottom app navigation bar for thumb-friendly quick navigation.
- Responsive CSS grid adapting from 4-column metric layouts to compact touch cards.
