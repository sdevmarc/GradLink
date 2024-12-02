import React, { createContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_AUTHENTICATION_STATUS } from '@/api/settings';

interface AuthContextType {
    isAuthenticated: boolean | null;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: null,
    setIsAuthenticated: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const { data: status, isFetched: statusFetched } = useQuery({
        queryFn: () => API_AUTHENTICATION_STATUS(),
        queryKey: ['auth-status'],
        refetchInterval: 60000
    })

    useEffect(() => {
        if (statusFetched) {
            if (status) {
                setIsAuthenticated(status)
            } else {
                setIsAuthenticated(false)
            }
        }
    }, [status])

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};
