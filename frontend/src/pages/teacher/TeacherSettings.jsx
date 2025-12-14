import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Bell,
    Save,
    Upload,
    Loader2,
    Camera,
    Check,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const TeacherSettings = () => {
    const { user: authUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        emergencyContact: '',
        profileImageUrl: ''
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Notification preferences
    const [notificationPrefs, setNotificationPrefs] = useState({
        email: true,
        sms: false,
        push: true
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/auth/me');
            if (data.success) {
                const userData = data.data;
                setProfileData({
                    name: userData.name || '',
                    email: userData.email || '',
                    phone: userData.phone || '',
                    address: userData.address || '',
                    emergencyContact: userData.emergencyContact || '',
                    profileImageUrl: userData.profileImageUrl || ''
                });
                setNotificationPrefs(userData.notificationPreferences || {
                    email: true,
                    sms: false,
                    push: true
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            showMessage('error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (field, value) => {
        setProfileData(prev => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
    };

    const handleNotificationChange = (field, value) => {
        setNotificationPrefs(prev => ({ ...prev, [field]: value }));
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updateData = {
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
                address: profileData.address,
                emergencyContact: profileData.emergencyContact,
                notificationPreferences: notificationPrefs
            };

            const { data } = await api.put('/auth/updatedetails', updateData);
            if (data.success) {
                showMessage('success', 'Profile updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            showMessage('error', error.response?.data?.error?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            // Note: Backend needs to implement password update endpoint
            // For now, we'll use a placeholder
            await api.put('/auth/updatepassword', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            showMessage('success', 'Password updated successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Failed to update password:', error);
            showMessage('error', error.response?.data?.error?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        setSaving(true);
        try {
            // Upload image - backend needs to support this
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                setProfileData(prev => ({ ...prev, profileImageUrl: data.url }));
                showMessage('success', 'Profile image updated!');
            }
        } catch (error) {
            console.error('Failed to upload image:', error);
            showMessage('error', 'Failed to upload image');
        } finally {
            setSaving(false);
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center p-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            );
        }

        switch (activeTab) {
            case 'profile':
                return <ProfileSection
                    data={profileData}
                    onChange={handleProfileChange}
                    onSubmit={handleProfileSubmit}
                    onImageUpload={handleImageUpload}
                    saving={saving}
                />;
            case 'security':
                return <SecuritySection
                    data={passwordData}
                    onChange={handlePasswordChange}
                    onSubmit={handlePasswordSubmit}
                    saving={saving}
                />;
            case 'notifications':
                return <NotificationSection
                    data={notificationPrefs}
                    onChange={handleNotificationChange}
                    onSave={handleProfileSubmit}
                    saving={saving}
                />;
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-theme(spacing.32))] min-h-[600px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Sidebar */}
            <motion.aside variants={itemVariants} className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden h-fit lg:h-full">
                <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account</p>
                </div>
                <nav className="p-2 space-y-1">
                    <NavButton
                        active={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                        icon={User}
                        label="Profile Information"
                    />
                    <NavButton
                        active={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                        icon={Lock}
                        label="Security"
                    />
                    <NavButton
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                        icon={Bell}
                        label="Notifications"
                    />
                </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.main variants={itemVariants} className="flex-1 flex flex-col bg-transparent rounded-xl overflow-hidden">
                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-4 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                        }`}>
                        {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto pr-2 pb-20">
                    {renderContent()}
                </div>
            </motion.main>
        </motion.div>
    );
};

// Navigation Button Component
const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

// Profile Section Component
const ProfileSection = ({ data, onChange, onSubmit, onImageUpload, saving }) => (
    <div className="flex flex-col gap-8 pb-10">
        <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Profile Information</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Update your personal details and profile picture.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex items-center gap-6 p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                        {data.profileImageUrl ? (
                            <img src={data.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            data.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                        <Camera className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                    </label>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{data.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Teacher</p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        required
                    />
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => onChange('email', e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                        required
                    />
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                </div>

                <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Emergency Contact
                    </label>
                    <input
                        type="tel"
                        value={data.emergencyContact}
                        onChange={(e) => onChange('emergencyContact', e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    />
                </div>

                <div className="md:col-span-2 p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address
                    </label>
                    <textarea
                        value={data.address}
                        onChange={(e) => onChange('address', e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>
        </form>
    </div>
);

// Security Section Component
const SecuritySection = ({ data, onChange, onSubmit, saving }) => (
    <div className="flex flex-col gap-8 pb-10">
        <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Security Settings</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Update your password to keep your account secure.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Current Password
                </label>
                <input
                    type="password"
                    value={data.currentPassword}
                    onChange={(e) => onChange('currentPassword', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    required
                />
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    New Password
                </label>
                <input
                    type="password"
                    value={data.newPassword}
                    onChange={(e) => onChange('newPassword', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    required
                    minLength="6"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 6 characters</p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Confirm New Password
                </label>
                <input
                    type="password"
                    value={data.confirmPassword}
                    onChange={(e) => onChange('confirmPassword', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    required
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Update Password
                </button>
            </div>
        </form>
    </div>
);

// Notification Section Component
const NotificationSection = ({ data, onChange, onSave, saving }) => (
    <div className="flex flex-col gap-8 pb-10">
        <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Notification Preferences</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage how you receive notifications.</p>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm divide-y divide-gray-200 dark:divide-gray-800">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails for important updates and announcements.</p>
                    </div>
                </div>
                <Toggle checked={data.email} onChange={(v) => onChange('email', v)} />
            </div>

            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">SMS Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive SMS for urgent alerts and reminders.</p>
                    </div>
                </div>
                <Toggle checked={data.sms} onChange={(v) => onChange('sms', v)} />
            </div>

            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Bell className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications in your browser.</p>
                    </div>
                </div>
                <Toggle checked={data.push} onChange={(v) => onChange('push', v)} />
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
            <button
                onClick={onSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Preferences
            </button>
        </div>
    </div>
);

// Toggle Component
const Toggle = ({ checked = false, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onChange && onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
    </label>
);

export default TeacherSettings;
