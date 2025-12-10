import React from 'react';
import {
    Upload,
    Search,
    LayoutGrid,
    List,
    Folder,
    Plus,
    FileText,
    Edit,
    Eye,
    Trash2,
    File as FileIcon
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

const TeacherMaterials = () => {
    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.header variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">Course Materials</h1>
                    <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">Manage and organize your teaching resources.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center justify-center gap-2 p-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                        <Upload className="w-5 h-5" />
                        <span className="text-sm font-medium">Upload New</span>
                    </button>
                </div>
            </motion.header>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 mb-2">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:max-w-xs">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="text-gray-400 w-5 h-5" />
                        </div>
                        <input
                            className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary placeholder-gray-400"
                            placeholder="Search files..."
                            type="search"
                        />
                    </div>
                    <select className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option>All Classes</option>
                        <option>Grade 10 - Algebra II</option>
                        <option>Grade 11 - Physics</option>
                        <option>Grade 9 - Geometry</option>
                    </select>
                    <select className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                        <option>All Types</option>
                        <option>PDF</option>
                        <option>Notes</option>
                        <option>Worksheet</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-primary bg-primary/10 dark:bg-primary/20">
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
                        <List className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Folders */}
            <motion.div variants={itemVariants} className="mb-4">
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Folders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Algebra II Notes", files: "12 files" },
                        { name: "Physics Worksheets", files: "8 files" },
                        { name: "Geometry Exercises", files: "15 files" }
                    ].map((folder, idx) => (
                        <div key={idx} className="bg-white dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 hover:shadow-md dark:hover:bg-gray-800 transition-all cursor-pointer border border-gray-200 dark:border-gray-800">
                            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                <Folder className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{folder.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{folder.files}</p>
                            </div>
                        </div>
                    ))}

                    <div className="bg-transparent p-4 rounded-xl flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                            <Plus className="text-gray-400 w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm text-gray-400">Create New Folder</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Recent Files */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Recent Files</h2>
                <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Class</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Date Added</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-right"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { name: "Chapter_5_Polynomials.pdf", class: "Grade 10 - Algebra II", date: "Oct 15, 2023", type: "PDF", typeColor: "bg-red-500/20 text-red-600 dark:text-red-400", icon: FileText, iconColor: "text-red-500" },
                                    { name: "Newton_Laws_Notes.docx", class: "Grade 11 - Physics", date: "Oct 14, 2023", type: "Notes", typeColor: "bg-blue-500/20 text-blue-600 dark:text-blue-400", icon: FileIcon, iconColor: "text-blue-500" },
                                    { name: "Worksheet_Circles.pdf", class: "Grade 9 - Geometry", date: "Oct 12, 2023", type: "Worksheet", typeColor: "bg-green-500/20 text-green-600 dark:text-green-400", icon: FileText, iconColor: "text-green-500" },
                                    { name: "Vectors_Intro.pdf", class: "Grade 11 - Physics", date: "Oct 11, 2023", type: "PDF", typeColor: "bg-red-500/20 text-red-600 dark:text-red-400", icon: FileText, iconColor: "text-red-500" },
                                ].map((file, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                            <file.icon className={`w-5 h-5 ${file.iconColor}`} />
                                            <span>{file.name}</span>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{file.class}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">{file.date}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-md ${file.typeColor}`}>
                                                {file.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><Edit className="w-4 h-4" /></button>
                                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><Eye className="w-4 h-4" /></button>
                                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeacherMaterials;
