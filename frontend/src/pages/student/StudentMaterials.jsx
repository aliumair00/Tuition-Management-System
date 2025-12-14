import React, { useState, useEffect } from 'react';
import {
    Search,
    FileText,
    File,
    Presentation,
    Download,
    ChevronLeft,
    ChevronRight,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const StudentMaterials = () => {
    const { user } = useAuth();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.classId) {
            fetchMaterials();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchMaterials = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/materials/class/${user.classId}`);
            if (data.success) {
                setMaterials(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch materials", error);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (type) => {
        if (type?.includes('pdf')) return FileText;
        if (type?.includes('presentation') || type?.includes('ppt')) return Presentation;
        return File;
    };

    const filteredMaterials = materials.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subjectId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <div className="lg:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="text-gray-400" size={20} />
                            </div>
                            <input
                                className="form-input block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-primary focus:border-primary pl-10 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                placeholder="Search for notes, topics..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Sort & Count */}
            <motion.div variants={itemVariants} className="flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Showing {filteredMaterials.length} results</p>
            </motion.div>

            {/* Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-10 text-gray-500">Loading materials...</div>
                ) : filteredMaterials.length > 0 ? (
                    filteredMaterials.map((item, idx) => {
                        const Icon = getFileIcon(item.fileType);
                        return (
                            <div key={item._id || idx} className="flex flex-col bg-white dark:bg-[#1C2433] rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                <div className="p-5 flex-grow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                                            <Icon className="text-blue-600 dark:text-blue-400" size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-gray-800 dark:text-white leading-tight mb-1">{item.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.subjectId?.name || 'Subject'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between text-xs text-gray-400 dark:text-gray-500">
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-t border-gray-200 dark:border-gray-700">
                                    <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors"
                                    >
                                        <Download size={20} />
                                        Download
                                    </a>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                        <AlertCircle size={48} className="mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No materials found.</p>
                        {!user.classId && <p className="text-sm mt-2">You are not assigned to any class.</p>}
                    </div>
                )}
            </motion.div>
        </motion.div >
    );
};

export default StudentMaterials;
