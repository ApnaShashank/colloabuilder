import api from "../axios";

const projectService = {
  getAll: async () => {
    const { data } = await api.get("/projects");
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get("/projects");
    return data.find(p => p._id === id);
  },

  deploy: async (id) => {
    const { data } = await api.post(`/projects/${id}/deploy`);
    return data;
  },

  delete: async (id) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },

  getLogsUrl: (id, token) => {
    return `http://127.0.0.1:5000/api/projects/${id}/logs`;
  }
};

export default projectService;
