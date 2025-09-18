const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Simple CORS that works
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://hello:hi@researchproject.9bbabuu.mongodb.net/campus-research-hub?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Survey Schema
const surveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  researchArea: { type: String, required: true },
  academicLevel: { type: String, required: true },
  collaborationNeeds: { type: String, required: true },
  skillsOffered: String,
  skillsNeeded: String,
  submittedAt: { type: Date, default: Date.now }
});

const Survey = mongoose.model('Survey', surveySchema);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Campus Research Hub API is working!', mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Survey submission
app.post('/api/survey', async (req, res) => {
  try {
    console.log('📝 Survey received:', req.body);
    
    const { name, email, researchArea, academicLevel, collaborationNeeds } = req.body;
    
    if (!name || !email || !researchArea || !academicLevel || !collaborationNeeds) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check for existing survey
    const existingSurvey = await Survey.findOne({ email });
    if (existingSurvey) {
      return res.status(409).json({
        success: false,
        message: 'Survey with this email already exists'
      });
    }

    // Save new survey
    const survey = new Survey(req.body);
    const savedSurvey = await survey.save();
    
    console.log('✅ Survey saved to MongoDB Atlas!');
    console.log('🆔 ID:', savedSurvey._id);
    console.log('👤 Name:', savedSurvey.name);
    
    res.json({
      success: true,
      message: 'Survey saved to MongoDB Atlas!',
      data: {
        id: savedSurvey._id,
        name: savedSurvey.name,
        email: savedSurvey.email
      }
    });

  } catch (error) {
    console.error('❌ Error saving survey:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving survey',
      error: error.message
    });
  }
});

app.listen(3001, () => {
  console.log('🚀 Campus Research Hub API running on port 3001');
  console.log('🌐 http://localhost:3001');
  console.log('🏥 Health: http://localhost:3001/api/health');
});
