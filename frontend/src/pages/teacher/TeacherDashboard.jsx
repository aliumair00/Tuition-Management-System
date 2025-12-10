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
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const { data } = await api.get('/classes/my');
                if (data.success) {
                    setClasses(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch classes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
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
                        {loading ? (
                            <p className="text-gray-500">Loading classes...</p>
                        ) : classes.length > 0 ? (
                            classes.map((cls) => (
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
                        <ExamItem title="Algebra II - Midterm" details="Grade 10 | Oct 25, 2023" />
                        <ExamItem title="Physics - Unit Test" details="Grade 11 | Nov 2, 2023" />
                    </div>
                </div>
            </div>

            {/* Right Column: Today's Timetable */}
            <div className="lg:col-span-1 bg-white dark:bg-card-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
                <h2 className="text-[#111318] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] mb-4">Today's Timetable</h2>
                <div className="flex flex-col pt-2">
                    <TimetableItem
                        type="class"
                        icon={Sigma}
                        title="Grade 10 - Algebra II"
                        time="09:00 AM - 10:30 AM"
                        room="Room 201"
                    />
                    <TimetableItem
                        type="class"
                        icon={FlaskConical}
                        title="Grade 11 - Physics"
                        time="10:45 AM - 12:15 PM"
                        room="Lab B"
                    />
                    <TimetableItem
                        type="break"
                        icon={Utensils}
                        title="Lunch Break"
                        time="12:15 PM - 01:00 PM"
                    />
                    <TimetableItem
                        type="class"
                        icon={Sigma}
                        title="Grade 10 - Algebra II"
                        time="01:00 PM - 02:30 PM"
                        room="Room 201"
                        isLast={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
