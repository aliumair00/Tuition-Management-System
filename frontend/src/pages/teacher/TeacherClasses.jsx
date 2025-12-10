import React from 'react';
import {
    Search,
    Bell,
    Sigma,
    FlaskConical,
    Ruler,
    BookOpen,
    History, // Using History instead of history_edu
    ClipboardCheck // For task_alt/Attendance
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

const ClassCard = ({ title, students, icon: Icon, colorClass, subjects }) => (
    <motion.div variants={itemVariants} className="bg-white dark:bg-card-dark rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-[#111318] dark:text-white">{title}</h3>
                    <p className="text-sm text-[#616f89] dark:text-gray-400">{students} Students</p>
                </div>
                <div className={`p-2 rounded-lg ${colorClass.bg} ${colorClass.text}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-[#111318] dark:text-gray-300">Subjects:</p>
                <div className="flex flex-wrap gap-2">
                    {subjects.map((subject, index) => (
                        <span key={index} className={`text-xs font-medium px-2 py-1 rounded-full ${colorClass.tagBg} ${colorClass.tagText}`}>
                            {subject}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <div className="bg-gray-50 dark:bg-background-dark p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
            <a className="text-sm font-medium text-primary hover:underline" href="#">View Details</a>
            <div className="flex items-center gap-2">
                <a className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary dark:hover:text-primary-light flex items-center gap-1" href="#">
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Attendance</span>
                </a>
            </div>
        </div>
    </motion.div>
);

const TeacherClasses = () => {
    const classes = [
        {
            title: "Grade 10 - Algebra II",
            students: 32,
            icon: Sigma,
            colorClass: { bg: "bg-primary/10 dark:bg-primary/20", text: "text-primary", tagBg: "bg-primary/10 dark:bg-primary/20", tagText: "text-primary" },
            subjects: ["Algebra", "Trigonometry"]
        },
        {
            title: "Grade 11 - Physics",
            students: 28,
            icon: FlaskConical,
            colorClass: { bg: "bg-green-500/10 dark:bg-green-500/20", text: "text-green-500", tagBg: "bg-green-500/10 dark:bg-green-500/20", tagText: "text-green-600 dark:text-green-400" },
            subjects: ["Mechanics", "Thermodynamics"]
        },
        {
            title: "Grade 9 - Geometry",
            students: 35,
            icon: Ruler,
            colorClass: { bg: "bg-amber-500/10 dark:bg-amber-500/20", text: "text-amber-500", tagBg: "bg-amber-500/10 dark:bg-amber-500/20", tagText: "text-amber-600 dark:text-amber-400" },
            subjects: ["Euclidean Geometry"]
        },
        {
            title: "Grade 12 - Literature",
            students: 22,
            icon: BookOpen,
            colorClass: { bg: "bg-rose-500/10 dark:bg-rose-500/20", text: "text-rose-500", tagBg: "bg-rose-500/10 dark:bg-rose-500/20", tagText: "text-rose-600 dark:text-rose-400" },
            subjects: ["Modernism", "Poetry Analysis"]
        },
        {
            title: "Grade 10 - History",
            students: 30,
            icon: History,
            colorClass: { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", text: "text-indigo-500", tagBg: "bg-indigo-500/10 dark:bg-indigo-500/20", tagText: "text-indigo-600 dark:text-indigo-400" },
            subjects: ["World History"]
        }
    ];

    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.header variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">My Classes</h1>
                    <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">View and manage your assigned classes.</p>
                </div>
            </motion.header>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls, index) => (
                    <ClassCard key={index} {...cls} />
                ))}
            </motion.div>
        </motion.div>
    );
};

export default TeacherClasses;
