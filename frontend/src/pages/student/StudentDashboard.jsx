import React, { useState, useEffect } from 'react';
import { Download, FileText, Presentation, File } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState({ present: 0, total: 0, percentage: 0 });
    const [results, setResults] = useState([]);
    const [fees, setFees] = useState({ status: 'No Dues', nextDue: null, hasPending: false });
    const [timetable, setTimetable] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Attendance
                const attRes = await api.get('/attendance/my');
                if (attRes.data.success) {
                    const total = attRes.data.data.length;
                    const present = attRes.data.data.filter(r => r.status === 'Present').length;
                    setAttendance({
                        present,
                        total,
                        percentage: total > 0 ? Math.round((present / total) * 100) : 0
                    });
                }

                // 2. Fetch Results
                const resRes = await api.get('/results/my');
                if (resRes.data.success) {
                    setResults(resRes.data.data.slice(0, 1)); // Just latest one for now
                }

                // 3. Fetch Fees
                const feeRes = await api.get('/invoices/my');
                if (feeRes.data.success) {
                    const pending = feeRes.data.data.find(inv => !inv.paid);
                    if (pending) {
                        setFees({
                            status: 'Pending',
                            nextDue: new Date(pending.dueDate).toLocaleDateString(),
                            hasPending: true
                        });
                    } else if (feeRes.data.data.length > 0) {
                        setFees({
                            status: 'Paid',
                            nextDue: 'No upcoming dues',
                            hasPending: false
                        });
                    }
                }

                // 4. Fetch Timetable & Materials (Need Class ID)
                // Assuming user object has classId or we fetch it from profile
                // For simplified flow, if user has classId populated
                if (user?.classId) {
                    // Fetch Timetable (mocking calls for now as logic supports classId lookup)
                    const timeRes = await api.get(`/timetables/class/${user.classId}`);
                    if (timeRes.data.success) {
                        // Filter for today's day name if needed, or show all
                        // For dashboard we usually show "Today"
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const today = days[new Date().getDay()];
                        const todaySchedule = timeRes.data.data.find(t => t.dayOfWeek === today);
                        if (todaySchedule) setTimetable(todaySchedule.periods);
                    }

                    const matRes = await api.get(`/materials/class/${user.classId}`);
                    if (matRes.data.success) {
                        setMaterials(matRes.data.data.slice(0, 3));
                    }
                }

            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <p className="text-text-primary-light dark:text-text-primary-dark text-3xl font-bold tracking-tight">Welcome, {user?.name.split(' ')[0]}!</p>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark text-base font-normal">Here’s a summary of your academic progress.</p>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Attendance Card */}
                <div className="lg:col-span-1 bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Attendance</h3>
                    <div className="flex items-center justify-center relative py-4">
                        <svg className="transform -rotate-90 size-40" viewBox="0 0 120 120">
                            <circle className="stroke-border-light dark:stroke-[#2A3447]" cx="60" cy="60" fill="none" r="54" strokeWidth="12"></circle>
                            <circle cx="60" cy="60" fill="none" pathLength="100" r="54" stroke="#4A90E2" strokeDasharray={`${attendance.percentage} 100`} strokeLinecap="round" strokeWidth="12"></circle>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">{attendance.percentage}%</span>
                            <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Present</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">{attendance.present} / {attendance.total} Days Attended</p>
                    </div>
                </div>

                {/* Results & Fees Card */}
                <div className="lg:col-span-2 bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 flex flex-col gap-4 border border-border-light dark:border-border-dark">
                    <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">Results & Fees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {/* Results */}
                        <div className="bg-background-light dark:bg-background-dark p-5 rounded-lg flex flex-col justify-between">
                            <div>
                                <h4 className="text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">Recent Results</h4>
                                {results.length > 0 ? (
                                    <>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">{results[0].examId?.title}</p>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <p className="text-4xl font-bold text-text-primary-light dark:text-text-primary-dark">{results[0].score}</p>
                                            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">/ {results[0].totalMarks}</p>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500">No results yet.</p>
                                )}
                            </div>
                            <button className="mt-4 text-sm font-medium text-primary hover:underline text-left">View All Results</button>
                        </div>

                        {/* Fees */}
                        <div className="bg-background-light dark:bg-background-dark p-5 rounded-lg flex flex-col justify-between">
                            <div>
                                <h4 className="text-text-primary-light dark:text-text-primary-dark font-semibold mb-2">Fee Status</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`inline-flex items-center justify-center size-6 rounded-full ${fees.hasPending ? 'bg-red-500/20 text-red-500' : 'bg-accent-green/20 text-accent-green'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </span>
                                    <p className={`text-base font-bold ${fees.hasPending ? 'text-red-500' : 'text-accent-green'}`}>{fees.status}</p>
                                </div>
                                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">{fees.hasPending ? `Next due on ${fees.nextDue}` : 'No dues pending'}</p>
                            </div>
                            <button className="w-full mt-4 text-sm font-bold text-white bg-primary hover:bg-primary/90 py-2.5 px-4 rounded-lg transition-colors">Pay Fees Now</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Timetable Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 border border-border-light dark:border-border-dark">
                    <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold mb-4">Today's Timetable</h3>
                    <div className="flex flex-col gap-3">
                        {timetable.length > 0 ? timetable.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background-light dark:bg-background-dark hover:bg-opacity-80 transition-colors">
                                <div className="flex flex-col">
                                    <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">{item.subjectId?.name || 'Subject'}</p>
                                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{item.teacherId?.name || 'Teacher'}</p>
                                </div>
                                <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark bg-card-light dark:bg-card-dark px-3 py-1 rounded border border-border-light dark:border-border-dark">{item.startTime} - {item.endTime}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500">No classes scheduled for today.</p>
                        )}
                    </div>
                </div>

                {/* Study Materials Card */}
                <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-6 border border-border-light dark:border-border-dark">
                    <h3 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold mb-4">Study Materials</h3>
                    <div className="flex flex-col gap-3">
                        {materials.length > 0 ? materials.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded bg-background-light dark:bg-background-dark text-primary bg-opacity-10`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-text-primary-light dark:text-text-primary-dark text-sm group-hover:text-primary transition-colors">{item.title}</p>
                                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">By {item.uploadedBy?.name}</p>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center size-8 rounded-lg text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                                    <Download size={16} />
                                </button>
                            </div>
                        )) : (
                            <p className="text-sm text-gray-500">No materials uploaded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
