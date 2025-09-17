const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const rateLim  = require('express-rate-limit');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5001;

/* ── middleware ─────────────────────────────────────────── */
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use(
  '/api/',
  rateLim({ windowMs: 15 * 60 * 1000, max: 100 })
);

/* ── database ───────────────────────────────────────────── */
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅  MongoDB connected'))
  .catch(err => console.error('❌  MongoDB error:', err));

/* ── routes ─────────────────────────────────────────────── */
app.use('/api/survey', require('./routes/survey'));

app.get('/api/health', (_, res) =>
  res.json({ status: 'OK', uptime: process.uptime() })
);

/* ── start ──────────────────────────────────────────────── */
app.listen(PORT, () => console.log(`🚀  API running on :${PORT}`));
