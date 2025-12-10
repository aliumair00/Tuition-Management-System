import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LightRays from '../../components/LightRays';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const { login, error } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user) {
                switch (user.role) {
                    case 'Admin':
                        navigate('/admin/dashboard');
                        break;
                    case 'Teacher':
                        navigate('/teacher/dashboard');
                        break;
                    case 'Student':
                        navigate('/student/dashboard');
                        break;
                    case 'Parent':
                        navigate('/parent/dashboard');
                        break;
                    default:
                        navigate('/'); // Fallback
                }
            }
        } catch (err) {
            console.error("Login Error:", err);
            // Error handling is managed by AuthContext/state but we can log it here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display">

            {/* 🌟 Floating Particles */}
            <motion.div
                className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"
                animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-10 right-16 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"
                animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="layout-container flex h-full grow flex-col relative z-10">
                <main className="flex min-h-screen w-full flex-col lg:flex-row">

                    {/* ------------------------------ */}
                    {/* LEFT PANEL + BACKGROUND ANIMATION */}
                    {/* ------------------------------ */}
                    <div className="relative hidden w-full flex-col items-center justify-center bg-[#135bec1a] p-8 lg:flex lg:w-1/2 dark:bg-background-dark overflow-hidden">

                        {/* LightRays Background */}
                        <div className="absolute inset-0 z-0 overflow-hidden bg-gray-50 dark:bg-[#0b0f19]">
                            <LightRays
                                raysOrigin="top-center"
                                raysColor="#4f46e5" // Indigo-ish to match theme
                                raysSpeed={1.5}
                                lightSpread={0.8}
                                rayLength={1.2}
                                followMouse={true}
                                mouseInfluence={0.1}
                                noiseAmount={0.1}
                                distortion={0.05}
                            />
                        </div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            className="relative z-10 flex flex-col items-start gap-6 text-left max-w-lg"
                        >
                            <div className="flex items-center gap-3">
                                <GraduationCap className="text-primary dark:text-white" size={40} />
                                <h1 className="text-3xl font-bold text-[#111318] dark:text-white">EduPlatform</h1>
                            </div>

                            <p className="text-5xl font-black leading-tight tracking-tighter text-[#111318] dark:text-white">
                                Empowering Education, Simply.
                            </p>

                            <p className="text-lg text-[#616f89] dark:text-gray-400">
                                Manage your institution with ease and efficiency, all in one place.
                            </p>
                        </motion.div>
                    </div>

                    {/* ------------------------------ */}
                    {/* RIGHT PANEL — LOGIN FORM */}
                    {/* ------------------------------ */}
                    <div className="flex w-full flex-col items-center justify-center bg-background-light p-4 lg:w-1/2 dark:bg-background-dark/80 relative z-20">
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex w-full max-w-sm flex-col items-stretch gap-8"
                        >
                            {/* Heading */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="flex flex-col gap-4 text-center lg:text-left"
                            >
                                <p className="text-[#111318] dark:text-white text-4xl font-black">
                                    Welcome Back
                                </p>
                                <p className="text-[#616f89] dark:text-gray-400">
                                    Log in to your account to continue.
                                </p>
                            </motion.div>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="flex w-full flex-col items-stretch gap-4">
                                {/* Email */}
                                <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="dark:text-gray-300 pb-2">Email or Username</p>
                                        <input
                                            className="form-input h-14 rounded-lg border border-gray-300 dark:border-gray-700 p-4 dark:bg-background-dark text-[#111318] dark:text-white"
                                            placeholder="Enter your email or username"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </label>
                                </motion.div>

                                {/* Password */}
                                <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
                                    <label className="flex flex-col min-w-40 flex-1">
                                        <p className="dark:text-gray-300 pb-2">Password</p>
                                        <div className="relative">
                                            <input
                                                className="form-input w-full h-14 rounded-lg border border-gray-300 dark:border-gray-700 p-4 pr-12 dark:bg-background-dark text-[#111318] dark:text-white"
                                                placeholder="Enter your password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <div
                                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer dark:text-gray-400"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                            </div>
                                        </div>
                                    </label>
                                </motion.div>

                                <a className="text-primary text-right text-sm hover:underline" href="#">
                                    Forgot password?
                                </a>

                                {/* Submit */}
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-primary text-white h-12 rounded-lg font-bold shadow-md hover:bg-primary/90"
                                    type="submit"
                                >
                                    Login
                                </motion.button>

                                <p className="text-center dark:text-gray-400">
                                    Don't have an account?{" "}
                                    <Link className="text-primary font-medium hover:underline" to="/register">
                                        Sign Up
                                    </Link>
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Login;
