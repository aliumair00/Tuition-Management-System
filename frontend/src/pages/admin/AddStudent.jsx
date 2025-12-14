import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Phone,
    Briefcase,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const AddStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: 'password123', // Default password
        role: 'Student',
        phone: '',
        address: '',
        admissionNumber: '',
        admissionDate: '',
        parentName: '',
        parentEmail: '',
        parentPhone: ''
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Basic validation
            if (!formData.name || !formData.email) {
                alert("Name and Email are required");
                setLoading(false);
                return;
            }

            // Send JSON payload (no file upload handling for now)
            const payload = { ...formData };
            // If you later add file upload support, handle it separately.
            await api.post('/users', payload);
            alert("Student added successfully!");
            navigate('/admin/students');
        } catch (error) {
            console.error("Failed to add student", error);
            const msg = error?.response?.data?.error?.message
                || error?.response?.data?.message
                || "Failed to add student. Please try again.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Student</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details below to admit a new student.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/admin/students')}
                        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Student'}
                    </button>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8 space-y-8">
                {/* Personal Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-4 border-b border-border-light dark:border-border-dark mb-6">Personal Details</h3>
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Profile Picture Placeholder */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="cursor-pointer group">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden relative group-hover:border-primary transition-colors">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-400 dark:text-gray-500 group-hover:scale-110 transition-transform" />
                                    )}
                                </div>
                                <div className="mt-4 text-center">
                                    <span className="text-sm font-medium text-primary hover:text-primary-dark">Upload Photo</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Enter full name"
                                    className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email (Username)</span>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    placeholder="Enter email"
                                    className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</span>
                                <input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    placeholder="Default: password123"
                                    className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</span>
                                <div className="relative">
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        type="tel"
                                        className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                    <Phone className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</span>
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="Enter full address"
                                    className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </label>
                        </div>
                    </div>
                </section>

                {/* Admission Details */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-4 border-b border-border-light dark:border-border-dark mb-6">Admission Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admission Number</span>
                            <div className="relative">
                                <input
                                    name="admissionNumber"
                                    value={formData.admissionNumber}
                                    onChange={handleInputChange}
                                    type="text"
                                    placeholder="e.g. ADM-2023-001"
                                    className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                                <Briefcase className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admission Date</span>
                            <div className="relative">
                                <input
                                    name="admissionDate"
                                    value={formData.admissionDate}
                                    onChange={handleInputChange}
                                    type="date"
                                    className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                                <Calendar className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </label>
                    </div>
                </section>

                {/* Parent Information */}
                <section>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-4 border-b border-border-light dark:border-border-dark mb-6">Parent Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent Name</span>
                            <input
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="Enter parent name"
                                className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent Email</span>
                            <input
                                name="parentEmail"
                                value={formData.parentEmail}
                                onChange={handleInputChange}
                                type="email"
                                placeholder="Enter parent email"
                                className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent Phone</span>
                            <input
                                name="parentPhone"
                                value={formData.parentPhone}
                                onChange={handleInputChange}
                                type="tel"
                                placeholder="Enter parent phone"
                                className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </label>
                    </div>
                </section>
            </motion.div>
        </motion.div>
    );
};

export default AddStudent;
