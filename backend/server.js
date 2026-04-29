require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Conectar MongoDB Atlas
connectDB();

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir frontend estático
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================
// RUTAS API
// ============================
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const noticiaRoutes = require('./routes/noticiaRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes');
const { comentarioRouter } = require('./routes/comentarioRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/noticias/:noticiaId/comentarios', comentarioRoutes);
app.use('/api/comentarios', comentarioRouter);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    exito: true,
    mensaje: '🚀 Sistem Network API funcionando',
    version: '1.0.0',
    equipo: 'CKN - Cable Konrad Network',
  });
});

// Cualquier otra ruta → frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌐 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔐 JWT habilitado | MongoDB Atlas conectando...\n`);
});
