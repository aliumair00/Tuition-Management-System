import React, { useState, useEffect } from 'react';
import {
    Download,
    TrendingUp,
    ChevronDown,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const StudentResults = () => {
    const { user } = useAuth();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        overallGrade: '-',
        gpa: '-',
        percentage: '-',
        totalExams: 0
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/results/my');
                if (data.success) {
                    const fetchedResults = data.data || [];
                    setResults(fetchedResults);
                    calculateStats(fetchedResults);
                }
            } catch (error) {
                console.error("Failed to fetch results", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchResults();
    }, [user]);

    const calculateStats = (data) => {
        if (!data.length) return;

        let totalMarksObtained = 0;
        let totalMaxMarks = 0;

        data.forEach(result => {
            totalMarksObtained += result.score;
            totalMaxMarks += result.totalMarks;
        });

        const percentage = totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;

        // Simple GPA Calculation (4.0 Scale approximation)
        let gpa = (percentage / 20) - 1;
        if (gpa < 0) gpa = 0;
        if (gpa > 4.0) gpa = 4.0;

        // Grade Calculation
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B';
        else if (percentage >= 60) grade = 'C';
        else if (percentage >= 50) grade = 'D';

        setStats({
            overallGrade: grade,
            gpa: gpa.toFixed(2) + '/4.0',
            percentage: Math.round(percentage) + '%',
            totalExams: data.length
        });
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 80) return "text-green-600 dark:text-green-400";
        if (percentage >= 60) return "text-blue-600 dark:text-blue-400";
        if (percentage >= 50) return "text-orange-600 dark:text-orange-400";
        return "text-red-600 dark:text-red-400";
    };

    const handleDownloadReport = () => {
        if (results.length === 0) {
            alert("No results data available to download.");
            return;
        }

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(`Academic Results Report - ${user?.name || 'Student'}`, 14, 22);

        doc.setFontSize(11);
        doc.text(`Student ID: ${user?._id?.substring(18).toUpperCase() || 'N/A'}`, 14, 30);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);

        // Stats Box
        doc.setDrawColor(200);
        doc.setFillColor(245, 247, 250);
        doc.rect(14, 42, 180, 24, 'FD');

        doc.setFontSize(10);
        doc.text(`Overall Grade: ${stats.overallGrade}`, 20, 52);
        doc.text(`GPA: ${stats.gpa}`, 70, 52);
        doc.text(`Percentage: ${stats.percentage}`, 120, 52);
        doc.text(`Total Exams: ${stats.totalExams}`, 160, 52);

        // Prepare table data
        const tableData = results.map(result => {
            const percent = (result.score / result.totalMarks) * 100;
            let grade = 'F';
            if (percent >= 90) grade = 'A+';
            else if (percent >= 80) grade = 'A';
            else if (percent >= 70) grade = 'B';
            else if (percent >= 60) grade = 'C';
            else if (percent >= 50) grade = 'D';

            return [
                result.examId?.title || 'Unknown Exam',
                new Date(result.createdAt).toLocaleDateString(),
                result.score,
                result.totalMarks,
                `${Math.round(percent)}%`,
                grade
            ];
        });

        // Add table
        doc.autoTable({
            startY: 75,
            head: [['Exam / Subject', 'Date', 'Marks', 'Total', 'Percentage', 'Grade']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] }, // Blue header
        });

        doc.save('student_results_report.pdf');
    };

    return (
        <motion.div
            className="flex flex-col gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Page Heading */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-between gap-4 items-center mb-4">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">My Results</p>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal leading-normal">Welcome, {user?.name}!</p>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[
                    { label: "Overall Grade", value: stats.overallGrade },
                    { label: "GPA", value: stats.gpa },
                    { label: "Percentage", value: stats.percentage },
                    { label: "Total Exams", value: stats.totalExams }
                ].map((stat, idx) => (
                    <div key={idx} className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <p className="text-slate-500 dark:text-slate-400 text-base font-medium leading-normal">{stat.label}</p>
                        <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight">
                            {stat.value}
                            {stat.sub && <span className="text-slate-400 dark:text-slate-500 text-xl font-medium">{stat.sub}</span>}
                        </p>
                    </div>
                ))}
            </motion.div>

            {/* Detailed Results */}
            <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center pb-3 pt-8">
                    <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Detailed Results</h2>
                    <button
                        onClick={handleDownloadReport}
                        className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary px-4 text-white hover:bg-primary/90"
                    >
                        <Download size={20} />
                        <p className="text-white text-sm font-medium leading-normal">Download Report</p>
                    </button>
                </div>
                <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading results...</div>
                    ) : results.length > 0 ? (
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold" scope="col">Subject / Exam</th>
                                    <th className="px-6 py-4 font-semibold text-center" scope="col">Marks Obtained</th>
                                    <th className="px-6 py-4 font-semibold text-center" scope="col">Total Marks</th>
                                    <th className="px-6 py-4 font-semibold text-center" scope="col">Percentage</th>
                                    <th className="px-6 py-4 font-semibold text-center" scope="col">Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result, idx) => {
                                    const percent = (result.score / result.totalMarks) * 100;
                                    let grade = 'F';
                                    if (percent >= 90) grade = 'A+';
                                    else if (percent >= 80) grade = 'A';
                                    else if (percent >= 70) grade = 'B';
                                    else if (percent >= 60) grade = 'C';
                                    else if (percent >= 50) grade = 'D';

                                    return (
                                        <tr key={result._id || idx} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                            <th className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap" scope="row">
                                                {result.examId?.title || 'Unknown Exam'}
                                                <span className="block text-xs font-normal text-slate-500">Date: {new Date(result.createdAt).toLocaleDateString()}</span>
                                            </th>
                                            <td className="px-6 py-4 text-center">{result.score}</td>
                                            <td className="px-6 py-4 text-center">{result.totalMarks}</td>
                                            <td className="px-6 py-4 text-center">{Math.round(percent)}%</td>
                                            <td className={`px-6 py-4 text-center font-bold ${getGradeColor(percent)}`}>{grade}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                            <AlertCircle size={48} className="mb-4 text-slate-300" />
                            <p className="text-lg font-medium">No results found</p>
                            <p className="text-sm">You haven't taken any exams yet.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StudentResults;
