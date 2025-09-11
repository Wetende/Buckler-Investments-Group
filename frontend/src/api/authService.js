import { axiosInstance, axiosPrivate, setAuthTokens, clearAuthTokens } from './axios';

// Register user
export const register = async (userData) => {
    // Backend expects 'name' not 'username' — map if necessary
    const payload = {
        email: userData.email,
        password: userData.password,
        name: userData.name ?? userData.username ?? undefined,
        phone: userData.phone,
        role: userData.role,
    };

    const { data } = await axiosInstance.post('/auth/register', payload);
    return data;
};

// Register and automatically log in the user
export const registerAndLogin = async (userData) => {
    // First register the user
    const registrationResult = await register(userData);
    
    // Then automatically log them in using their credentials
    const loginResult = await login({ 
        username: userData.email, // Backend uses email as username for login
        password: userData.password 
    });
    
    return {
        user: registrationResult,
        tokens: loginResult
    };
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
