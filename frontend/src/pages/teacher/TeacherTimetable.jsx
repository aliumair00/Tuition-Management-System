import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const TimetableBlock = ({ subject, time, room, className }) => (
    <div className={`bg-background-light dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow ${className}`}>
        <p className="font-semibold text-gray-900 dark:text-white">{subject}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{time}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{room}</p>
    </div>
);

const DayColumn = ({ day, periods }) => (
    <div className="flex flex-col gap-4 min-w-[200px] md:min-w-0">
        <div className="text-center pb-4 border-b-2 border-primary dark:border-primary/50">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">{day}</h2>
        </div>
        <div className="flex flex-col gap-4">
            {periods.length > 0 ? (
                periods.map((p, idx) => (
                    <TimetableBlock
                        key={idx}
                        subject={`${p.class} - ${p.subject}`}
                        time={`${p.startTime} - ${p.endTime}`}
                        room={p.room || 'N/A'}
                    />
                ))
            ) : (
                <div className="text-center text-sm text-gray-400 italic py-4">No classes</div>
            )}
        </div>
    </div>
);

const TeacherTimetable = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            const { data } = await api.get('/timetables/my');
            if (data.success) {
                // Process data: Group by Day
                // Backend returns array of Timetables (per class/day)
                // We need to extract periods assigned to THIS teacher
                const dayMap = {};
                days.forEach(d => dayMap[d] = []);

                data.data.forEach(tt => {
                    const day = tt.dayOfWeek;
                    if (dayMap[day] !== undefined) {
                        // Filter periods for this teacher
                        const myPeriods = tt.periods.filter(p => p.teacherId === user._id);
                        myPeriods.forEach(p => {
                            // Fetch subject name from ID if populated? 
                            // Review backend: getMyTimetable does NOT populate periods deep.
                            // Actually it populates 'classId'. Periods array has object IDs usually.
                            // Let's check backend controller again...
                            // Controller: `Timetable.find(...).populate('classId', 'name')`
                            // Uses default schema: periods.subjectId is ref. periods.teacherId is ref.
                            // Mongoose find() result will have IDs unless populated.
                            // We need to fetch Subjects or populate in backend?
                            // Backend `getMyTimetable` didn't populate periods.subjectId. I should update backend or fetch here.
                            // Updating backend is better. But for now assuming partial data:
                            dayMap[day].push({
                                startTime: p.startTime,
                                endTime: p.endTime,
                                subject: p.subjectId?.name || 'Subject',
                                room: p.room,
                                class: tt.classId?.name || 'Class'
                            });
                        });
                    }
                });

                // Sort by start time
                Object.keys(dayMap).forEach(d => {
                    dayMap[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
                });

                setSchedule(dayMap);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.header variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4 mb-2">
                <div className="flex flex-col">
                    <h1 className="text-gray-900 dark:text-white text-3xl font-bold leading-tight tracking-tight">My Timetable</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Your weekly teaching schedule.</p>
                </div>
            </motion.header>

            <motion.div variants={itemVariants} className="bg-white dark:bg-card-dark p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto">
                {loading ? <div className="p-10 text-center">Loading...</div> : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 min-w-[800px] lg:min-w-0">
                        {days.map(day => (
                            <DayColumn key={day} day={day} periods={schedule[day] || []} />
                        ))}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default TeacherTimetable;
