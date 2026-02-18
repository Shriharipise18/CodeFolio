import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

import api from '../services/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    // Try to fetch specific user details from API
                    const response = await api.get('/auth/me');
                    const userData = { ...response.data, token }; // Merge token back in
                    setUser(userData);
                    sessionStorage.setItem('user', JSON.stringify(userData));
                } catch (err) {
                    console.error("Failed to fetch user details", err);
                    // API failed? Consider session invalid.
                    sessionStorage.removeItem('user');
                    sessionStorage.removeItem('token');
                    setUser(null);
                    setToken(null);
                }
            } else {
                sessionStorage.removeItem('user');
                setUser(null);
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data)); // Store full user object
            setToken(data.token);
            setUser(data);
        } catch (error) {
            console.error("Login Error Details:", error);
            if (error.code === 'ERR_NETWORK') {
                throw new Error('Cannot connect to server. Please check if backend is running.');
            }
            throw new Error(error.response?.data?.error || 'Login failed. Please check your credentials.');
        }
    };

    const signup = async (fullName, email, password) => {
        try {
            const response = await api.post('/auth/register', { fullName, email, password });
            const data = response.data;
            sessionStorage.setItem('token', data.token);
            // Backend for register currently only returns token, so we construct user object
            const userObj = { token: data.token, email, fullName };
            sessionStorage.setItem('user', JSON.stringify(userObj));
            setToken(data.token);
            setUser(userObj);
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Signup failed');
        }
    };

    const updateUser = (userData) => {
        setUser(prev => ({ ...prev, ...userData }));
        sessionStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
