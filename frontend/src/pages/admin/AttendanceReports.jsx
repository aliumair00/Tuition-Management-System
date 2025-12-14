import React, { useState, useEffect } from 'react';
import { Filter, Download, FileText, Search, Bell, Loader2 } from 'lucide-react';
import api from '../../lib/api';

const AttendanceReports = () => {
    // Data States
    const [classes, setClasses] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [selectedClassId, setSelectedClassId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Aggregated Report Data
    const [studentStats, setStudentStats] = useState([]);

    // Initial Data Fetch
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/classes');
                if (data.success) {
                    setClasses(data.data || data.results || []);
                }
            } catch (e) { console.error("Failed to load classes", e); }
        };
        fetchClasses();
    }, []);

    // Generate Report Logic
    const generateReport = async () => {
        if (!selectedClassId) return alert("Please select a class");

        setLoading(true);
        try {
            // Fetch all attendance for the class
            const { data } = await api.get(`/attendance/class/${selectedClassId}`);
            if (data.success) {
                const records = data.data || [];
                setAttendanceRecords(records);
                processStats(records);
            }
        } catch (e) {
            console.error("Failed to fetch report", e);
            alert("Failed to fetch attendance data");
        } finally {
            setLoading(false);
        }
    };

    const processStats = (records) => {
        // Filter by Date Range if set
        let filteredRecords = records;
        if (startDate) {
            filteredRecords = filteredRecords.filter(r => r.date >= startDate);
        }
        if (endDate) {
            filteredRecords = filteredRecords.filter(r => r.date <= endDate);
        }

        const statsMap = {};

        filteredRecords.forEach(record => {
            record.records.forEach(studentRec => {
                // Handle populated vs unpopulated studentId
                const studentId = studentRec.studentId?._id || studentRec.studentId;
                const studentName = studentRec.studentId?.name || 'Unknown Student';

                if (!studentId) return;

                if (!statsMap[studentId]) {
                    statsMap[studentId] = {
                        id: studentId,
                        name: studentName,
                        totalDays: 0,
                        presentDays: 0,
                        absentDays: 0,
                        lateDays: 0,
                        excusedDays: 0
                    };
                }

                statsMap[studentId].totalDays++;
                if (studentRec.status === 'Present') statsMap[studentId].presentDays++;
                else if (studentRec.status === 'Absent') statsMap[studentId].absentDays++;
                else if (studentRec.status === 'Late') {
                    statsMap[studentId].lateDays++;
                    statsMap[studentId].presentDays++; // Counting late as present for % 
                }
                else if (studentRec.status === 'Excused') statsMap[studentId].excusedDays++;
            });
        });

        const statsArray = Object.values(statsMap).map(stat => {
            // Effective Total could exclude excused if desired, but sticking to standard attendance formula: Present / Total * 100
            const effectiveTotal = stat.totalDays;
            const pct = effectiveTotal > 0 ? Math.round((stat.presentDays / effectiveTotal) * 100) : 0;

            let status = 'Good';
            let color = 'green';

            if (pct >= 95) { status = 'Excellent'; color = 'green'; }
            else if (pct >= 85) { status = 'Good'; color = 'blue'; }
            else if (pct >= 75) { status = 'Average'; color = 'yellow'; }
            else { status = 'Low'; color = 'red'; }

            return { ...stat, pct, status, color };
        });

        // Sort by name
        statsArray.sort((a, b) => a.name.localeCompare(b.name));
        setStudentStats(statsArray);
    };

    // Handlers
    const handleClearFilters = () => {
        setSelectedClassId('');
        setStartDate('');
        setEndDate('');
        setStudentStats([]);
        setAttendanceRecords([]);
    };

    const handleExportCSV = () => {
        if (studentStats.length === 0) return alert("No data to export");

        const headers = ["Student Name", "Total Days", "Present", "Absent", "Late", "Percentage", "Status"];
        const rows = studentStats.map(s => [
            `"${s.name}"`, // Quote names to handle commas
            s.totalDays,
            s.presentDays,
            s.absentDays,
            s.lateDays,
            `${s.pct}%`,
            s.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="space-y-8">
            {/* Header / Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Reports</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">View and analyze student attendance records.</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Class</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white"
                        >
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={generateReport}
                            disabled={loading || !selectedClassId}
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold gap-2 hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
                            <span>Generate Report</span>
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span>Clear</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleExportCSV}
                            disabled={studentStats.length === 0}
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-emerald-600 text-white text-sm font-semibold gap-2 hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            disabled={studentStats.length === 0}
                            className="flex items-center justify-center rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-semibold gap-2 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileText className="w-4 h-4" />
                            <span>Print / PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Attendance Summary</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                            {selectedClassId ? (classes.find(c => c._id === selectedClassId)?.name || 'Class Report') : 'Select a class to view report'}
                            {startDate && ` • From ${startDate}`}
                            {endDate && ` • To ${endDate}`}
                        </p>
                    </div>
                    {studentStats.length > 0 && (
                        <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                            Total Students: {studentStats.length}
                        </div>
                    )}
                </div>

                {studentStats.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
                        <Search className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No Data to Display</p>
                        <p className="text-sm mt-1 max-w-sm mx-auto">Select a class and click "Generate Report" to see attendance statistics.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Student Name</th>
                                    <th scope="col" className="px-6 py-3 text-center">Total Days</th>
                                    <th scope="col" className="px-6 py-3 text-center">Attendance %</th>
                                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-light dark:divide-border-dark">
                                {studentStats.map((student, index) => (
                                    <tr key={student.id} className="bg-white dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{student.name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-mono text-xs">
                                                {student.presentDays} / {student.totalDays}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${student.color === 'green' ? 'bg-green-500' :
                                                                student.color === 'blue' ? 'bg-blue-500' :
                                                                    student.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${student.pct}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-medium text-gray-700 dark:text-gray-300 w-8">{student.pct}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${student.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    student.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                        student.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceReports;
