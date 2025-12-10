import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    if (data.success) {
                        setUser(data.data);
                    }
                } catch (err) {
                    console.error('Auth check failed', err);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                localStorage.setItem('token', data.accessToken);
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optional: Call API to revoke refresh token
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
