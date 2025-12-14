import React, { useState, useEffect, useRef } from 'react';
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
    File as FileIcon,
    X,
    Filter,
    ChevronDown,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

const TeacherMaterials = () => {
    // Data State
    const [materials, setMaterials] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');
    const [selectedType, setSelectedType] = useState('All Types');

    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);

    // Searchable Select State
    const [classSearchQuery, setClassSearchQuery] = useState('');
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        file: null
    });
    const [availableSubjects, setAvailableSubjects] = useState([]);

    useEffect(() => {
        fetchInitialData();

        // click outside listener for dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsClassDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchInitialData = async () => {
        try {
            const [materialsRes, classesRes] = await Promise.all([
                api.get('/materials/my'),
                api.get('/classes/my')
            ]);

            if (materialsRes.data.success) {
                setMaterials(materialsRes.data.data);
            }
            if (classesRes.data.success) {
                setClasses(classesRes.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived Data for Filters
    const filteredMaterials = materials.filter(material => {
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase());

        let materialClassName = 'Unassigned';
        if (material.classId && material.classId.name) {
            const g = material.classId.grade;
            const n = material.classId.name;
            const s = material.classId.section;
            materialClassName = g + ' - ' + n + ' (' + s + ')';
        }

        const matchesClass = selectedClass === 'All Classes' || materialClassName === selectedClass;

        // Simplified type check
        const matchesType = selectedType === 'All Types' ||
            (selectedType === 'PDF' && material.fileType === '.pdf') ||
            (selectedType === 'Image' && ['.jpg', '.jpeg', '.png'].includes(material.fileType)) ||
            (selectedType === 'Document' && ['.doc', '.docx', '.txt'].includes(material.fileType));

        return matchesSearch && matchesClass && matchesType;
    });

    // Derived Data for Modal Class Search
    const modalFilteredClasses = classes.filter(cls => {
        const searchTarget = (cls.name + ' ' + cls.grade + ' ' + cls.section).toLowerCase();
        return searchTarget.includes(classSearchQuery.toLowerCase());
    });

    // Handle Class Selection
    const handleClassSelect = (cls) => {
        setFormData({ ...formData, classId: cls._id, subjectId: '' });
        setAvailableSubjects(cls.subjectIds || []);
        const displayVal = cls.grade + ' - ' + cls.name + ' (' + cls.section + ')';
        setClassSearchQuery(displayVal);
        setIsClassDropdownOpen(false);
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploadLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('classId', formData.classId);
        data.append('subjectId', formData.subjectId);
        data.append('file', formData.file);

        try {
            const res = await api.post('/materials', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                // Refresh list
                const { data: newMaterials } = await api.get('/materials/my');
                setMaterials(newMaterials.data);
                closeModal();
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload material");
        } finally {
            setUploadLoading(false);
        }
    };

    const closeModal = () => {
        setIsUploadModalOpen(false);
        setFormData({ title: '', description: '', classId: '', subjectId: '', file: null });
        setClassSearchQuery('');
        setAvailableSubjects([]);
    };

    const getFileIcon = (type) => {
        if (type === '.pdf') return { icon: FileText, color: 'text-red-500', bg: 'bg-red-500/10' };
        if (['.jpg', '.jpeg', '.png'].includes(type)) return { icon: FileIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        return { icon: FileText, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    };

    // Calculate Folder Stats (Group by Subject)
    const folderStats = materials.reduce((acc, curr) => {
        const subjectName = curr.subjectId?.name || 'Uncategorized';
        if (!acc[subjectName]) acc[subjectName] = 0;
        acc[subjectName]++;
        return acc;
    }, {});

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
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center justify-center gap-2 p-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                    >
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option>All Classes</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls.grade + ' - ' + cls.name + ' (' + cls.section + ')'}>
                                {cls.grade + ' - ' + cls.name + ' (' + cls.section + ')'}
                            </option>
                        ))}
                    </select>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                    >
                        <option>All Types</option>
                        <option>PDF</option>
                        <option>Image</option>
                        <option>Document</option>
                    </select>
                </div>
            </motion.div>

            {/* Folders (Grouped by Subject) */}
            <motion.div variants={itemVariants} className="mb-4">
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Folders</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Object.entries(folderStats).map(([subject, count], idx) => (
                        <div key={idx} className="bg-white dark:bg-card-dark p-4 rounded-xl flex items-center gap-4 hover:shadow-md dark:hover:bg-gray-800 transition-all cursor-pointer border border-gray-200 dark:border-gray-800">
                            <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                <Folder className="text-primary w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-gray-900 dark:text-white">{subject}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{count} files</p>
                            </div>
                        </div>
                    ))}
                    {/* Placeholder for functionality expansion - maybe filter by subject on click */}
                </div>
            </motion.div>

            {/* File List */}
            <motion.div variants={itemVariants}>
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Files</h2>
                <div className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Class</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Date Added</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading materials...</td></tr>
                                ) : filteredMaterials.length === 0 ? (
                                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No materials found.</td></tr>
                                ) : (
                                    filteredMaterials.map((file) => {
                                        const { icon: Icon, color, bg } = getFileIcon(file.fileType);
                                        return (
                                            <tr key={file._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                                <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                                    <Icon className={`w-5 h-5 ${color}`} />
                                                    <span>{file.title}</span>
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">
                                                    {file.classId ? `${file.classId.grade} - ${file.classId.name}` : 'N/A'}
                                                </td>
                                                <td className="p-4 text-gray-600 dark:text-gray-300">{new Date(file.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${bg} ${color}`}>
                                                        {file.fileType}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <a
                                                            href={file.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                                                            download
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                        {/* Implement Delete if needed */}
                                                        {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"><Trash2 className="w-4 h-4" /></button> */}
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-card-dark rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upload Material</h3>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        placeholder="e.g. Chapter 1 Notes"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                    <textarea
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        placeholder="Optional description..."
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div ref={dropdownRef} className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                                        <div
                                            className="relative"
                                            onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                        >
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors cursor-pointer"
                                                placeholder="Select Class..."
                                                value={classSearchQuery}
                                                onChange={(e) => {
                                                    setClassSearchQuery(e.target.value);
                                                    setIsClassDropdownOpen(true);
                                                }}
                                                // Prevent input from closing dropdown on click
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsClassDropdownOpen(true);
                                                }}
                                            />
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                                        </div>

                                        {isClassDropdownOpen && (
                                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                {classes.length === 0 ? (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No classes found.</div>
                                                ) : modalFilteredClasses.length > 0 ? (
                                                    modalFilteredClasses.map(cls => (
                                                        <div
                                                            key={cls._id}
                                                            onClick={() => handleClassSelect(cls)}
                                                            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                                                        >
                                                            <span>{cls.grade} - {cls.name} ({cls.section})</span>
                                                            {formData.classId === cls._id && <Check className="w-4 h-4 text-primary" />}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No matches found.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                        <select
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            value={formData.subjectId}
                                            onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                            disabled={!formData.classId}
                                        >
                                            <option value="">Select Subject</option>
                                            {availableSubjects.map(sub => (
                                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">File</label>
                                    <input
                                        type="file"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {uploadLoading ? 'Uploading...' : 'Upload Material'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TeacherMaterials;
