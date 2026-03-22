=======
# Viet Heritage Hub

A comprehensive web platform for preserving and promoting Vietnamese cultural heritage through digital innovation.

## Overview

Viet Heritage Hub is an integrated web platform designed to digitize and promote Vietnam's rich cultural heritage. The platform combines historical education, interactive mapping, AI-powered art creation, community engagement, and e-commerce for traditional crafts.

## Features

### 🏛️ Historical Timeline
- Interactive timeline of Vietnamese dynasties
- Multimedia content (images, audio, video)
- Period-specific themes and music

### 🗺️ Interactive Heritage Map
- Location-based heritage sites exploration
- Multi-language audio guides (Vietnamese, English, French)
- Filter by region, type, and historical period

### 🎨 AI Art Lab
- Generate traditional calligraphy
- Restore historical photographs
- Text-to-speech for cultural content

### 👥 Community Platform
- Discussion forums and groups
- Cultural event management
- Verified artisan content

### 🛍️ Artisan Marketplace
- Traditional craft e-commerce
- Artisan profile management
- Direct sales and order tracking

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- MVC architecture

### Frontend
- **HTML, CSS, and JavaScript** (Tailwind via CDN; Chart.js for timeline chart; marked for AI markdown)
- Hash-based navigation (`#/`, `#/history`, …); API calls use `fetch` to `/api/...`

### AI Integration
- Custom AI models for calligraphy generation
- Image restoration algorithms
- Multi-language text-to-speech

## Project Structure (PBL5 repo)

```
PBL5/
├── backend/                 # Node.js/Express API
├── frontend/                # Main UI: HTML / CSS / JavaScript (served by Express)
├── viet-heritage-hub/       # Optional: earlier Vite + React prototype (unchanged)
├── database/                # schema.sql, seeds/
├── docs/
└── README.md
```

## User Roles

- **Guest**: Browse content, limited AI features
- **Member**: Full access to features, premium AI
- **Artisan**: Content creation, product management
- **Admin**: System management, content moderation

## Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/viet-heritage-hub.git
cd viet-heritage-hub
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. The web UI lives in `frontend/` (static files; no npm install required for the UI itself).

4. Set up the database
```bash
cd ../database
mysql -u root -p < schema.sql
```

5. Configure environment variables
```bash
# Backend: optional backend/.env with DB_*, PORT, and GEMINI_API_KEY (AI Studio uses the key on the server)
```

6. Start the backend (serves the static UI from `frontend/` on the same port)
```bash
cd ..   # repo root (PBL5)
npm install          # optional: root devDependencies (concurrently, etc.)
npm run install:all  # installs backend dependencies only
npm run dev          # or: cd backend && npm run dev
# Open http://localhost:3000 — hash routes: #/, #/history, #/ai, …
```

7. Optional: the folder `viet-heritage-hub/` is a separate Vite/React copy; the product UI is `frontend/`.

## API Documentation

See [API Documentation](./docs/API.md) for detailed endpoint information.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Vietnam Ministry of Culture, Sports and Tourism
- Local artisans and cultural experts
- Open source community

---

**Preserving Vietnam's Cultural Heritage Through Digital Innovation**
