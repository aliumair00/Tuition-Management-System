import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Users,
    Wallet,
    Calendar,
    Settings,
    LogOut,
    Search,
    Bell,
    Menu,
    School,
    X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const ParentLayout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const notificationRef = useRef(null);

    const isActive = (path) => {
        return location.pathname === path;
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/parent/dashboard' },
        { icon: Users, label: 'My Children', path: '/parent/children' },
        { icon: Wallet, label: 'Fees & Payments', path: '/parent/fees' },
        { icon: Calendar, label: 'Calendar', path: '/parent/calendar' },
        { icon: Settings, label: 'Settings', path: '/parent/settings' },
    ];

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            setLoadingNotifications(true);
            try {
                const { data } = await api.get('/notifications/my');
                if (data.success) {
                    setNotifications(data.data);
                }
            } catch (error) {
                // Only log non-401 errors (401 is expected when not authenticated)
                if (error.response?.status !== 401) {
                    console.error('Failed to fetch notifications:', error);
                }
            } finally {
                setLoadingNotifications(false);
            }
        };

        fetchNotifications();
    }, [user]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

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
                    <School size={32} />
                    <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Parent Portal</h2>
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
                        <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors w-full text-left">
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
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-background-light dark:bg-background-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark pl-2 text-base font-normal leading-normal"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </label>

                        {/* Notification Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark hover:bg-border-light dark:hover:bg-border-dark transition-colors"
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown Menu */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg overflow-hidden z-50">
                                    <div className="p-4 border-b border-border-light dark:border-border-dark">
                                        <h3 className="text-text-primary-light dark:text-text-primary-dark font-semibold">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {loadingNotifications ? (
                                            <div className="p-4 text-center text-text-secondary-light dark:text-text-secondary-dark">
                                                Loading...
                                            </div>
                                        ) : notifications.length === 0 ? (
                                            <div className="p-4 text-center text-text-secondary-light dark:text-text-secondary-dark">
                                                No notifications
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification._id}
                                                    onClick={() => !notification.read && markAsRead(notification._id)}
                                                    className={cn(
                                                        "p-4 border-b border-border-light dark:border-border-dark cursor-pointer hover:bg-background-light dark:hover:bg-background-dark transition-colors",
                                                        !notification.read && "bg-primary/5"
                                                    )}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-1">
                                                            <h4 className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pl-2 border-l border-border-light dark:border-border-dark">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200 ring-2 ring-primary/20"
                                style={{
                                    backgroundImage: user?.profileImageUrl
                                        ? `url(${user.profileImageUrl})`
                                        : `url("https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4A90E2&color=fff")`
                                }}
                            ></div>
                            <div className="hidden lg:flex flex-col text-right">
                                <h1 className="text-text-primary-light dark:text-text-primary-dark text-sm font-medium">
                                    {user?.name || 'Parent'}
                                </h1>
                                <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs">Parent</p>
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

export default ParentLayout;
