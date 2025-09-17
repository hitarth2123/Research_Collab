const router = require('express').Router();
const Survey = require('../models/SurveyResponse');

/* ─ submit survey ─ */
router.post('/', async (req, res) => {
  try {
    const saved = await Survey.create(req.body);
    res.status(201).json({ id: saved._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ─ basic stats ─ */
router.get('/stats', async (_, res) => {
  const total = await Survey.countDocuments();
  res.json({ total });
});

module.exports = router;
