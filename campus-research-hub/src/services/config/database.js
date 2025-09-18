
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    // Your corrected MongoDB Atlas connection string with database name
    const mongoURI = 'mongodb+srv://hello:hi@researchproject.9bbabuu.mongodb.net/campus-research-hub?retryWrites=true&w=majority';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection String: mongodb+srv://hello:hi@researchproject.9bbabuu.mongodb.net/campus-research-hub`);
    
    // Test the connection by trying to access collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Available Collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Collections found:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // Detailed error handling
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication failed - check username (hello) and password (hi)');
      console.error('💡 Make sure the user "hello" exists in MongoDB Atlas with correct password');
    } else if (error.message.includes('IP') || error.message.includes('not allowed')) {
      console.error('🌐 IP not whitelisted - add your IP to MongoDB Atlas');
      console.error('💡 Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere');
    } else if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.error('⏰ Connection timeout - check network connectivity and cluster status');
      console.error('💡 Verify the cluster "researchproject" is running in MongoDB Atlas');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to YOUR MongoDB Atlas
connectDB();

// Survey Schema
const surveySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  studentId: String,
  researchArea: { type: String, required: true },
  academicLevel: { type: String, required: true },
  currentProjects: String,
  collaborationNeeds: { type: String, required: true },
  skillsOffered: String,
  skillsNeeded: String,
  resourceRequirements: String,
  submittedAt: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

const Survey = mongoose.model('Survey', surveySchema);

// Test route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Campus Research Hub API is running with YOUR MongoDB!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    database: 'campus-research-hub',
    cluster: 'researchproject.9bbabuu.mongodb.net'
  });
});

// Submit survey endpoint with enhanced logging
app.post('/api/survey', async (req, res) => {
  try {
    console.log('\n📝 ===== NEW SURVEY SUBMISSION =====');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📊 MongoDB Status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    console.log('🗄️ Database:', mongoose.connection.name);
    console.log('📋 Request Data:');
    console.log(JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const { name, email, researchArea, academicLevel, collaborationNeeds } = req.body;
    
    if (!name || !email || !researchArea || !academicLevel || !collaborationNeeds) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, researchArea, academicLevel, collaborationNeeds'
      });
    }
    
    // Check if user already exists
    console.log('🔍 Checking for existing survey with email:', email);
    const existingSurvey = await Survey.findOne({ email: email });
    
    if (existingSurvey) {
      console.log('⚠️ Duplicate submission detected for:', email);
      return res.status(409).json({
        success: false,
        message: 'A survey with this email address already exists.',
        existingSubmission: {
          submittedAt: existingSurvey.submittedAt,
          name: existingSurvey.name
        }
      });
    }

    // Create new survey
    const surveyData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      submittedAt: new Date()
    };

    console.log('💾 Creating new survey document...');
    const survey = new Survey(surveyData);
    
    console.log('🚀 Saving to MongoDB Atlas...');
    const savedSurvey = await survey.save();
    
    console.log('✅ SUCCESS! Survey saved successfully!');
    console.log('🆔 Survey ID:', savedSurvey._id);
    console.log('👤 User:', savedSurvey.name);
    console.log('📧 Email:', savedSurvey.email);
    console.log('🔬 Research Area:', savedSurvey.researchArea);
    console.log('=====================================\n');

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully to MongoDB Atlas!',
      data: {
        id: savedSurvey._id,
        name: savedSurvey.name,
        email: savedSurvey.email,
        researchArea: savedSurvey.researchArea,
        submittedAt: savedSurvey.submittedAt
      }
    });

  } catch (error) {
    console.error('\n🚨 ===== SURVEY SUBMISSION ERROR =====');
    console.error('❌ Error:', error.message);
    console.error('📊 MongoDB Status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
    console.error('🔧 Error Code:', error.code);
    console.error('🗄️ Stack:', error.stack);
    console.error('=====================================\n');
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A survey with this email address already exists.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error submitting survey to database',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get all surveys
app.get('/api/surveys', async (req, res) => {
  try {
    console.log('📊 Fetching all surveys from MongoDB Atlas...');
    const surveys = await Survey.find()
      .select('-ipAddress -userAgent -__v')
      .sort({ submittedAt: -1 })
      .limit(100);
    
    console.log(`✅ Retrieved ${surveys.length} surveys from database: ${mongoose.connection.name}`);
    
    res.json({
      success: true,
      count: surveys.length,
      database: mongoose.connection.name,
      data: surveys
    });
  } catch (error) {
    console.error('❌ Error fetching surveys:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching surveys', 
      error: error.message 
    });
  }
});

// Get user survey by email
app.get('/api/surveys/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log('🔍 Looking up survey for email:', email);
    
    const survey = await Survey.findOne({ email: email })
      .select('-ipAddress -userAgent -__v');
    
    if (survey) {
      console.log('✅ Survey found for:', email);
      res.json({ 
        success: true, 
        data: survey
      });
    } else {
      console.log('❌ No survey found for email:', email);
      res.status(404).json({ 
        success: false, 
        message: 'No survey found for this email'
      });
    }
  } catch (error) {
    console.error('❌ Error fetching user survey:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching survey data', 
      error: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      database: mongoose.connection.name,
      host: mongoose.connection.host
    },
    environment: process.env.NODE_ENV || 'development'
  };
  
  console.log('🏥 Health check requested:', healthData);
  res.json(healthData);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❓ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    availableEndpoints: [
      'GET /',
      'POST /api/survey',  
      'GET /api/surveys',
      'GET /api/surveys/user/:email',
      'GET /api/health'
    ]
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 =======================================');
  console.log(`🔥 Campus Research Hub Backend API`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Access at: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ MongoDB: researchproject.9bbabuu.mongodb.net`);
  console.log(`📊 Database: campus-research-hub`);
  console.log(`📋 API endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/survey`);
  console.log(`   GET  http://localhost:${PORT}/api/surveys`);
  console.log('🚀 =======================================\n');
});

module.exports = app;
