import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, DollarSign } from 'lucide-react';

const ParentDashboard = () => {
    return (
        <div className="flex flex-col gap-6">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold tracking-tight">Overview</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal">Welcome back, get an update on your children's progress.</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-5 border border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Total Fees Due</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">$450</p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-5 border border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">New Messages</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">3</p>
                    </div>
                    <div className="p-3 bg-primary/20 text-primary rounded-lg">
                        <AlertCircle size={24} />
                    </div>
                </div>
                {/* Placeholder stats */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-5 border border-border-light dark:border-border-dark flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Events</p>
                        <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mt-1">2 Upcoming</p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                        <CheckCircle2 size={24} />
                    </div>
                </div>
            </div>

            {/* Children Overview */}
            <div>
                <h3 className="text-text-primary-light dark:text-text-primary-dark text-xl font-bold mb-4">My Children</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Child 1 */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-gray-200 bg-center bg-cover" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Alex+Doe&background=4A90E2&color=fff")' }}></div>
                                <div>
                                    <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Alex Doe</h4>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Class 10 - A</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Very Good
                            </span>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Attendance</p>
                                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">92%</p>
                            </div>
                            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Grade</p>
                                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">A-</p>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <button className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors">
                                View Full Report
                            </button>
                        </div>
                    </div>

                    {/* Child 2 */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="p-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-gray-200 bg-center bg-cover" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Emma+Doe&background=7ED321&color=fff")' }}></div>
                                <div>
                                    <h4 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Emma Doe</h4>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Class 6 - B</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                Good
                            </span>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-4">
                            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Attendance</p>
                                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">88%</p>
                            </div>
                            <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg">
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Avg Grade</p>
                                <p className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark">B+</p>
                            </div>
                        </div>
                        <div className="px-6 pb-6">
                            <button className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors">
                                View Full Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fees Breakdown - Simple Table */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Recent Fee Invoices</h3>
                    <button className="text-primary text-sm font-medium hover:underline">View All</button>
                </div>
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
                            <tr className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">#INV-2024-001</td>
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">Alex Doe</td>
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">$250.00</td>
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">Aug 15, 2024</td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                        Unpaid
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button className="text-primary hover:underline text-sm font-medium">Pay Now</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">#INV-2024-002</td>
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">Emma Doe</td>
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">$200.00</td>
                                <td className="py-3 px-4 text-text-primary-light dark:text-text-primary-dark text-sm">Aug 15, 2024</td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                        Unpaid
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button className="text-primary hover:underline text-sm font-medium">Pay Now</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
