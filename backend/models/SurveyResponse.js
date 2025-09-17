const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema(
  {
    email:   { type: String, required: true, lowercase: true },
    name:    { type: String, required: true },
    currentCollaborationMethod: String,
    collaborationStruggles:     String,
    collaborationBarriers:      String,
    materialOrganization:       String,
    valuableFeatures:           String,
    communicationImportance:    String,
    collaboratorSearchPreference:String,
    securityFeatures:           String,
    idealWorkflow:              String,
    currentToolFrustrations:    String,
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SurveyResponse', surveySchema);
