import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Loader2, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ParentFees = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [children, setChildren] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'history'

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch children and invoices in parallel
                // Backend automatically returns only children associated with logged-in parent
                const [childrenRes, invoicesRes] = await Promise.all([
                    api.get('/parent/children'),
                    api.get('/parent/invoices')
                ]);

                if (childrenRes.data.success) {
                    setChildren(childrenRes.data.data);
                }
                if (invoicesRes.data.success) {
                    setInvoices(invoicesRes.data.data);
                }
            } catch (err) {
                // Only log non-401 errors (401 is expected when not authenticated)
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch fees data:', err);
                }
                setError(err.response?.data?.error?.message || 'Failed to load fees data');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, searchParams]);

    // Filter invoices based on tab only (no child filtering - show all children)
    const filteredInvoices = invoices.filter(invoice => {
        const tabMatch = activeTab === 'all' || (activeTab === 'history' && invoice.paid);
        return tabMatch;
    });

    // Calculate statistics
    const stats = {
        totalOutstanding: invoices
            .filter(inv => !inv.paid)
            .reduce((sum, inv) => sum + inv.amount, 0),
        nextPayment: invoices
            .filter(inv => !inv.paid)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0] || null,
        totalPaid: invoices
            .filter(inv => inv.paid)
            .reduce((sum, inv) => sum + inv.amount, 0)
    };

    const handlePayInvoice = (invoiceId) => {
        // In production, this would open a payment gateway
        alert(`Payment gateway would open for invoice ${invoiceId}. Integration with payment provider needed.`);
    };

    const handlePayAll = () => {
        const unpaidInvoices = invoices.filter(inv => !inv.paid);
        if (unpaidInvoices.length === 0) {
            alert('No outstanding invoices to pay.');
            return;
        }
        alert(`Payment gateway would open for ${unpaidInvoices.length} invoices totaling $${stats.totalOutstanding.toFixed(2)}`);
    };

    const handleDownloadInvoice = async (invoiceId) => {
        try {
            // In production, this would download the PDF from the server
            alert(`Downloading invoice ${invoiceId}. PDF generation endpoint needed.`);
            // const response = await api.get(`/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', `invoice-${invoiceId}.pdf`);
            // document.body.appendChild(link);
            // link.click();
            // link.remove();
        } catch (err) {
            // Only log non-401 errors
            if (err.response?.status !== 401) {
                console.error('Failed to download invoice:', err);
            }
            alert('Failed to download invoice');
        }
    };

    const getStatusBadge = (invoice) => {
        if (invoice.paid) {
            return {
                label: 'Paid',
                className: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
            };
        }

        const dueDate = new Date(invoice.dueDate);
        const today = new Date();

        if (dueDate < today) {
            return {
                label: 'Overdue',
                className: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            };
        }

        return {
            label: 'Pending',
            className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-text-secondary-light dark:text-text-secondary-dark">Loading fees data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3 text-center">
                    <AlertCircle className="text-red-500" size={40} />
                    <p className="text-text-primary-light dark:text-text-primary-dark font-semibold">Error Loading Fees</p>
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
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Fees & Invoices</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                    {children.length === 1
                        ? `Manage ${children[0]?.name}'s fee status, outstanding payments, and invoice history.`
                        : children.length > 1
                            ? `Manage your ${children.length} children's fee status, outstanding payments, and invoice history.`
                            : 'Manage your children\'s fee status, outstanding payments, and invoice history.'}
                </p>
            </div>

            {/* Stats & Pay Now Button Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Total Outstanding</p>
                        <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
                            ${stats.totalOutstanding.toFixed(2)}
                        </p>
                        <p className="text-red-500 dark:text-red-400 text-sm font-medium leading-normal">
                            {stats.totalOutstanding > 0 ? 'Due Now' : 'All Paid'}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Next Payment Due</p>
                        {stats.nextPayment ? (
                            <>
                                <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
                                    ${stats.nextPayment.amount.toFixed(2)}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                                    Due on {new Date(stats.nextPayment.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">$0.00</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">No pending payments</p>
                            </>
                        )}
                    </div>
                </motion.div>
                {/* Pay Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center justify-center rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                    <button
                        onClick={handlePayAll}
                        disabled={stats.totalOutstanding === 0}
                        className={`flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-14 px-5 text-lg font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg ${stats.totalOutstanding > 0
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <CreditCard size={24} />
                        <span className="truncate">Pay Total Outstanding</span>
                    </button>
                </motion.div>
            </div>

            {/* Invoice History Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm"
            >
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex gap-6 px-6 -mb-px">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${activeTab === 'all'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            All Invoices
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'history'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                        >
                            Payment History
                        </button>
                    </nav>
                </div>
                {/* Invoice Table */}
                {filteredInvoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <FileText size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
                        <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-2">No Invoices Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            {activeTab === 'history'
                                ? 'No payment history available yet.'
                                : 'No invoices found for the selected filter.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Invoice ID</th>
                                    <th className="px-6 py-3 font-medium">Child Name</th>
                                    <th className="px-6 py-3 font-medium">Issue Date</th>
                                    <th className="px-6 py-3 font-medium">Due Date</th>
                                    <th className="px-6 py-3 font-medium text-right">Amount</th>
                                    <th className="px-6 py-3 font-medium text-center">Status</th>
                                    <th className="px-6 py-3 font-medium text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredInvoices.map(invoice => {
                                    const statusBadge = getStatusBadge(invoice);
                                    return (
                                        <tr key={invoice._id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">
                                                #{invoice._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {invoice.studentId?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(invoice.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(invoice.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-right">
                                                ${invoice.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDownloadInvoice(invoice._id)}
                                                        className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                                        title="Download Invoice"
                                                    >
                                                        <Download size={20} />
                                                    </button>
                                                    {!invoice.paid && (
                                                        <button
                                                            onClick={() => handlePayInvoice(invoice._id)}
                                                            className="px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        >
                                                            Pay Now
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ParentFees;
