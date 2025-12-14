import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Eye, Edit, Trash2, ChevronLeft, ChevronRight, BookOpen, User, X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const ClassManagement = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list', 'add', 'manage'
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);

    // Form data for adding a new class
    const [formData, setFormData] = useState({
        name: '',
        grade: '',
        section: ''
    });

    // Enroll Modal State
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [enrollSearchQuery, setEnrollSearchQuery] = useState('');

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/classes');
            if (data.success) {
                setClasses(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch classes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode === 'list') {
            fetchClasses();
        }
    }, [viewMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.grade || !formData.section) return alert("All fields are required");

            await api.post('/classes', formData);
            await fetchClasses();
            alert("Class added successfully!");
            setViewMode('list');
            setFormData({ name: '', grade: '', section: '' });
        } catch (error) {
            console.error("Failed to add class", error);
            alert("Failed to add class. Ensure name is unique.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            try {
                await api.delete(`/classes/${id}`);
                setClasses(prev => prev.filter(c => c._id !== id));
            } catch (error) {
                console.error("Failed to delete class", error);
            }
        }
    };

    // --- Manage Mode Logic ---
    const handleManage = async (cls) => {
        setSelectedClass(cls);
        setViewMode('manage');
        // Fetch detailed class info (to ensure we have latest students/subjects)
        try {
            const { data } = await api.get(`/classes/${cls._id}`);
            if (data.success) setSelectedClass(data.data);
        } catch (e) { console.error(e); }

        // Fetch all subjects for selection
        try {
            const { data } = await api.get('/subjects');
            if (data.success) setAvailableSubjects(data.data);
        } catch (e) { console.error(e); }

        // Fetch students (optimally only those not assigned, but for now all students)
        try {
            const { data } = await api.get('/users?role=Student');
            if (data.success) setAvailableStudents(data.data);
        } catch (e) { console.error(e); }
    };

    const handleAddSubject = async (subjectId) => {
        if (!subjectId) return;
        try {
            const currentSubjectObjs = selectedClass.subjectIds || [];
            const currentSubjectIds = currentSubjectObjs.map(s => (typeof s === 'string' ? s : s._id));
            if (currentSubjectIds.includes(subjectId)) return alert('Subject already added');

            const updatedSubjects = [...currentSubjectIds, subjectId];
            const { data } = await api.put(`/classes/${selectedClass._id}`, { subjectIds: updatedSubjects });
            if (data.success) {
                const { data: newData } = await api.get(`/classes/${selectedClass._id}`);
                setSelectedClass(newData.data);
                setClasses(prev => prev.map(c => (c._id === newData.data._id ? newData.data : c)));
            }
        } catch (error) {
            console.error('Failed to add subject', error);
            alert('Failed to add subject');
        }
    };

    const handleRemoveSubject = async (subjectId) => {
        if (!window.confirm("Remove this subject from the class?")) return;
        try {
            const updatedSubjects = selectedClass.subjectIds.filter(s => s._id !== subjectId).map(s => s._id);
            const { data } = await api.put(`/classes/${selectedClass._id}`, { subjectIds: updatedSubjects });
            if (data.success) {
                const { data: newData } = await api.get(`/classes/${selectedClass._id}`);
                setSelectedClass(newData.data);
            }
        } catch (error) {
            console.error("Failed to remove subject", error);
        }
    };

    const handleAddStudent = async (studentId) => {
        if (!studentId) return;
        try {
            // Update user's classId
            await api.put(`/users/${studentId}`, { classId: selectedClass._id });
            // Refresh class data
            const { data: newData } = await api.get(`/classes/${selectedClass._id}`);
            setSelectedClass(newData.data);
            // Also refresh available students list to reflect change if needed, though they just change class
            const { data: newStudents } = await api.get('/users?role=Student');
            setAvailableStudents(newStudents.data);
        } catch (error) {
            console.error("Failed to enroll student", error);
        }
    };

    const handleRemoveStudent = async (studentId) => {
        if (!window.confirm("Unenroll this student?")) return;
        try {
            // Set classId to null/undefined. API might expect explicit null or removal of field associated
            // Assuming backend handles { classId: null } properly or we send empty string if handled
            await api.put(`/users/${studentId}`, { classId: null });
            const { data: newData } = await api.get(`/classes/${selectedClass._id}`);
            setSelectedClass(newData.data);
            const { data: newStudents } = await api.get('/users?role=Student');
            setAvailableStudents(newStudents.data);
        } catch (error) {
            console.error("Failed to unenroll student", error);
        }
    };


    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
    const [subjectSearchQuery, setSubjectSearchQuery] = useState('');

    if (viewMode === 'add') {
        return (
            <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Class</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Create a new class group.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setViewMode('list')} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm">Save Class</button>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</span>
                            <div className="relative">
                                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Grade 10 - Science A" className="w-full h-12 px-4 pl-11 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade Level</span>
                            <input name="grade" value={formData.grade} onChange={handleInputChange} type="text" placeholder="e.g. 10" className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Section</span>
                            <input name="section" value={formData.section} onChange={handleInputChange} type="text" placeholder="e.g. A" className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </label>
                    </div>
                </div>
            </motion.div>
        );
    }

    if (viewMode === 'manage' && selectedClass) {
        return (
            <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage: {selectedClass.name}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enroll students and assign subjects.</p>
                    </div>
                    <button onClick={() => { setSelectedClass(null); setViewMode('list'); }} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Back to List
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subjects Section */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Subjects</h3>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setIsSubjectModalOpen(true);
                                        setSubjectSearchQuery('');
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-bold transition-colors"
                                >
                                    <Plus size={16} /> Add Subject
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedClass.subjectIds && selectedClass.subjectIds.length > 0 ? (
                                selectedClass.subjectIds.map(subject => (
                                    <div key={subject._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border-light dark:border-gray-700">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{subject.name}</p>
                                            <p className="text-xs text-gray-500">{subject.code}</p>
                                        </div>
                                        <button onClick={() => handleRemoveSubject(subject._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No subjects assigned.</p>
                            )}
                        </div>
                    </div>

                    {/* Students Section */}
                    <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Enrolled Students</h3>
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        setIsEnrollModalOpen(true);
                                        setEnrollSearchQuery('');
                                    }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm font-bold transition-colors"
                                >
                                    <Plus size={16} /> Enroll Student
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {selectedClass.students && selectedClass.students.length > 0 ? (
                                selectedClass.students.map(student => (
                                    <div key={student._id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-border-light dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{student.name}</p>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveStudent(student._id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No students enrolled.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enroll Student Modal */}
                {isEnrollModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Enroll Student</h3>
                                <button onClick={() => setIsEnrollModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search students by name..."
                                        value={enrollSearchQuery}
                                        onChange={(e) => setEnrollSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto p-2">
                                {availableStudents.filter(s =>
                                    s.classId !== selectedClass._id &&
                                    s.name.toLowerCase().includes(enrollSearchQuery.toLowerCase())
                                ).length > 0 ? (
                                    <div className="space-y-1">
                                        {availableStudents
                                            .filter(s =>
                                                s.classId !== selectedClass._id &&
                                                s.name.toLowerCase().includes(enrollSearchQuery.toLowerCase())
                                            )
                                            .map(student => (
                                                <div key={student._id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{student.name}</p>
                                                            <p className="text-xs text-gray-500">{student.email}</p>
                                                            {student.classId && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">Transfer</span>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            handleAddStudent(student._id);
                                                            // Optional: Keep modal open or close it? User might want to batch enroll.
                                                            // For better UX, let's show a success feedback or toast, but for now simple enroll.
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-md hover:bg-primary-dark transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    >
                                                        Enroll
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <User className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                        <p>No matching students found.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Add Subject Modal */}
                {isSubjectModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Subject</h3>
                                <button onClick={() => setIsSubjectModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search subjects by name..."
                                        value={subjectSearchQuery}
                                        onChange={(e) => setSubjectSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto p-2">
                                {availableSubjects.filter(s =>
                                    !selectedClass.subjectIds?.some(existing => (typeof existing === 'string' ? existing : existing._id) === s._id) &&
                                    s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase())
                                ).length > 0 ? (
                                    <div className="space-y-1">
                                        {availableSubjects
                                            .filter(s =>
                                                !selectedClass.subjectIds?.some(existing => (typeof existing === 'string' ? existing : existing._id) === s._id) &&
                                                s.name.toLowerCase().includes(subjectSearchQuery.toLowerCase())
                                            )
                                            .map(subject => (
                                                <div key={subject._id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{subject.name}</p>
                                                        <p className="text-xs text-gray-500">{subject.code}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            handleAddSubject(subject._id);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-md hover:bg-primary-dark transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                        <p>No matching subjects found.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* PageHeading */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold leading-tight tracking-tight">Class Management</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">Manage, add, and edit class information.</p>
                </div>
                <button onClick={() => setViewMode('add')} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 hover:bg-primary-dark transition-colors">
                    <PlusCircle size={20} />
                    <span className="truncate">Add New Class</span>
                </button>
            </motion.div>

            {/* Table */}
            <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark">
                                <th className="px-6 py-4 text-left text-text-primary-light dark:text-text-primary-dark text-xs font-semibold uppercase tracking-wider">Class Name</th>
                                <th className="px-6 py-4 text-left text-text-primary-light dark:text-text-primary-dark text-xs font-semibold uppercase tracking-wider">Grade/Section</th>
                                <th className="px-6 py-4 text-left text-text-primary-light dark:text-text-primary-dark text-xs font-semibold uppercase tracking-wider">Subjects</th>
                                <th className="px-6 py-4 text-left text-text-primary-light dark:text-text-primary-dark text-xs font-semibold uppercase tracking-wider">Students</th>
                                <th className="px-6 py-4 text-left text-text-primary-light dark:text-text-primary-dark text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
                            ) : classes.length > 0 ? (
                                classes.map((row) => (
                                    <tr key={row._id} className="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-text-primary-light dark:text-text-primary-dark text-sm font-medium">{row.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark text-sm">{row.grade} - {row.section}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                            {row.subjectIds?.length > 0 ? row.subjectIds.length : '0'} Subjects
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark text-sm">
                                            {row.students?.length || 0} Enrolled
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => handleManage(row)} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors gap-1 flex items-center">
                                                    <Edit size={18} /> <span className="text-xs">Manage</span>
                                                </button>
                                                <button onClick={() => handleDelete(row._id)} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-4 text-center">No classes found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ClassManagement;
