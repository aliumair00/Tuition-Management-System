import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [children, setChildren] = useState([]);
    const [stats, setStats] = useState({
        totalFeesDue: 0,
        newMessages: 0,
        upcomingEvents: 0
    });
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch all data in parallel
                const [childrenRes, statsRes, invoicesRes] = await Promise.all([
                    api.get('/parent/children'),
                    api.get('/parent/dashboard-stats'),
                    api.get('/parent/invoices')
                ]);

                if (childrenRes.data.success) {
                    setChildren(childrenRes.data.data);
                }
                if (statsRes.data.success) {
                    setStats(statsRes.data.data);
                }
                if (invoicesRes.data.success) {
                    setInvoices(invoicesRes.data.data);
                }
            } catch (err) {
                // Only log non-401 errors (401 is expected when not authenticated)
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch dashboard data:', err);
                }
                setError(err.response?.data?.error?.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const getPerformanceBadge = (attendance) => {
        if (attendance >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
        if (attendance >= 80) return { label: 'Very Good', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
        if (attendance >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
        return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    };

    const handlePayNow = (invoiceId) => {
        // Navigate to payment page or open payment modal
        navigate(`/parent/fees?invoice=${invoiceId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="text-red-500" size={40} />
                    <p className="text-text-primary-light dark:text-text-primary-dark font-semibold">Error Loading Dashboard</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold tracking-tight">Overview</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal">
                        Welcome back, {user?.name}! Get an update on your children's progress.
                    </p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-5 border border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Total Fees Due</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">
                            ${stats.totalFeesDue.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-5 border border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">New Messages</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">{stats.newMessages}</p>
                    </div>
                    <div className="p-3 bg-primary/20 text-primary rounded-lg">
                        <AlertCircle size={24} />
                    </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-5 border border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Upcoming Events</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">{stats.upcomingEvents}</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            {/* Children Overview */}
            <div>
                <h3 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold mb-4">My Children</h3>
                {children.length === 0 ? (
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-8 text-center">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">No children registered yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {children.map((child) => {
                            const performance = getPerformanceBadge(85); // Default for now, can be fetched from API
                            return (
                                <div key={child._id} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                                    <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="size-12 rounded-full bg-gray-200 bg-center bg-cover"
                                                style={{
                                                    backgroundImage: child.profileImageUrl
                                                        ? `url(${child.profileImageUrl})`
                                                        : `url("https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=4A90E2&color=fff")`
                                                }}
                                            ></div>
                                            <div>
                                                <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">{child.name}</h4>
                                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                                                    {child.classId?.name || 'No Class Assigned'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${performance.color}`}>
                                            {performance.label}
                                        </span>
                                    </div>
                                    <div className="p-6 grid grid-cols-2 gap-4">
                                        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Attendance</p>
                                            <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">--</p>
                                        </div>
                                        <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Grade</p>
                                            <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">--</p>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6">
                                        <button
                                            onClick={() => navigate(`/parent/children/${child._id}`)}
                                            className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
                                        >
                                            View Full Report
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Fees Breakdown - Simple Table */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Recent Fee Invoices</h3>
                    <button
                        onClick={() => navigate('/parent/fees')}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        View All
                    </button>
                </div>
                {invoices.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">No invoices found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark">
                                    <th className="py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Invoice ID</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Student</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Amount</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Due Date</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Status</th>
                                    <th className="py-3 px-4 text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.slice(0, 5).map((invoice) => (
                                    <tr key={invoice._id} className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                        <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">
                                            #{invoice._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">
                                            {invoice.studentId?.name || 'Unknown'}
                                        </td>
                                        <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">
                                            ${invoice.amount.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">
                                            {new Date(invoice.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.paid
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {invoice.paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {!invoice.paid && (
                                                <button
                                                    onClick={() => handlePayNow(invoice._id)}
                                                    className="text-primary hover:underline text-sm font-medium"
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;
