import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    Wallet,
    BookOpen,
    User,
    LogOut,
    Search,
    Bell,
    Menu,
    GraduationCap,
    X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const StudentLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const notificationRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
        { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
        { icon: BarChart3, label: 'Results', path: '/student/results' },
        { icon: Wallet, label: 'Fees', path: '/student/fees' },
        { icon: BookOpen, label: 'Study Materials', path: '/student/materials' },
    ];

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications/my');
                if (data.success) {
                    setNotifications(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch notifications");
            }
        };
        if (user) fetchNotifications();
    }, [user]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        // Implement search logic or navigate to search page with query
        // For now, we can pass it to children via context if needed, or just keep it local
    };

    return (
        <div className="relative flex min-h-screen w-full bg-background-light dark:bg-background-dark font-display overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SideNavBar */}
            <aside className={cn(
                "fixed flex h-full flex-col bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark w-64 p-4 transition-transform duration-300 ease-in-out z-20",
                sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <div className="flex items-center gap-3 px-3 py-2 text-primary">
                    <GraduationCap size={32} />
                    <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Student Portal</h2>
                </div>

                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                    isActive(item.path)
                                        ? "bg-primary/20 text-primary"
                                        : "hover:bg-primary/20 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary"
                                )}
                            >
                                <item.icon size={20} />
                                <p className="text-sm font-medium">{item.label}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-auto flex flex-col gap-4">
                    <div className="border-t border-border-light dark:border-border-dark pt-4 flex flex-col gap-2">
                        <Link to="/student/profile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                            <User size={20} />
                            <p className="text-sm font-medium">Profile</p>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors w-full text-left">
                            <LogOut size={20} />
                            <p className="text-sm font-medium">Logout</p>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen w-full max-w-full">
                {/* TopNavBar */}
                <header className="flex items-center justify-between whitespace-nowrap border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-6 py-4 sticky top-0 z-10">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden text-text-primary-light dark:text-text-primary-dark"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="hidden md:block"></div>
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <label className="hidden sm:flex flex-col relative min-w-40 !h-10 max-w-64">
                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-border-light dark:border-border-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                                <span className="text-text-secondary-light dark:text-text-secondary-dark flex bg-background-light dark:bg-background-dark items-center justify-center pl-3">
                                    <Search size={20} />
                                </span>
                                <input
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-background-light dark:bg-background-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark pl-2 text-base font-normal leading-normal"
                                    placeholder="Search..."
                                />
                            </div>
                        </label>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                            >
                                <Bell size={20} />
                                {notifications.some(n => !n.read) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden z-50"
                                    >
                                        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            <button onClick={() => setNotificationsOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map(notification => (
                                                    <div key={notification._id} className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                                                        <p className="text-xs text-gray-400 mt-2">{new Date(notification.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500 text-sm">No notifications</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile User Info */}
                        <div className="flex items-center gap-3 pl-2 border-l border-border-light dark:border-border-dark">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 ring-2 ring-primary/20"
                                style={{ backgroundImage: user?.profileImageUrl ? `url(${user.profileImageUrl})` : `url("https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4A90E2&color=fff")` }}></div>
                            <div className="hidden lg:flex flex-col text-right">
                                <h1 className="text-text-primary-light dark:text-text-primary-dark text-sm font-medium">{user?.name || 'Student'}</h1>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{user?.role || 'Student'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
