import axios from 'axios';

// Base URL follows backend spec: /api/v1 (configurable via env)
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

// In-memory access token; refresh token persisted in localStorage
let accessTokenMemory = null;
let isRefreshing = false;
let pendingQueue = [];

const setAuthHeader = (config) => {
    if (!config.headers) config.headers = {};
    if (accessTokenMemory) {
        config.headers.Authorization = `Bearer ${accessTokenMemory}`;
    }
    return config;
};

export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setAuthTokens = ({ accessToken, refreshToken }) => {
    accessTokenMemory = accessToken || null;
    if (refreshToken !== undefined && refreshToken !== null) {
        localStorage.setItem('refresh_token', refreshToken);
    }
};

export const clearAuthTokens = () => {
    accessTokenMemory = null;
    localStorage.removeItem('refresh_token');
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

const axiosPrivate = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

const refreshTokens = async () => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) throw new Error('No refresh token');
    const { data } = await axiosInstance.post('/auth/refresh', { refresh_token });
    // Expect { access_token, refresh_token? }
    setAuthTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
    return data.access_token;
};

// Attach Authorization for private requests; if no access token but refresh exists, refresh first
axiosPrivate.interceptors.request.use(async (config) => {
    if (!accessTokenMemory && getRefreshToken()) {
        try {
            await refreshTokens();
        } catch (e) {
            // proceed; 401 handler will kick in
        }
    }
    return setAuthHeader(config);
});

// Handle 401 with refresh-and-retry once
axiosPrivate.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosPrivate(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshTokens();
                // Drain queue
                pendingQueue.forEach((p) => p.resolve(newToken));
                pendingQueue = [];
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosPrivate(originalRequest);
            } catch (refreshError) {
                pendingQueue.forEach((p) => p.reject(refreshError));
                pendingQueue = [];
                isRefreshing = false;
                clearAuthTokens();
                // Redirect to homepage where login modal is available
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
export { axiosInstance, axiosPrivate };