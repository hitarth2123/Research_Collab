const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/survey', (req, res) => {
  console.log('Survey received:', req.body);
  res.json({ success: true, message: 'Survey received!' });
});

app.listen(3001, () => {
  console.log('Minimal server running on port 3001');
});
