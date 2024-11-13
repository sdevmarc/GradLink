// AuthContext.tsx
import { HOST } from '@/constants'
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
    isAuthenticated: boolean | null;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
    checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: null,
    setIsAuthenticated: () => { },
    checkAuthStatus: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(`http://${HOST}/status`, {
                withCredentials: true,
            });
            setIsAuthenticated(response.data.isAuthenticated);
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
