import React from 'react';
import {
    Search,
    FileText,
    File,
    Presentation,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 100
        }
    }
};

const StudentMaterials = () => {
    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-wrap justify-between items-start gap-4 mb-2">
                <div className="flex flex-col gap-2">
                    <p className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Study Materials</p>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Find all the notes and resources from your teachers here.</p>
                </div>
            </div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-[#1C2433] rounded-xl p-4 md:p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="text-gray-400" size={20} />
                            </div>
                            <input className="form-input block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-primary focus:border-primary pl-10 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500" placeholder="Search for notes, topics..." type="text" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                        <select className="form-select block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            <option>All Subjects</option>
                            <option>Biology</option>
                            <option>History</option>
                            <option>Mathematics</option>
                            <option>Literature</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teacher</label>
                        <select className="form-select block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100">
                            <option>All Teachers</option>
                            <option>Mr. Smith</option>
                            <option>Ms. Jones</option>
                            <option>Mr. Davis</option>
                            <option>Mrs. Lee</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Sort & Count */}
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Showing 4 results</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</p>
                    <select className="form-select block w-auto rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:ring-primary focus:border-primary text-gray-900 dark:text-gray-100 py-1">
                        <option>Newest First</option>
                        <option>Oldest First</option>
                        <option>A-Z</option>
                        <option>Z-A</option>
                    </select>
                </div>
            </motion.div>

            {/* Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                    { title: "Chapter 5: Cell Biology Notes", subject: "Biology", teacher: "Mr. Smith", date: "15 Oct 2023", size: "2.5 MB", icon: FileText, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/50" },
                    { title: "History of Ancient Civilizations", subject: "History", teacher: "Ms. Jones", date: "14 Oct 2023", size: "5.1 MB", icon: File, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/50" },
                    { title: "Algebra II Problem Set", subject: "Mathematics", teacher: "Mr. Davis", date: "12 Oct 2023", size: "1.2 MB", icon: Presentation, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/50" },
                    { title: "The Great Gatsby Analysis", subject: "Literature", teacher: "Mrs. Lee", date: "11 Oct 2023", size: "850 KB", icon: FileText, color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/50" },
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col bg-white dark:bg-[#1C2433] rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <div className="p-5 flex-grow">
                            <div className="flex items-start gap-4">
                                <div className={`${item.bg} p-3 rounded-lg`}>
                                    <item.icon className={item.color} size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-bold text-gray-800 dark:text-white leading-tight mb-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.subject} • {item.teacher}</p>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between text-xs text-gray-400 dark:text-gray-500">
                                <span>{item.date}</span>
                                <span>{item.size}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                                <Download size={20} />
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Pagination */}
            <motion.div variants={itemVariants} className="mt-8 flex justify-center">
                <nav aria-label="Pagination" className="flex items-center space-x-2">
                    <a className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" href="#">
                        <ChevronLeft size={20} />
                    </a>
                    <a aria-current="page" className="relative z-10 inline-flex items-center px-4 py-2 border border-primary bg-primary/20 text-sm font-medium text-primary rounded-md" href="#">1</a>
                    <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors" href="#">2</a>
                    <a className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors" href="#">3</a>
                    <a className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" href="#">
                        <ChevronRight size={20} />
                    </a>
                </nav>
            </motion.div>
        </motion.div>
    );
};

export default StudentMaterials;
