import React, { useState, useEffect, useRef } from 'react';
import { Search, PlusCircle, Trash2, Edit, BookOpen, User, ChevronDown, Check } from 'lucide-react';
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

const SubjectManagement = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'add'
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        assignedTeacherId: ''
    });
    const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
    const [teacherQuery, setTeacherQuery] = useState('');
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
        const onDocMouseDown = (e) => {
            if (!teacherDropdownOpen) return;
            const dropdownEl = dropdownRef.current;
            const triggerEl = triggerRef.current;
            if (!dropdownEl || !triggerEl) return;
            const target = e.target;
            if (dropdownEl.contains(target) || triggerEl.contains(target)) return;
            setTeacherDropdownOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setTeacherDropdownOpen(false);
        };
        document.addEventListener('mousedown', onDocMouseDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [teacherDropdownOpen]);

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/subjects');
            if (data.success) {
                setSubjects(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await api.get('/users?role=Teacher');
            if (data.success) {
                setTeachers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        }
    };

    useEffect(() => {
        if (viewMode === 'list') {
            fetchSubjects();
        } else if (viewMode === 'add') {
            fetchTeachers();
        }
    }, [viewMode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.code) return alert("Name and Code are required");

            await api.post('/subjects', formData);
            alert("Subject added successfully!");
            setTeacherDropdownOpen(false);
            setViewMode('list');
            setFormData({ name: '', code: '', assignedTeacherId: '' });
        } catch (error) {
            console.error("Failed to add subject", error);
            alert("Failed to add subject. Ensure code is unique.");
        }
    };

    const handleCancel = () => {
        setTeacherDropdownOpen(false);
        setTeacherQuery('');
        setViewMode('list');
    };

    const filteredTeachers = teachers.filter(t => {
        const q = teacherQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            (t.name || '').toLowerCase().includes(q) ||
            (t.email || '').toLowerCase().includes(q)
        );
    });

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await api.delete(`/subjects/${id}`);
                setSubjects(prev => prev.filter(s => s._id !== id));
            } catch (error) {
                console.error("Failed to delete subject", error);
            }
        }
    };

    if (viewMode === 'add') {
        return (
            <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Subject</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Create a new subject curriculum.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm">Save Subject</button>
                    </div>
                </div>

                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Name</span>
                            <div className="relative">
                                <input name="name" value={formData.name} onChange={handleInputChange} type="text" placeholder="e.g. Advanced Physics" className="w-full h-12 px-4 pl-11 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                                <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Code</span>
                            <input name="code" value={formData.code} onChange={handleInputChange} type="text" placeholder="e.g. PHY-101" className="w-full h-12 px-4 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </label>
                        <label className="space-y-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assign Teacher (Optional)</span>
                            <div className="relative">
                                <button
                                    type="button"
                                    ref={triggerRef}
                                    onClick={() => setTeacherDropdownOpen(v => !v)}
                                    className="w-full h-12 px-4 pl-11 pr-10 rounded-lg bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all flex items-center justify-between"
                                >
                                    <span className="truncate text-left">
                                        {formData.assignedTeacherId
                                            ? (() => {
                                                const sel = teachers.find(t => t._id === formData.assignedTeacherId);
                                                return sel ? `${sel.name} (${sel.email})` : 'Select a teacher';
                                            })()
                                            : 'Select a teacher'}
                                    </span>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                    <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                                </button>
                                {teacherDropdownOpen && (
                                    <>
                                    <div className="fixed inset-0 z-20" onClick={() => setTeacherDropdownOpen(false)} />
                                    <div ref={dropdownRef} className="absolute z-30 mt-2 w-full rounded-xl border border-border-light dark:border-gray-700 bg-card-light dark:bg-card-dark shadow-lg overflow-hidden">
                                        <div className="p-2 border-b border-border-light dark:border-gray-800">
                                            <div className="relative">
                                                <input
                                                    value={teacherQuery}
                                                    onChange={(e) => setTeacherQuery(e.target.value)}
                                                    placeholder="Search teacher by name or email"
                                                    className="w-full h-10 px-3 pl-9 rounded-md bg-background-light dark:bg-gray-900 border border-border-light dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                                                />
                                                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <div className="max-h-56 overflow-auto">
                                            {filteredTeachers.length === 0 ? (
                                                <div className="p-3 text-sm text-gray-500 dark:text-gray-400">No matches</div>
                                            ) : (
                                                filteredTeachers.map(t => (
                                                    <button
                                                        key={t._id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, assignedTeacherId: t._id }));
                                                            setTeacherDropdownOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${formData.assignedTeacherId === t._id ? 'bg-primary/10' : ''}`}
                                                    >
                                                        <User className="w-4 h-4 text-primary" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{t.name}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.email}</div>
                                                        </div>
                                                        {formData.assignedTeacherId === t._id && <Check className="w-4 h-4 text-primary" />}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-2 border-t border-border-light dark:border-gray-800 flex justify-between">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, assignedTeacherId: '' }));
                                                    setTeacherDropdownOpen(false);
                                                }}
                                                className="text-xs px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            >
                                                Clear
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTeacherDropdownOpen(false)}
                                                className="text-xs px-3 py-1 rounded-md bg-primary text-white hover:bg-primary/90"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </div>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>
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
            {/* Page Heading */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold leading-tight tracking-tight">Subject Management</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">Manage curriculum and assign teachers.</p>
                </div>
                <button onClick={() => setViewMode('add')} className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary-dark transition-colors">
                    <PlusCircle size={20} />
                    <span className="truncate">Add New Subject</span>
                </button>
            </motion.div>

            {/* SearchBar */}
            <motion.div variants={itemVariants}>
                <label className="flex flex-col min-w-40 h-10 w-full max-w-md">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full border border-border-light dark:border-border-dark overflow-hidden focus-within:ring-2 focus-within:ring-primary/20">
                        <div className="text-text-secondary-light dark:text-text-secondary-dark flex bg-card-light dark:bg-card-dark items-center justify-center pl-4">
                            <Search size={20} />
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-text-primary-light dark:text-text-primary-dark focus:outline-0 focus:ring-0 border-none bg-card-light dark:bg-card-dark h-full placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark px-4 pl-2 text-base font-normal leading-normal"
                            placeholder="Search subjects..."
                        />
                    </div>
                </label>
            </motion.div>

            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800/50">
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Code</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Assigned Teacher</th>
                                <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-4 text-center">Loading...</td></tr>
                            ) : subjects.length > 0 ? (
                                subjects.map(subject => (
                                    <tr key={subject._id} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="p-4 text-sm text-gray-800 dark:text-gray-200 font-medium">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-primary" />
                                                {subject.name}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400 font-mono">{subject.code}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                                            {subject.assignedTeacherId ? subject.assignedTeacherId.name : <span className="text-gray-400 italic">Unassigned</span>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors"><Edit size={18} /></button>
                                                <button onClick={() => handleDelete(subject._id)} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="p-4 text-center text-gray-500">No subjects found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SubjectManagement;
