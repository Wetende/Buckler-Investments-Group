import { axiosInstance, axiosPrivate, setAuthTokens, clearAuthTokens } from './axios';

// Register user
export const register = async (userData) => {
    const { data } = await axiosInstance.post('/auth/register', userData);
    return data;
};

// Backend expects OAuth2 password form or JSON depending on implementation.
// Per frontend.md we use POST /auth/token (form-encoded) → returns access & refresh.
export const login = async ({ username, password }) => {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);

    const { data } = await axiosInstance.post('/auth/token', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    setAuthTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
    });
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await axiosPrivate.get('/auth/me');
    return data;
};

export const refresh = async (refresh_token) => {
    const { data } = await axiosInstance.post('/auth/refresh', { refresh_token });
    setAuthTokens({ accessToken: data.access_token, refreshToken: data.refresh_token });
    return data;
};

export const logout = async () => {
    try {
        await axiosPrivate.post('/auth/logout');
    } finally {
        clearAuthTokens();
    }
    return { ok: true };
};
