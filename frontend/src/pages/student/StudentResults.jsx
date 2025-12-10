import React from 'react';
import {
    Download,
    TrendingUp,
    ChevronDown
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

const StudentResults = () => {
    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Page Heading */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-between gap-4 items-center mb-4">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Results</p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Welcome, Alex Doe!</p>
                </div>
            </motion.div>

            {/* Chips / Filters */}
            <motion.div variants={itemVariants} className="flex gap-3 flex-wrap">
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-4 pr-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Academic Year: 2023-24</p>
                    <ChevronDown className="text-slate-500 dark:text-slate-400" size={20} />
                </button>
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-4 pr-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Term: Fall Semester</p>
                    <ChevronDown className="text-slate-500 dark:text-slate-400" size={20} />
                </button>
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/20 dark:bg-primary/30 border border-primary/50 dark:border-primary/50 pl-4 pr-2">
                    <p className="text-primary dark:text-sky-300 text-sm font-medium leading-normal">Exam Type: Final Exam</p>
                    <ChevronDown className="text-primary dark:text-sky-300" size={20} />
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[
                    { label: "Overall Grade", value: "A+" },
                    { label: "GPA", value: "3.8/4.0" },
                    { label: "Percentage", value: "92%" },
                    { label: "Rank", value: "3", sub: "/45" }
                ].map((stat, idx) => (
                    <div key={idx} className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal">{stat.label}</p>
                        <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
                            {stat.value}
                            {stat.sub && <span className="text-slate-400 dark:text-slate-500 text-xl font-medium">{stat.sub}</span>}
                        </p>
                    </div>
                ))}
            </motion.div>

            {/* Detailed Results */}
            <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center pb-3 pt-8">
                    <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Detailed Results</h2>
                    <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-4 text-white hover:bg-primary/90">
                        <Download size={20} />
                        <p className="text-white text-sm font-medium leading-normal">Download Report</p>
                    </button>
                </div>
                <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-4 font-semibold" scope="col">Subject Name</th>
                                <th className="px-6 py-4 font-semibold text-center" scope="col">Marks Obtained</th>
                                <th className="px-6 py-4 font-semibold text-center" scope="col">Total Marks</th>
                                <th className="px-6 py-4 font-semibold text-center" scope="col">Percentage</th>
                                <th className="px-6 py-4 font-semibold text-center" scope="col">Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { subject: "Advanced Mathematics", marks: 98, total: 100, percent: "98%", grade: "A+", color: "text-green-600 dark:text-green-400" },
                                { subject: "Quantum Physics", marks: 91, total: 100, percent: "91%", grade: "A", color: "text-green-600 dark:text-green-400" },
                                { subject: "Organic Chemistry", marks: 85, total: 100, percent: "85%", grade: "B+", color: "text-blue-600 dark:text-blue-400" },
                                { subject: "Literature & Composition", marks: 94, total: 100, percent: "94%", grade: "A", color: "text-green-600 dark:text-green-400" },
                                { subject: "Data Structures", marks: 92, total: 100, percent: "92%", grade: "A", color: "text-green-600 dark:text-green-400" },
                            ].map((row, idx) => (
                                <tr key={idx} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <th className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap" scope="row">{row.subject}</th>
                                    <td className="px-6 py-4 text-center">{row.marks}</td>
                                    <td className="px-6 py-4 text-center">{row.total}</td>
                                    <td className="px-6 py-4 text-center">{row.percent}</td>
                                    <td className={`px-6 py-4 text-center font-bold ${row.color}`}>{row.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Performance Trend */}
            <motion.div variants={itemVariants}>
                <div className="pb-3 pt-8">
                    <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Performance Trend</h2>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center min-h-[300px]">
                    <div className="flex flex-col items-center text-center text-slate-500 dark:text-slate-400">
                        <TrendingUp className="text-slate-400 dark:text-slate-500" size={48} />
                        <p className="mt-2 font-semibold">Performance Chart Area</p>
                        <p className="text-sm">A line or bar chart visualizing performance will be displayed here.</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentResults;
