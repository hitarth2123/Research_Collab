// src/components/ResearchDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion 
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const ResearchDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    researchArea: '',
    collaboratorsNeeded: '',
    requiredSkills: '',
    status: 'open'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'researchProjects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'researchProjects'), {
        ...newProject,
        createdBy: auth.currentUser.uid,
        creatorName: auth.currentUser.displayName || auth.currentUser.email,
        createdAt: new Date(),
        collaborators: [auth.currentUser.uid],
        collaboratorNames: [auth.currentUser.displayName || auth.currentUser.email]
      });
      
      setNewProject({
        title: '',
        description: '',
        researchArea: '',
        collaboratorsNeeded: '',
        requiredSkills: '',
        status: 'open'
      });
      
      setShowCreateForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleJoinProject = async (projectId) => {
    try {
      const projectRef = doc(db, 'researchProjects', projectId);
      await updateDoc(projectRef, {
        collaborators: arrayUnion(auth.currentUser.uid),
        collaboratorNames: arrayUnion(auth.currentUser.displayName || auth.currentUser.email)
      });
      
      fetchProjects();
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Research Collaboration Hub</h2>
        <p>Connect with fellow researchers and find collaboration opportunities</p>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Project'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-project-form">
          <h3>Create New Research Project</h3>
          <form onSubmit={handleCreateProject}>
            <div className="form-group">
              <label htmlFor="title">Project Title *</label>
              <input
                type="text"
                id="title"
                placeholder="Enter project title"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                placeholder="Describe your research project"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="researchArea">Research Area *</label>
              <input
                type="text"
                id="researchArea"
                placeholder="e.g., Machine Learning, Biology"
                value={newProject.researchArea}
                onChange={(e) => setNewProject({...newProject, researchArea: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="collaboratorsNeeded">Collaborators Needed</label>
              <input
                type="number"
                id="collaboratorsNeeded"
                placeholder="Number of collaborators needed"
                value={newProject.collaboratorsNeeded}
                onChange={(e) => setNewProject({...newProject, collaboratorsNeeded: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label htmlFor="requiredSkills">Required Skills</label>
              <input
                type="text"
                id="requiredSkills"
                placeholder="e.g., Python, Statistics, Data Analysis"
                value={newProject.requiredSkills}
                onChange={(e) => setNewProject({...newProject, requiredSkills: e.target.value})}
              />
            </div>

            <button type="submit" className="submit-btn">Create Project</button>
          </form>
        </div>
      )}

      <div className="projects-section">
        <h3>Available Research Projects</h3>
        
        {projects.length === 0 ? (
          <p className="no-projects">No projects available. Create the first one!</p>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <h4>{project.title}</h4>
                  <span className={`status ${project.status}`}>{project.status}</span>
                </div>
                
                <p className="project-area"><strong>Research Area:</strong> {project.researchArea}</p>
                <p className="project-description">{project.description}</p>
                
                {project.collaboratorsNeeded && (
                  <p><strong>Collaborators Needed:</strong> {project.collaboratorsNeeded}</p>
                )}
                
                {project.requiredSkills && (
                  <p><strong>Required Skills:</strong> {project.requiredSkills}</p>
                )}
                
                <div className="project-meta">
                  <p><strong>Created by:</strong> {project.creatorName}</p>
                  <p><strong>Collaborators:</strong> {project.collaboratorNames?.length || 1}</p>
                </div>

                {!project.collaborators?.includes(auth.currentUser.uid) && (
                  <button 
                    className="join-btn"
                    onClick={() => handleJoinProject(project.id)}
                  >
                    Join Project
                  </button>
                )}

                {project.collaborators?.includes(auth.currentUser.uid) && (
                  <span className="joined-indicator">✅ Joined</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDashboard;
