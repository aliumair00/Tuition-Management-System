import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, User, FileText, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
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

const AttendanceManagement = () => {
    const [activeTab, setActiveTab] = useState('attendance');
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/classes');
                if (data.success) setClasses(data.data);
            } catch {}
        };
        fetchClasses();
    }, []);

    const loadStudents = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            const att = await api.get(`/attendance/class/${selectedClass}`, { params: { date } });
            if (att.data?.success && Array.isArray(att.data.data) && att.data.data.length > 0) {
                setStudents(att.data.data.map(r => ({
                    _id: r.student?._id || r.student,
                    name: r.student?.name || r.name || '',
                    rollNo: r.student?.rollNo || r.rollNo || '',
                    status: r.status || 'Present',
                    remark: r.remark || ''
                })));
            } else {
                const cls = await api.get(`/classes/${selectedClass}`);
                const roster = (cls.data?.data?.students || []).map(s => ({
                    _id: s._id,
                    name: s.name,
                    rollNo: s.rollNo,
                    status: 'Present',
                    remark: ''
                }));
                setStudents(roster);
            }
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = (id, status) => {
        setStudents(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    };
    const updateRemark = (id, remark) => {
        setStudents(prev => prev.map(s => s._id === id ? { ...s, remark } : s));
    };
    const markAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };
    const submitAttendance = async () => {
        if (!selectedClass || students.length === 0) return;
        setSaving(true);
        try {
            const payload = {
                classId: selectedClass,
                date,
                records: students.map(s => ({ studentId: s._id, status: s.status, remark: s.remark }))
            };
            await api.post('/attendance', payload);
        } catch {
        } finally {
            setSaving(false);
        }
    };

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
                    <h1 className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold leading-tight tracking-tight">Attendance & Leave</h1>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal leading-normal">Manage daily attendance and review leave requests.</p>
                </div>
                <div className="flex bg-card-light dark:bg-card-dark p-1 rounded-lg border border-border-light dark:border-border-dark">
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'attendance'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                            }`}
                    >
                        Mark Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('leaves')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'leaves'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark'
                            }`}
                    >
                        Leave Requests
                    </button>
                </div>
            </motion.div>

            {activeTab === 'attendance' ? (
                <motion.div
                    className="flex flex-col gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="attendance" // Add key for AnimatePresence if needed, but works for simple switch too
                >
                    {/* Filters */}
                    <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark p-4 rounded-xl border border-border-light dark:border-border-dark flex flex-wrap gap-4 items-end">
                        <label className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Select Class</span>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
                                <option value="">Select a class</option>
                                {classes.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                            <span className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">Select Date</span>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark" />
                        </label>
                        <button onClick={loadStudents} className="h-[42px] px-6 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                            {loading ? 'Loading...' : 'Load Students'}
                        </button>
                    </motion.div>

                    {/* Attendance List */}
                    <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Student List ({students.length})</h3>
                            <div className="flex gap-2">
                                <button onClick={() => markAll('Present')} className="text-sm px-3 py-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors">Mark All Present</button>
                                <button onClick={() => markAll('Absent')} className="text-sm px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">Mark All Absent</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4 text-left">Student Information</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-left">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                    {students.map((s) => (
                                        <tr key={s._id} className="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {s.name?.split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{s.name}</p>
                                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">Roll No: {s.rollNo}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => updateStatus(s._id,'Present')} className={`p-2 rounded-lg border ${s.status==='Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 'text-gray-400'}`}>
                                                        <span className="font-bold text-xs">P</span>
                                                    </button>
                                                    <button onClick={() => updateStatus(s._id,'Absent')} className={`p-2 rounded-lg ${s.status==='Absent' ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'text-gray-400'}`}>
                                                        <span className="font-bold text-xs">A</span>
                                                    </button>
                                                    <button onClick={() => updateStatus(s._id,'Leave')} className={`p-2 rounded-lg ${s.status==='Leave' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500' : 'text-gray-400'}`}>
                                                        <span className="font-bold text-xs">L</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input value={s.remark} onChange={e=>updateRemark(s._id,e.target.value)} placeholder="Optional remark..." className="w-full bg-transparent border-b border-border-light dark:border-border-dark focus:border-primary focus:outline-none text-sm py-1 text-text-primary-light dark:text-text-primary-dark" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-end">
                            <button onClick={submitAttendance} className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all">{saving ? 'Submitting...' : 'Submit Attendance'}</button>
                        </div>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div
                    className="flex flex-col gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    key="leaves"
                >
                    {/* Leave Requests List */}
                    <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Pending Requests</h3>
                            <button className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                                <Filter size={16} /> Filter
                            </button>
                        </div>
                        <div className="divide-y divide-border-light dark:divide-border-dark">
                            {[
                                { name: 'Sarah Connor', type: 'Medical Leave', dates: '12 Dec - 14 Dec', reason: 'High fever and viral infection.', status: 'Pending' },
                                { name: 'Kyle Reese', type: 'Casual Leave', dates: '15 Dec', reason: 'Family function.', status: 'Pending' },
                            ].map((req, idx) => (
                                <div key={idx} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                    <div className="flex gap-4">
                                        <div className="mt-1">
                                            <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                <Clock size={20} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">{req.name}</h4>
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">{req.type}</span>
                                            </div>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Requested for: <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{req.dates}</span></p>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark italic">"{req.reason}"</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-colors">
                                            <XCircle size={18} /> Reject
                                        </button>
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
                                            <CheckCircle size={18} /> Approve
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AttendanceManagement;
