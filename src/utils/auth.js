// src/utils/auth.js

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token'); 
        return token ? token : null;
    }
    return null;
};

export const isAuthenticated = () => {
    const token = getAuthToken();
    return token !== null;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token'); 
    }
};
