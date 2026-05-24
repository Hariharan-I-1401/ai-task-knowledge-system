import api from './api';

export const taskService = {
  /**
   * Retrieves active workflow items, with an optional filter boundary (e.g., Pending, Completed).
   * FIXED: Removed '/api' prefix to prevent url token doubling.
   */
  getWorkflowTasks: async (statusFilter = null) => {
    const url = statusFilter ? `/tasks?status_filter=${statusFilter}` : '/tasks';
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Dispatches a payload generation request to allocate a new review item in the operations queue.
   * FIXED: Changed endpoint to direct relative syntax.
   */
  createAuditTask: async (taskPayload) => {
    const response = await api.post('/tasks', taskPayload);
    return response.data;
  },

  /**
   * Toggles properties or logs completion timestamps on an individual task entry.
   * FIXED: Trimmed base prefix match alignment.
   */
  updateTaskState: async (taskId, updatesPayload) => {
    const response = await api.patch(`/tasks/${taskId}`, updatesPayload);
    return response.data;
  },
};