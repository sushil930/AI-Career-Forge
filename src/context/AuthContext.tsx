import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from '@/lib/firebase'; // Import initialized Firebase auth
import { User, onAuthStateChanged, signOut, getIdToken } from 'firebase/auth';

// Define the shape of the auth context data
interface AuthContextType {
    user: User | null;         // Firebase User object or null
    token: string | null;      // Firebase ID token or null
    isLoading: boolean;        // Loading state for initial auth check
    logout: () => Promise<void>; // Logout function
    // Note: Login/Signup are handled by AuthModal, which calls onAuthSuccess.
    // The context primarily consumes the auth state change.
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading until initial check is done

    useEffect(() => {
        // Subscribe to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('[AuthContext] Auth state changed:', firebaseUser?.uid);
            if (firebaseUser) {
                // User is signed in
                setUser(firebaseUser);
                try {
                    const idToken = await getIdToken(firebaseUser);
                    setToken(idToken);
                    // Optionally store token in localStorage for persistence across refreshes
                    localStorage.setItem('firebaseIdToken', idToken);
                    console.log('[AuthContext] Token set.');
                } catch (error) {
                    console.error('[AuthContext] Error getting ID token:', error);
                    setToken(null);
                    localStorage.removeItem('firebaseIdToken');
                }
            } else {
                // User is signed out
                setUser(null);
                setToken(null);
                localStorage.removeItem('firebaseIdToken');
                console.log('[AuthContext] User signed out, token removed.');
            }
            setIsLoading(false); // Initial check complete
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Logout function
    const logout = async () => {
        console.log('[AuthContext] Logging out...');
        try {
            await signOut(auth);
            // State updates (user, token) will be handled by the onAuthStateChanged listener
            // No need to manually set user/token to null here
            localStorage.removeItem('firebaseIdToken'); // Explicitly clear storage on logout action
        } catch (error) {
            console.error('[AuthContext] Error signing out:', error);
            // Handle logout error (e.g., show toast)
        }
    };

    // Value provided to consuming components
    const value = {
        user,
        token,
        isLoading,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 