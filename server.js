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
const productoTemporadaRoutes = require('./src/routes/productoTemporadaRoutes');
const ofertaRoutes = require('./src/routes/ofertaRoutes');

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
app.use('/api/services', serviceRoutes);
app.use('/api', ventaRoutes);
app.use('/api', productoTemporadaRoutes);
app.use('/api', ofertaRoutes);

// Routes - Compatible with frontend URLs (if using proxy or direct connection)
// These routes match the frontend's expected URL structure
// Note: If frontend uses http://IP/Software_FullControl/FullControl_System/public/api/...
// you'll need to configure a reverse proxy (nginx) or update frontend config
app.use('/Software_FullControl/FullControl_System/public/api/materials', materialRoutes);
app.use('/Software_FullControl/FullControl_System/public/api/orders', orderRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', productoRoutes);
app.use('/Software_FullControl/FullControl_System/public/api/services', serviceRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', ventaRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', productoTemporadaRoutes);
app.use('/Software_FullControl/FullControl_System/public/api', ofertaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), uptime: process.uptime() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access locally: http://localhost:${PORT}`);
});
