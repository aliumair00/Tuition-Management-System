import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
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
    Filter
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);
    const [loadingNotifications, setLoadingNotifications] = React.useState(false);

    const toggleNotifications = async () => {
        const next = !showNotifications;
        setShowNotifications(next);
        if (next && user?.id && notifications.length === 0) {
            setLoadingNotifications(true);
            try {
                const { data } = await api.get(`/notifications/user/${user.id}`);
                if (data.success) setNotifications(data.data);
            } catch (e) {
            } finally {
                setLoadingNotifications(false);
            }
        }
    };

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
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 bg-cover bg-center" style={{ backgroundImage: `url("${user?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=random`}")` }} />
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name || 'Admin'}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.role || 'Administrator'}</p>
                        </div>
                    </div>
                    <button onClick={() => { logout(); navigate('/login'); }} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium text-sm">
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
                            />
                        </div>

                        <div className="relative">
                            <button onClick={toggleNotifications} className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                                <Bell className="w-6 h-6" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-card-light dark:border-card-dark" />
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
                                                <div key={n._id} className="p-4 border-b border-border-light dark:border-border-dark">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{n.message}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
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
