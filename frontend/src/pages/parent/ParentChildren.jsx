import React from 'react';
import {
    Bell,
    Plus,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    CalendarCheck,
    CreditCard,
    AlertCircle,
    School
} from 'lucide-react';
import { motion } from 'framer-motion';

const ParentChildren = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex min-w-72 flex-col gap-2">
                    <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Children</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">An overview of your children's progress and activities.</p>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-primary text-primary hover:bg-primary/10 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors">
                    <Plus size={20} />
                    <span className="truncate">Add Child</span>
                </button>
            </div>

            <div className="flex flex-col gap-8">
                {/* Child Card 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-center bg-no-repeat aspect-square bg-cover rounded-full flex-shrink-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595152452543-e5cca283f58c?ixlib=rb-1.2.1&auto=format&fit=clamp&w=200&h=200")' }}></div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">Jessica Miller</p>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Grade 5 - Section B</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-1">Next parent-teacher meeting: Oct 28</p>
                            </div>
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3">
                                <CheckCircle size={16} />
                                <p className="text-sm font-medium leading-normal">Fees Paid</p>
                            </div>
                            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3">
                                <AlertTriangle size={16} />
                                <p className="text-sm font-medium leading-normal">Attendance Low</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 gap-2 transition-colors">
                            <BarChart3 size={20} />
                            <span className="truncate">View Performance</span>
                        </button>
                        <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors">
                            <CalendarCheck size={20} />
                            <span className="truncate">Check Attendance</span>
                        </button>
                        <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors">
                            <CreditCard size={20} />
                            <span className="truncate">Manage Fees</span>
                        </button>
                    </div>
                </motion.div>

                {/* Child Card 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-center bg-no-repeat aspect-square bg-cover rounded-full flex-shrink-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&auto=format&fit=clamp&w=200&h=200")' }}></div>
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-900 dark:text-white text-2xl font-bold leading-tight">Tom Adams</p>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Grade 2 - Section A</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-1">Next parent-teacher meeting: Nov 05</p>
                            </div>
                        </div>
                        <div className="flex gap-2 self-start sm:self-center">
                            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3">
                                <AlertCircle size={16} />
                                <p className="text-sm font-medium leading-normal">Fees Overdue</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 gap-2 transition-colors">
                            <BarChart3 size={20} />
                            <span className="truncate">View Performance</span>
                        </button>
                        <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors">
                            <CalendarCheck size={20} />
                            <span className="truncate">Check Attendance</span>
                        </button>
                        <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/10 dark:bg-primary/20 text-gray-900 dark:text-white hover:bg-primary/20 dark:hover:bg-primary/30 text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors">
                            <CreditCard size={20} />
                            <span className="truncate">Manage Fees</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ParentChildren;
