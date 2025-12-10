import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    ChevronDown,
    Upload,
    User,
    Mail,
    Phone,
    BookOpen,
    Users,
    Search,
    Filter,
    Plus,
    MoreVertical,
    Trash2,
    Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const StudentManagement = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);


    // Fetch students
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/users?role=Student');
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);



    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await api.delete(`/users/${id}`);
                setStudents(prev => prev.filter(s => s._id !== id));
            } catch (error) {
                console.error("Failed to delete student", error);
            }
        }
    };

    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Student Management</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage all student records.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/students/add')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    Add New Student
                </button>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800/50">
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                            ) : students.length > 0 ? (
                                students.map(student => (
                                    <tr key={student._id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-200">{student.name}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{student.email}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{student.role}</td>
                                        <td className="p-4">
                                            <button onClick={() => handleDelete(student._id)} className="text-red-500 hover:text-red-700 p-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No students found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default StudentManagement;
