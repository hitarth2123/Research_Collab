// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const surveyAPI = {
  // Submit survey to MongoDB
  submitSurvey: async (surveyData) => {
    try {
      const response = await api.post('/survey', surveyData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit survey');
    }
  },

  // Get all surveys
  getAllSurveys: async () => {
    try {
      const response = await api.get('/surveys');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch surveys');
    }
  }
};

export default api;
