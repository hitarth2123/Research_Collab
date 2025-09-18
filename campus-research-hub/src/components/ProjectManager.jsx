
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

// User Profile Modal Component
const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
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
        {/* Profile Header */}
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
              {user.profileImage || '👤'}
            </div>
            <div>
              <h2 style={{ 
                margin: '0 0 0.25rem 0', 
                color: '#1e293b', 
                fontSize: '1.5rem', 
                fontWeight: '700' 
              }}>
                {user.name}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                {user.affiliation || user.academicLevel}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
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

        {/* Profile Details */}
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Research Area */}
          <div>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#374151', 
              fontSize: '1rem', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔬 Research Area
            </h4>
            <p style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>
              {user.researchArea}
            </p>
          </div>

          {/* Skills Offered */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#374151', 
                fontSize: '1rem', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🛠️ Skills & Expertise
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.skills.map((skill, index) => (
                  <span key={index} style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#374151', 
              fontSize: '1rem', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📧 Contact Information
            </h4>
            <p style={{ margin: 0, color: '#1e293b', fontSize: '1rem' }}>
              {user.email}
            </p>
          </div>

          {/* Stats */}
          <div>
            <h4 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#374151', 
              fontSize: '1rem', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              📊 Research Stats
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                  {user.activeProjects || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Projects</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                  {user.publications || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Publications</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: '700' }}>
                  {user.collaborations || 0}
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>Collaborations</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              💬 Send Message
            </button>
            <button style={{
              flex: 1,
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              🤝 Collaborate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Project Join Confirmation Modal
const ProjectJoinModal = ({ project, onJoin, onClose }) => {
  const [joinMessage, setJoinMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await onJoin(project.id, joinMessage);
      onClose();
    } catch (error) {
      console.error('Error joining project:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
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
            Request to collaborate on: <strong>{project.title}</strong>
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
            Why do you want to join this project?
          </label>
          <textarea
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
            placeholder="Describe your interest and how you can contribute..."
            rows="4"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              padding: '0.75rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
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
            {isJoining ? '⏳ Sending Request...' : '🚀 Request to Join'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Project Manager Component
const ProjectManager = ({ activeTab, userSurveyData }) => {
  const [projects, setProjects] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [joinProjectModal, setJoinProjectModal] = useState(null);
  const [userProjects, setUserProjects] = useState([]);

  useEffect(() => {
    if (activeTab === 'projects') {
      fetchProjects();
    } else if (activeTab === 'collaborators') {
      fetchCollaborators();
    }
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      // Real projects - we'll use mock data but structure for Firestore
      const mockProjects = [
        {
          id: 'proj1',
          title: "AI-Powered Climate Change Prediction",
          description: "Developing machine learning models to predict climate patterns using satellite data and IoT sensors",
          researchArea: "Environmental Science",
          status: "Active",
          progress: 75,
          deadline: "2025-12-15",
          createdBy: "dr-sarah-johnson",
          createdByName: "Dr. Sarah Johnson",
          collaborators: ["mark-chen", "anna-rodriguez"],
          collaboratorNames: ["Mark Chen", "Anna Rodriguez"],
          lookingFor: ["Climate Data Expert", "Statistical Analyst", "Python Developer"],
          skills: ["Python", "Machine Learning", "Data Analysis", "Climate Science"],
          budget: "$50,000",
          location: "Stanford University",
          joinRequests: [],
          createdAt: new Date('2025-01-15'),
          lastUpdated: new Date('2025-09-10')
        },
        {
          id: 'proj2',
          title: "Quantum Computing Applications in Cryptography",
          description: "Exploring quantum algorithms for next-generation encryption methods and blockchain security",
          researchArea: "Computer Science",
          status: "Recruiting",
          progress: 25,
          deadline: "2026-06-30",
          createdBy: "prof-michael-zhang",
          createdByName: "Prof. Michael Zhang",
          collaborators: ["lisa-park"],
          collaboratorNames: ["Lisa Park"],
          lookingFor: ["Quantum Physicist", "Security Researcher", "Mathematician"],
          skills: ["Quantum Computing", "Cryptography", "Mathematics", "Python"],
          budget: "$120,000",
          location: "MIT",
          joinRequests: [],
          createdAt: new Date('2025-02-20'),
          lastUpdated: new Date('2025-09-05')
        },
        {
          id: 'proj3',
          title: "Social Media Impact on Mental Health",
          description: "Large-scale study analyzing social media usage patterns and their correlation with mental health outcomes in young adults",
          researchArea: "Psychology",
          status: "Data Collection",
          progress: 60,
          deadline: "2025-09-20",
          createdBy: "dr-rachel-kim",
          createdByName: "Dr. Rachel Kim",
          collaborators: ["james-wilson", "maya-patel"],
          collaboratorNames: ["James Wilson", "Maya Patel"],
          lookingFor: ["Data Analyst", "Mental Health Expert", "Survey Designer"],
          skills: ["Psychology", "Statistics", "Survey Design", "R Programming"],
          budget: "$35,000",
          location: "University of California",
          joinRequests: [],
          createdAt: new Date('2025-03-10'),
          lastUpdated: new Date('2025-09-18')
        },
        {
          id: 'proj4',
          title: "Sustainable Urban Agriculture Systems",
          description: "Designing and testing vertical farming solutions for urban environments with focus on resource optimization",
          researchArea: "Agricultural Science",
          status: "Planning",
          progress: 15,
          deadline: "2026-03-30",
          createdBy: "dr-elena-garcia",
          createdByName: "Dr. Elena Garcia",
          collaborators: [],
          collaboratorNames: [],
          lookingFor: ["Agricultural Engineer", "Sustainability Expert", "IoT Developer"],
          skills: ["Agriculture", "Sustainability", "IoT", "Data Analysis"],
          budget: "$75,000",
          location: "UC Davis",
          joinRequests: [],
          createdAt: new Date('2025-08-15'),
          lastUpdated: new Date('2025-09-12')
        }
      ];

      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      
      // Mock collaborators with detailed profiles
      const mockCollaborators = [
        {
          id: 'collab1',
          name: "Dr. Emily Watson",
          email: "emily.watson@stanford.edu",
          researchArea: "Artificial Intelligence",
          academicLevel: "Professor",
          affiliation: "Stanford University",
          skills: ["Deep Learning", "Computer Vision", "Python", "TensorFlow", "Research Design"],
          activeProjects: 3,
          publications: 45,
          collaborations: 12,
          profileImage: "👩‍💼",
          bio: "Leading researcher in AI applications for healthcare and climate science.",
          joinedDate: "2020-05-15"
        },
        {
          id: 'collab2',
          name: "Prof. David Chen",
          email: "david.chen@mit.edu",
          researchArea: "Environmental Science",
          academicLevel: "Associate Professor",
          affiliation: "MIT",
          skills: ["Climate Modeling", "Data Analysis", "GIS", "R", "Statistical Analysis"],
          activeProjects: 2,
          publications: 67,
          collaborations: 18,
          profileImage: "👨‍🔬",
          bio: "Expert in climate data analysis and environmental modeling systems.",
          joinedDate: "2018-09-20"
        },
        {
          id: 'collab3',
          name: "Dr. Maria Garcia",
          email: "maria.garcia@harvard.edu",
          researchArea: "Biotechnology",
          academicLevel: "Senior Researcher",
          affiliation: "Harvard Medical School",
          skills: ["Genomics", "Bioinformatics", "Molecular Biology", "CRISPR", "Data Mining"],
          activeProjects: 4,
          publications: 52,
          collaborations: 15,
          profileImage: "👩‍⚕️",
          bio: "Pioneering research in gene therapy and personalized medicine.",
          joinedDate: "2019-11-10"
        },
        {
          id: 'collab4',
          name: "Dr. Alex Kumar",
          email: "alex.kumar@berkeley.edu",
          researchArea: "Quantum Computing",
          academicLevel: "Postdoctoral Researcher",
          affiliation: "UC Berkeley",
          skills: ["Quantum Algorithms", "Cryptography", "Mathematics", "Quantum Physics"],
          activeProjects: 2,
          publications: 23,
          collaborations: 8,
          profileImage: "👨‍💻",
          bio: "Focused on quantum cryptography and quantum machine learning applications.",
          joinedDate: "2021-01-25"
        },
        {
          id: 'collab5',
          name: "Dr. Sophie Liu",
          email: "sophie.liu@caltech.edu",
          researchArea: "Psychology",
          academicLevel: "Assistant Professor",
          affiliation: "Caltech",
          skills: ["Cognitive Psychology", "Statistics", "fMRI", "Behavioral Analysis"],
          activeProjects: 3,
          publications: 31,
          collaborations: 10,
          profileImage: "👩‍🎓",
          bio: "Investigating the neural basis of decision-making and social cognition.",
          joinedDate: "2020-08-30"
        }
      ];

      setCollaborators(mockCollaborators);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (projectId, message) => {
    try {
      console.log(`Joining project ${projectId} with message: ${message}`);
      
      // In real implementation, this would update Firestore
      // await updateDoc(doc(db, 'researchProjects', projectId), {
      //   joinRequests: arrayUnion({
      //     userId: auth.currentUser.uid,
      //     userName: auth.currentUser.displayName || auth.currentUser.email,
      //     message: message,
      //     requestedAt: serverTimestamp(),
      //     status: 'pending'
      //   })
      // });

      // For demo, we'll show success message
      alert(`✅ Join request sent successfully! The project owner will review your request.`);
      
    } catch (error) {
      console.error('Error joining project:', error);
      alert('❌ Failed to send join request. Please try again.');
    }
  };

  const handleConnectWithUser = async (userId) => {
    try {
      console.log(`Connecting with user ${userId}`);
      
      // In real implementation, this would create a connection/message in Firestore
      alert(`✅ Connection request sent! You can now collaborate with this researcher.`);
      
    } catch (error) {
      console.error('Error connecting with user:', error);
      alert('❌ Failed to send connection request. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px'
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
          <p>Loading {activeTab}...</p>
        </div>
      </div>
    );
  }

  // Projects Tab Content
  if (activeTab === 'projects') {
    return (
      <div>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: '#1e293b', 
              fontSize: '1.875rem', 
              fontWeight: '700' 
            }}>
              🔬 Research Projects
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>
              Discover and join exciting research collaborations
            </p>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            ➕ Create New Project
          </button>
        </div>

        {/* Projects Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
          gap: '1.5rem'
        }}>
          {projects.map(project => (
            <div key={project.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              
              {/* Project Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start', 
                marginBottom: '1rem' 
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: '#1e293b', 
                  fontSize: '1.25rem', 
                  fontWeight: '700',
                  lineHeight: '1.4',
                  flex: 1
                }}>
                  {project.title}
                </h3>
                <span style={{
                  background: project.status === 'Active' ? '#dcfce7' : 
                            project.status === 'Recruiting' ? '#fef3c7' : 
                            project.status === 'Data Collection' ? '#dbeafe' : '#f3e8ff',
                  color: project.status === 'Active' ? '#166534' : 
                         project.status === 'Recruiting' ? '#92400e' : 
                         project.status === 'Data Collection' ? '#1e40af' : '#7c3aed',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  marginLeft: '1rem'
                }}>
                  {project.status}
                </span>
              </div>

              {/* Project Description */}
              <p style={{ 
                margin: '0 0 1rem 0', 
                color: '#64748b', 
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}>
                {project.description}
              </p>

              {/* Project Info */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🔬</span>
                    <span style={{ color: '#64748b' }}>Area:</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{project.researchArea}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>👨‍💼</span>
                    <span style={{ color: '#64748b' }}>Lead:</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{project.createdByName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📍</span>
                    <span style={{ color: '#64748b' }}>Location:</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{project.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💰</span>
                    <span style={{ color: '#64748b' }}>Budget:</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{project.budget}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '500' }}>Progress</span>
                  <span style={{ color: '#1e293b', fontSize: '0.75rem', fontWeight: '600' }}>{project.progress}%</span>
                </div>
                <div style={{
                  background: '#e2e8f0',
                  borderRadius: '6px',
                  height: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${
                      project.progress < 30 ? '#ef4444' : 
                      project.progress < 70 ? '#f59e0b' : '#10b981'
                    } 0%, ${
                      project.progress < 30 ? '#dc2626' : 
                      project.progress < 70 ? '#d97706' : '#047857'
                    } 100%)`,
                    width: `${project.progress}%`,
                    height: '100%',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              {/* Collaborators */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Current Team ({project.collaborators.length + 1})
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  <span style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    padding: '0.125rem 0.5rem',
                    borderRadius: '10px',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}>
                    {project.createdByName} (Lead)
                  </span>
                  {project.collaboratorNames.map((collaborator, index) => (
                    <span key={index} style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem'
                    }}>
                      {collaborator}
                    </span>
                  ))}
                </div>
              </div>

              {/* Looking For */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Looking for
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {project.lookingFor.slice(0, 3).map((skill, index) => (
                    <span key={index} style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      {skill}
                    </span>
                  ))}
                  {project.lookingFor.length > 3 && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '0.7rem',
                      padding: '0.125rem 0.25rem'
                    }}>
                      +{project.lookingFor.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button 
                  onClick={() => setJoinProjectModal(project)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🚀 Request to Join
                </button>
                <button style={{
                  background: 'white',
                  color: '#374151',
                  border: '2px solid #e5e7eb',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}>
                  📋 View Details
                </button>
              </div>

              {/* Deadline */}
              <div style={{ 
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                  Deadline: <strong style={{ color: '#1e293b' }}>{new Date(project.deadline).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        {joinProjectModal && (
          <ProjectJoinModal
            project={joinProjectModal}
            onJoin={handleJoinProject}
            onClose={() => setJoinProjectModal(null)}
          />
        )}
      </div>
    );
  }

  // Collaborators Tab Content
  if (activeTab === 'collaborators') {
    return (
      <div>
        {/* Header */}
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

        {/* Collaborators Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '1.5rem'
        }}>
          {collaborators.map(collaborator => (
            <div key={collaborator.id} style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              
              {/* Profile Header */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  marginRight: '1rem',
                  color: 'white'
                }}>
                  {collaborator.profileImage}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 0.25rem 0', 
                    color: '#1e293b', 
                    fontSize: '1.25rem', 
                    fontWeight: '700' 
                  }}>
                    {collaborator.name}
                  </h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                    {collaborator.affiliation}
                  </p>
                  <p style={{ margin: 0, color: '#3b82f6', fontSize: '0.875rem', fontWeight: '500' }}>
                    {collaborator.academicLevel}
                  </p>
                </div>
              </div>

              {/* Research Area */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '0.75rem', 
                  marginBottom: '0.25rem', 
                  fontWeight: '500' 
                }}>
                  Research Area
                </div>
                <div style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '500' }}>
                  {collaborator.researchArea}
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ 
                  margin: 0, 
                  color: '#374151', 
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  fontStyle: 'italic'
                }}>
                  "{collaborator.bio}"
                </p>
              </div>

              {/* Skills */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '0.75rem', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500' 
                }}>
                  Skills & Expertise
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {collaborator.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.7rem',
                      fontWeight: '500'
                    }}>
                      {skill}
                    </span>
                  ))}
                  {collaborator.skills.length > 4 && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '0.7rem',
                      padding: '0.125rem 0.25rem'
                    }}>
                      +{collaborator.skills.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '1rem',
                marginBottom: '1.5rem',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
                    {collaborator.activeProjects}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Projects</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
                    {collaborator.publications}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Publications</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#1e293b', fontSize: '1.25rem', fontWeight: '700' }}>
                    {collaborator.collaborations}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Collaborations</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  onClick={() => handleConnectWithUser(collaborator.id)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  🤝 Connect
                </button>
                <button 
                  onClick={() => setSelectedUser(collaborator)}
                  style={{
                    background: 'white',
                    color: '#374151',
                    border: '2px solid #e5e7eb',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  👤 View Profile
                </button>
              </div>

              {/* Member Since */}
              <div style={{ 
                marginTop: '1rem',
                padding: '0.5rem',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.75rem'
              }}>
                Member since {new Date(collaborator.joinedDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile Modal */}
        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    );
  }

  return null;
};

export default ProjectManager;
