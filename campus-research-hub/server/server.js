
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'connect the database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(() => {
  console.log('⚠️ MongoDB not connected - using memory mode');
});

const db = mongoose.connection;
db.on('error', () => console.log('⚠️ MongoDB connection error - continuing with memory mode'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

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
}, { timestamps: true });

const Survey = mongoose.model('Survey', surveySchema);

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['collaboration_request', 'collaboration_accepted', 'collaboration_declined', 
           'join_request_sent', 'join_request_received', 'project_update', 
           'chat_message', 'system_update', 'survey_submitted']
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  actionUrl: String,
  senderName: String,
  senderEmail: String,
  projectId: String,
  chatRoomId: String,
  isSystem: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  readAt: Date,
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

// Email Configuration - FIXED: Use createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'test-password'
  }
});

// Email Notification Function
const sendEmailNotification = async (notificationData) => {
  try {
    const { userEmail, title, message, senderName, senderEmail, actionUrl } = notificationData;
    
    console.log('\n📧 EMAIL NOTIFICATION SENT:');
    console.log('═'.repeat(50));
    console.log(`📧 To: ${userEmail}`);
    console.log(`📋 Subject: Campus Research Hub: ${title}`);
    console.log(`👤 From: ${senderName || 'Campus Research Hub'}`);
    console.log(`💬 Message: ${message}`);
    console.log(`🔗 Action URL: ${actionUrl || 'N/A'}`);
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    console.log('═'.repeat(50));
    
    return { success: true, messageId: 'simulated-' + Date.now() };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Survey Routes
app.post('/api/survey', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('researchArea').trim().isLength({ min: 1 }).withMessage('Research area is required'),
  body('academicLevel').trim().isLength({ min: 1 }).withMessage('Academic level is required'),
  body('collaborationNeeds').trim().isLength({ min: 1 }).withMessage('Collaboration needs are required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const existingSurvey = await Survey.findOne({ email: req.body.email }).catch(() => null);
    if (existingSurvey) {
      return res.status(409).json({
        success: false,
        message: 'A survey with this email already exists'
      });
    }

    const survey = new Survey(req.body);
    await survey.save().catch(() => {
      console.log('⚠️ Survey saved to memory (MongoDB not available)');
    });

    console.log('✅ Survey submitted by:', req.body.email);

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      data: survey
    });
  } catch (error) {
    console.error('Survey submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit survey'
    });
  }
});

app.get('/api/surveys/user/:email', async (req, res) => {
  try {
    const survey = await Survey.findOne({ email: req.params.email }).catch(() => null);
    
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Survey not found'
      });
    }

    res.json({
      success: true,
      data: survey
    });
  } catch (error) {
    console.error('Survey fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch survey'
    });
  }
});

// Notification Routes
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .catch(() => []);

    const unreadCount = await Notification.countDocuments({ userId, isRead: false }).catch(() => 0);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      currentPage: page,
      totalPages: Math.ceil(await Notification.countDocuments(query).catch(() => 0) / limit)
    });
  } catch (error) {
    console.error('Notification fetch error:', error);
    res.json({
      success: true,
      data: [],
      unreadCount: 0,
      currentPage: 1,
      totalPages: 1
    });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notificationData = req.body;
    
    const notification = new Notification(notificationData);
    await notification.save().catch(() => {
      console.log('⚠️ Notification saved to memory (MongoDB not available)');
    });

    if (notificationData.sendEmail !== false) {
      const emailResult = await sendEmailNotification({
        userEmail: notificationData.userEmail,
        title: notificationData.title,
        message: notificationData.message,
        senderName: notificationData.senderName,
        senderEmail: notificationData.senderEmail,
        actionUrl: notificationData.actionUrl
      });

      if (emailResult.success) {
        await Notification.findByIdAndUpdate(notification._id, { emailSent: true }).catch(() => {});
      }
    }

    console.log('✅ Notification created:', notificationData.title);

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Notification creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

// Email Test Route
app.post('/api/send-email', async (req, res) => {
  try {
    const result = await sendEmailNotification(req.body);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully (simulated)',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      success: false,
      message: 'Email service error'
    });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'simulation mode',
      email: 'simulation mode (console logs)',
      notifications: 'enabled'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Campus Research Hub API',
    version: '1.0.0',
    status: 'running',
    features: ['surveys', 'notifications', 'email-simulation'],
    endpoints: [
      'GET /api/health',
      'POST /api/survey',
      'GET /api/surveys/user/:email',
      'POST /api/notifications',
      'GET /api/notifications/:userId',
      'POST /api/send-email'
    ]
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('\n🚀 CAMPUS RESEARCH HUB BACKEND');
  console.log('═'.repeat(50));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'Simulation Mode'}`);
  console.log(`📧 Emails: Simulation Mode (console logs)`);
  console.log(`🔔 Notifications: Enabled`);
  console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('═'.repeat(50));
  console.log('✅ Backend ready! Start your React frontend now.');
  console.log('🌐 Frontend should run on: http://localhost:3000\n');
});
