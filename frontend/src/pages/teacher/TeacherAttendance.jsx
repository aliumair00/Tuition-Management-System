import React, { useState, useEffect } from 'react';
import { Search, Bell, PersonStanding, CheckCircle, XCircle, Clock, Save, Loader2 } from 'lucide-react';
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

const TeacherAttendance = () => {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]); // List of { studentId, name, status }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                // If user is admin, fetch all. If teacher, fetch assigned.
                // Assuming /api/classes/my works for teachers, or generic /api/classes for all if admin
                const endpoint = user.role === 'Admin' ? '/classes' : '/classes/my';
                const { data } = await api.get(endpoint);
                if (data.success) {
                    setClasses(data.data);
                    if (data.data.length > 0) {
                        setSelectedClassId(data.data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        };
        fetchClasses();
    }, [user.role]);

    // Fetch Attendance or Class Roster when Class/Date changes
    useEffect(() => {
        if (!selectedClassId || !date) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Try to get existing attendance
                const { data: attendanceData } = await api.get(`/attendance/class/${selectedClassId}?date=${date}`);

                if (attendanceData.success && attendanceData.data.length > 0) {
                    // Start with the existing record (assuming first one is relevant if multiple, logic says unique per class/date)
                    const record = attendanceData.data[0];
                    if (record) {
                        // Map existing records
                        const mappedStudents = record.records.map(r => ({
                            studentId: r.studentId._id,
                            name: r.studentId.name,
                            status: r.status, // Present/Absent/Late
                            note: r.note
                        }));
                        setStudents(mappedStudents);
                    }
                } else {
                    // 2. If no attendance, fetch fresh roster from Class details
                    // The classes list might already have students populated? Yes from previous step.
                    // But let's fetch individual class to be safe and get specific student list if needed
                    // Actually, if 'classes' state already has students populated (from getMyClasses), we can use that.
                    // Let's check if the selected class in 'classes' array has students.
                    const cls = classes.find(c => c._id === selectedClassId);
                    if (cls && cls.students) {
                        const roster = cls.students.map(s => ({
                            studentId: s._id,
                            name: s.name,
                            status: 'Present', // Default
                            note: ''
                        }));
                        setStudents(roster);
                    } else {
                        // Only if not populated, fetch class details
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
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedClassId, date, classes]);

    const handleStatusChange = (studentId, newStatus) => {
        setStudents(prev => prev.map(s =>
            s.studentId === studentId ? { ...s, status: newStatus } : s
        ));
    };

    const handleMarkAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const saveAttendance = async () => {
        if (!selectedClassId) return;
        setSaving(true);
        try {
            const payload = {
                classId: selectedClassId,
                date,
                records: students.map(s => ({
                    studentId: s.studentId,
                    status: s.status,
                    note: s.note
                }))
            };

            await api.post('/attendance', payload);
            alert("Attendance saved successfully!");
        } catch (error) {
            console.error("Failed to save attendance", error);
            alert("Failed to save attendance.");
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
            <motion.header variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <div className="flex flex-col">
                    <h1 className="text-[#111318] dark:text-white text-3xl font-bold leading-tight tracking-tight">Attendance Marking</h1>
                    <p className="text-[#616f89] dark:text-gray-400 text-base font-normal leading-normal">Mark student attendance for your classes.</p>
                </div>
            </motion.header>

            {/* Filters */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Class / Subject</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        >
                            {classes.length === 0 && <option value="">Loading classes...</option>}
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name} ({c.grade}-{c.section})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                            type="date"
                        />
                    </div>
                    <button onClick={() => { }} className="w-full md:w-auto bg-primary text-white font-medium py-2.5 px-5 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm pointer-events-none opacity-80">
                        {/* Placeholder or Refresh button */}
                        <PersonStanding className="w-5 h-5" />
                        <span>Roster Loaded</span>
                    </button>
                </div>
            </motion.div>

            {/* Roster */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#111318] dark:text-white">
                                Student Roster: {classes.find(c => c._id === selectedClassId)?.name || 'Select Class'}
                            </h2>
                            <p className="text-[#616f89] dark:text-gray-400">{date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleMarkAll('Present')} className="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">Mark All Present</button>
                            <button onClick={saveAttendance} disabled={saving} className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-70">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save Attendance"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-dark/50">
                            <tr>
                                <th className="px-6 py-3" scope="col">Roll No.</th>
                                <th className="px-6 py-3" scope="col">Student Name</th>
                                <th className="px-6 py-3 text-center" scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="p-4 text-center">Loading roster...</td></tr>
                            ) : students.length > 0 ? (
                                students.map((student, idx) => (
                                    <tr key={student.studentId} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{idx + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => handleStatusChange(student.studentId, 'Present')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${student.status === 'Present' ? 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/50' : 'bg-transparent text-gray-400 border-transparent opacity-50 hover:opacity-100 hover:bg-green-500/10 hover:text-green-500'}`}>
                                                    <CheckCircle className="w-4 h-4" /> Present
                                                </button>
                                                <button onClick={() => handleStatusChange(student.studentId, 'Absent')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${student.status === 'Absent' ? 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/50' : 'bg-transparent text-gray-400 border-transparent opacity-50 hover:opacity-100 hover:bg-red-500/10 hover:text-red-500'}`}>
                                                    <XCircle className="w-4 h-4" /> Absent
                                                </button>
                                                <button onClick={() => handleStatusChange(student.studentId, 'Late')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${student.status === 'Late' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/50' : 'bg-transparent text-gray-400 border-transparent opacity-50 hover:opacity-100 hover:bg-amber-500/10 hover:text-amber-500'}`}>
                                                    <Clock className="w-4 h-4" /> Late
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="3" className="p-4 text-center">No students found in this class.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeacherAttendance;
