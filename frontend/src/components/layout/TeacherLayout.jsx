import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    Calendar,
    FolderOpen,
    ClipboardCheck,
    FileQuestion,
    Settings,
    LogOut,
    Menu,
    Search,
    Bell
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const TeacherLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Notifications State
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [loadingNotifications, setLoadingNotifications] = React.useState(false);

    // Search State
    const [searchOpen, setSearchOpen] = React.useState(false);

    const toggleNotifications = async () => {
        const next = !showNotifications;
        setShowNotifications(next);
        if (next && user?.id && notifications.length === 0) {
            setLoadingNotifications(true);
            try {
                const { data } = await api.get(`/notifications/user/${user.id}`);
                if (data.success) setNotifications(data.data);
            } catch (e) {
                console.error("Failed to fetch notifications", e);
            } finally {
                setLoadingNotifications(false);
            }
        }
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
        { icon: Users, label: 'Classes', path: '/teacher/classes' },
        { icon: Calendar, label: 'Timetable', path: '/teacher/timetable' },
        { icon: FolderOpen, label: 'Materials', path: '/teacher/materials' },
        { icon: ClipboardCheck, label: 'Attendance', path: '/teacher/attendance' },
        { icon: FileQuestion, label: 'Exams', path: '/teacher/exams' },
    ];

    return (
        <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SideNavBar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-full flex-col justify-between p-4">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2 p-2">
                            <GraduationCap className="text-primary w-8 h-8" />
                            <h1 className="text-[#111318] dark:text-white text-lg font-bold">EduPlatform</h1>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                        ${isActive
                                                    ? 'bg-primary/10 dark:bg-primary/20 text-primary'
                                                    : 'text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-[#616f89] dark:text-gray-400'}`} />
                                            <p className={`text-sm font-medium leading-normal ${isActive ? 'text-primary' : ''}`}>{item.label}</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex gap-3 p-2 items-center">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200" style={{ backgroundImage: `url("${user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Teacher')}&background=random`}")` }}></div>
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-[#111318] dark:text-white text-sm font-medium leading-normal truncate">{user?.name || 'Teacher'}</h1>
                                <p className="text-[#616f89] dark:text-gray-400 text-xs font-normal leading-normal truncate">{user?.email || 'teacher@school.edu'}</p>
                            </div>
                        </div>
                        <Link to="/teacher/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <Settings className="w-5 h-5" />
                            <p className="text-sm font-medium leading-normal">Settings</p>
                        </Link>
                        <button onClick={logout} className="flex w-full items-center gap-3 px-3 py-2 text-[#616f89] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 rounded-lg text-left">
                            <LogOut className="w-5 h-5" />
                            <p className="text-sm font-medium leading-normal">Logout</p>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-6 lg:p-8">
                    {/* Mobile Header Placeholder */}
                    <div className="lg:hidden flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="text-primary w-8 h-8" />
                            <h1 className="text-[#111318] dark:text-white text-lg font-bold">EduPlatform</h1>
                        </div>
                        <button
                            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <header className="flex flex-wrap justify-between items-center gap-4">
                            <div className="flex flex-col">
                                <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">Good Morning, {user?.name?.split(' ')[0] || 'Teacher'}!</h1>
                                <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                {searchOpen ? (
                                    <div className="relative">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search..."
                                            className="pl-4 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-card-dark focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
                                            onBlur={() => setSearchOpen(false)}
                                        />
                                        <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                ) : (
                                    <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                        <Search className="w-6 h-6 text-[#616f89] dark:text-gray-400" />
                                    </button>
                                )}

                                <div className="relative">
                                    <button onClick={toggleNotifications} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 relative transition-colors">
                                        <Bell className="w-6 h-6 text-[#616f89] dark:text-gray-400" />
                                        {/* Show badge if notifications exist (can optimize later to check read status) */}
                                        <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    </button>

                                    {showNotifications && (
                                        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-lg z-40">
                                            <div className="p-3 border-b border-border-light dark:border-border-dark text-sm font-semibold text-gray-700 dark:text-gray-300">Notifications</div>
                                            <div className="max-h-80 overflow-auto">
                                                {loadingNotifications ? (
                                                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading...</div>
                                                ) : notifications.length === 0 ? (
                                                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">No notifications</div>
                                                ) : (
                                                    notifications.map(n => (
                                                        <div key={n._id} className="p-4 border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{n.message}</div>
                                                            <div className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </header>

                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
