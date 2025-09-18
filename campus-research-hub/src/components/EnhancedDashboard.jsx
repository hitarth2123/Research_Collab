import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

const EnhancedDashboard = () => {
  const [user] = useAuthState(auth);
  const [collaborationRequests, setCollaborationRequests] = useState({ incoming: [], outgoing: [] });
  const [projects, setProjects] = useState({ owned: [], collaborating: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCollaborationRequests();
      fetchProjects();
    }
  }, [user]);

  const fetchCollaborationRequests = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/collaboration-requests/${user.email}`);
      const data = await response.json();
      if (data.success) {
        setCollaborationRequests(data.data);
      }
    } catch (error) {
      console.error('Error fetching collaboration requests:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${user.email}`);
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:3001/api/collaboration-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh requests
        fetchCollaborationRequests();
        alert(`Request ${status} successfully!`);
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Research Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.displayName || user?.email}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold text-blue-900">Pending Requests</h3>
          <p className="text-3xl font-bold text-blue-600">{collaborationRequests.incoming.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-green-900">My Projects</h3>
          <p className="text-3xl font-bold text-green-600">{projects.owned.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-purple-900">Collaborations</h3>
          <p className="text-3xl font-bold text-purple-600">{projects.collaborating.length}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-500">
          <h3 className="text-lg font-semibold text-orange-900">Sent Requests</h3>
          <p className="text-3xl font-bold text-orange-600">{collaborationRequests.outgoing.length}</p>
        </div>
      </div>

      {/* Incoming Collaboration Requests */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            📬 Incoming Collaboration Requests
            {collaborationRequests.incoming.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {collaborationRequests.incoming.length}
              </span>
            )}
          </h2>
        </div>
        <div className="p-6">
          {collaborationRequests.incoming.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <p>No pending collaboration requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborationRequests.incoming.map((request) => (
                <div key={request._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.type === 'collaboration' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {request.type === 'collaboration' ? '🤝 Collaboration' : '🚀 Join Project'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{request.projectTitle}</h3>
                      <p className="text-sm text-gray-600 mb-2">From: {request.fromUser}</p>
                      {request.message && (
                        <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                          "{request.message}"
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleRequestResponse(request._id, 'accepted')}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleRequestResponse(request._id, 'rejected')}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
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

      {/* Outgoing Requests */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">📤 Sent Requests</h2>
        </div>
        <div className="p-6">
          {collaborationRequests.outgoing.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📤</div>
              <p>No sent requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collaborationRequests.outgoing.map((request) => (
                <div key={request._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : request.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status === 'pending' ? '⏳ Pending' : 
                           request.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{request.projectTitle}</h3>
                      <p className="text-sm text-gray-600">To: {request.toUser}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Projects */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">🚀 My Projects</h2>
        </div>
        <div className="p-6">
          {projects.owned.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📁</div>
              <p>No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.owned.map((project) => (
                <div key={project._id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {project.collaborators.length} collaborators
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
