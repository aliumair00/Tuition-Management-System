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

const TeacherLayout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

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
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gray-200" style={{ backgroundImage: 'url("https://i.pravatar.cc/150?u=teacher")' }}></div>
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-[#111318] dark:text-white text-sm font-medium leading-normal truncate">Ms. Eleanor Vance</h1>
                                <p className="text-[#616f89] dark:text-gray-400 text-xs font-normal leading-normal truncate">eleanor.v@school.edu</p>
                            </div>
                        </div>
                        <Link to="/teacher/settings" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <Settings className="w-5 h-5" />
                            <p className="text-sm font-medium leading-normal">Settings</p>
                        </Link>
                        <Link to="/login" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <LogOut className="w-5 h-5" />
                            <p className="text-sm font-medium leading-normal">Logout</p>
                        </Link>
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
                                <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">Good Morning, Eleanor!</h1>
                                <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">Monday, 16 October 2023</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                    <Search className="w-6 h-6 text-[#616f89] dark:text-gray-400" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 relative transition-colors">
                                    <Bell className="w-6 h-6 text-[#616f89] dark:text-gray-400" />
                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                </button>
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
