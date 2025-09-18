
// Collaboration Request Schema
const collaborationRequestSchema = new mongoose.Schema({
  fromUser: { type: String, required: true }, // email of requester
  toUser: { type: String, required: true },   // email of recipient
  projectTitle: { type: String, required: true },
  message: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  type: { type: String, enum: ['collaboration', 'join_project'], required: true }
});

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: String, required: true }, // email of project owner
  collaborators: [String], // array of collaborator emails
  researchArea: String,
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

// Get collaboration requests for a user
app.get('/api/collaboration-requests/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Get requests sent to this user (incoming)
    const incomingRequests = await CollaborationRequest.find({ 
      toUser: email,
      status: 'pending'
    }).sort({ createdAt: -1 });
    
    // Get requests sent by this user (outgoing)
    const outgoingRequests = await CollaborationRequest.find({ 
      fromUser: email 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: {
        incoming: incomingRequests,
        outgoing: outgoingRequests
      }
    });
    
  } catch (error) {
    console.error('Error fetching collaboration requests:', error);
    res.status(500).json({ success: false, message: 'Error fetching requests' });
  }
});

// Send collaboration request
app.post('/api/collaboration-requests', async (req, res) => {
  try {
    const { fromUser, toUser, projectTitle, message, type } = req.body;
    
    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      fromUser,
      toUser,
      projectTitle,
      status: 'pending'
    });
    
    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: 'Collaboration request already sent'
      });
    }
    
    const request = new CollaborationRequest({
      fromUser,
      toUser,
      projectTitle,
      message,
      type
    });
    
    const savedRequest = await request.save();
    
    console.log('📬 Collaboration request sent:', savedRequest._id);
    
    res.json({
      success: true,
      message: 'Collaboration request sent successfully!',
      data: savedRequest
    });
    
  } catch (error) {
    console.error('Error sending collaboration request:', error);
    res.status(500).json({ success: false, message: 'Error sending request' });
  }
});

// Update collaboration request status
app.put('/api/collaboration-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    
    const request = await CollaborationRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    console.log(`📋 Request ${status}:`, request._id);
    
    res.json({
      success: true,
      message: `Request ${status} successfully!`,
      data: request
    });
    
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ success: false, message: 'Error updating request' });
  }
});

// Get user projects
app.get('/api/projects/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Get projects owned by user
    const ownedProjects = await Project.find({ owner: email });
    
    // Get projects user is collaborating on
    const collaboratingProjects = await Project.find({ 
      collaborators: { $in: [email] }
    });
    
    res.json({
      success: true,
      data: {
        owned: ownedProjects,
        collaborating: collaboratingProjects
      }
    });
    
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, message: 'Error fetching projects' });
  }
});

