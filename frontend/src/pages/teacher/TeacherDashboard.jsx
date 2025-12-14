import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

import {
    ClipboardCheck,
    Upload,
    Sigma,
    FlaskConical,
    Utensils
} from 'lucide-react';

const QuickActionBtn = ({ icon: Icon, label, primary = true }) => (
    <button className={`flex items-center justify-center gap-2 p-4 rounded-lg transition-colors font-medium
    ${primary
            ? 'bg-primary text-white hover:bg-primary/90'
            : 'bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30'
        }`}>
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </button>
);

const ClassCard = ({ title, students }) => (
    <div className="bg-background-light dark:bg-background-dark p-4 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
        <p className="font-semibold text-sm text-[#111318] dark:text-white">{title}</p>
        <p className="text-xs text-[#616f89] dark:text-gray-400">{students} Students</p>
    </div>
);

const ExamItem = ({ title, details }) => (
    <div className="flex items-center justify-between p-4 bg-background-light dark:bg-background-dark rounded-lg">
        <div>
            <p className="font-medium text-[#111318] dark:text-white">{title}</p>
            <p className="text-sm text-[#616f89] dark:text-gray-400">{details}</p>
        </div>
        <a className="text-sm text-primary font-medium hover:underline" href="#">View Details</a>
    </div>
);

const TimetableItem = ({ time, title, room, icon: Icon, type, isLast }) => {
    let iconBg = 'bg-gray-100 dark:bg-gray-800 text-[#616f89] dark:text-gray-400';
    if (type === 'class') iconBg = 'bg-primary/20 text-primary';

    return (
        <div className="grid grid-cols-[auto_1fr] gap-x-4">
            <div className="flex flex-col items-center gap-1">
                {type === 'start' && <div className="h-3"></div>}
                {/* Adjusting local vertical lines logic is tricky without precise CSS grid, 
            but following the design's visual flow: */}
                <div className={`p-1.5 rounded-full ${iconBg} z-10`}>
                    <Icon className="w-5 h-5" />
                </div>
                {!isLast && <div className="w-[2px] bg-gray-200 dark:bg-gray-700 h-full min-h-[40px]"></div>}
            </div>
            <div className={`flex flex-1 flex-col py-2 ${!isLast ? 'border-b border-dashed border-gray-200 dark:border-gray-700 pb-6 mb-2' : ''}`}>
                <p className={`text-base font-medium leading-normal ${type === 'class' ? 'text-primary' : 'text-[#111318] dark:text-white'}`}>
                    {title}
                </p>
                <p className="text-[#616f89] dark:text-gray-400 text-sm font-normal leading-normal">
                    {time} {room && `| ${room}`}
                </p>
            </div>
        </div>
    );
};

const TeacherDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        classes: [],
        upcomingExams: [],
        todaysTimetable: [],
        stats: {
            totalClasses: 0,
            totalStudents: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch classes (reusing existing endpoint if needed, or rely on analytics)
                // Actually, let's use the new analytics endpoint for everything to be efficient
                // But wait, the analytics endpoint returns class count, not full class list for the cards?
                // Let's check my implementation plan... I said "fetch classes (reusing existing endpoint)".
                // But let's see if I can do valid hybrid approach.
                // The analytics endpoint I wrote returns `classes.length` only for `totalClasses`.
                // So I still need to fetch `/classes/my` for the "My Classes" section.

                const [analyticsRes, classesRes] = await Promise.all([
                    api.get('/analytics/teacher'),
                    api.get('/classes/my')
                ]);

                if (analyticsRes.data.success) {
                    setDashboardData(prev => ({
                        ...prev,
                        upcomingExams: analyticsRes.data.data.upcomingExams,
                        todaysTimetable: analyticsRes.data.data.todaysTimetable,
                        stats: {
                            totalClasses: analyticsRes.data.data.totalClasses,
                            totalStudents: analyticsRes.data.data.totalStudents
                        }
                    }));
                }

                if (classesRes.data.success) {
                    setDashboardData(prev => ({
                        ...prev,
                        classes: classesRes.data.data
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Stats Row (Optional, if we want to show numbers) */}
                {/* 
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm">Total Classes</p>
                        <p className="text-2xl font-bold">{dashboardData.stats.totalClasses}</p>
                    </div>
                </div> 
                */}

                {/* Quick Actions */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <QuickActionBtn icon={ClipboardCheck} label="Mark Attendance" />
                        <QuickActionBtn icon={Upload} label="Upload Material" primary={false} />
                    </div>
                </div>

                {/* My Classes */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">My Classes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {dashboardData.classes.length > 0 ? (
                            dashboardData.classes.map((cls) => (
                                <ClassCard
                                    key={cls._id}
                                    title={cls.name}
                                    students={cls.students ? cls.students.length : 0}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-full">No classes assigned yet.</p>
                        )}
                    </div>
                </div>

                {/* Exams & Results */}
                <div className="bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Upcoming Exams</h2>
                    <div className="flex flex-col gap-4">
                        {dashboardData.upcomingExams.length > 0 ? (
                            dashboardData.upcomingExams.map((exam) => (
                                <ExamItem
                                    key={exam._id}
                                    title={`${exam.subjectId?.name || 'Subject'} - ${exam.title}`}
                                    details={`${exam.classId?.name || 'Class'} | ${new Date(exam.date).toLocaleDateString()}`}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm">No upcoming exams scheduled.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Today's Timetable */}
            <div className="lg:col-span-1 bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Today's Timetable</h2>
                <div className="flex flex-col pt-2">
                    {dashboardData.todaysTimetable.length > 0 ? (
                        dashboardData.todaysTimetable.map((period, index) => (
                            <TimetableItem
                                key={period._id}
                                type="class"
                                icon={Sigma}
                                title={`${period.className} - ${period.subject}`}
                                time={`${period.startTime} - ${period.endTime}`}
                                room={period.room}
                                isLast={index === dashboardData.todaysTimetable.length - 1}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                            <Utensils className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-sm">No classes scheduled for today.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
