const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const materialRoutes = require('./src/routes/materialRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const ventaRoutes = require('./src/routes/ventaRoutes');

// Import error handler
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - Standard API routes
app.use('/api/materials', materialRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', productoRoutes);
app.use('/api', require('./src/routes/productoTemporadaRoutes'));
app.use('/api/services', serviceRoutes);
app.use('/api', ventaRoutes);

// Routes - Compatible with frontend URLs (if using proxy or direct connection)
// These routes match the frontend's expected URL structure
// Note: If frontend uses http://IP/Software_FullControl/FullControl_System/public/api/...
// you'll need to configure a reverse proxy (nginx) or update frontend config
app.use('/Software_FullControl/FullControl_System/public/api/materials', materialRoutes);
app.use('/Software_FullControl/FullControl_System/public/api/orders', orderRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', productoRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', require('./src/routes/productoTemporadaRoutes'));
app.use('/Software_FullControl/FullControl_System/public/api/services', serviceRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', ventaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

