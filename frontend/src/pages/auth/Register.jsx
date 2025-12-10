import React, { useState } from 'react';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LightRays from '../../components/LightRays';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'student'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth(); // Assuming we auto-login or just redirect

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const normalizeRole = (r) => ({
        student: 'Student',
        teacher: 'Teacher',
        parent: 'Parent',
        admin: 'Admin'
    }[String(r).toLowerCase()] || 'Student');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        console.log("Register with", formData);

        try {
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: normalizeRole(formData.role)
            });

            if (res.data.success) {
                // Auto login or redirect to login
                // For now, let's redirect to login with a message? 
                // Or better, just auto-login if the backend returned a token (it does)
                const { accessToken, user } = res.data;
                if (accessToken) {
                    localStorage.setItem('token', accessToken);
                    // Force reload or use context login to set state?
                    // Ideally context handles this. But for safety, navigate to login to force clean auth flow unless we update context.
                    // The user requested: "show a messahe that account is created"
                    alert("Account created successfully! Please login.");
                    navigate('/login');
                } else {
                    navigate('/login');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden font-display">

            {/* 🌟 Floating Particles */}
            <motion.div
                className="absolute top-12 left-14 w-24 h-24 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"
                animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-16 right-20 w-28 h-28 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"
                animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="layout-container flex h-full grow flex-col relative z-10">
                <main className="flex min-h-screen w-full flex-col lg:flex-row">

                    {/* LEFT PANEL */}
                    <div className="relative hidden w-full flex-col items-center justify-center bg-[#135bec1a] p-8 lg:flex lg:w-1/2 dark:bg-background-dark">

                        {/* LightRays Background */}
                        <div className="absolute inset-0 z-0">
                            <LightRays
                                raysOrigin="top-center"
                                raysColor="#4f46e5"
                                raysSpeed={1.5}
                                lightSpread={0.8}
                                rayLength={1.2}
                                followMouse={true}
                                mouseInfluence={0.1}
                                noiseAmount={0.1}
                                distortion={0.05}
                            />
                        </div>

                        {/* Left text animation */}
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
                                Join the Future of Education.
                            </p>

                            <p className="text-lg text-[#616f89] dark:text-gray-400">
                                Create your account and get started with managing your institute.
                            </p>
                        </motion.div>
                    </div>

                    {/* RIGHT PANEL — REGISTER FORM */}
                    <div className="flex w-full flex-col items-center justify-center bg-background-light p-4 lg:w-1/2 dark:bg-background-dark/80 relative z-20">

                        {/* Card animation */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex w-full max-w-sm flex-col items-stretch gap-8"
                        >

                            {/* Heading animation */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="flex flex-col gap-4 text-center lg:text-left"
                            >
                                <p className="text-[#111318] dark:text-white text-4xl font-black">
                                    Create Account
                                </p>
                                <p className="text-[#616f89] dark:text-gray-400">
                                    Sign up to get started.
                                </p>
                            </motion.div>

                            {/* FORM */}
                            <form onSubmit={handleRegister} className="flex w-full flex-col items-stretch gap-4">

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}

                                {/* Name */}
                                <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
                                    <label>
                                        <p className="dark:text-gray-300 pb-2">Full Name</p>
                                        <input
                                            className="form-input w-full h-14 rounded-lg border border-gray-300 dark:border-gray-700 p-4 dark:bg-background-dark text-[#111318] dark:text-white"
                                            placeholder="Enter your full name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </label>
                                </motion.div>

                                {/* Email */}
                                <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
                                    <label>
                                        <p className="dark:text-gray-300 pb-2">Email</p>
                                        <input
                                            className="form-input w-full h-14 rounded-lg border border-gray-300 dark:border-gray-700 p-4 dark:bg-background-dark text-[#111318] dark:text-white"
                                            placeholder="Enter your email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            type="email"
                                        />
                                    </label>
                                </motion.div>

                                {/* Role Selection */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="flex flex-col"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <label>
                                        <p className="dark:text-gray-300 pb-2">I am a</p>
                                        <div className="relative">
                                            <motion.select
                                                whileFocus={{ scale: 1.01, borderColor: "#3b82f6" }}
                                                className="form-input w-full h-14 rounded-lg border border-gray-300 dark:border-gray-700 p-4 dark:bg-background-dark text-[#111318] dark:text-white cursor-pointer appearance-none transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/20"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="student">Student</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="parent">Parent</option>
                                            </motion.select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </label>
                                </motion.div>

                                {/* Password */}
                                <motion.div whileHover={{ scale: 1.02 }} className="flex flex-col">
                                    <label>
                                        <p className="dark:text-gray-300 pb-2">Password</p>
                                        <div className="relative">
                                            <input
                                                className="form-input w-full h-14 rounded-lg border border-gray-300 dark:border-gray-700 p-4 pr-12 dark:bg-background-dark text-[#111318] dark:text-white"
                                                placeholder="Create a password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                minLength={6}
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

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={loading}
                                    className="bg-primary text-white h-12 rounded-lg font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </motion.button>

                                <p className="text-center dark:text-gray-400">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-primary hover:underline">Log In</Link>
                                </p>
                            </form>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Register;
