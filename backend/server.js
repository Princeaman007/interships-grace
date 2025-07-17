// ===============================================
// server.js (Point d'entrée)
// ===============================================
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer l'app
const app = require('./app');

// Connecter à la base de données
const connectDB = require('./config/database');
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Serveur Nexaid démarré sur le port ${PORT}`);
  console.log(`📍 Mode: ${process.env.NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Erreur: ${err.message}`);
  // Fermer le serveur et quitter
  server.close(() => {
    process.exit(1);
  });
});