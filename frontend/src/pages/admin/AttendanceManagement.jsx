import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, User, FileText, Search, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
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
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [leaves, setLeaves] = useState([]);

    const fetchLeaves = async () => {
        setLeaveLoading(true);
        try {
            const { data } = await api.get('/leaves/pending');
            if (data.success) setLeaves(data.data);
        } catch (e) {
        } finally {
            setLeaveLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'leaves') fetchLeaves();
    }, [activeTab]);

    const approveLeave = async (id) => {
        try {
            await api.patch(`/leaves/${id}/approve`);
            setLeaves(prev => prev.filter(l => l._id !== id));
        } catch (e) { }
    };

    const rejectLeave = async (id) => {
        try {
            await api.patch(`/leaves/${id}/reject`);
            setLeaves(prev => prev.filter(l => l._id !== id));
        } catch (e) { }
    };
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]); // {studentId, name, status, note}
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/classes');
                if (data.success) {
                    const list = data.data || data.results || [];
                    setClasses(list);
                    if (list.length > 0) setSelectedClassId(list[0]._id);
                }
            } catch (e) {
            }
        };
        fetchClasses();
    }, []);

    const loadStudents = async () => {
        if (!selectedClassId || !date) return;
        setLoading(true);
        try {
            const { data: attendanceData } = await api.get(`/attendance/class/${selectedClassId}?date=${date}`);
            if (attendanceData.success && attendanceData.data.length > 0) {
                const record = attendanceData.data[0];
                const mapped = record.records.map(r => ({
                    studentId: r.studentId._id || r.studentId,
                    name: r.studentId.name || '',
                    status: r.status,
                    note: r.note || ''
                }));
                setStudents(mapped);
            } else {
                // fallback: get class roster
                const cls = classes.find(c => c._id === selectedClassId);
                if (cls && cls.students) {
                    const roster = cls.students.map(s => ({
                        studentId: s._id,
                        name: s.name,
                        status: 'Present',
                        note: ''
                    }));
                    setStudents(roster);
                } else {
                    const { data: classDetail } = await api.get(`/classes/${selectedClassId}`);
                    if (classDetail.success) {
                        const roster = classDetail.data.students.map(s => ({
                            studentId: s._id,
                            name: s.name,
                            status: 'Present',
                            note: ''
                        }));
                        setStudents(roster);
                    }
                }
            }
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = (studentId, status) => {
        setStudents(prev => prev.map(s => s.studentId === studentId ? { ...s, status } : s));
    };

    const handleMarkAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleNote = (studentId, note) => {
        setStudents(prev => prev.map(s => s.studentId === studentId ? { ...s, note } : s));
    };

    const submitAttendance = async () => {
        if (!selectedClassId) return;
        setSaving(true);
        try {
            const payload = {
                classId: selectedClassId,
                date,
                records: students.map(s => ({ studentId: s.studentId, status: s.status, note: s.note }))
            };
            await api.post('/attendance', payload);
            alert('Attendance saved');
        } catch (e) {
            alert('Failed to save');
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
                    {/* Filters */}
                    <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark flex flex-col md:flex-row gap-6 items-end shadow-sm">
                        <div className="flex-1 w-full min-w-[200px] flex flex-col gap-2">
                            <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark ml-1">Select Class</label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                    <User size={18} />
                                </div>
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="w-full h-11 pl-10 pr-10 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
                                >
                                    {classes.length === 0 && <option value="">Loading classes...</option>}
                                    {classes.length > 0 && classes.map(c => (
                                        <option key={c._id} value={c._id}>{c.name} {c.grade && c.section ? `(${c.grade}-${c.section})` : ''}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <ChevronDown size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-w-[200px] flex flex-col gap-2">
                            <label className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark ml-1">Select Date</label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer hover:border-gray-400 dark:hover:border-gray-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={loadStudents}
                            disabled={loading || !selectedClassId}
                            className={`h-11 px-8 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 min-w-[140px] ${loading || !selectedClassId
                                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                                    : 'bg-primary text-white hover:bg-primary-dark hover:shadow-primary/40 active:scale-95'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    <span>Load Data</span>
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Attendance List */}
                    <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                            <h3 className="text-lg font-bold text-text-primary-light dark:text-text-primary-dark">Student List ({students.length})</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleMarkAll('Present')} className="text-sm px-3 py-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors">Mark All Present</button>
                                <button onClick={() => handleMarkAll('Absent')} className="text-sm px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">Mark All Absent</button>
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
                                    {loading ? (
                                        <tr><td colSpan="3" className="px-6 py-4">Loading...</td></tr>
                                    ) : students.length === 0 ? (
                                        <tr><td colSpan="3" className="px-6 py-4">No students loaded</td></tr>
                                    ) : students.map((s, idx) => (
                                        <tr key={s.studentId} className="hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{(s.name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                                                    <div>
                                                        <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{s.name}</p>
                                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">#{idx + 1}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleStatus(s.studentId, 'Present')} className={`p-2 rounded-lg border ${s.status === 'Present' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 'hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400'}`}>
                                                        <span className="font-bold text-xs">P</span>
                                                    </button>
                                                    <button onClick={() => handleStatus(s.studentId, 'Absent')} className={`p-2 rounded-lg ${s.status === 'Absent' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400'}`}>
                                                        <span className="font-bold text-xs">A</span>
                                                    </button>
                                                    <button onClick={() => handleStatus(s.studentId, 'Late')} className={`p-2 rounded-lg ${s.status === 'Late' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800' : 'hover:bg-yellow-50 dark:hover:bg-yellow-900/20 text-gray-400'}`}>
                                                        <span className="font-bold text-xs">L</span>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input value={s.note} onChange={(e) => handleNote(s.studentId, e.target.value)} placeholder="Optional remark..." className="w-full bg-transparent border-b border-border-light dark:border-border-dark focus:border-primary focus:outline-none text-sm py-1 text-text-primary-light dark:text-text-primary-dark" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-border-light dark:border-border-dark flex justify-end">
                            <button onClick={submitAttendance} disabled={saving} className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all disabled:opacity-70">{saving ? 'Saving...' : 'Submit Attendance'}</button>
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
                            {leaveLoading ? (
                                <div className="p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading...</div>
                            ) : leaves.length === 0 ? (
                                <div className="p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">No pending requests</div>
                            ) : (
                                leaves.map((req) => (
                                    <div key={req._id} className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                                        <div className="flex gap-4">
                                            <div className="mt-1">
                                                <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                                    <Clock size={20} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">{req.requestedBy?.name || 'Unknown'}</h4>
                                                    <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">{req.type} Leave</span>
                                                </div>
                                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">Requested for: <span className="font-medium text-text-primary-light dark:text-text-primary-dark">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}</span></p>
                                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark italic">"{req.reason}"</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
                                            <button onClick={() => rejectLeave(req._id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-colors">
                                                <XCircle size={18} /> Reject
                                            </button>
                                            <button onClick={() => approveLeave(req._id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm">
                                                <CheckCircle size={18} /> Approve
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AttendanceManagement;
