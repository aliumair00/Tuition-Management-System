import React, { useState, useEffect } from 'react';
import { Receipt, CreditCard, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const StudentFees = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/invoices/my');
            if (data.success) setInvoices(data.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    // Derived States
    const pendingInvoices = invoices.filter(inv => !inv.paid);
    const hasDue = pendingInvoices.length > 0;
    // Earliest due date
    const earliestDue = hasDue
        ? pendingInvoices.reduce((prev, curr) => prev.dueDate < curr.dueDate ? prev : curr).dueDate
        : null;
    const totalDue = pendingInvoices.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <div className="flex flex-wrap justify-between gap-3 items-center">
                <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Fee Status & History</h1>
            </div>

            {/* Cards Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fee Status Card */}
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-stretch justify-start">
                        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4 py-4 px-4">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Current Fee Status</p>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${!hasDue ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                                    {!hasDue ? 'All Clear!' : 'Payments Due'}
                                </span>
                            </div>
                            <div className="flex items-end gap-3 justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Amount Due: <span className="font-bold text-gray-800 dark:text-gray-200">${totalDue.toFixed(2)}</span></p>
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Next Due Date: <span className="font-bold text-gray-800 dark:text-gray-200">{earliestDue ? new Date(earliestDue).toLocaleDateString() : 'N/A'}</span></p>
                                </div>
                                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary/20 text-primary text-sm font-medium leading-normal hover:bg-primary/30 gap-2 transition-colors">
                                    <Receipt size={20} />
                                    <span className="truncate">View Receipt</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Pay / Upcoming */}
                <div className="p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col items-stretch justify-start">
                        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4 py-4 px-4">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight">Action Required</p>
                                {hasDue && <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/50 px-3 py-1 text-sm font-medium text-orange-700 dark:text-orange-300">Pending</span>}
                            </div>
                            <div className="flex items-end gap-3 justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Payable Now: <span className="font-bold text-gray-800 dark:text-gray-200">${totalDue.toFixed(2)}</span></p>
                                </div>
                                <button disabled={!hasDue} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <CreditCard size={20} />
                                    <span className="truncate">Pay Now</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* List */}
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-0 pt-4">Invoice History</h2>
            <motion.div variants={itemVariants} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                {['Invoice ID', 'Class', 'Due Date', 'Amount', 'Status', 'Actions'].map((header) => (
                                    <th key={header} className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 text-sm font-medium">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? <tr><td colSpan="6" className="p-4 text-center">Loading invoices...</td></tr> :
                                invoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                                        <td className="h-[72px] px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">#{inv._id.substring(18)}</td>
                                        <td className="h-[72px] px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">{inv.classId?.name || 'Class'}</td>
                                        <td className="h-[72px] px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                        <td className="h-[72px] px-4 py-2 text-gray-700 dark:text-gray-300 text-sm">${inv.amount}</td>
                                        <td className="h-[72px] px-4 py-2 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium 
                                            ${inv.paid ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                                                {inv.paid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="h-[72px] px-4 py-2 text-sm">
                                            <button className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
                                                <Download size={16} /> Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            {!loading && invoices.length === 0 && <tr><td colSpan="6" className="p-4 text-center">No invoices found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentFees;
