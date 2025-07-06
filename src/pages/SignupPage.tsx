import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Quote } from 'lucide-react';
import { toast } from "sonner";
import apiClient from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/ui/loader';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [redirectPath, setRedirectPath] = useState('/dashboard');

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedPath = localStorage.getItem('authRedirectPath');
        if (savedPath) {
            setRedirectPath(savedPath);
            localStorage.removeItem('authRedirectPath');
        }
    }, []);

    useEffect(() => {
        if (user) {
            navigate(redirectPath);
        }
    }, [user, navigate, redirectPath]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !displayName) {
            toast.error("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiClient.post('/api/auth/signup', {
                email,
                password,
                displayName
            });

            toast.success(`Signup successful for ${response.data.displayName}! Please log in.`);

            navigate('/login');

        } catch (error: any) {
            console.error("Signup Error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(`Signup failed: ${error.response.data.message}`);
            } else {
                toast.error("Signup failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Loader fullScreen />}
            <div className="min-h-[calc(100vh-80px)] flex">
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-right w-full mb-4">
                            <span className="text-sm text-muted-foreground">Already have an account? </span>
                            <Link to="/login" className="font-semibold text-theme-blue hover:underline text-sm">
                                Log In
                            </Link>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-theme-darkSlate">Join AI Resume Pro</h1>
                        <p className="text-muted-foreground">
                            Create your account to unlock powerful tools designed to accelerate your job search and land your dream role.
                        </p>

                        <form onSubmit={handleSignup} className="space-y-4 pt-4">
                            <div>
                                <Label htmlFor="signup-name">Name</Label>
                                <Input
                                    id="signup-name"
                                    placeholder="Your Name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    required
                                    className="mt-1"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1"
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    placeholder="Create a password (min. 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="mt-1"
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full text-lg py-3 bg-theme-blue hover:bg-theme-blue/90 text-white mt-6"
                                disabled={isLoading}
                            >
                                <UserPlus className="mr-2 h-5 w-5" />
                                Create Account
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-theme-blue to-theme-purple items-center justify-center p-12 text-white flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-opacity-10 bg-white backdrop-blur-sm"></div>
                    <div className="relative z-10 text-center space-y-6">
                        <Quote className="h-12 w-12 text-cyan-300 mx-auto" strokeWidth={1.5} />
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Your Next Career Move.
                        </h2>
                        <p className="text-xl font-light text-blue-100 max-w-md mx-auto">
                            "Stop guessing, start impressing. Let our AI guide you to a better resume and the right opportunities."
                        </p>
                        <div className="pt-4">
                            <p className="font-semibold">AI Resume Pro</p>
                            <p className="text-sm text-blue-200">Intelligent Career Tools</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupPage; 