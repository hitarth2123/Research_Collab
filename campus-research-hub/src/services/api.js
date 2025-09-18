
const API_BASE_URL = 'http://localhost:3001/api';

export const surveyAPI = {
  submitSurvey: async (surveyData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to submit survey');
    }
  },

  getAllSurveys: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/surveys`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch surveys');
    }
  }
};

export default surveyAPI;
EOF
