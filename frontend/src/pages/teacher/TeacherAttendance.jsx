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
    const [students, setStudents] = useState([]); // List of { studentId, name, status, note }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
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
                setError("Failed to load classes.");
            }
        };
        fetchClasses();
    }, [user.role]);

    // Fetch Attendance or Class Roster when Class/Date changes
    useEffect(() => {
        if (!selectedClassId || !date) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Try to get existing attendance
                const { data: attendanceData } = await api.get(`/attendance/class/${selectedClassId}?date=${date}`);

                if (attendanceData.success && attendanceData.data.length > 0) {
                    const record = attendanceData.data[0];
                    if (record) {
                        const mappedStudents = record.records.map(r => ({
                            studentId: r.studentId._id,
                            name: r.studentId.name,
                            status: r.status,
                            note: r.note || ''
                        }));
                        setStudents(mappedStudents);
                        return; // Done
                    }
                }

                // 2. If no attendance, we need the roster.
                // We shouldn't rely on 'classes' list having full student objects populated deeply if the list is huge.
                // Safer to fetch the specific class details again or check if we already have it.
                // The /classes/my endpoint usually populates students.
                const currentClass = classes.find(c => c._id === selectedClassId);

                if (currentClass && currentClass.students && currentClass.students.length > 0) {
                    const roster = currentClass.students.map(s => ({
                        studentId: s._id,
                        name: s.name,
                        status: 'Present', // Default to Present for new day
                        note: ''
                    }));
                    setStudents(roster);
                } else {
                    // Fallback check: fetch class details explicitly in case list didn't populate
                    const { data: classDetail } = await api.get(`/classes/${selectedClassId}`);
                    if (classDetail.success && classDetail.data.students.length > 0) {
                        const roster = classDetail.data.students.map(s => ({
                            studentId: s._id,
                            name: s.name,
                            status: 'Present',
                            note: ''
                        }));
                        setStudents(roster);
                    } else {
                        setStudents([]); // No students found
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data", error);
                // Don't show error if it's just 404 for attendance, but here we handled success check.
                // If API fails completely:
                setError("Failed to load attendance data.");
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
            // Optionally refetch or just stay as is
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
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                        >
                            {classes.length === 0 && <option value="">Loading classes...</option>}
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name} ({c.grade}-{c.section})</option>
                            ))}
                        </select>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        {classes.length === 0 && !error && <p className="text-xs text-gray-400 mt-1">Found 0 classes.</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                            type="date"
                        />
                    </div>
                    <button className="w-full md:w-auto bg-primary/10 text-primary font-medium py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 shadow-sm pointer-events-none opacity-80 border border-primary/20">
                        <Clock className="w-5 h-5" />
                        <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </button>
                </div>
            </motion.div>

            {/* Roster */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#111318] dark:text-white">
                                Student Roster
                            </h2>
                            <p className="text-[#616f89] dark:text-gray-400 text-sm mt-1">
                                {classes.find(c => c._id === selectedClassId)?.name || 'Select Class'} • {students.length} Students
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleMarkAll('Present')} className="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300">Mark All Present</button>
                            <button onClick={saveAttendance} disabled={saving || students.length === 0} className="py-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save Attendance"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3" scope="col">#</th>
                                <th className="px-6 py-3" scope="col">Student Name</th>
                                <th className="px-6 py-3 text-center" scope="col">Status</th>
                                <th className="px-6 py-3 text-center" scope="col">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /><p className="mt-2 text-gray-500">Loading roster...</p></td></tr>
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
                                        <td className="px-6 py-4 text-center">
                                            <input
                                                type="text"
                                                placeholder="Note..."
                                                className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-primary outline-none text-xs w-full max-w-[100px]"
                                                value={student.note || ''}
                                                onChange={(e) => setStudents(prev => prev.map(s => s.studentId === student.studentId ? { ...s, note: e.target.value } : s))}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        <p>No students found in this class.</p>
                                        <p className="text-xs mt-1">Contact admin if this is unexpected.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default TeacherAttendance;
