

import React, { useState } from 'react';
const SurveyForm = () => {
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
    resourceRequirements: '',
    availableTime: '',
    preferredCollaborationType: '',
    researchGoals: '',
    additionalComments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitMessage('Please fix the errors above and try again.');
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      // Submit to your MongoDB backend
      const response = await fetch('http://localhost:3001/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }
      const result = await response.json();
      console.log('Survey submitted:', result);
      setSubmitMessage('✅ Survey submitted successfully! Thank you for your participation.');
      
      // Reset form
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
        resourceRequirements: '',
        availableTime: '',
        preferredCollaborationType: '',
        researchGoals: '',
        additionalComments: ''
      });
      
    } catch (error) {
      console.error('Survey submission error:', error);
      setSubmitMessage(`❌ Error: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '2rem auto'
    }}>
      {/* Form Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ 
          color: '#2c3e50', 
          marginBottom: '0.5rem',
          fontSize: '2rem',
          fontWeight: '700'
        }}>
          Campus Research Collaboration Survey
        </h2>
        <p style={{ 
          color: '#7f8c8d', 
          fontSize: '1.1rem',
          lineHeight: '1.6',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Help us understand your research needs and connect you with potential collaborators. 
          Your responses will help build a stronger research community on campus.
        </p>
      </div>
      {/* Survey Form */}
      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#34495e', marginBottom: '1rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Personal Information
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
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
                  border: `2px solid ${errors.name ? '#e74c3c' : '#e1e8ed'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
              {errors.name && (
                <span style={{ color: '#e74c3c', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.name}
                </span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
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
                  border: `2px solid ${errors.email ? '#e74c3c' : '#e1e8ed'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
              {errors.email && (
                <span style={{ color: '#e74c3c', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.email}
                </span>
              )}
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
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
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>
        </div>
        {/* Academic Information Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#34495e', marginBottom: '1rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Academic Information
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
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
                  border: `2px solid ${errors.researchArea ? '#e74c3c' : '#e1e8ed'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s ease'
                }}
              />
              {errors.researchArea && (
                <span style={{ color: '#e74c3c', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.researchArea}
                </span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                Academic Level *
              </label>
              <select
                name="academicLevel"
                value={formData.academicLevel}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${errors.academicLevel ? '#e74c3c' : '#e1e8ed'}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  transition: 'border-color 0.3s ease'
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
                <span style={{ color: '#e74c3c', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  {errors.academicLevel}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Research Details Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#34495e', marginBottom: '1rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Research Details
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
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
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
              Collaboration Needs *
            </label>
            <textarea
              name="collaborationNeeds"
              value={formData.collaborationNeeds}
              onChange={handleChange}
              placeholder="What type of collaboration are you looking for? (e.g., co-authors, data analysis help, literature review, experimental design)"
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.collaborationNeeds ? '#e74c3c' : '#e1e8ed'}`,
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
            />
            {errors.collaborationNeeds && (
              <span style={{ color: '#e74c3c', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                {errors.collaborationNeeds}
              </span>
            )}
          </div>
        </div>
        {/* Skills & Resources Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#34495e', marginBottom: '1rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Skills & Resources
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                Skills You Can Offer
              </label>
              <textarea
                name="skillsOffered"
                value={formData.skillsOffered}
                onChange={handleChange}
                placeholder="e.g., Python programming, Statistical analysis, Literature review, Data collection"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                Skills You Need
              </label>
              <textarea
                name="skillsNeeded"
                value={formData.skillsNeeded}
                onChange={handleChange}
                placeholder="e.g., Machine learning expertise, Qualitative research methods, Grant writing"
                rows="3"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
              Resource Requirements
            </label>
            <textarea
              name="resourceRequirements"
              value={formData.resourceRequirements}
              onChange={handleChange}
              placeholder="What resources do you need? (e.g., lab equipment, software licenses, funding, data access)"
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
        {/* Collaboration Preferences Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#34495e', marginBottom: '1rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Collaboration Preferences
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                Available Time Commitment
              </label>
              <select
                name="availableTime"
                value={formData.availableTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select time commitment</option>
                <option value="1-5 hours/week">1-5 hours per week</option>
                <option value="6-10 hours/week">6-10 hours per week</option>
                <option value="11-20 hours/week">11-20 hours per week</option>
                <option value="20+ hours/week">More than 20 hours per week</option>
                <option value="project-based">Project-based (varies)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                Preferred Collaboration Type
              </label>
              <select
                name="preferredCollaborationType"
                value={formData.preferredCollaborationType}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e1e8ed',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Select collaboration type</option>
                <option value="remote">Remote collaboration</option>
                <option value="in-person">In-person collaboration</option>
                <option value="hybrid">Hybrid (both remote and in-person)</option>
                <option value="no-preference">No preference</option>
              </select>
            </div>
          </div>
        </div>
        {/* Goals & Comments Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#34495e', marginBottom: '1rem', borderBottom: '2px solid #3498db', paddingBottom: '0.5rem' }}>
            Research Goals & Additional Information
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
              Research Goals & Objectives
            </label>
            <textarea
              name="researchGoals"
              value={formData.researchGoals}
              onChange={handleChange}
              placeholder="What are your main research goals? What do you hope to achieve through collaboration?"
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
              Additional Comments
            </label>
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
              placeholder="Any additional information you'd like to share..."
              rows="3"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>
        </div>
        {/* Submit Button */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting 
                ? '#bdc3c7' 
                : 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(52, 152, 219, 0.3)',
              minWidth: '200px'
            }}
          >
            {isSubmitting ? (
              <span>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}>
                  ⏳
                </span>
                Submitting...
              </span>
            ) : (
              'Submit Survey'
            )}
          </button>
        </div>
        {/* Success/Error Message */}
        {submitMessage && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '600',
            background: submitMessage.includes('✅') 
              ? '#d5f4e6' 
              : '#ffeaa7',
            color: submitMessage.includes('✅') 
              ? '#00b894' 
              : '#e17055',
            border: `2px solid ${submitMessage.includes('✅') ? '#00b894' : '#e17055'}`
          }}>
            {submitMessage}
          </div>
        )}
      </form>
      {/* Form Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{ 
          color: '#6c757d', 
          fontSize: '0.9rem',
          margin: 0 
        }}>
          <strong>Privacy Note:</strong> Your information will be used solely for research collaboration matching 
          and will be kept confidential. You can request data removal at any time.
        </p>
      </div>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #3498db !important;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
          }
          
          button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4) !important;
          }
        `}
      </style>
    </div>
  );
};
export default SurveyForm;
