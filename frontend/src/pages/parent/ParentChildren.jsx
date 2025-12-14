import React, { useState, useEffect } from 'react';
import {
    Plus,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    CalendarCheck,
    CreditCard,
    AlertCircle,
    Loader2,
    UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ParentChildren = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [children, setChildren] = useState([]);
    const [childrenWithStatus, setChildrenWithStatus] = useState([]);
    const [showAddChildModal, setShowAddChildModal] = useState(false);

    useEffect(() => {
        const fetchChildren = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get('/parent/children');
                if (data.success) {
                    setChildren(data.data);
                    // Fetch additional status information for each child
                    await fetchChildrenStatus(data.data);
                }
            } catch (err) {
                // Only log non-401 errors (401 is expected when not authenticated)
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch children:', err);
                }
                setError(err.response?.data?.error?.message || 'Failed to load children data');
            } finally {
                setLoading(false);
            }
        };

        const fetchChildrenStatus = async (childrenList) => {
            try {
                const statusPromises = childrenList.map(async (child) => {
                    try {
                        // Fetch invoices for this child
                        const invoicesRes = await api.get(`/invoices/student/${child._id}`);
                        const invoices = invoicesRes.data.data || [];

                        // Calculate fee status
                        const unpaidInvoices = invoices.filter(inv => !inv.paid);
                        const overdueInvoices = unpaidInvoices.filter(inv =>
                            new Date(inv.dueDate) < new Date()
                        );

                        let feeStatus = 'paid';
                        if (overdueInvoices.length > 0) {
                            feeStatus = 'overdue';
                        } else if (unpaidInvoices.length > 0) {
                            feeStatus = 'pending';
                        }

                        // For attendance, we'll use a placeholder for now
                        // In a real app, you'd fetch attendance data from an endpoint
                        const attendanceStatus = 'normal'; // Can be 'normal', 'low', 'critical'

                        return {
                            ...child,
                            feeStatus,
                            attendanceStatus,
                            unpaidAmount: unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0),
                            nextMeeting: null // Placeholder for next parent-teacher meeting
                        };
                    } catch (err) {
                        // Only log non-401 errors
                        if (err.response?.status !== 401) {
                            console.error(`Failed to fetch status for child ${child._id}:`, err);
                        }
                        return {
                            ...child,
                            feeStatus: 'unknown',
                            attendanceStatus: 'unknown',
                            unpaidAmount: 0,
                            nextMeeting: null
                        };
                    }
                });

                const childrenWithStatusData = await Promise.all(statusPromises);
                setChildrenWithStatus(childrenWithStatusData);
            } catch (err) {
                // Only log non-401 errors
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch children status:', err);
                }
            }
        };

        if (user) {
            fetchChildren();
        }
    }, [user]);

    const handleViewPerformance = (childId) => {
        navigate(`/parent/children/${childId}`);
    };

    const handleCheckAttendance = (childId) => {
        // Navigate to attendance page or open attendance modal
        navigate(`/parent/children/${childId}?tab=attendance`);
    };

    const handleManageFees = (childId) => {
        // Navigate to fees page filtered by this child
        navigate(`/parent/fees?child=${childId}`);
    };

    const handleAddChild = () => {
        // In a real app, this would open a modal or navigate to add child form
        // For now, we'll just show an alert
        alert('Add Child functionality would be implemented here. This typically requires admin approval to link a student to a parent account.');
    };

    const getFeeStatusBadge = (feeStatus) => {
        switch (feeStatus) {
            case 'paid':
                return {
                    icon: CheckCircle,
                    label: 'Fees Paid',
                    className: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                };
            case 'overdue':
                return {
                    icon: AlertCircle,
                    label: 'Fees Overdue',
                    className: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                };
            case 'pending':
                return {
                    icon: AlertTriangle,
                    label: 'Fees Pending',
                    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                };
            default:
                return null;
        }
    };

    const getAttendanceBadge = (attendanceStatus) => {
        switch (attendanceStatus) {
            case 'low':
                return {
                    icon: AlertTriangle,
                    label: 'Attendance Low',
                    className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                };
            case 'critical':
                return {
                    icon: AlertCircle,
                    label: 'Attendance Critical',
                    className: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                };
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading children...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="text-red-500" size={40} />
                    <p className="text-text-primary-light dark:text-text-primary-dark font-semibold">Error Loading Children</p>
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
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Children</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                    {childrenWithStatus.length === 1
                        ? `An overview of ${childrenWithStatus[0]?.name}'s progress and activities.`
                        : childrenWithStatus.length > 1
                            ? `An overview of your ${childrenWithStatus.length} children's progress and activities.`
                            : 'An overview of your children\'s progress and activities.'}
                </p>
            </div>

            {childrenWithStatus.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                    <UserPlus size={48} className="text-gray-400 dark:text-gray-600" />
                    <div className="text-center">
                        <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">No Children Registered</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            No students are currently linked to your parent account. Please contact the school administration to link your child(ren) to your account.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    {childrenWithStatus.map((child, index) => {
                        const feeBadge = getFeeStatusBadge(child.feeStatus);
                        const attendanceBadge = getAttendanceBadge(child.attendanceStatus);

                        return (
                            <motion.div
                                key={child._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-20 h-20 bg-center bg-no-repeat aspect-square bg-cover rounded-full flex-shrink-0"
                                            style={{
                                                backgroundImage: child.profileImageUrl
                                                    ? `url(${child.profileImageUrl})`
                                                    : `url("https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=4A90E2&color=fff&size=200")`
                                            }}
                                        ></div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">{child.name}</p>
                                            <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                                                {child.classId?.name || 'No Class Assigned'}
                                            </p>
                                            {child.nextMeeting && (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-1">
                                                    Next parent-teacher meeting: {new Date(child.nextMeeting).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 self-start sm:self-center flex-wrap">
                                        {feeBadge && (
                                            <div className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 ${feeBadge.className}`}>
                                                <feeBadge.icon size={16} />
                                                <p className="text-sm font-medium leading-normal">{feeBadge.label}</p>
                                            </div>
                                        )}
                                        {attendanceBadge && (
                                            <div className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 ${attendanceBadge.className}`}>
                                                <attendanceBadge.icon size={16} />
                                                <p className="text-sm font-medium leading-normal">{attendanceBadge.label}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleViewPerformance(child._id)}
                                        className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 gap-2 transition-colors"
                                    >
                                        <BarChart3 size={20} />
                                        <span className="truncate">View Performance</span>
                                    </button>
                                    <button
                                        onClick={() => handleCheckAttendance(child._id)}
                                        className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors"
                                    >
                                        <CalendarCheck size={20} />
                                        <span className="truncate">Check Attendance</span>
                                    </button>
                                    <button
                                        onClick={() => handleManageFees(child._id)}
                                        className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors"
                                    >
                                        <CreditCard size={20} />
                                        <span className="truncate">Manage Fees</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParentChildren;
