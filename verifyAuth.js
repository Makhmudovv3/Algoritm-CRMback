const axios = require('axios');

const baseURL = 'http://localhost:3000/api/v1';

let storage = {
  app_access_token: '',
  app_refresh_token: ''
};

const tokenManager = {
  getToken: () => storage.app_access_token,
  setToken: (t) => storage.app_access_token = t,
  getRefreshToken: () => storage.app_refresh_token,
  setRefreshToken: (t) => storage.app_refresh_token = t,
  clearTokens: () => { storage.app_access_token = ''; storage.app_refresh_token = ''; }
};

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const { data } = await axios.post(`${baseURL}/auth/refresh`, { token: refreshToken });
          
          const tokenData = data?.data || data;

          if (tokenData && (tokenData.token || tokenData.accessToken)) {
            const newToken = tokenData.token || tokenData.accessToken;
            const newRefreshToken = tokenData.refreshToken || tokenData.refresh_token;
            
            tokenManager.setToken(newToken);
            if (newRefreshToken) {
              tokenManager.setRefreshToken(newRefreshToken);
            }
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            if (originalRequest.headers) {
              originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            }
            return apiClient(originalRequest);
          } else {
            throw new Error("Token data is missing in refresh response");
          }
        }
      } catch (err) {
        console.error("Refresh failed", err.message);
        tokenManager.clearTokens();
      }
    }
    return Promise.reject(error);
  }
);

async function runTest() {
  try {
    console.log("1. Logging in...");
    const loginRes = await apiClient.post('/auth/login', { phone: '998901234567', password: 'password123' });
    // Note: Assuming a default user is superadmin. Wait, what is the default user?
    // Let's check backend/seeders/superadmin.js or something. 
    // Wait, let's just make sure it works.
    
    // Actually, I don't know the default password. Let me check the DB.
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}

runTest();
