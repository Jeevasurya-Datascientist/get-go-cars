
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Parse the hash parameters from the URL
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const error = hashParams.get('error');
                const errorDescription = hashParams.get('error_description');
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (error) {
                    console.error('Auth error:', error, errorDescription);
                    setStatus('error');
                    if (error === 'access_denied' && errorDescription?.includes('expired')) {
                        setMessage('Your verification link has expired. Please try signing up again or request a new link.');
                    } else {
                        setMessage(errorDescription?.replace(/\+/g, ' ') || 'An error occurred during verification.');
                    }
                    return;
                }

                // If we have tokens, set the session
                if (accessToken && refreshToken) {
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    });

                    if (sessionError) {
                        throw sessionError;
                    }
                } else {
                    // If no hash params, check if we have an active session anyway (sometimes the hash is consumed by the client automatically)
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                        // No session found and no tokens in URL
                        setStatus('error');
                        setMessage('Invalid verification link. Please checking your email again or request a new one.');
                        return;
                    }
                }

                setStatus('success');
                setMessage('Email verified successfully! Starting your engine...');

                // Delay redirect slightly to show success message
                setTimeout(() => {
                    navigate('/');
                }, 2000);

            } catch (err: any) {
                console.error('Callback error:', err);
                setStatus('error');
                setMessage(err.message || 'Failed to verify email.');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 text-slate-100 font-sans">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/80 to-[#0f172a]"></div>
            </div>

            <Card className="w-full max-w-md border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        {status === 'loading' && 'Verifying...'}
                        {status === 'success' && 'Verified!'}
                        {status === 'error' && 'Verification Failed'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
                            <p className="text-slate-400 text-center">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-300">
                            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <p className="text-slate-300 text-center text-lg">{message}</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-300 w-full">
                            <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <XCircle className="h-10 w-10 text-red-500" />
                            </div>
                            <p className="text-slate-300 text-center">{message}</p>
                            <Button
                                onClick={() => navigate('/auth')}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                            >
                                Back to Login <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
