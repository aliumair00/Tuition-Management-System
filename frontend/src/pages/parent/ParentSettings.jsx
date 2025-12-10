import React from 'react';
import { Edit, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const ParentSettings = () => {
    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Manage your personal and contact information.</p>
            </div>

            <div className="flex flex-col gap-8">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
                >
                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex gap-4 items-center">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=clamp&w=200&h=200")' }}></div>
                            <div className="flex flex-col justify-center">
                                <p className="text-gray-900 dark:text-white text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">Eleanor Vance</p>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Relationship: Mother</p>
                            </div>
                        </div>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] w-full sm:w-auto hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <span className="truncate">Edit Profile</span>
                        </button>
                    </div>
                </motion.div>

                {/* Contact Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <header className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em]">Contact Information</h2>
                        <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Edit size={16} />
                            <span className="truncate">Edit</span>
                        </button>
                    </header>
                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                            <p className="text-base text-gray-900 dark:text-white">eleanor.v@example.com</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                            <p className="text-base text-gray-900 dark:text-white">(123) 456-7890</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Home Address</label>
                            <p className="text-base text-gray-900 dark:text-white">123 Learning Lane, Knowledge City, ED 54321</p>
                        </div>
                    </div>
                </motion.div>

                {/* Linked Children Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <header className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em]">Linked Children</h2>
                        <button className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-3 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                            <Plus size={16} />
                            <span className="truncate">Add Child</span>
                        </button>
                    </header>
                    <div className="p-4 sm:p-6 flex flex-col gap-4">
                        {/* Child 1 */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center gap-4">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-1.2.1&auto=format&fit=clamp&w=150&h=150")' }}></div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Oliver Vance</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5</p>
                                </div>
                            </div>
                            <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                <span className="truncate">View Full Profile</span>
                            </button>
                        </div>

                        {/* Child 2 */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center gap-4">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1595152452543-e5cca283f58c?ixlib=rb-1.2.1&auto=format&fit=clamp&w=150&h=150")' }}></div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Mia Vance</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Grade 2</p>
                                </div>
                            </div>
                            <button className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                                <span className="truncate">View Full Profile</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ParentSettings;
