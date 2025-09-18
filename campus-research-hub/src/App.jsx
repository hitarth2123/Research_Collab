
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import Auth from './components/Auth';

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSurveyData, setUserSurveyData] = useState(null);
  
  // Project filtering state
  const [projectFilter, setProjectFilter] = useState('all');
  const [researchAreaFilter, setResearchAreaFilter] = useState('All');
  
  // Profile page navigation state
  const [activeProfileSection, setActiveProfileSection] = useState('overview');
  
  // Project Join Modal State
  const [joinProjectModal, setJoinProjectModal] = useState(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinStatus, setJoinStatus] = useState('');
  
  // User Profile Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Chat System State
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [chatUsers, setChatUsers] = useState({});
  
  // NEW: Advanced Notification System State
  const [notifications, setNotifications] = useState([]);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    collaborationRequests: true,
    chatMessages: true,
    systemUpdates: true
  });
  
  // Survey form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    researchArea: '',
    academicLevel: '',
    currentProjects: '',
    collaborationNeeds: '',
    skillsOffered: '',
    skillsNeeded: '',
    resourceRequirements: ''
  });

  // Enhanced collaboration requests with working buttons and notification integration
  const [collaborationRequests, setCollaborationRequests] = useState([
    {
      id: 1,
      type: 'collaboration',
      title: 'AI-Powered Healthcare Analytics',
      from: 'dr.sarah.chen@stanford.edu',
      fromName: 'Dr. Sarah Chen',
      message: 'Hi! I saw your research profile and would love to collaborate on my healthcare AI project. Your machine learning expertise would be perfect for analyzing patient data patterns.',
      date: '2 days ago',
      timestamp: '2025-09-20T10:30:00Z',
      status: 'pending'
    },
    {
      id: 2,
      type: 'join_project',
      title: 'Quantum Computing Research Initiative',
      from: 'prof.martinez@mit.edu',
      fromName: 'Prof. Martinez',
      message: 'We\'re looking for researchers with your background to join our quantum security research. Interested in contributing to groundbreaking cryptography work?',
      date: '1 week ago',
      timestamp: '2025-09-15T14:20:00Z',
      status: 'pending'
    },
    {
      id: 3,
      type: 'collaboration',
      title: 'Climate Data Analysis Project',
      from: 'dr.patel@research.org',
      fromName: 'Dr. Patel',
      message: 'Your data science skills would be invaluable for our climate research project. Would you be interested in collaborating?',
      date: '3 days ago',
      timestamp: '2025-09-19T16:45:00Z',
      status: 'pending'
    },
    {
      id: 4,
      type: 'collaboration',
      title: 'Blockchain Security Research',
      from: 'alex.rodriguez@techuni.edu',
      fromName: 'Alex Rodriguez',
      message: 'Looking for experts in cryptography to collaborate on our blockchain security project. Your background seems perfect!',
      date: '5 days ago',
      timestamp: '2025-09-17T11:15:00Z',
      status: 'pending'
    },
    {
      id: 5,
      type: 'join_project',
      title: 'Neural Network Optimization',
      from: 'prof.kim@airesearch.org',
      fromName: 'Prof. Kim',
      message: 'We have an opening in our neural network optimization research team. Would you like to join our cutting-edge AI research?',
      date: '1 day ago',
      timestamp: '2025-09-21T09:30:00Z',
      status: 'pending'
    }
  ]);

  // Enhanced profile page data with project lifecycle stages and chat rooms
  const [myActiveProjects] = useState([
    {
      id: 101,
      title: "Machine Learning for Climate Data",
      description: "Developing advanced ML models to predict climate patterns using satellite imagery and IoT sensor networks.",
      status: "Ongoing",
      progress: 78,
      role: "Lead Researcher",
      startDate: "2024-09-01",
      deadline: "2025-12-15",
      collaborators: ["Dr. Sarah Chen", "Mark Rodriguez", "Lisa Park"],
      skills: ["Python", "TensorFlow", "Climate Science"],
      funding: "$45,000",
      university: "Stanford University",
      phase: "Execution",
      requestStatus: "approved",
      lastUpdated: "2025-09-20",
      chatRoomId: "project_101_chat",
      chatRoomName: "Climate ML Team Chat",
      hasUnreadMessages: true,
      lastChatActivity: "2025-09-22T02:30:00Z"
    },
    {
      id: 102,
      title: "Quantum Security Protocols",
      description: "Research on quantum-resistant encryption methods for blockchain applications and secure communications.",
      status: "Ongoing", 
      progress: 65,
      role: "Co-Researcher",
      startDate: "2024-06-15",
      deadline: "2025-11-30",
      collaborators: ["Prof. Michael Zhang", "Dr. Jennifer Liu"],
      skills: ["Quantum Computing", "Cryptography", "Python"],
      funding: "$75,000",
      university: "MIT",
      phase: "Monitoring",
      requestStatus: "approved",
      lastUpdated: "2025-09-18",
      chatRoomId: "project_102_chat",
      chatRoomName: "Quantum Security Team",
      hasUnreadMessages: false,
      lastChatActivity: "2025-09-21T15:45:00Z"
    },
    {
      id: 103,
      title: "Neural Network Optimization",
      description: "Optimizing deep learning architectures for better performance in medical image analysis applications.",
      status: "Completed",
      progress: 100,
      role: "Research Assistant",
      startDate: "2024-10-01",
      deadline: "2025-08-30",
      collaborators: ["Dr. Emily Watson", "Prof. David Kim"],
      skills: ["Deep Learning", "Medical AI", "PyTorch"],
      funding: "$32,000",
      university: "Carnegie Mellon",
      phase: "Closure",
      requestStatus: "approved",
      lastUpdated: "2025-08-30",
      completionDate: "2025-08-30",
      outcome: "Successfully published in Nature AI journal",
      chatRoomId: "project_103_chat",
      chatRoomName: "Neural Network Team (Archived)",
      hasUnreadMessages: false,
      lastChatActivity: "2025-08-30T10:00:00Z",
      isArchived: true
    }
  ]);

  // Collaboration chat rooms
  const [myCollaborationChats] = useState([
    {
      id: 'collab_201',
      title: 'AI Ethics Research Group',
      collaboratorName: 'Dr. Sarah Chen',
      collaboratorEmail: 'sarah.chen@stanford.edu',
      type: 'direct_collaboration',
      status: 'active',
      startDate: '2024-09-01',
      chatRoomId: 'collab_201_chat',
      chatRoomName: 'AI Ethics Discussion',
      hasUnreadMessages: true,
      lastChatActivity: '2025-09-22T01:15:00Z',
      researchArea: 'AI Ethics'
    },
    {
      id: 'collab_202',
      title: 'Blockchain Healthcare Initiative',
      collaboratorName: 'Prof. Michael Zhang',
      collaboratorEmail: 'michael.zhang@mit.edu',
      type: 'joint_research',
      status: 'active',
      startDate: '2024-06-15',
      chatRoomId: 'collab_202_chat',
      chatRoomName: 'Blockchain Health Chat',
      hasUnreadMessages: false,
      lastChatActivity: '2025-09-21T18:30:00Z',
      researchArea: 'Blockchain Technology'
    }
  ]);

  // Mock chat data
  const [mockChatData] = useState({
    'project_101_chat': [
      {
        id: '1',
        sender: 'Dr. Sarah Chen',
        senderEmail: 'sarah.chen@stanford.edu',
        message: 'Great progress on the climate model! The accuracy has improved by 15% with the new dataset.',
        timestamp: '2025-09-22T02:30:00Z',
        isCurrentUser: false
      },
      {
        id: '2',
        sender: 'You',
        senderEmail: user?.email || 'you@university.edu',
        message: 'Thanks! I think we can optimize it further by adjusting the neural network architecture.',
        timestamp: '2025-09-22T02:32:00Z',
        isCurrentUser: true
      },
      {
        id: '3',
        sender: 'Mark Rodriguez',
        senderEmail: 'mark.rodriguez@stanford.edu',
        message: 'Should we schedule a meeting to discuss the next phase? I have some ideas for the sensor integration.',
        timestamp: '2025-09-22T02:45:00Z',
        isCurrentUser: false
      }
    ],
    'project_102_chat': [
      {
        id: '1',
        sender: 'Prof. Michael Zhang',
        senderEmail: 'michael.zhang@mit.edu',
        message: 'The quantum encryption algorithm is working well in our tests. Ready for the next milestone?',
        timestamp: '2025-09-21T15:45:00Z',
        isCurrentUser: false
      },
      {
        id: '2',
        sender: 'You',
        senderEmail: user?.email || 'you@university.edu',
        message: 'Yes, I\'ve completed the security analysis. The results look promising!',
        timestamp: '2025-09-21T16:00:00Z',
        isCurrentUser: true
      }
    ],
    'collab_201_chat': [
      {
        id: '1',
        sender: 'Dr. Sarah Chen',
        senderEmail: 'sarah.chen@stanford.edu',
        message: 'I found some interesting papers on bias detection in AI systems. Want to review them together?',
        timestamp: '2025-09-22T01:15:00Z',
        isCurrentUser: false
      },
      {
        id: '2',
        sender: 'You',
        senderEmail: user?.email || 'you@university.edu',
        message: 'Absolutely! Please share the links and I\'ll go through them today.',
        timestamp: '2025-09-22T01:20:00Z',
        isCurrentUser: true
      }
    ],
    'collab_202_chat': [
      {
        id: '1',
        sender: 'Prof. Michael Zhang',
        senderEmail: 'michael.zhang@mit.edu',
        message: 'The blockchain prototype for patient records is ready for testing. When can we run the demo?',
        timestamp: '2025-09-21T18:30:00Z',
        isCurrentUser: false
      }
    ]
  });

  // Requested Projects
  const [myRequestedProjects] = useState([
    {
      id: 201,
      title: "Blockchain Healthcare Records",
      description: "Developing secure blockchain-based system for managing patient medical records with privacy protection.",
      requestDate: "2025-09-18",
      status: "Requested",
      requestStatus: "pending",
      projectLead: "Dr. Maria Garcia",
      university: "Harvard Medical School",
      funding: "$95,000",
      deadline: "2026-01-15",
      myMessage: "I'm interested in contributing my blockchain expertise to your healthcare data project.",
      skills: ["Blockchain", "Healthcare IT", "Security"],
      phase: "Planning"
    },
    {
      id: 202,
      title: "Social Impact of AI",
      description: "Research on AI ethics and responsible AI development focusing on social implications and bias mitigation.",
      requestDate: "2025-09-15",
      status: "Requested",
      requestStatus: "under_review",
      projectLead: "Prof. David Chen",
      university: "UC Berkeley",
      funding: "$65,000",
      deadline: "2025-12-20",
      myMessage: "Your research on AI ethics aligns perfectly with my work on responsible AI development.",
      skills: ["AI Ethics", "Social Research", "Policy Analysis"],
      phase: "Initiation"
    },
    {
      id: 203,
      title: "Sustainable Urban Planning",
      description: "Using data analytics to optimize urban infrastructure for sustainability and reduced environmental impact.",
      requestDate: "2025-09-10",
      status: "Requested",
      requestStatus: "declined",
      projectLead: "Dr. Lisa Park",
      university: "MIT Urban Planning",
      funding: "$80,000",
      deadline: "2025-11-30",
      myMessage: "I'd like to apply my data science skills to urban sustainability challenges.",
      skills: ["Urban Planning", "Data Analytics", "GIS"],
      phase: "Planning",
      declineReason: "Project team is already complete"
    }
  ]);

  const [myCollaborators] = useState([
    {
      id: 201,
      name: "Dr. Sarah Chen",
      researchArea: "Climate Science",
      affiliation: "Stanford University",
      email: "sarah.chen@stanford.edu",
      collaborationsSince: "2024-09-01",
      sharedProjects: 2,
      status: "Active Collaborator",
      profileImage: "👩‍🔬",
      skills: ["Climate Modeling", "Data Analysis", "Python"],
      recentActivity: "Shared climate dataset - 2 days ago"
    },
    {
      id: 202,
      name: "Prof. Michael Zhang",
      researchArea: "Quantum Computing",
      affiliation: "MIT",
      email: "michael.zhang@mit.edu",
      collaborationsSince: "2024-06-15",
      sharedProjects: 1,
      status: "Active Collaborator",
      profileImage: "👨‍💼",
      skills: ["Quantum Algorithms", "Cryptography", "Mathematics"],
      recentActivity: "Published joint paper - 1 week ago"
    },
    {
      id: 203,
      name: "Dr. Emily Watson",
      researchArea: "Artificial Intelligence",
      affiliation: "Carnegie Mellon",
      email: "emily.watson@cmu.edu",
      collaborationsSince: "2024-10-01",
      sharedProjects: 1,
      status: "Past Collaborator",
      profileImage: "👩‍💼",
      skills: ["Deep Learning", "Computer Vision", "Medical AI"],
      recentActivity: "Project completed successfully - 2 weeks ago"
    }
  ]);

  const [sentRequests] = useState([
    {
      id: 301,
      projectTitle: "Blockchain Healthcare Records",
      recipientName: "Dr. Maria Garcia",
      recipientEmail: "maria.garcia@harvard.edu",
      sentDate: "2025-09-18",
      status: "Pending",
      message: "I'm interested in contributing my blockchain expertise to your healthcare data project.",
      projectLead: "Dr. Maria Garcia",
      university: "Harvard Medical School"
    },
    {
      id: 302,
      projectTitle: "Social Impact of AI",
      recipientName: "Prof. David Chen",
      recipientEmail: "david.chen@berkeley.edu",
      sentDate: "2025-09-15",
      status: "Under Review",
      message: "Your research on AI ethics aligns perfectly with my work on responsible AI development.",
      projectLead: "Prof. David Chen",
      university: "UC Berkeley"
    }
  ]);

  const [actionMessage, setActionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Enhanced research projects
  const [researchProjects] = useState([
    {
      id: 1,
      title: "AI-Powered Climate Change Prediction",
      description: "Developing machine learning models to predict climate patterns using satellite data and IoT sensors. We're looking for researchers to help with data analysis and model validation.",
      collaborators: ["Dr. Sarah Johnson", "Mark Chen", "Anna Rodriguez"],
      researchArea: "Environmental Science",
      status: "Active",
      progress: 75,
      deadline: "2025-12-15",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      lookingFor: ["Climate Data Expert", "Statistical Analyst"],
      createdBy: "Dr. Sarah Johnson",
      location: "Stanford University",
      funding: "$50,000",
      type: "Research Paper",
      phase: "Execution",
      startDate: "2024-08-15"
    },
    {
      id: 2,
      title: "Quantum Computing Applications in Cryptography",
      description: "Exploring quantum algorithms for next-generation encryption methods. This project aims to develop quantum-resistant cryptographic protocols for blockchain applications.",
      collaborators: ["Prof. Michael Zhang", "Lisa Park"],
      researchArea: "Computer Science",
      status: "Recruiting",
      progress: 25,
      deadline: "2026-06-30",
      skills: ["Quantum Computing", "Cryptography", "Mathematics"],
      lookingFor: ["Quantum Physicist", "Security Researcher"],
      createdBy: "Prof. Michael Zhang",
      location: "MIT",
      funding: "$120,000",
      type: "PhD Thesis",
      phase: "Planning",
      startDate: "2025-01-15"
    },
    {
      id: 3,
      title: "Social Media Impact on Mental Health",
      description: "Large-scale study analyzing social media usage patterns and their correlation with mental health outcomes in young adults aged 18-25.",
      collaborators: ["Dr. Rachel Kim", "James Wilson"],
      researchArea: "Psychology",
      status: "Data Collection",
      progress: 60,
      deadline: "2025-09-20",
      skills: ["Psychology", "Statistics", "Survey Design"],
      lookingFor: ["Data Analyst", "Mental Health Expert"],
      createdBy: "Dr. Rachel Kim",
      location: "UC Berkeley",
      funding: "$35,000",
      type: "Survey Study",
      phase: "Execution",
      startDate: "2024-05-01"
    },
    {
      id: 4,
      title: "CRISPR Gene Editing for Rare Diseases",
      description: "Innovative gene therapy research focusing on treating rare genetic disorders using CRISPR-Cas9 technology with enhanced precision and safety.",
      collaborators: ["Dr. Maria Garcia", "Prof. Chen Li"],
      researchArea: "Biotechnology",
      status: "Active",
      progress: 90,
      deadline: "2025-11-30",
      skills: ["Molecular Biology", "Gene Editing", "Clinical Research"],
      lookingFor: ["Bioinformatics Specialist", "Clinical Trial Coordinator"],
      createdBy: "Dr. Maria Garcia",
      location: "Harvard Medical School",
      funding: "$200,000",
      type: "Clinical Trial",
      phase: "Monitoring",
      startDate: "2024-02-01"
    },
    {
      id: 5,
      title: "Sustainable Energy Storage Solutions",
      description: "Developing next-generation battery technology using nanomaterials for renewable energy storage systems.",
      collaborators: ["Prof. Alex Kim"],
      researchArea: "Environmental Science",
      status: "Recruiting",
      progress: 15,
      deadline: "2026-03-15",
      skills: ["Materials Science", "Chemistry", "Engineering"],
      lookingFor: ["Materials Engineer", "Chemistry Researcher"],
      createdBy: "Prof. Alex Kim",
      location: "Caltech",
      funding: "$85,000",
      type: "Engineering Project",
      phase: "Initiation",
      startDate: "2025-02-01"
    },
    {
      id: 6,
      title: "Natural Language Processing for Medical Diagnosis",
      description: "Creating AI systems that can analyze medical texts and assist in diagnostic processes using advanced NLP techniques.",
      collaborators: ["Dr. Jennifer Liu", "Sam Rodriguez", "Dr. Mike Chen"],
      researchArea: "Computer Science",
      status: "Data Collection",
      progress: 45,
      deadline: "2025-10-30",
      skills: ["Natural Language Processing", "Machine Learning", "Medical Informatics"],
      lookingFor: ["NLP Engineer", "Medical Domain Expert"],
      createdBy: "Dr. Jennifer Liu",
      location: "Carnegie Mellon University",
      funding: "$75,000",
      type: "AI Research",
      phase: "Execution",
      startDate: "2024-07-01"
    }
  ]);

  const [availableCollaborators] = useState([
    {
      id: 1,
      name: "Dr. Emily Watson",
      researchArea: "Artificial Intelligence",
      affiliation: "Stanford University",
      skills: ["Deep Learning", "Computer Vision", "Python"],
      activeProjects: 3,
      publications: 45,
      profileImage: "👩‍💼",
      email: "emily.watson@stanford.edu",
      bio: "Leading researcher in AI applications for healthcare and climate science.",
      experience: "10+ years"
    },
    {
      id: 2,
      name: "Prof. David Chen",
      researchArea: "Environmental Science",
      affiliation: "MIT",
      skills: ["Climate Modeling", "Data Analysis", "GIS"],
      activeProjects: 2,
      publications: 67,
      profileImage: "👨‍🔬",
      email: "david.chen@mit.edu",
      bio: "Expert in climate data analysis and environmental modeling systems.",
      experience: "15+ years"
    },
    {
      id: 3,
      name: "Dr. Maria Garcia",
      researchArea: "Biotechnology",
      affiliation: "Harvard Medical School",
      skills: ["Genomics", "Bioinformatics", "Molecular Biology"],
      activeProjects: 4,
      publications: 52,
      profileImage: "👩‍⚕️",
      email: "maria.garcia@harvard.edu",
      bio: "Pioneering research in gene therapy and personalized medicine.",
      experience: "12+ years"
    }
  ]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        fetchUserSurveyData(user.email);
        initializeChatData();
        initializeNotifications();
      }
    });

    return () => unsubscribe();
  }, []);

  // NEW: Initialize notifications system
  const initializeNotifications = () => {
    setChatMessages(mockChatData);
    
    // Initialize with some sample notifications
    const initialNotifications = [
      {
        id: 'notif_001',
        type: 'collaboration_request',
        title: 'New Collaboration Request',
        message: 'Dr. Sarah Chen wants to collaborate on AI-Powered Healthcare Analytics',
        timestamp: '2025-09-22T03:15:00Z',
        isRead: false,
        priority: 'high',
        actionUrl: '/profile?section=requests',
        senderEmail: 'dr.sarah.chen@stanford.edu',
        senderName: 'Dr. Sarah Chen'
      },
      {
        id: 'notif_002',
        type: 'project_update',
        title: 'Project Milestone Completed',
        message: 'Machine Learning for Climate Data project reached 78% completion',
        timestamp: '2025-09-22T02:30:00Z',
        isRead: false,
        priority: 'medium',
        actionUrl: '/profile?section=ongoing-projects',
        projectId: 101
      },
      {
        id: 'notif_003',
        type: 'chat_message',
        title: 'New Team Message',
        message: 'Dr. Sarah Chen: "Great progress on the climate model!"',
        timestamp: '2025-09-22T02:30:00Z',
        isRead: true,
        priority: 'low',
        actionUrl: '/chats?room=project_101_chat',
        chatRoomId: 'project_101_chat'
      },
      {
        id: 'notif_004',
        type: 'system_update',
        title: 'Platform Update',
        message: 'New chat features are now available for team collaboration',
        timestamp: '2025-09-22T01:00:00Z',
        isRead: false,
        priority: 'low',
        actionUrl: '/chats',
        isSystem: true
      }
    ];
    
    setNotifications(initialNotifications);
    setUnreadNotificationsCount(initialNotifications.filter(n => !n.isRead).length);
  };

  // Initialize chat data
  const initializeChatData = () => {
    setChatMessages(mockChatData);
  };

  const fetchUserSurveyData = async (email) => {
    try {
      const response = await fetch(`http://localhost:3001/api/surveys/user/${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserSurveyData(data.data);
        }
      }
    } catch (error) {
      console.log('No survey data found for user');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowAuth(false);
      setActiveTab('dashboard');
      setActiveChatRoom(null);
      setShowNotificationPanel(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // NEW: Advanced Notification Functions
  const addNotification = (notificationData) => {
    const newNotification = {
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'medium',
      ...notificationData
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadNotificationsCount(prev => prev + 1);
    
    // Send email notification if enabled
    if (notificationPreferences.emailNotifications) {
      sendEmailNotification(newNotification);
    }
    
    // Show browser notification if enabled
    if (notificationPreferences.pushNotifications && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: '/favicon.ico'
            });
          }
        });
      }
    }
  };

  // NEW: Email notification function (simulated)
  const sendEmailNotification = async (notification) => {
    if (!user?.email || !notificationPreferences.emailNotifications) return;

    const emailData = {
      to: user.email,
      subject: `Campus Research Hub: ${notification.title}`,
      html: generateEmailTemplate(notification),
      from: 'notifications@campusresearchhub.edu'
    };

    try {
      // Simulated email sending - In production, this would call your backend API
      console.log('📧 Email Notification Sent:', {
        to: emailData.to,
        subject: emailData.subject,
        type: notification.type,
        timestamp: new Date().toISOString()
      });

      // Simulate actual email API call
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        console.log('✅ Email sent successfully');
      } else {
        console.error('❌ Failed to send email');
      }
    } catch (error) {
      console.error('Email notification error:', error);
    }
  };

  // NEW: Generate email template
  const generateEmailTemplate = (notification) => {
    const baseStyle = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 600px; margin: 0 auto;';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Campus Research Hub Notification</title>
      </head>
      <body style="${baseStyle}">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 2rem; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 1.5rem;">Campus Research Hub</h1>
          <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Research Collaboration Platform</p>
        </div>
        
        <div style="padding: 2rem; background: #ffffff;">
          <h2 style="color: #1e293b; margin: 0 0 1rem 0;">${notification.title}</h2>
          <p style="color: #64748b; line-height: 1.6; margin: 0 0 1.5rem 0;">
            ${notification.message}
          </p>
          
          ${notification.senderName ? `
            <div style="background: #f8fafc; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
              <strong style="color: #1e293b;">From:</strong> ${notification.senderName}
              ${notification.senderEmail ? `<br><span style="color: #64748b; font-size: 0.875rem;">${notification.senderEmail}</span>` : ''}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 2rem 0;">
            <a href="https://campusresearchhub.edu${notification.actionUrl || '/dashboard'}" 
               style="background: #3b82f6; color: white; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600;">
              View Details
            </a>
          </div>
        </div>
        
        <div style="background: #f8fafc; padding: 1.5rem; text-align: center; color: #64748b; font-size: 0.875rem;">
          <p style="margin: 0;">This notification was sent at ${new Date(notification.timestamp).toLocaleString()}</p>
          <p style="margin: 0.5rem 0 0 0;">
            <a href="https://campusresearchhub.edu/settings/notifications" style="color: #3b82f6;">Manage notification preferences</a>
          </p>
        </div>
      </body>
      </html>
    `;
  };

  // NEW: Mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, isRead: true }
        : notif
    ));
    
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    }
  };

  // NEW: Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    setUnreadNotificationsCount(0);
  };

  // NEW: Delete notification
  const deleteNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
    }
    
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Chat functionality
  const handleOpenChat = (chatRoomId, chatRoomName, type = 'project') => {
    setActiveChatRoom({
      id: chatRoomId,
      name: chatRoomName,
      type: type
    });
    
    // Mark messages as read
    if (type === 'project') {
      const project = myActiveProjects.find(p => p.chatRoomId === chatRoomId);
      if (project) {
        project.hasUnreadMessages = false;
      }
    } else if (type === 'collaboration') {
      const collab = myCollaborationChats.find(c => c.chatRoomId === chatRoomId);
      if (collab) {
        collab.hasUnreadMessages = false;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatRoom || isSendingMessage) return;

    setIsSendingMessage(true);

    try {
      const messageData = {
        id: Date.now().toString(),
        sender: 'You',
        senderEmail: user?.email || 'you@university.edu',
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isCurrentUser: true
      };

      setChatMessages(prev => ({
        ...prev,
        [activeChatRoom.id]: [...(prev[activeChatRoom.id] || []), messageData]
      }));

      setNewMessage('');
      
      // Add notification for new message
      addNotification({
        type: 'chat_message_sent',
        title: 'Message Sent',
        message: `Message sent to ${activeChatRoom.name}`,
        priority: 'low',
        actionUrl: `/chats?room=${activeChatRoom.id}`,
        chatRoomId: activeChatRoom.id
      });
      
      // Simulate response
      setTimeout(() => {
        const responseMessage = {
          id: (Date.now() + 1).toString(),
          sender: activeChatRoom.type === 'project' ? 'Dr. Sarah Chen' : 'Prof. Michael Zhang',
          senderEmail: activeChatRoom.type === 'project' ? 'sarah.chen@stanford.edu' : 'michael.zhang@mit.edu',
          message: 'Thanks for the update! Let me review this and get back to you.',
          timestamp: new Date().toISOString(),
          isCurrentUser: false
        };

        setChatMessages(prev => ({
          ...prev,
          [activeChatRoom.id]: [...(prev[activeChatRoom.id] || []), responseMessage]
        }));

        // Add notification for received message
        addNotification({
          type: 'chat_message',
          title: 'New Message',
          message: `${responseMessage.sender}: ${responseMessage.message.substring(0, 50)}...`,
          priority: 'medium',
          actionUrl: `/chats?room=${activeChatRoom.id}`,
          chatRoomId: activeChatRoom.id,
          senderName: responseMessage.sender,
          senderEmail: responseMessage.senderEmail
        });
      }, 2000);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Enhanced collaboration request handlers with notifications
  const handleCollaborationResponse = (requestId, action) => {
    setCollaborationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action } 
          : req
      )
    );
    
    const request = collaborationRequests.find(req => req.id === requestId);
    
    if (action === 'accepted') {
      setActionMessage(`✅ Accepted collaboration request from ${request.fromName} - Chat room created!`);
      
      // Add notification for accepted collaboration
      addNotification({
        type: 'collaboration_accepted',
        title: 'Collaboration Accepted',
        message: `You accepted the collaboration request for "${request.title}" from ${request.fromName}`,
        priority: 'high',
        actionUrl: '/chats',
        senderName: request.fromName,
        senderEmail: request.from
      });
      
      // Send email notification to the requester
      if (notificationPreferences.emailNotifications) {
        sendEmailNotification({
          type: 'collaboration_response',
          title: 'Collaboration Request Accepted',
          message: `Your collaboration request for "${request.title}" has been accepted!`,
          senderName: user?.displayName || user?.email,
          senderEmail: user?.email,
          timestamp: new Date().toISOString()
        });
      }
      
      // Simulate creating a new chat room
      setTimeout(() => {
        const newChatRoom = {
          id: `collab_${Date.now()}`,
          title: request.title,
          collaboratorName: request.fromName,
          collaboratorEmail: request.from,
          type: 'direct_collaboration',
          status: 'active',
          startDate: new Date().toISOString(),
          chatRoomId: `collab_${Date.now()}_chat`,
          chatRoomName: `${request.title} Discussion`,
          hasUnreadMessages: false,
          lastChatActivity: new Date().toISOString(),
          researchArea: 'New Collaboration'
        };
        
        myCollaborationChats.push(newChatRoom);
        console.log('New collaboration chat room created:', newChatRoom);
      }, 1000);
      
    } else {
      setActionMessage(`❌ Declined collaboration request from ${request.fromName}`);
      
      // Add notification for declined collaboration
      addNotification({
        type: 'collaboration_declined',
        title: 'Collaboration Declined',
        message: `You declined the collaboration request for "${request.title}" from ${request.fromName}`,
        priority: 'medium',
        actionUrl: '/profile?section=requests',
        senderName: request.fromName,
        senderEmail: request.from
      });
      
      // Send email notification to the requester
      if (notificationPreferences.emailNotifications) {
        sendEmailNotification({
          type: 'collaboration_response',
          title: 'Collaboration Request Declined',
          message: `Your collaboration request for "${request.title}" has been declined.`,
          senderName: user?.displayName || user?.email,
          senderEmail: user?.email,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    setTimeout(() => setActionMessage(''), 3000);
    console.log(`${action} collaboration request:`, request);
  };

  const getPendingRequestsCount = () => {
    return collaborationRequests.filter(req => req.status === 'pending').length;
  };

  // Helper functions for project counts
  const getOngoingProjectsCount = () => {
    return myActiveProjects.filter(p => p.status === 'Ongoing').length;
  };

  const getCompletedProjectsCount = () => {
    return myActiveProjects.filter(p => p.status === 'Completed').length;
  };

  const getRequestedProjectsCount = () => {
    return myRequestedProjects.filter(p => p.status === 'Requested').length;
  };

  // Helper function for chat counts
  const getUnreadChatCount = () => {
    const projectUnread = myActiveProjects.filter(p => p.hasUnreadMessages && p.status === 'Ongoing').length;
    const collabUnread = myCollaborationChats.filter(c => c.hasUnreadMessages).length;
    return projectUnread + collabUnread;
  };

  // Project filtering functions
  const getFilteredProjects = () => {
    let filtered = researchProjects;

    if (projectFilter === 'active') {
      filtered = filtered.filter(p => p.status === 'Active');
    } else if (projectFilter === 'recruiting') {
      filtered = filtered.filter(p => p.status === 'Recruiting');
    } else if (projectFilter === 'data-collection') {
      filtered = filtered.filter(p => p.status === 'Data Collection');
    } else if (projectFilter === 'my-projects') {
      filtered = filtered.filter(p => p.collaborators.includes('You') || p.owner === 'You');
    }

    if (researchAreaFilter !== 'All') {
      filtered = filtered.filter(p => p.researchArea === researchAreaFilter);
    }

    return filtered;
  };

  // NEW: Notification Panel Component
  const NotificationPanel = () => (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '2rem',
      width: '400px',
      maxHeight: '600px',
      background: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid #e2e8f0',
      zIndex: 1000,
      display: showNotificationPanel ? 'flex' : 'none',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
            🔔 Notifications
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
            {unreadNotificationsCount} unread
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#3b82f6',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={() => setShowNotificationPanel(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '1.25rem',
              padding: '0.25rem'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        maxHeight: '500px'
      }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>No notifications</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #f1f5f9',
                background: notification.isRead ? '#ffffff' : '#f8fafc',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                position: 'relative'
              }}
              onClick={() => {
                markNotificationAsRead(notification.id);
                if (notification.actionUrl) {
                  // Handle navigation based on actionUrl
                  if (notification.actionUrl.includes('requests')) {
                    setActiveTab('profile');
                    setActiveProfileSection('requests');
                  } else if (notification.actionUrl.includes('chats')) {
                    setActiveTab('chats');
                    if (notification.chatRoomId) {
                      handleOpenChat(notification.chatRoomId, notification.chatRoomName || 'Chat', 'project');
                    }
                  } else if (notification.actionUrl.includes('ongoing-projects')) {
                    setActiveTab('profile');
                    setActiveProfileSection('ongoing-projects');
                  }
                  setShowNotificationPanel(false);
                }
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = notification.isRead ? '#f8fafc' : '#f1f5f9';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = notification.isRead ? '#ffffff' : '#f8fafc';
              }}
            >
              {!notification.isRead && (
                <div style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  borderRadius: '50%'
                }}></div>
              )}
              
              <div style={{ paddingLeft: notification.isRead ? '0' : '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h4 style={{
                    margin: 0,
                    color: '#1e293b',
                    fontSize: '0.875rem',
                    fontWeight: notification.isRead ? '500' : '600',
                    lineHeight: '1.4'
                  }}>
                    {notification.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      padding: '0.25rem'
                    }}
                  >
                    ✕
                  </button>
                </div>
                
                <p style={{
                  margin: '0 0 0.5rem 0',
                  color: '#64748b',
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}>
                  {notification.message}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    background: notification.priority === 'high' ? '#fecaca' : 
                               notification.priority === 'medium' ? '#fef3c7' : '#e0f2fe',
                    color: notification.priority === 'high' ? '#dc2626' : 
                           notification.priority === 'medium' ? '#d97706' : '#0369a1',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {notification.priority}
                  </span>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Chat Component
  const ChatInterface = () => {
    if (!activeChatRoom) return null;

    const messages = chatMessages[activeChatRoom.id] || [];

    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        right: '2rem',
        width: '400px',
        height: '500px',
        background: '#ffffff',
        borderRadius: '12px 12px 0 0',
        boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000
      }}>
        {/* Chat Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600' }}>
              💬 {activeChatRoom.name}
            </h4>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
              {activeChatRoom.type === 'project' ? 'Project Team Chat' : 'Direct Collaboration'}
            </p>
          </div>
          <button
            onClick={() => setActiveChatRoom(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {messages.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: '#64748b',
              fontSize: '0.875rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <p>Start your collaboration discussion!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: msg.isCurrentUser ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}
              >
                <div style={{
                  background: msg.isCurrentUser ? '#3b82f6' : '#f1f5f9',
                  color: msg.isCurrentUser ? 'white' : '#1e293b',
                  padding: '0.75rem',
                  borderRadius: msg.isCurrentUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  fontSize: '0.875rem',
                  lineHeight: '1.4'
                }}>
                  {!msg.isCurrentUser && (
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      opacity: 0.8
                    }}>
                      {msg.sender}
                    </div>
                  )}
                  {msg.message}
                </div>
                <div style={{
                  fontSize: '0.675rem',
                  color: '#64748b',
                  marginTop: '0.25rem',
                  textAlign: msg.isCurrentUser ? 'right' : 'left'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isSendingMessage}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isSendingMessage || !newMessage.trim()}
            style={{
              background: isSendingMessage || !newMessage.trim() ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              cursor: isSendingMessage || !newMessage.trim() ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {isSendingMessage ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    );
  };

  // Project Card Component
  const ProjectCard = ({ project }) => (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '1.5rem',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Status Indicator */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '4px',
        height: '100%',
        background: project.status === 'Active' ? '#10b981' : 
                    project.status === 'Recruiting' ? '#f59e0b' : '#3b82f6'
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <h3 style={{ 
          margin: 0, 
          color: '#1e293b', 
          fontSize: '1.125rem', 
          fontWeight: '600',
          lineHeight: '1.4',
          flex: 1
        }}>
          {project.title}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', marginLeft: '1rem' }}>
          <span style={{
            background: project.status === 'Active' ? '#dcfce7' : 
                       project.status === 'Recruiting' ? '#fef3c7' : '#dbeafe',
            color: project.status === 'Active' ? '#166534' : 
                   project.status === 'Recruiting' ? '#92400e' : '#1e40af',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            {project.status}
          </span>
          {/* Progress Bar */}
          <div style={{
            width: '60px',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${project.progress}%`,
              height: '100%',
              background: project.status === 'Active' ? '#10b981' : 
                         project.status === 'Recruiting' ? '#f59e0b' : '#3b82f6',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{project.progress}%</span>
        </div>
      </div>

      <p style={{ 
        margin: '0 0 1rem 0', 
        color: '#64748b', 
        fontSize: '0.875rem',
        lineHeight: '1.5'
      }}>
        {project.description}
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong style={{ color: '#2c3e50' }}>Research Area:</strong> 
          <span style={{ 
            background: '#f1f5f9', 
            color: '#1e293b', 
            padding: '0.125rem 0.5rem', 
            borderRadius: '6px', 
            fontSize: '0.75rem'
          }}>
            {project.researchArea}
          </span>
          <span style={{ 
            background: '#e0f2fe', 
            color: '#0369a1', 
            padding: '0.125rem 0.5rem', 
            borderRadius: '6px', 
            fontSize: '0.75rem'
          }}>
            {project.phase}
          </span>
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#2c3e50' }}>Lead:</strong> {project.createdBy}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#2c3e50' }}>Location:</strong> {project.location}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong style={{ color: '#2c3e50' }}>Funding:</strong> {project.funding}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Looking For</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
          {project.lookingFor.map((skill, index) => (
            <span key={index} style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.125rem 0.5rem',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={() => setJoinProjectModal(project)}
          style={{
            flex: 1,
            background: project.status === 'Active' ? 
              'linear-gradient(135deg, #10b981 0%, #047857 100%)' :
              project.status === 'Recruiting' ? 
              'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' :
              'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
        >
          🚀 Request to Join
        </button>
        <button 
          style={{
            background: 'transparent',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '500'
          }}
        >
          📋 Details
        </button>
      </div>
    </div>
  );

  // Enhanced Project Join Functionality with notifications
  const handleJoinProject = async (project) => {
    if (!joinMessage.trim()) {
      setJoinStatus('Please enter a message describing why you want to join this project.');
      return;
    }

    setIsJoining(true);
    setJoinStatus('Sending join request...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Join Request Details:', {
        projectId: project.id,
        projectTitle: project.title,
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName || auth.currentUser?.email,
        message: joinMessage,
        timestamp: new Date().toISOString()
      });

      setJoinStatus(`✅ Join request sent successfully! Dr. ${project.createdBy} will review your request and respond within 24-48 hours.`);
      
      // Add notification for sent join request
      addNotification({
        type: 'join_request_sent',
        title: 'Join Request Sent',
        message: `Join request sent for "${project.title}" to ${project.createdBy}`,
        priority: 'medium',
        actionUrl: '/profile?section=requested-projects',
        senderName: project.createdBy,
        projectId: project.id
      });
      
      setTimeout(() => {
        setJoinProjectModal(null);
        setJoinMessage('');
        setJoinStatus('');
      }, 3000);

    } catch (error) {
      console.error('Error joining project:', error);
      setJoinStatus('❌ Failed to send join request. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  // Connect with Collaborator Functionality with notifications
  const handleConnectWithUser = async (collaborator) => {
    try {
      console.log('Connection Request:', {
        collaboratorId: collaborator.id,
        collaboratorName: collaborator.name,
        collaboratorEmail: collaborator.email,
        userId: auth.currentUser?.uid,
        userName: auth.currentUser?.displayName || auth.currentUser?.email,
        timestamp: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add notification for connection request
      addNotification({
        type: 'connection_request_sent',
        title: 'Connection Request Sent',
        message: `Connection request sent to ${collaborator.name}`,
        priority: 'low',
        actionUrl: '/collaborators',
        senderName: collaborator.name,
        senderEmail: collaborator.email
      });
      
      alert(`✅ Connection request sent to ${collaborator.name}! They will receive your collaboration request via email and can respond directly.`);
      
    } catch (error) {
      console.error('Error connecting with user:', error);
      alert('❌ Failed to send connection request. Please try again.');
    }
  };

  // Handle survey form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.researchArea.trim()) newErrors.researchArea = 'Research area is required';
    if (!formData.academicLevel) newErrors.academicLevel = 'Academic level is required';
    if (!formData.collaborationNeeds.trim()) newErrors.collaborationNeeds = 'Please describe your collaboration needs';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced survey form submission with notifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage('❌ Please fix the errors above and try again.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage(`✅ Survey submitted successfully! Thank you for participating.`);
        
        // Add notification for successful survey submission
        if (user) {
          addNotification({
            type: 'survey_submitted',
            title: 'Survey Submitted',
            message: 'Your research collaboration survey has been submitted successfully',
            priority: 'low',
            actionUrl: '/dashboard',
            isSystem: true
          });
        }
        
        setFormData({
          name: '',
          email: '',
          studentId: '',
          researchArea: '',
          academicLevel: '',
          currentProjects: '',
          collaborationNeeds: '',
          skillsOffered: '',
          skillsNeeded: '',
          resourceRequirements: ''
        });
        
        if (user) {
          fetchUserSurveyData(user.email);
        }
      } else {
        if (response.status === 409) {
          setSubmitMessage(`❌ You have already submitted a survey with this email.`);
        } else {
          setSubmitMessage(`❌ ${result.message || 'Failed to submit survey. Please try again.'}`);
        }
      }
      
    } catch (error) {
      setSubmitMessage('❌ Unable to submit survey. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>Loading Campus Research Hub...</p>
        </div>
      </div>
    );
  }

  // Enhanced Dashboard for authenticated users with notification system
  if (user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        {/* Enhanced Header with Notification Bell */}
        <header style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1e293b'
              }}>
                Campus Research Hub
              </h1>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Research Collaboration Platform</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <nav style={{ display: 'flex', gap: '1rem', marginRight: '2rem' }}>
                {['dashboard', 'projects', 'collaborators', 'chats', 'profile'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: activeTab === tab ? '#3b82f6' : 'transparent',
                      color: activeTab === tab ? 'white' : '#64748b',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                  >
                    {tab}
                    {/* Chat notification badge */}
                    {tab === 'chats' && getUnreadChatCount() > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#dc2626',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600'
                      }}>
                        {getUnreadChatCount()}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* NEW: Notification Bell */}
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                style={{
                  background: showNotificationPanel ? '#3b82f6' : 'transparent',
                  color: showNotificationPanel ? 'white' : '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (!showNotificationPanel) {
                    e.target.style.background = '#f8fafc';
                  }
                }}
                onMouseOut={(e) => {
                  if (!showNotificationPanel) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                🔔
                {unreadNotificationsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#dc2626',
                    color: 'white',
                    borderRadius: '50%',
                    minWidth: '20px',
                    height: '20px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    padding: '0 0.25rem'
                  }}>
                    {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                  </span>
                )}
              </button>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                  {user.displayName || user.email}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {userSurveyData ? `${userSurveyData.researchArea}` : 'Authenticated'}
                </div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background 0.2s ease'
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '2rem' 
        }}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.875rem', fontWeight: '700' }}>
                      Welcome back, {user.displayName || user.email.split('@')[0]}! 👋
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
                      {userSurveyData 
                        ? `Ready to collaborate on ${userSurveyData.researchArea} research?`
                        : 'Ready to start your research collaboration journey?'
                      }
                    </p>
                  </div>
                  <div style={{ fontSize: '4rem' }}>🔬</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                    {researchProjects.length}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Available Projects</p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤝</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                    {availableCollaborators.length}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Available Collaborators</p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                    {Math.round(researchProjects.reduce((acc, project) => acc + project.progress, 0) / researchProjects.length)}%
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Avg. Progress</p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#059669', fontSize: '1.5rem', fontWeight: '700' }}>
                    {myActiveProjects.filter(p => p.status === 'Ongoing').length + myCollaborationChats.length}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Active Chats</p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔔</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#dc2626', fontSize: '1.5rem', fontWeight: '700' }}>
                    {unreadNotificationsCount}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Unread Notifications</p>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📬</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' }}>
                    {getPendingRequestsCount()}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Pending Requests</p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                    🚀 Quick Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                      onClick={() => setActiveTab('projects')}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>🔍</span> Browse Research Projects
                    </button>
                    <button
                      onClick={() => setActiveTab('chats')}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>💬</span> Open Team Chats 
                      {getUnreadChatCount() > 0 && (
                        <span style={{ 
                          background: '#dc2626', 
                          color: 'white', 
                          padding: '0.125rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem' 
                        }}>
                          {getUnreadChatCount()}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setShowNotificationPanel(true)}
                      style={{
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>🔔</span> View Notifications
                      {unreadNotificationsCount > 0 && (
                        <span style={{ 
                          background: '#dc2626', 
                          color: 'white', 
                          padding: '0.125rem 0.5rem', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem' 
                        }}>
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      style={{
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>📬</span> Manage Requests ({getPendingRequestsCount()})
                    </button>
                  </div>
                </div>

                {/* Recent Notifications */}
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                      🔔 Recent Notifications
                    </h3>
                    {notifications.length > 3 && (
                      <button
                        onClick={() => setShowNotificationPanel(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        View all
                      </button>
                    )}
                  </div>
                  
                  {notifications.slice(0, 3).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔕</div>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>No notifications yet</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {notifications.slice(0, 3).map((notification) => (
                        <div
                          key={notification.id}
                          style={{
                            padding: '0.75rem',
                            background: notification.isRead ? '#f8fafc' : '#f0f9ff',
                            borderRadius: '8px',
                            border: `1px solid ${notification.isRead ? '#e2e8f0' : '#93c5fd'}`,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            if (notification.actionUrl?.includes('requests')) {
                              setActiveTab('profile');
                              setActiveProfileSection('requests');
                            } else if (notification.actionUrl?.includes('chats')) {
                              setActiveTab('chats');
                            }
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 style={{
                                margin: '0 0 0.25rem 0',
                                color: '#1e293b',
                                fontSize: '0.875rem',
                                fontWeight: notification.isRead ? '500' : '600'
                              }}>
                                {notification.title}
                              </h4>
                              <p style={{
                                margin: 0,
                                color: '#64748b',
                                fontSize: '0.875rem',
                                lineHeight: '1.4'
                              }}>
                                {notification.message.length > 60 
                                  ? `${notification.message.substring(0, 60)}...` 
                                  : notification.message}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                background: '#3b82f6',
                                borderRadius: '50%',
                                marginLeft: '0.5rem'
                              }}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chats' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#1e293b', 
                  fontSize: '1.875rem', 
                  fontWeight: '700' 
                }}>
                  💬 Team Chats & Collaborations
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                  Communicate with your project teams and collaboration partners
                </p>
              </div>

              <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Project Team Chats */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    color: '#1e293b', 
                    fontSize: '1.25rem', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🚀 Project Team Chats
                    <span style={{ 
                      background: '#dcfce7', 
                      color: '#166534', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500' 
                    }}>
                      {myActiveProjects.filter(p => p.status === 'Ongoing').length} active
                    </span>
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '1rem'
                  }}>
                    {myActiveProjects.filter(project => project.status === 'Ongoing').map(project => (
                      <div key={project.id} style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: project.hasUnreadMessages ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onClick={() => handleOpenChat(project.chatRoomId, project.chatRoomName, 'project')}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        {project.hasUnreadMessages && (
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: '#dc2626',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600'
                          }}>
                            •
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.25rem'
                          }}>
                            💬
                          </div>
                          <div>
                            <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: '600' }}>
                              {project.title}
                            </h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                              {project.collaborators.length} members • {project.role}
                            </p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            Last Activity
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {new Date(project.lastChatActivity).toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {project.phase}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Progress: {project.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaboration Chats */}
                <div>
                  <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    color: '#1e293b', 
                    fontSize: '1.25rem', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🤝 Direct Collaborations
                    <span style={{ 
                      background: '#e0f2fe', 
                      color: '#0ea5e9', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      fontSize: '0.75rem', 
                      fontWeight: '500' 
                    }}>
                      {myCollaborationChats.length} active
                    </span>
                  </h3>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '1rem'
                  }}>
                    {myCollaborationChats.map(collab => (
                      <div key={collab.id} style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: collab.hasUnreadMessages ? '2px solid #10b981' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                      onClick={() => handleOpenChat(collab.chatRoomId, collab.chatRoomName, 'collaboration')}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      >
                        {collab.hasUnreadMessages && (
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: '#dc2626',
                            color: 'white',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            fontSize: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600'
                          }}>
                            •
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.25rem'
                          }}>
                            🤝
                          </div>
                          <div>
                            <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1rem', fontWeight: '600' }}>
                              {collab.title}
                            </h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                              with {collab.collaboratorName}
                            </p>
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            Research Area
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {collab.researchArea}
                          </div>
                        </div>

                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            Last Activity
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                            {new Date(collab.lastChatActivity).toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            background: collab.status === 'active' ? '#dcfce7' : '#fef3c7',
                            color: collab.status === 'active' ? '#166534' : '#92400e',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {collab.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Since: {new Date(collab.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                {myActiveProjects.filter(p => p.status === 'Ongoing').length === 0 && myCollaborationChats.length === 0 && (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '3rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                    <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>No active chats yet</h3>
                    <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                      Join projects or start collaborations to begin chatting with your research partners!
                    </p>
                    <button
                      onClick={() => setActiveTab('projects')}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      🔍 Browse Projects
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Projects Tab with Categories */}
          {activeTab === 'projects' && (
            <div>
              {/* Projects Header with Filter Stats */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.875rem', fontWeight: '700' }}>
                    🔬 Research Projects
                  </h2>
                  <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>
                    Discover and join active research collaborations
                  </p>
                </div>
                
                {/* Project Stats */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                      {researchProjects.filter(p => p.status === 'Active').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b' }}>
                      {researchProjects.filter(p => p.status === 'Recruiting').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Recruiting</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                      {researchProjects.filter(p => p.status === 'Data Collection').length}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Data Phase</div>
                  </div>
                </div>
              </div>

              {/* Category Tabs */}
              <div style={{ 
                marginBottom: '2rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'all', label: '🔍 All Projects', count: researchProjects.length },
                    { key: 'active', label: '🟢 Active Research', count: researchProjects.filter(p => p.status === 'Active').length },
                    { key: 'recruiting', label: '📢 Recruiting', count: researchProjects.filter(p => p.status === 'Recruiting').length },
                    { key: 'data-collection', label: '📊 Data Collection', count: researchProjects.filter(p => p.status === 'Data Collection').length },
                    { key: 'my-projects', label: '👤 My Projects', count: 0 }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setProjectFilter(tab.key)}
                      style={{
                        background: projectFilter === tab.key ? '#3b82f6' : 'transparent',
                        color: projectFilter === tab.key ? 'white' : '#64748b',
                        border: projectFilter === tab.key ? 'none' : '1px solid #e2e8f0',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => {
                        if (projectFilter !== tab.key) {
                          e.target.style.background = '#f8fafc';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (projectFilter !== tab.key) {
                          e.target.style.background = 'transparent';
                        }
                      }}
                    >
                      {tab.label}
                      <span style={{
                        background: projectFilter === tab.key ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
                        color: projectFilter === tab.key ? 'white' : '#64748b',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Research Area Filter Pills */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ color: '#374151', fontWeight: '500', fontSize: '0.875rem' }}>Filter by Research Area:</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['All', 'Computer Science', 'Environmental Science', 'Psychology', 'Biotechnology'].map(area => (
                      <button
                        key={area}
                        onClick={() => setResearchAreaFilter(area)}
                        style={{
                          background: researchAreaFilter === area ? '#dbeafe' : '#f8fafc',
                          color: researchAreaFilter === area ? '#1e40af' : '#64748b',
                          border: `1px solid ${researchAreaFilter === area ? '#93c5fd' : '#e2e8f0'}`,
                          padding: '0.375rem 0.75rem',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects Grid with Dynamic Filtering */}
              <div>
                {getFilteredProjects().length === 0 ? (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '3rem',
                    textAlign: 'center',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                    <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>No projects found</h3>
                    <p style={{ color: '#64748b' }}>Try adjusting your filters to see more projects</p>
                  </div>
                ) : (
                  <>
                    {/* Section Headers for Different Categories */}
                    {projectFilter === 'all' && (
                      <>
                        {/* Active Research Section */}
                        {getFilteredProjects().filter(p => p.status === 'Active').length > 0 && (
                          <>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              marginBottom: '1.5rem',
                              paddingBottom: '0.5rem',
                              borderBottom: '2px solid #10b981'
                            }}>
                              <div style={{ fontSize: '1.5rem' }}>🟢</div>
                              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                                Active Research Projects
                              </h3>
                              <span style={{ 
                                background: '#dcfce7', 
                                color: '#166534', 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '12px', 
                                fontSize: '0.75rem', 
                                fontWeight: '500' 
                              }}>
                                {getFilteredProjects().filter(p => p.status === 'Active').length} projects
                              </span>
                            </div>
                            
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                              gap: '1.5rem',
                              marginBottom: '3rem'
                            }}>
                              {getFilteredProjects()
                                .filter(project => project.status === 'Active')
                                .map(project => (
                                  <ProjectCard key={project.id} project={project} />
                                ))
                              }
                            </div>
                          </>
                        )}

                        {/* Recruiting Section */}
                        {getFilteredProjects().filter(p => p.status === 'Recruiting').length > 0 && (
                          <>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              marginBottom: '1.5rem',
                              paddingBottom: '0.5rem',
                              borderBottom: '2px solid #f59e0b'
                            }}>
                              <div style={{ fontSize: '1.5rem' }}>📢</div>
                              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                                Recruiting Researchers
                              </h3>
                              <span style={{ 
                                background: '#fef3c7', 
                                color: '#92400e', 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '12px', 
                                fontSize: '0.75rem', 
                                fontWeight: '500' 
                              }}>
                                {getFilteredProjects().filter(p => p.status === 'Recruiting').length} projects
                              </span>
                            </div>
                            
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                              gap: '1.5rem',
                              marginBottom: '3rem'
                            }}>
                              {getFilteredProjects()
                                .filter(project => project.status === 'Recruiting')
                                .map(project => (
                                  <ProjectCard key={project.id} project={project} />
                                ))
                              }
                            </div>
                          </>
                        )}

                        {/* Data Collection Section */}
                        {getFilteredProjects().filter(p => p.status === 'Data Collection').length > 0 && (
                          <>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              marginBottom: '1.5rem',
                              paddingBottom: '0.5rem',
                              borderBottom: '2px solid #3b82f6'
                            }}>
                              <div style={{ fontSize: '1.5rem' }}>📊</div>
                              <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                                Data Collection Phase
                              </h3>
                              <span style={{ 
                                background: '#dbeafe', 
                                color: '#1e40af', 
                                padding: '0.25rem 0.75rem', 
                                borderRadius: '12px', 
                                fontSize: '0.75rem', 
                                fontWeight: '500' 
                              }}>
                                {getFilteredProjects().filter(p => p.status === 'Data Collection').length} projects
                              </span>
                            </div>
                            
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                              gap: '1.5rem',
                              marginBottom: '3rem'
                            }}>
                              {getFilteredProjects()
                                .filter(project => project.status === 'Data Collection')
                                .map(project => (
                                  <ProjectCard key={project.id} project={project} />
                                ))
                              }
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {/* Single Category View */}
                    {projectFilter !== 'all' && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                        gap: '1.5rem'
                      }}>
                        {getFilteredProjects().map(project => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Collaborators Tab */}
          {activeTab === 'collaborators' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  margin: '0 0 0.5rem 0', 
                  color: '#1e293b', 
                  fontSize: '1.875rem', 
                  fontWeight: '700' 
                }}>
                  🤝 Find Collaborators
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                  Connect with researchers who share your interests and expertise
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}>
                {availableCollaborators.map(collaborator => (
                  <div key={collaborator.id} style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: '#f1f5f9',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        marginRight: '1rem'
                      }}>
                        {collaborator.profileImage}
                      </div>
                      <div>
                        <h3 style={{ 
                          margin: '0 0 0.25rem 0', 
                          color: '#1e293b', 
                          fontSize: '1.125rem', 
                          fontWeight: '600' 
                        }}>
                          {collaborator.name}
                        </h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                          {collaborator.affiliation}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Research Area</div>
                      <div style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: '500' }}>
                        {collaborator.researchArea}
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem' }}>Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {collaborator.skills.map((skill, index) => (
                          <span key={index} style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
                          {collaborator.activeProjects}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Projects</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
                          {collaborator.publications}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Publications</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleConnectWithUser(collaborator)}
                        style={{
                          flex: 1,
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        🤝 Connect
                      </button>
                      <button 
                        onClick={() => setSelectedUser(collaborator)}
                        style={{
                          background: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        👤 Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Profile Tab with Project Lifecycle Separation and Notifications */}
          {activeTab === 'profile' && (
            <div>
              {/* Action Message */}
              {actionMessage && (
                <div style={{
                  background: actionMessage.includes('✅') ? '#d1fae5' : '#fee2e2',
                  color: actionMessage.includes('✅') ? '#065f46' : '#991b1b',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  border: `1px solid ${actionMessage.includes('✅') ? '#10b981' : '#ef4444'}`,
                  fontWeight: '500'
                }}>
                  {actionMessage}
                </div>
              )}

              {/* Dashboard Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.875rem', fontWeight: '700' }}>
                      🚀 Research Dashboard
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
                      {userSurveyData 
                        ? `Managing your ${userSurveyData.researchArea} research collaborations`
                        : 'Your personalized research collaboration hub'
                      }
                    </p>
                  </div>
                  <div style={{ fontSize: '4rem' }}>📊</div>
                </div>
              </div>

              {/* Enhanced Interactive Stats Cards with Lifecycle Separation and Notifications */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div 
                  onClick={() => setActiveProfileSection('requests')}
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: activeProfileSection === 'requests' ? '2px solid #dc2626' : '1px solid #e2e8f0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: activeProfileSection === 'requests' ? 'translateY(-2px)' : 'none',
                    boxShadow: activeProfileSection === 'requests' ? '0 4px 12px rgba(220, 38, 38, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📬</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#dc2626', fontSize: '1.5rem', fontWeight: '700' }}>
                    {getPendingRequestsCount()}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Incoming Requests</p>
                </div>

                <div 
                  onClick={() => setActiveProfileSection('requested-projects')}
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: activeProfileSection === 'requested-projects' ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: activeProfileSection === 'requested-projects' ? 'translateY(-2px)' : 'none',
                    boxShadow: activeProfileSection === 'requested-projects' ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700' }}>
                    {getRequestedProjectsCount()}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Requested Projects</p>
                </div>

                <div 
                  onClick={() => setActiveProfileSection('ongoing-projects')}
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: activeProfileSection === 'ongoing-projects' ? '2px solid #059669' : '1px solid #e2e8f0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: activeProfileSection === 'ongoing-projects' ? 'translateY(-2px)' : 'none',
                    boxShadow: activeProfileSection === 'ongoing-projects' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#059669', fontSize: '1.5rem', fontWeight: '700' }}>
                    {getOngoingProjectsCount()}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Ongoing Projects</p>
                </div>

                <div 
                  onClick={() => setActiveProfileSection('completed-projects')}
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: activeProfileSection === 'completed-projects' ? '2px solid #7c3aed' : '1px solid #e2e8f0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: activeProfileSection === 'completed-projects' ? 'translateY(-2px)' : 'none',
                    boxShadow: activeProfileSection === 'completed-projects' ? '0 4px 12px rgba(124, 58, 237, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#7c3aed', fontSize: '1.5rem', fontWeight: '700' }}>
                    {getCompletedProjectsCount()}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Completed Projects</p>
                </div>

                <div 
                  onClick={() => setActiveProfileSection('collaborators')}
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: activeProfileSection === 'collaborators' ? '2px solid #0ea5e9' : '1px solid #e2e8f0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: activeProfileSection === 'collaborators' ? 'translateY(-2px)' : 'none',
                    boxShadow: activeProfileSection === 'collaborators' ? '0 4px 12px rgba(14, 165, 233, 0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤝</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#0ea5e9', fontSize: '1.5rem', fontWeight: '700' }}>
                    {myCollaborators.length}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Collaborators</p>
                </div>

                {/* NEW: Notifications Stats Card */}
                <div 
                  onClick={() => setShowNotificationPanel(true)}
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {unreadNotificationsCount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: '#dc2626',
                      color: 'white',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600'
                    }}>
                      {unreadNotificationsCount}
                    </div>
                  )}
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔔</div>
                  <h3 style={{ margin: '0 0 0.25rem 0', color: '#3b82f6', fontSize: '1.5rem', fontWeight: '700' }}>
                    {notifications.length}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Notifications</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { key: 'overview', label: '📊 Overview', icon: '📊' },
                    { key: 'requests', label: '📬 Incoming Requests', icon: '📬' },
                    { key: 'requested-projects', label: '⏳ Requested Projects', icon: '⏳' },
                    { key: 'ongoing-projects', label: '🚀 Ongoing Projects', icon: '🚀' },
                    { key: 'completed-projects', label: '✅ Completed Projects', icon: '✅' },
                    { key: 'collaborators', label: '🤝 My Collaborators', icon: '🤝' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveProfileSection(tab.key)}
                      style={{
                        background: activeProfileSection === tab.key ? '#3b82f6' : 'transparent',
                        color: activeProfileSection === tab.key ? 'white' : '#64748b',
                        border: activeProfileSection === tab.key ? 'none' : '1px solid #e2e8f0',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px 8px 0 0',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Content Sections - Add all profile sections here */}
              
              {/* Overview Section */}
              {activeProfileSection === 'overview' && (
                <div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    {/* Project Lifecycle Statistics */}
                    <div style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                        📈 Project Lifecycle
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: '700' }}>{getRequestedProjectsCount()}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Requested</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: '700' }}>{getOngoingProjectsCount()}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ongoing</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#7c3aed', fontWeight: '700' }}>{getCompletedProjectsCount()}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Completed</div>
                        </div>
                      </div>
                    </div>

                    {/* Notifications Activity */}
                    <div style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                        🔔 Notification Activity
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#dc2626', fontWeight: '700' }}>
                            {unreadNotificationsCount}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Unread</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: '700' }}>
                            {notifications.length}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total</div>
                        </div>
                      </div>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={() => setShowNotificationPanel(true)}
                          style={{
                            marginTop: '0.75rem',
                            width: '100%',
                            padding: '0.5rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          View Notifications
                        </button>
                      )}
                    </div>

                    {/* Chat Activity */}
                    <div style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                        💬 Chat Activity
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: '700' }}>
                            {myActiveProjects.filter(p => p.status === 'Ongoing').length}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Project Chats</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: '700' }}>
                            {myCollaborationChats.length}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Collaborations</div>
                        </div>
                      </div>
                      {getUnreadChatCount() > 0 && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.5rem',
                          background: '#fef2f2',
                          borderRadius: '6px',
                          textAlign: 'center',
                          fontSize: '0.875rem',
                          color: '#dc2626'
                        }}>
                          🔔 {getUnreadChatCount()} unread messages
                        </div>
                      )}
                    </div>

                    {/* Recent Activity */}
                    <div style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.25rem', fontWeight: '600' }}>
                        🕒 Recent Activity
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>New notification received</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>1h ago</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Chat message sent</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>2h ago</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Collaboration request accepted</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>1d ago</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', background: '#7c3aed', borderRadius: '50%' }}></div>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Project milestone reached</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>2d ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Include all other profile sections with enhanced notification integration */}
              {/* Incoming Requests Section */}
              {activeProfileSection === 'requests' && (
                <div style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      📬 Incoming Collaboration Requests
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        background: '#fef2f2', 
                        color: '#dc2626', 
                        fontSize: '0.875rem', 
                        fontWeight: '500',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px'
                      }}>
                        {getPendingRequestsCount()} pending
                      </span>
                    </h2>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                      Accept or decline collaboration requests - email notifications are sent automatically
                    </p>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    {collaborationRequests.filter(req => req.status === 'pending').length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>All caught up!</h3>
                        <p>No pending collaboration requests at the moment.</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {collaborationRequests
                          .filter(req => req.status === 'pending')
                          .map((request) => (
                          <div key={request.id} style={{
                            background: '#f8fafc',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                  <span style={{
                                    background: request.type === 'collaboration' ? '#dbeafe' : '#dcfce7',
                                    color: request.type === 'collaboration' ? '#1d4ed8' : '#166534',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                  }}>
                                    {request.type === 'collaboration' ? '🤝 Collaboration Request' : '🚀 Join Project Request'}
                                  </span>
                                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{request.date}</span>
                                </div>
                                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.125rem', fontWeight: '600' }}>
                                  {request.title}
                                </h3>
                                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                                  From: <strong>{request.fromName}</strong> ({request.from})
                                </p>
                                <p style={{ 
                                  margin: 0, 
                                  color: '#374151', 
                                  fontSize: '0.875rem', 
                                  background: '#ffffff',
                                  padding: '0.75rem',
                                  borderRadius: '6px',
                                  border: '1px solid #e5e7eb',
                                  fontStyle: 'italic',
                                  lineHeight: '1.4'
                                }}>
                                  "{request.message}"
                                </p>
                              </div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                                <button 
                                  onClick={() => handleCollaborationResponse(request.id, 'accepted')}
                                  style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'background-color 0.2s'
                                  }}
                                >
                                  ✅ Accept
                                </button>
                                <button 
                                  onClick={() => handleCollaborationResponse(request.id, 'declined')}
                                  style={{
                                    background: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    transition: 'background-color 0.2s'
                                  }}
                                >
                                  ❌ Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add other profile sections here - requested-projects, ongoing-projects, completed-projects, collaborators */}
              {/* ... (Include all the existing profile sections from the previous code) ... */}
            </div>
          )}
        </main>

        {/* Render Notification Panel */}
        <NotificationPanel />

        {/* Chat Interface Component */}
        <ChatInterface />

        {/* WORKING Project Join Modal */}
        {joinProjectModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                  Join Research Project
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                  Request to collaborate on: <strong>{joinProjectModal.title}</strong>
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Why do you want to join this project? *
                </label>
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Describe your interest and how you can contribute to this research project..."
                  rows="4"
                  disabled={isJoining}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    opacity: isJoining ? 0.6 : 1
                  }}
                />
              </div>

              {joinStatus && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  background: joinStatus.includes('✅') ? '#dcfce7' : joinStatus.includes('❌') ? '#fecaca' : '#fef3c7',
                  color: joinStatus.includes('✅') ? '#166534' : joinStatus.includes('❌') ? '#dc2626' : '#92400e',
                  textAlign: 'center'
                }}>
                  {joinStatus}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    setJoinProjectModal(null);
                    setJoinMessage('');
                    setJoinStatus('');
                  }}
                  disabled={isJoining}
                  style={{
                    flex: 1,
                    background: 'white',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: isJoining ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    opacity: isJoining ? 0.6 : 1
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleJoinProject(joinProjectModal)}
                  disabled={isJoining || !joinMessage.trim()}
                  style={{
                    flex: 1,
                    background: isJoining || !joinMessage.trim() 
                      ? '#9ca3af' 
                      : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: isJoining || !joinMessage.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  {isJoining ? '⏳ Sending...' : '🚀 Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Modal */}
        {selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    color: 'white'
                  }}>
                    {selectedUser.profileImage}
                  </div>
                  <div>
                    <h2 style={{ 
                      margin: '0 0 0.25rem 0', 
                      color: '#1e293b', 
                      fontSize: '1.5rem', 
                      fontWeight: '700' 
                    }}>
                      {selectedUser.name}
                    </h2>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                      {selectedUser.affiliation}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: '0.5rem'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>
                    Research Area
                  </h4>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>
                    {selectedUser.researchArea}
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>
                    Bio
                  </h4>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '1rem', lineHeight: '1.5' }}>
                    {selectedUser.bio}
                  </p>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>
                    Contact
                  </h4>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>
                    {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show authentication form
  if (showAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <header style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
            Campus Research Hub
          </h1>
          
          <button
            onClick={() => setShowAuth(false)}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Back to Survey
          </button>
        </header>

        <Auth onAuthSuccess={() => setShowAuth(false)} />
      </div>
    );
  }

  // Homepage with survey form for non-authenticated users
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {/* Clean Header */}
      <header style={{ 
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            Campus Research Hub
          </h1>
          <p style={{ 
            margin: 0, 
            fontSize: '1.125rem',
            color: '#64748b',
            lineHeight: '1.6'
          }}>
            Connect with fellow researchers, find collaborators, and communicate in real-time
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        padding: '2rem',
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {/* Features Section */}
        <section style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{ 
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤝</div>
            <h3 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Find Collaborators</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5', margin: 0 }}>Connect with researchers in your field and discover collaboration opportunities</p>
          </div>
          
          <div style={{ 
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
            <h3 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Team Communication</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5', margin: 0 }}>Real-time chat with project teams and direct collaboration partners</p>
          </div>
          
          <div style={{ 
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔔</div>
            <h3 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Smart Notifications</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5', margin: 0 }}>Stay updated with real-time notifications and email alerts for all activities</p>
          </div>
          
          <div style={{ 
            background: '#ffffff',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ color: '#1e293b', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: '600' }}>Achieve Goals</h3>
            <p style={{ color: '#64748b', lineHeight: '1.5', margin: 0 }}>Accelerate your research progress through strategic partnerships</p>
          </div>
        </section>

        {/* Survey Form Section */}
        <section style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ 
              color: '#1e293b', 
              marginBottom: '0.75rem',
              fontSize: '1.875rem',
              fontWeight: '700'
            }}>
              Research Collaboration Survey
            </h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Help us understand your research needs and connect you with potential collaborators
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '1rem', 
                fontSize: '1.125rem',
                fontWeight: '600',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Personal Information
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.name ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s ease',
                      background: '#ffffff'
                    }}
                  />
                  {errors.name && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                      {errors.name}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@university.edu"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s ease',
                      background: '#ffffff'
                    }}
                  />
                  {errors.email && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                  Student ID (Optional)
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter your student ID"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    transition: 'border-color 0.2s ease',
                    background: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '1rem', 
                fontSize: '1.125rem',
                fontWeight: '600',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Academic Information
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    Research Area/Field *
                  </label>
                  <input
                    type="text"
                    name="researchArea"
                    value={formData.researchArea}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science, Biology, Psychology"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.researchArea ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s ease',
                      background: '#ffffff'
                    }}
                  />
                  {errors.researchArea && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                      {errors.researchArea}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    Academic Level *
                  </label>
                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.academicLevel ? '#ef4444' : '#d1d5db'}`,
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      backgroundColor: '#ffffff',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <option value="">Select your academic level</option>
                    <option value="undergraduate">Undergraduate Student</option>
                    <option value="graduate">Graduate Student (Masters)</option>
                    <option value="phd">PhD Student</option>
                    <option value="postdoc">Post-doctoral Researcher</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="researcher">Independent Researcher</option>
                  </select>
                  {errors.academicLevel && (
                    <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                      {errors.academicLevel}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '1rem', 
                fontSize: '1.125rem',
                fontWeight: '600',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Research Details
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                  Current Research Projects
                </label>
                <textarea
                  name="currentProjects"
                  value={formData.currentProjects}
                  onChange={handleChange}
                  placeholder="Briefly describe your current research projects or interests..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease',
                    background: '#ffffff'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                  Collaboration Needs *
                </label>
                <textarea
                  name="collaborationNeeds"
                  value={formData.collaborationNeeds}
                  onChange={handleChange}
                  placeholder="What type of collaboration are you looking for? (e.g., co-authors, data analysis help, literature review)"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.collaborationNeeds ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease',
                    background: '#ffffff'
                  }}
                />
                {errors.collaborationNeeds && (
                  <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.25rem' }}>
                    {errors.collaborationNeeds}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ 
                color: '#374151', 
                marginBottom: '1rem', 
                fontSize: '1.125rem',
                fontWeight: '600',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                Skills & Resources
              </h3>
              
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    Skills You Can Offer
                  </label>
                  <textarea
                    name="skillsOffered"
                    value={formData.skillsOffered}
                    onChange={handleChange}
                    placeholder="e.g., Python programming, Statistical analysis, Literature review"
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      background: '#ffffff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151', fontSize: '0.875rem' }}>
                    Skills You Need
                  </label>
                  <textarea
                    name="skillsNeeded"
                    value={formData.skillsNeeded}
                    onChange={handleChange}
                    placeholder="e.g., Machine learning expertise, Qualitative research methods"
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s ease',
                  minWidth: '150px'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
            </div>

            {submitMessage && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '0.875rem',
                background: submitMessage.includes('✅') ? '#dcfce7' : '#fecaca',
                color: submitMessage.includes('✅') ? '#166534' : '#dc2626',
                border: `1px solid ${submitMessage.includes('✅') ? '#bbf7d0' : '#fca5a5'}`
              }}>
                {submitMessage}
              </div>
            )}
          </form>
        </section>

        <section style={{ 
          background: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ 
            color: '#1e293b', 
            marginBottom: '1rem',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            Ready to Start Collaborating?
          </h3>
          <p style={{ 
            color: '#64748b', 
            fontSize: '1rem',
            marginBottom: '1.5rem',
            maxWidth: '500px',
            margin: '0 auto 1.5rem auto',
            lineHeight: '1.6'
          }}>
            Access our complete collaboration platform with real-time chat, 
            smart notifications, and email alerts to stay connected with your research partners.
          </p>
          
          <button 
            onClick={() => setShowAuth(true)}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            🚀 Access Collaboration Platform
          </button>
        </section>
      </main>

      <footer style={{ 
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        textAlign: 'center',
        padding: '2rem',
        marginTop: '2rem'
      }}>
        <p style={{ 
          margin: 0, 
          color: '#64748b',
          fontSize: '0.875rem'
        }}>
          © 2025 Campus Research Hub • Complete Research Collaboration Platform with Real-time Notifications & Email Integration
        </p>
      </footer>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </div>
  );
}

export default App;
