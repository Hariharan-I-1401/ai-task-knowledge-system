import api from './api';

export const startupService = {
  /**
   * Submits a complete multi-step founder onboarding profile entry to the backend ledger.
   */
  submitApplication: async (applicationData) => {
    const response = await api.post('/api/startups', applicationData);
    return response.data;
  },

  /**
   * Fetches the global venture pipeline list (accessible by authorized team roles).
   */
  getPipelineStartups: async () => {
    const response = await api.get('/api/startups');
    return response.data;
  },

  /**
   * Pulls a single detailed application view profile matching a specific primary key ID.
   */
  getStartupDetails: async (startupId) => {
    const response = await api.get(`/api/startups/${startupId}`);
    return response.data;
  }
};