import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { GraduationCap, Users, Wallet, Hourglass, Plus, Receipt } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass, bgClass }) => (
    <motion.div variants={itemVariants} className={`rounded-xl p-6 shadow-sm border border-transparent bg-white dark:bg-[#1f2937] flex items-center gap-4 hover:shadow-md transition-shadow`}>
        <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}><Icon size={24} /></div>
        <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</span>
            <span className={`text-xs flex items-center gap-1 mt-1 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                {trendUp ? '↑' : '↓'} {trend}
            </span>
        </div>
    </motion.div>
);

const QuickActionBtn = ({ icon: Icon, label, primary = true, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg ${primary ? 'bg-primary text-white' : 'border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark'}`}>
        <Icon size={18} />
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

// Helper for relative time (e.g. "2 hours ago")
const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} months ago`;
    return `${Math.floor(months / 12)} years ago`;
};

const NoticeItem = ({ title, time }) => (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-card-hover transition-colors">
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary-light dark:text-gray-200">{title}</span>
            <span className="text-xs text-text-secondary-light dark:text-gray-400 mt-1">{time}</span>
        </div>
    </div>
);

const EventItem = ({ month, day, title, time }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center">
            <span className="text-xs font-bold uppercase">{month}</span>
            <span className="text-xl font-extrabold">{day}</span>
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark">{title}</span>
            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{time}</span>
        </div>
    </div>
);

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClassses: 0,
        totalRevenue: 0,
        pendingRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [notices, setNotices] = useState([]);
    const [events, setEvents] = useState([]);
    const [showNotices, setShowNotices] = useState(false);
    const [showEvents, setShowEvents] = useState(false);

    // Fetch Stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/admin');
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Fetch Events & Notices
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Events
                const eventsRes = await api.get('/events');
                if (eventsRes.data?.success) {
                    setEvents(eventsRes.data.data);
                }

                // Fetch Notices (if user ID available)
                if (user?._id || user?.id) {
                    const userId = user._id || user.id;
                    const notifsRes = await api.get(`/notifications/user/${userId}`);
                    if (notifsRes.data?.success) {
                        setNotices(notifsRes.data.data);
                    }
                }
            } catch (error) {
                console.error("Dashboard data fetch error", error);
            }
        };
        if (user) fetchData();
    }, [user]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get('section');
        setShowNotices(section === 'notices');
        setShowEvents(section === 'events');
    }, [location.search]);

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <>
            <motion.div
                className="space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, get an overview of your institute.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        trend="2.5% this month"
                        trendUp={true}
                        icon={GraduationCap}
                        colorClass="text-blue-500"
                        bgClass="bg-blue-50 dark:bg-blue-900/20"
                    />
                    <StatCard
                        title="Total Teachers"
                        value={stats.totalTeachers}
                        trend="0.5% this month"
                        trendUp={false}
                        icon={Users}
                        colorClass="text-purple-500"
                        bgClass="bg-purple-50 dark:bg-purple-900/20"
                    />
                    <StatCard
                        title="Fees Collected"
                        value={`$${stats.totalRevenue}`}
                        trend="12% this month"
                        trendUp={true}
                        icon={Wallet}
                        colorClass="text-emerald-500"
                        bgClass="bg-emerald-50 dark:bg-emerald-900/20"
                    />
                    <StatCard
                        title="Fees Pending"
                        value={`$${stats.pendingRevenue || 0}`}
                        trend="3% this month"
                        trendUp={false}
                        icon={Hourglass}
                        colorClass="text-amber-500"
                        bgClass="bg-amber-50 dark:bg-amber-900/20"
                    />
                </div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <QuickActionBtn icon={Plus} label="Add Student" onClick={() => navigate('/admin/students')} />
                        <QuickActionBtn icon={Plus} label="Add Teacher" onClick={() => navigate('/admin/teachers')} />
                        <QuickActionBtn icon={Plus} label="Add Class" onClick={() => navigate('/admin/classes')} />
                        <QuickActionBtn icon={Receipt} label="Generate Invoice" primary={false} onClick={() => navigate('/admin/billing')} />
                    </div>
                </motion.div>

                {/* Bottom Section: Notices & Events */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Notices */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Notices</h3>
                            <button onClick={() => setShowNotices(true)} className="text-sm font-semibold text-primary hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {notices.slice(0, 5).map(n => (
                                <NoticeItem key={n._id} title={n.title} time={getRelativeTime(n.createdAt)} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Upcoming Events */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
                            <button onClick={() => setShowEvents(true)} className="text-sm font-semibold text-primary hover:underline">View All</button>
                        </div>
                        <div className="space-y-4">
                            {events.slice(0, 5).map(ev => {
                                const d = new Date(ev.startDate);
                                return (
                                    <EventItem
                                        key={ev._id}
                                        month={d.toLocaleString('default', { month: 'short' }).toUpperCase()}
                                        day={String(d.getDate()).padStart(2, '0')}
                                        title={ev.title}
                                        time={d.toLocaleString()}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
            {showNotices && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowNotices(false)}>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-lg border border-border-light dark:border-border-dark w-[90%] max-w-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">All Notices</h3>
                            <button className="text-sm text-text-secondary-light dark:text-text-secondary-dark" onClick={() => setShowNotices(false)}>Close</button>
                        </div>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {notices.map(n => (
                                <NoticeItem key={n._id} title={n.title} time={getRelativeTime(n.createdAt)} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showEvents && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowEvents(false)}>
                    <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-lg border border-border-light dark:border-border-dark w-[90%] max-w-xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">All Events</h3>
                            <button className="text-sm text-text-secondary-light dark:text-text-secondary-dark" onClick={() => setShowEvents(false)}>Close</button>
                        </div>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                            {events.map(ev => {
                                const d = new Date(ev.startDate);
                                return (
                                    <EventItem key={ev._id} month={d.toLocaleString('default', { month: 'short' }).toUpperCase()} day={String(d.getDate()).padStart(2, '0')} title={ev.title} time={d.toLocaleString()} />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;
