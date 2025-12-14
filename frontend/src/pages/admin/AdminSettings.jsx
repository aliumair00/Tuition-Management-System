import React, { useState, useEffect } from 'react';
import {
    Settings,
    Users,
    Bell,
    Link as LinkIcon,
    Palette,
    Globe,
    Lock,
    UserPlus,
    Upload,
    Save,
    Mail,
    MessageSquare,
    Smartphone,
    Check,
    Cloud,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        appName: 'Edura School Platform',
        timezone: '(UTC+05:00) Islamabad, Karachi',
        dateFormat: 'DD/MM/YYYY',
        passwordPolicy: {
            minLength: 8,
            requireSpecialChar: false,
            requireNumber: false,
            forceReset: false
        },
        newUserDefaults: {
            role: 'Student',
            sendWelcome: true,
            requireVerify: false
        },
        notifications: {
            email: true,
            sms: false,
            push: true,
            triggers: []
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                if (data.success) {
                    setSettings(prev => ({ ...prev, ...data.data }));
                }
            } catch (e) {
                console.error("Failed to fetch settings", e);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (section, key, value) => {
        if (section) {
            setSettings(prev => ({
                ...prev,
                [section]: { ...prev[section], [key]: value }
            }));
        } else {
            setSettings(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/settings', settings);
            alert("Settings saved successfully!");
        } catch (e) {
            console.error("Failed to save settings", e);
            alert("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

        switch (activeTab) {
            case 'general':
                return <GeneralSettings settings={settings} handleChange={handleChange} />;
            case 'users':
                return <UserManagementSettings settings={settings} handleChange={handleChange} />;
            case 'notifications':
                return <NotificationSettings settings={settings} handleChange={handleChange} />;
            case 'integrations':
                return <IntegrationSettings />;
            default:
                return <GeneralSettings settings={settings} handleChange={handleChange} />;
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
            <motion.aside variants={itemVariants} className="w-full lg:w-64 flex-shrink-0 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden h-fit lg:h-full">
                <div className="p-4 sm:p-6 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage system configurations</p>
                </div>
                <nav className="p-2 space-y-1">
                    <NavButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={Settings} label="System Preferences" />
                    <NavButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={Users} label="User Management" />
                    <NavButton active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} icon={Bell} label="Notification Defaults" />
                    <NavButton active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')} icon={LinkIcon} label="Integrations" />
                </nav>
            </motion.aside>

            {/* Main Content */}
            <motion.main variants={itemVariants} className="flex-1 flex flex-col bg-transparent rounded-xl overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 pb-20">
                    {renderContent()}
                </div>

                <div className="mt-auto pt-6 border-t border-border-light dark:border-border-dark flex justify-end gap-3 sticky bottom-0 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm py-4">
                    <button className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Discard</button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </motion.main>
        </motion.div>
    );
};

// Components
const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const SectionHeader = ({ title, description }) => (
    <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
);

const GeneralSettings = ({ settings, handleChange }) => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="System Preferences" description="Manage application branding and localization settings." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">App Branding</h4>
                    <Palette className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App Name</label>
                        <input value={settings.appName} onChange={e => handleChange(null, 'appName', e.target.value)} type="text" className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" />
                    </div>
                </div>
            </div>
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Localization</h4>
                    <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                        <select value={settings.timezone} onChange={e => handleChange(null, 'timezone', e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 outline-none text-sm text-gray-700 dark:text-gray-200">
                            <option>(UTC-05:00) Eastern Time</option>
                            <option>(UTC+00:00) London</option>
                            <option>(UTC+05:00) Islamabad, Karachi</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Format</label>
                        <select value={settings.dateFormat} onChange={e => handleChange(null, 'dateFormat', e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 outline-none text-sm text-gray-700 dark:text-gray-200">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const UserManagementSettings = ({ settings, handleChange }) => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="User Management" description="Configure password policies and default settings." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Password Policies</h4>
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Length</label>
                        <input type="number" value={settings.passwordPolicy.minLength} onChange={e => handleChange('passwordPolicy', 'minLength', parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all text-sm" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Special Character</span>
                        <Toggle checked={settings.passwordPolicy.requireSpecialChar} onChange={v => handleChange('passwordPolicy', 'requireSpecialChar', v)} />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Number</span>
                        <Toggle checked={settings.passwordPolicy.requireNumber} onChange={v => handleChange('passwordPolicy', 'requireNumber', v)} />
                    </div>
                </div>
            </div>
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">New User Defaults</h4>
                    <UserPlus className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Role</label>
                        <select value={settings.newUserDefaults.role} onChange={e => handleChange('newUserDefaults', 'role', e.target.value)} className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 outline-none text-sm text-gray-700 dark:text-gray-200">
                            <option>Student</option>
                            <option>Teacher</option>
                            <option>Parent</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Send Welcome Email</span>
                        <Toggle checked={settings.newUserDefaults.sendWelcome} onChange={v => handleChange('newUserDefaults', 'sendWelcome', v)} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NotificationSettings = ({ settings, handleChange }) => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="Notification Defaults" description="Manage email, SMS, and push notification settings." />
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm divide-y divide-border-light dark:divide-border-dark">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary"><Mail className="w-6 h-6" /></div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails for important system alerts.</p>
                    </div>
                </div>
                <Toggle checked={settings.notifications.email} onChange={v => handleChange('notifications', 'email', v)} />
            </div>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><MessageSquare className="w-6 h-6" /></div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">SMS Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive SMS for urgent alerts.</p>
                    </div>
                </div>
                <Toggle checked={settings.notifications.sms} onChange={v => handleChange('notifications', 'sms', v)} />
            </div>
        </div>
    </div>
);

const IntegrationSettings = () => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="Integrations" description="Connect with third-party services." />
        <div className="grid grid-cols-1 gap-4">
            <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-4">
                    <Cloud />
                    <span>No active integrations available</span>
                </div>
            </div>
        </div>
    </div>
);

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

export default AdminSettings;
