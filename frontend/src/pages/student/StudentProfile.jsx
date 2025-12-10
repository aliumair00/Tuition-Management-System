import React from 'react';
import {
    User,
    Contact,
    Lock,
    Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentProfile = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                {/* Sidebar */}
                <aside className="lg:col-span-3">
                    <div className="sticky top-24">
                        <div className="flex h-full flex-col justify-between bg-white dark:bg-gray-900/50 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24 bg-gray-200" style={{ backgroundImage: 'url("https://ui-avatars.com/api/?name=Samantha+Lee&background=random")' }}></div>
                                    <div className="flex flex-col text-center">
                                        <h1 className="text-gray-900 dark:text-white text-lg font-medium leading-normal">Samantha Lee</h1>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">Student ID: 123456789</p>
                                    </div>
                                </div>
                                <button className="w-full flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                                    <span className="truncate">Upload Photo</span>
                                </button>
                                <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
                                <div className="flex flex-col gap-1">
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary" href="#">
                                        <User size={20} className="fill-current" />
                                        <p className="text-sm font-medium leading-normal">Personal Information</p>
                                    </a>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" href="#">
                                        <Contact size={20} />
                                        <p className="text-sm font-medium leading-normal">Emergency Contacts</p>
                                    </a>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" href="#">
                                        <Lock size={20} />
                                        <p className="text-sm font-medium leading-normal">Account Security</p>
                                    </a>
                                    <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors" href="#">
                                        <Bell size={20} />
                                        <p className="text-sm font-medium leading-normal">Notifications</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-9">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap justify-between items-start gap-3">
                            <div className="flex min-w-72 flex-col gap-2">
                                <p className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Personal Information</p>
                                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Manage your personal details and contact information.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
                                    <span className="truncate">Cancel</span>
                                </button>
                                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                                    <span className="truncate">Save Changes</span>
                                </button>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <label className="flex flex-col">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">First Name</p>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal" defaultValue="Samantha" />
                                </label>
                                <label className="flex flex-col">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Last Name</p>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal" defaultValue="Lee" />
                                </label>
                                <label className="flex flex-col md:col-span-2">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Email Address</p>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal" defaultValue="samantha.lee@example.com" />
                                </label>
                                <label className="flex flex-col">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Phone Number</p>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal" defaultValue="+1 (555) 123-4567" />
                                </label>
                                <label className="flex flex-col">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Date of Birth</p>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal" type="date" defaultValue="2005-08-15" />
                                </label>
                                <label className="flex flex-col md:col-span-2">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm font-medium leading-normal pb-2">Address</p>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 h-12 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-3 text-base font-normal leading-normal" defaultValue="123 Innovation Drive, Techville, CA 90210" />
                                </label>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfile;
