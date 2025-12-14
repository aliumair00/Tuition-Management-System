import React, { useState, useEffect } from 'react';
import {
    User,
    Contact,
    Lock,
    Bell,
    Camera,
    Save,
    X,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeSection, setActiveSection] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        notificationPreferences: {
            email: true,
            sms: false,
            app: true
        }
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                address: user.address || '',
                emergencyContact: {
                    name: user.emergencyContact?.name || '',
                    relationship: user.emergencyContact?.relationship || '',
                    phone: user.emergencyContact?.phone || ''
                },
                notificationPreferences: {
                    email: user.notificationPreferences?.email ?? true,
                    sms: user.notificationPreferences?.sms ?? false,
                    app: user.notificationPreferences?.app ?? true
                }
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmergencyChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            emergencyContact: {
                ...prev.emergencyContact,
                [name]: value
            }
        }));
    };

    const handleNotificationToggle = (type) => {
        setFormData(prev => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [type]: !prev.notificationPreferences[type]
            }
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setSuccessMessage('');
        try {
            await api.put('/auth/updatedetails', formData);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

    const sections = [
        { id: 'personal', label: 'Personal Information', icon: User },
        { id: 'emergency', label: 'Emergency Contacts', icon: Contact },
        { id: 'security', label: 'Account Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                {/* Sidebar */}
                <aside className="lg:col-span-3">
                    <div className="sticky top-24">
                        <div className="flex h-full flex-col justify-between bg-white dark:bg-gray-900/50 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative group">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 bg-gray-200 border-2 border-white dark:border-gray-800 shadow-md"
                                            style={{ backgroundImage: `url("${user.profileImageUrl || defaultAvatar}")` }}
                                        ></div>
                                        <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-white shadow-sm hover:bg-primary/90 transition-colors">
                                            <Camera size={14} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col text-center">
                                        <h1 className="text-gray-900 dark:text-white text-lg font-medium leading-normal">{user.name}</h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal capitalize">{user.role}</p>
                                        <p className="text-xs text-gray-400 mt-1">ID: {user._id?.substring(18).toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
                                <div className="flex flex-col gap-1">
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full text-left ${activeSection === section.id
                                                ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                                        >
                                            <section.icon size={20} className={activeSection === section.id ? "fill-current" : ""} />
                                            <p className="text-sm leading-normal">{section.label}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-9">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap justify-between items-start gap-3">
                            <div className="flex min-w-72 flex-col gap-2">
                                <h2 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                                    {sections.find(s => s.id === activeSection)?.label}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                                    Manage your {activeSection} details.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <AnimatePresence>
                                    {successMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg mr-2"
                                        >
                                            <CheckCircle size={16} />
                                            <span className="text-sm font-medium">{successMessage}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex min-w-[140px] items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        </div>

                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6"
                        >
                            {activeSection === 'personal' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Full Name</p>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-11 px-3"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Phone Number</p>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-11 px-3"
                                        />
                                    </label>
                                    <label className="flex flex-col md:col-span-2">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Email Address</p>
                                        <input
                                            value={user.email}
                                            disabled
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-11 px-3 text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                                    </label>
                                    <label className="flex flex-col md:col-span-2">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Residential Address</p>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            placeholder="123 Main St, City, Country"
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 resize-none"
                                        />
                                    </label>
                                </div>
                            )}

                            {activeSection === 'emergency' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <label className="flex flex-col">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Contact Name</p>
                                        <input
                                            name="name"
                                            value={formData.emergencyContact.name}
                                            onChange={handleEmergencyChange}
                                            placeholder="Parent / Guardian Name"
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-11 px-3"
                                        />
                                    </label>
                                    <label className="flex flex-col">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Relationship</p>
                                        <input
                                            name="relationship"
                                            value={formData.emergencyContact.relationship}
                                            onChange={handleEmergencyChange}
                                            placeholder="e.g. Father, Mother"
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-11 px-3"
                                        />
                                    </label>
                                    <label className="flex flex-col md:col-span-2">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Emergency Phone</p>
                                        <input
                                            name="phone"
                                            value={formData.emergencyContact.phone}
                                            onChange={handleEmergencyChange}
                                            placeholder="Emergency Contact Number"
                                            className="form-input rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-11 px-3"
                                        />
                                    </label>
                                </div>
                            )}

                            {activeSection === 'security' && (
                                <div className="flex flex-col gap-6">
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                                            To change your password, please contact the administration or use the "Forgot Password" flow on the login screen.
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:col-span-2">
                                        <p className="text-gray-800 dark:text-gray-200 text-sm font-medium pb-2">Last Login</p>
                                        <div className="h-11 flex items-center px-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500">
                                            {new Date().toLocaleDateString()} (Current Session)
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSection === 'notifications' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                            <p className="text-sm text-gray-500">Receive assignment updates and results via email.</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('email')}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.notificationPreferences.email ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.notificationPreferences.email ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">SMS Notifications</p>
                                            <p className="text-sm text-gray-500">Get text messages for immediate alerts (Urgent only).</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('sms')}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.notificationPreferences.sms ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.notificationPreferences.sms ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">In-App Notifications</p>
                                            <p className="text-sm text-gray-500">Show badges and alerts within the dashboard.</p>
                                        </div>
                                        <button
                                            onClick={() => handleNotificationToggle('app')}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${formData.notificationPreferences.app ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${formData.notificationPreferences.app ? 'left-7' : 'left-1'}`}></div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfile;
