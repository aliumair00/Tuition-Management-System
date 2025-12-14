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
import api from '../../lib/api';

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
    const [classes, setClasses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/classes/my');
                if (data.success) {
                    setClasses(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch classes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    // Color palettes to cycle through
    const colorPalettes = [
        { bg: "bg-primary/10 dark:bg-primary/20", text: "text-primary", tagBg: "bg-primary/10 dark:bg-primary/20", tagText: "text-primary" },
        { bg: "bg-green-500/10 dark:bg-green-500/20", text: "text-green-500", tagBg: "bg-green-500/10 dark:bg-green-500/20", tagText: "text-green-600 dark:text-green-400" },
        { bg: "bg-amber-500/10 dark:bg-amber-500/20", text: "text-amber-500", tagBg: "bg-amber-500/10 dark:bg-amber-500/20", tagText: "text-amber-600 dark:text-amber-400" },
        { bg: "bg-rose-500/10 dark:bg-rose-500/20", text: "text-rose-500", tagBg: "bg-rose-500/10 dark:bg-rose-500/20", tagText: "text-rose-600 dark:text-rose-400" },
        { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", text: "text-indigo-500", tagBg: "bg-indigo-500/10 dark:bg-indigo-500/20", tagText: "text-indigo-600 dark:text-indigo-400" }
    ];

    const icons = [Sigma, FlaskConical, Ruler, BookOpen, History];

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

            {loading ? (
                <div className="p-10 text-center text-gray-500">Loading classes...</div>
            ) : (
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.length > 0 ? (
                        classes.map((cls, index) => {
                            const palette = colorPalettes[index % colorPalettes.length];
                            const Icon = icons[index % icons.length];

                            return (
                                <ClassCard
                                    key={cls._id}
                                    title={`${cls.grade} - ${cls.name} (${cls.section})`}
                                    students={cls.students ? cls.students.length : 0}
                                    icon={Icon}
                                    colorClass={palette} // Pass the full palette object correctly
                                    subjects={cls.subjectIds ? cls.subjectIds.map(s => s.name) : []}
                                />
                            );
                        })
                    ) : (
                        <div className="col-span-full p-10 text-center text-gray-500 bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800">
                            No classes assigned to you yet.
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default TeacherClasses;
