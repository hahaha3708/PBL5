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
- **React.js** with modern hooks
- **Leaflet** for interactive maps
- **Axios** for API communication

### AI Integration
- Custom AI models for calligraphy generation
- Image restoration algorithms
- Multi-language text-to-speech

## Project Structure

```
viet-heritage-hub/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Request handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── views/              # EJS templates
│   ├── config/             # Configuration files
│   └── app.js              # Main application
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   └── assets/         # Static assets
│   └── public/             # Public assets
├── database/                # Database files
│   ├── schema.sql          # Database schema
│   └── seeds/              # Sample data
├── docs/                   # Documentation
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

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up the database
```bash
cd ../database
mysql -u root -p < schema.sql
```

5. Configure environment variables
```bash
cp backend/.env.example backend/.env
# Edit .env with your database credentials
```

6. Start the development servers
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm start
```

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
