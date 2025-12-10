import React from 'react';
import { CreditCard, Download } from 'lucide-react';
import { motion } from 'framer-motion';

const ParentFees = () => {
    return (
        <div className="flex flex-col gap-8">
            {/* Page Header and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Fees & Invoices</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Manage your children's fee status, outstanding payments, and invoice history.</p>
                </div>
                {/* Child Selection Chips */}
                <div className="flex gap-2 flex-wrap">
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/10 dark:bg-primary/20 pl-4 pr-3 text-primary dark:text-primary-foreground font-medium transition-colors">
                        <p className="text-sm font-medium leading-normal">All Children</p>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 pl-4 pr-3 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <p className="text-sm font-medium leading-normal">John Doe</p>
                    </button>
                    <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 pl-4 pr-3 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <p className="text-sm font-medium leading-normal">Jane Doe</p>
                    </button>
                </div>
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
                        <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">$1,250.00</p>
                        <p className="text-red-500 dark:text-red-400 text-sm font-medium leading-normal">Due Now</p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-normal">Next Payment Due</p>
                        <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">$450.00</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">Due on 15 Oct 2024</p>
                    </div>
                </motion.div>
                {/* Pay Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center justify-center rounded-xl p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                    <button className="flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
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
                        <a className="py-4 px-1 border-b-2 border-primary text-primary font-semibold text-sm" href="#">All Invoices</a>
                        <a className="py-4 px-1 border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 font-medium text-sm transition-colors" href="#">Payment History</a>
                    </nav>
                </div>
                {/* Invoice Table */}
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
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">#INV-0084</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">John Doe</td>
                                <td className="px-6 py-4">01 Sep 2024</td>
                                <td className="px-6 py-4">15 Sep 2024</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-right">$800.00</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Overdue</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                        <Download size={20} />
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">#INV-0083</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">Jane Doe</td>
                                <td className="px-6 py-4">01 Sep 2024</td>
                                <td className="px-6 py-4">15 Sep 2024</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-right">$450.00</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">Pending</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                        <Download size={20} />
                                    </button>
                                </td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">#INV-0082</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">John Doe</td>
                                <td className="px-6 py-4">01 Aug 2024</td>
                                <td className="px-6 py-4">15 Aug 2024</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white text-right">$800.00</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">Paid</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                        <Download size={20} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default ParentFees;
