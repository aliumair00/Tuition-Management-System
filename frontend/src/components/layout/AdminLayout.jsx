import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    Receipt,
    FileText,
    Settings,
    LogOut,
    Search,
    Bell,
    Menu,
    UserCircle,
    School,
    Calendar,
    Filter,
    X
} from 'lucide-react';
import api from '../../lib/api';

// Helper for relative time
const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(dateString).toLocaleDateString();
};

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [search, setSearch] = React.useState('');
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    React.useEffect(() => {
        const fetchNotifications = async () => {
            if (user?._id || user?.id) {
                try {
                    const userId = user._id || user.id;
                    const { data } = await api.get(`/notifications/user/${userId}`);
                    if (data.success) {
                        setNotifications(data.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch notifications", error);
                }
            }
        };
        fetchNotifications();
    }, [user]);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: UserCircle, label: 'Teachers', path: '/admin/teachers' },
        { icon: School, label: 'Classes', path: '/admin/classes' },
        { icon: BookOpen, label: 'Subjects', path: '/admin/subjects' },
        { icon: Calendar, label: 'Attendance', path: '/admin/attendance' },
        { icon: FileText, label: 'Timetable', path: '/admin/timetable' },
        { icon: Receipt, label: 'Billing', path: '/admin/billing' },
        { icon: Filter, label: 'Reports', path: '/admin/reports' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-body">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-30 w-64 flex-col bg-card-light dark:bg-card-dark border-r border-border-light dark:border-border-dark 
                    transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:flex
                    ${isSidebarOpen ? 'translate-x-0 flex' : '-translate-x-full lg:flex'}
                `}
            >
                <div className="flex items-center justify-between px-6 py-6 border-b border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white font-display">EduAdmin</h1>
                    </div>
                    {/* Close Button for Mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <LogOut className="h-5 w-5 rotate-180" /> {/* Using LogOut as makeshift arrow or add X icon */}
                    </button>
                </div>

                <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                  ${isActive
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border-light dark:border-border-dark">
                    <div className="flex items-center gap-3 p-3 rounded-lg mb-2">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center" style={{ backgroundImage: user?.profileImageUrl ? `url("${user.profileImageUrl}")` : 'url("https://i.pravatar.cc/150?u=admin")' }} />
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name || 'Admin User'}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role || 'Administrator'}</p>
                        </div>
                    </div>
                    <button onClick={() => { logout(); }} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium text-sm">
                        <LogOut className="w-5 h-5" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="flex h-16 items-center justify-between border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                        <Menu className="w-6 h-6 dark:text-white" />
                    </button>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white lg:hidden">Dashboard</h2>
                    {/* On desktop, breadcrumbs or page title could go here if managed by child components, otherwise empty or search */}

                    <div className="flex flex-1 items-center justify-end gap-4">
                        <div className="relative hidden max-w-sm w-full lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="w-full h-10 pl-10 pr-4 rounded-full bg-background-light dark:bg-gray-800 border-transparent text-sm focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { navigate(`/admin/students?q=${encodeURIComponent(search)}`); } }}
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            >
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-card-light dark:border-card-dark" />
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-card-dark rounded-xl shadow-lg border border-border-light dark:border-border-dark z-50 overflow-hidden">
                                        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                                            <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-border-light dark:divide-border-dark">
                                                    {notifications.map((n) => (
                                                        <div key={n._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{n.title}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">{getRelativeTime(n.createdAt)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 border-t border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 text-center">
                                            <button onClick={() => { navigate('/admin/dashboard?section=notifications'); setShowNotifications(false); }} className="text-xs font-semibold text-primary hover:underline">
                                                View All Notifications
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
