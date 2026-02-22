// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_BASE_URL = API_URL;
export const API_ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
    register: `${API_URL}/api/auth/register`,
  },
  parts: {
    list: `${API_URL}/api/parts`,
    byId: (id) => `${API_URL}/api/parts/${id}`,
    compare: (ids) => `${API_URL}/api/parts/compare?ids=${ids}`,
  },
};

export default API_URL;
