import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { GraduationCap, Users, Wallet, Hourglass, Plus, Receipt } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const StatCard = ({ title, value, trend, trendUp, icon: Icon, colorClass, bgClass }) => (
    <div className={`p-5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark ${bgClass}`}> 
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
                {trend && (
                    <p className={`text-xs mt-1 ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>{trend}</p>
                )}
            </div>
            {Icon && <div className={`p-3 rounded-lg ${colorClass}`}><Icon className="w-6 h-6" /></div>}
        </div>
    </div>
);

const QuickActionBtn = ({ icon: Icon, label, primary = true, onClick }) => (
    <button onClick={onClick} className={`${primary ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-colors`}>
        {Icon && <Icon className="w-4 h-4" />}
        {label}
    </button>
);

const NoticeItem = ({ title, time }) => (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
    </div>
);

const EventItem = ({ month, day, title, time }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark">
        <div className="text-center">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{month}</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{day}</div>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalClassses: 0,
        totalRevenue: 0,
        pendingRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/analytics/admin');
                if (data.success) {
                    setStats(data.data);
                }
                const evResp = await api.get('/events');
                if (evResp.data?.success) setEvents(evResp.data.data || []);
                if (user?.id) {
                    const noResp = await api.get(`/notifications/user/${user.id}`);
                    if (noResp.data?.success) setNotices(noResp.data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user?.id]);

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
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
                    colorClass="text-indigo-500"
                    bgClass="bg-indigo-50 dark:bg-indigo-900/20"
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
                    <QuickActionBtn icon={Plus} label="Add Student" onClick={() => navigate('/admin/students/add')} />
                    <QuickActionBtn icon={Plus} label="Add Teacher" onClick={() => navigate('/admin/teachers/add')} />
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
                        <a href="#" className="text-sm font-semibold text-primary hover:underline">View All</a>
                    </div>
                    <div className="space-y-4">
                        {notices.length === 0 ? (
                            <div className="text-sm text-gray-500 dark:text-gray-400">No notices</div>
                        ) : (
                            notices.slice(0, 5).map(n => (
                                <NoticeItem key={n._id} title={n.title} time={new Date(n.createdAt).toLocaleString()} />
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                    variants={itemVariants}
                    className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Events</h3>
                        <a href="#" className="text-sm font-semibold text-primary hover:underline">View All</a>
                    </div>
                    <div className="space-y-4">
                        {events.length === 0 ? (
                            <div className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</div>
                        ) : (
                            events.slice(0, 5).map(e => (
                                <EventItem key={e._id} month={new Date(e.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()} day={`${new Date(e.startDate).getDate()}`.padStart(2, '0')} title={e.title} time={new Date(e.startDate).toLocaleString()} />
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;
