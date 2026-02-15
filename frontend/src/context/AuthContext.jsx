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
        const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data)); // Store full user object
        setToken(data.token);
        setUser(data);
    };

    const signup = async (fullName, email, password) => {
        const response = await fetch('http://localhost:8081/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Signup failed');
        }
        const data = await response.json();
        sessionStorage.setItem('token', data.token);
        // Backend for register currently only returns token, so we construct user object
        const userObj = { token: data.token, email, fullName };
        sessionStorage.setItem('user', JSON.stringify(userObj));
        setToken(data.token);
        setUser(userObj);
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
