import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Quote } from 'lucide-react';
import { toast } from "sonner";
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/context/AuthContext';
import { Loader } from '@/components/ui/loader';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [redirectPath, setRedirectPath] = useState('/dashboard');

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter email and password.");
            return;
        }
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);

            toast.success("Login successful! Redirecting...");
            navigate('/dashboard');

        } catch (error: any) {
            console.error("Login Error:", error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
                toast.error("Invalid email or password.");
            } else {
                toast.error("Login failed. Please try again.");
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
                            <span className="text-sm text-muted-foreground">Don't have an account? </span>
                            <Link to="/signup" className="font-semibold text-theme-blue hover:underline text-sm">
                                Sign Up
                            </Link>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-theme-darkSlate">Welcome Back!</h1>
                        <p className="text-muted-foreground">
                            Log in to access your dashboard, manage resumes, and discover job opportunities tailored for you.
                        </p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
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
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1"
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full text-lg py-3 bg-theme-blue hover:bg-theme-blue/90 text-white mt-6"
                                disabled={isLoading}
                            >
                                <LogIn className="mr-2 h-5 w-5" />
                                Sign In
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-theme-blue to-theme-purple items-center justify-center p-12 text-white flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-opacity-10 bg-white backdrop-blur-sm"></div>
                    <div className="relative z-10 text-center space-y-6">
                        <Quote className="h-12 w-12 text-cyan-300 mx-auto" strokeWidth={1.5} />
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Craft Your Future.
                        </h2>
                        <p className="text-xl font-light text-blue-100 max-w-md mx-auto">
                            "Leverage AI to build a resume that stands out and matches you with the perfect job."
                        </p>
                        <div className="pt-4">
                            <p className="font-semibold">AI Resume Pro</p>
                            <p className="text-sm text-blue-200">Your Career Advancement Partner</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage; 