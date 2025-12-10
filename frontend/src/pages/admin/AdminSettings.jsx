import React, { useState } from 'react';
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
    AlertCircle,
    Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100
        }
    }
};

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'users':
                return <UserManagementSettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'integrations':
                return <IntegrationSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <motion.div
            className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-theme(spacing.32))] min-h-[600px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Settings Sidebar */}
            <motion.aside variants={itemVariants} className="w-full lg:w-64 flex-shrink-0 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm overflow-hidden h-fit lg:h-full">
                <div className="p-4 sm:p-6 border-b border-border-light dark:border-border-dark">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage system configurations</p>
                </div>
                <nav className="p-2 space-y-1">
                    <NavButton
                        active={activeTab === 'general'}
                        onClick={() => setActiveTab('general')}
                        icon={Settings}
                        label="System Preferences"
                    />
                    <NavButton
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                        icon={Users}
                        label="User Management"
                    />
                    <NavButton
                        active={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                        icon={Bell}
                        label="Notification Defaults"
                    />
                    <NavButton
                        active={activeTab === 'integrations'}
                        onClick={() => setActiveTab('integrations')}
                        icon={LinkIcon}
                        label="Integrations"
                    />
                </nav>
            </motion.aside>

            {/* Main Content Area */}
            <motion.main variants={itemVariants} className="flex-1 flex flex-col bg-transparent rounded-xl overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2">
                    {renderContent()}
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-auto pt-6 border-t border-border-light dark:border-border-dark flex justify-end gap-3 sticky bottom-0 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm py-4">
                    <button className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Discard
                    </button>
                    <button className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </motion.main>
        </motion.div>
    );
};

// Helper Components
const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            }`}
    >
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

// Tab Content Components
const GeneralSettings = () => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="System Preferences" description="Manage application branding and localization settings." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* App Branding */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">App Branding</h4>
                    <Palette className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">App Name</label>
                        <input type="text" defaultValue="Edura School Platform" className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">App Logo</label>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600">
                                <span className="text-xs font-bold text-primary">LOGO</span>
                            </div>
                            <button className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <Upload className="w-4 h-4" />
                                Upload Logo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Localization */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Localization</h4>
                    <Globe className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                        <select className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-gray-700 dark:text-gray-200">
                            <option>(UTC-05:00) Eastern Time</option>
                            <option>(UTC+00:00) London</option>
                            <option>(UTC+05:00) Islamabad, Karachi</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Format</label>
                        <select className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-gray-700 dark:text-gray-200">
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

const UserManagementSettings = () => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="User Management" description="Configure password policies and default settings for new users." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Policies */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Password Policies</h4>
                    <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Length</label>
                        <input type="number" defaultValue="8" className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Special Character</span>
                        <Toggle />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Number</span>
                        <Toggle />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Force Reset Every 90 Days</span>
                        <Toggle />
                    </div>
                </div>
            </div>

            {/* New User Defaults */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">New User Defaults</h4>
                    <UserPlus className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Role</label>
                        <select className="w-full h-10 px-3 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-gray-700 dark:text-gray-200">
                            <option>Student</option>
                            <option>Teacher</option>
                            <option>Parent</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Send Welcome Email</span>
                        <Toggle />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Require Email Verification</span>
                        <Toggle />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const NotificationSettings = () => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="Notification Defaults" description="Manage email, SMS, and push notification settings." />

        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm divide-y divide-border-light dark:divide-border-dark">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-primary">
                        <Mail className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails for important system alerts and updates.</p>
                    </div>
                </div>
                <Toggle />
            </div>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">SMS Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive SMS for urgent alerts like attendance.</p>
                    </div>
                </div>
                <Toggle />
            </div>
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                        <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Push Notifications</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications on mobile devices.</p>
                    </div>
                </div>
                <Toggle />
            </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4">Event Triggers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['New User Registration', 'Fee Payment Received', 'Class Schedule Change', 'Exam Result Published', 'Teacher Leave Request'].map((event) => (
                <div key={event} className="p-4 rounded-lg bg-background-light dark:bg-gray-800 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{event}</span>
                    <Toggle />
                </div>
            ))}
        </div>
    </div>
);

const IntegrationSettings = () => (
    <div className="flex flex-col gap-8 pb-10">
        <SectionHeader title="Integrations" description="Connect with third-party services and APIs." />

        <div className="grid grid-cols-1 gap-6">
            {/* Google Workspace */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-gray-200">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png" alt="Google" className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Google Workspace</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sync calendars, drive, and email.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                    Connect
                </button>
            </div>

            {/* Zoom */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#2D8CFF] flex items-center justify-center">
                        <div className="text-white font-bold text-xs">ZOOM</div>
                        {/* <Video className="w-6 h-6 text-white" /> */}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Zoom</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enable online classes and meetings.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Connected
                </button>
            </div>

            {/* Stripe */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#635BFF] flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Stripe Payments</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Process fee payments and transactions.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-white">
                    Connect
                </button>
            </div>

            {/* API Access */}
            <div className="p-6 rounded-xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Cloud className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">API Access</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Manage API keys for custom integrations.</p>
                        </div>
                    </div>
                </div>
                <div className="bg-background-light dark:bg-gray-900 p-4 rounded-lg flex items-center justify-between gap-4">
                    <code className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-mono break-all leading-relaxed bg-white dark:bg-black/20 p-2 rounded border border-gray-200 dark:border-gray-800">
                        sk_test_51Mz...92x
                    </code>
                    <button className="text-primary hover:text-primary-dark text-sm font-bold">Regenerate</button>
                </div>
            </div>
        </div>
    </div>
);

const Toggle = ({ checked = false }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
    </label>
);

export default AdminSettings;
