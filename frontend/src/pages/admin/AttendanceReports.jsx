import React from 'react';
import { Filter, Download, FileText, Search, Bell } from 'lucide-react';

const AttendanceReports = () => {
    return (
        <div className="space-y-8">
            {/* Header / Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Reports</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">View and analyze student attendance records.</p>
                </div>
                {/* Search and Notification - already in Layout, but we can add page-specific actions if needed */}
            </div>

            {/* Filters Section */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label htmlFor="class" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Class</label>
                        <select id="class" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white">
                            <option>Select Class</option>
                            <option>Class 10-A</option>
                            <option>Class 10-B</option>
                            <option>Class 9-A</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject</label>
                        <select id="subject" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white">
                            <option>Select Subject</option>
                            <option>Mathematics</option>
                            <option>Science</option>
                            <option>History</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="student" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Student</label>
                        <select id="student" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white">
                            <option>All Students</option>
                            <option>John Doe</option>
                            <option>Jane Smith</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date-range" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Date Range</label>
                        <input type="date" id="date-range" className="w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-gray-800 focus:ring-primary focus:border-primary text-sm p-2.5 text-gray-900 dark:text-white" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold gap-2 hover:bg-primary-dark transition-colors shadow-sm">
                            <Filter className="w-4 h-4" />
                            <span>Apply Filters</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm font-semibold gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <span>Clear Filters</span>
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-emerald-600 text-white text-sm font-semibold gap-2 hover:bg-emerald-700 transition-colors shadow-sm">
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-semibold gap-2 hover:bg-red-700 transition-colors shadow-sm">
                            <FileText className="w-4 h-4" />
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Class 10-A: Mathematics Attendance</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">October 2023</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                            <tr>
                                <th scope="col" className="px-6 py-3">Student Name</th>
                                <th scope="col" className="px-6 py-3">Student ID</th>
                                <th scope="col" className="px-6 py-3 text-center">Attendance %</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {[
                                { name: 'Alice Johnson', id: 'S-101', pct: 95, status: 'Excellent', color: 'green' },
                                { name: 'Bob Williams', id: 'S-102', pct: 90, status: 'Excellent', color: 'green' },
                                { name: 'Charlie Brown', id: 'S-103', pct: 78, status: 'Good', color: 'yellow' },
                                { name: 'Diana Miller', id: 'S-104', pct: 65, status: 'Warning', color: 'red' },
                                { name: 'Ethan Davis', id: 'S-105', pct: 98, status: 'Excellent', color: 'green' },
                            ].map((student, index) => (
                                <tr key={index} className="bg-white dark:bg-card-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{student.name}</td>
                                    <td className="px-6 py-4">{student.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        student.color === 'green' ? 'bg-green-500' : 
                                                        student.color === 'yellow' ? 'bg-yellow-400' : 'bg-red-500'
                                                    }`} 
                                                    style={{ width: `${student.pct}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 w-8">{student.pct}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                            student.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                            student.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a href="#" className="font-medium text-primary hover:underline">View</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReports;
