import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User as AppUser } from '@/types';
import { CarLoader } from '@/components/CarLoader';

interface AuthContextType {
    session: Session | null;
    user: AppUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session?.user) {
                fetchProfile(session.user.id, session.user);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string, sessionUser?: User) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
            }

            if (data) {
                setUser({
                    id: data.id,
                    name: data.full_name || 'User',
                    email: sessionUser?.email || session?.user.email || '',
                    role: data.role || 'customer',
                    profileImage: data.avatar_url,
                    createdAt: new Date(data.created_at || Date.now()),
                });
            } else if (sessionUser) {
                // Self-healing: Create profile if missing
                console.log('Profile missing, creating new profile...');
                const newProfile = {
                    id: userId,
                    full_name: sessionUser.user_metadata?.full_name || 'User',
                    avatar_url: sessionUser.user_metadata?.avatar_url,
                    role: 'customer'
                };

                const { error: insertError } = await supabase
                    .from('profiles')
                    .insert([newProfile]);

                if (!insertError) {
                    setUser({
                        id: newProfile.id,
                        name: newProfile.full_name,
                        email: sessionUser.email || '',
                        role: 'customer',
                        profileImage: newProfile.avatar_url,
                        createdAt: new Date()
                    });
                }
            }
        } catch (error) {
            console.error('Error in fetchProfile:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.session && data.user) {
            setSession(data.session);
            await fetchProfile(data.user.id, data.user);
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
            }
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setSession(null);
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, login, signInWithGoogle, signOut }}>
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-background">
                    <CarLoader size="lg" label="Loading application..." />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
