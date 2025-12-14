import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const StudentTimetable = () => {
    const { user } = useAuth();
    const [view, setView] = useState('Weekly View'); // 'Weekly View' or 'Daily View'
    const [schedule, setSchedule] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    const timeSlots = [
        "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00",
        "11:00 - 12:00", "12:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00"
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Helper to get start and end of the current week
    const getWeekRange = (date) => {
        const start = new Date(date);
        const day = start.getDay() || 7; // Get current day number, make Sunday 7
        if (day !== 1) start.setHours(-24 * (day - 1)); // Set to Monday
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Set to Sunday
        return { start, end };
    };

    const { start: weekStart, end: weekEnd } = getWeekRange(currentDate);

    const formatDateRange = (start, end) => {
        const options = { month: 'long', day: 'numeric' };
        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { ...options, year: 'numeric' })}`;
    };

    useEffect(() => {
        if (user && user.classId) {
            fetchTimetable();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/timetables/class/${user.classId}`);
            if (data.success) {
                const map = {};
                days.forEach(d => map[d] = []);
                data.data.forEach(d => {
                    if (map[d.dayOfWeek] !== undefined) map[d.dayOfWeek] = d.periods;
                });
                setSchedule(map);
            }
        } catch (e) { console.error("Timetable fetch error", e); }
        finally { setLoading(false); }
    };



    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const getClassForSlot = (day, slotStart) => {
        // Simple string matching: backend "09:00", frontend "09:00"
        if (!schedule[day]) return null;
        const startHour = parseInt(slotStart?.split(':')[0]);
        return schedule[day].find(p => parseInt(p.startTime?.split(':')[0]) === startHour);
    };

    // Color mapping for subjects (deterministic based on subject name char code sum)
    const getSubjectColor = (subjectName) => {
        const colors = [
            'bg-blue-600/20 border-blue-500 text-blue-400',
            'bg-purple-600/20 border-purple-500 text-purple-400',
            'bg-green-600/20 border-green-500 text-green-400',
            'bg-orange-600/20 border-orange-500 text-orange-400',
            'bg-pink-600/20 border-pink-500 text-pink-400',
            'bg-cyan-600/20 border-cyan-500 text-cyan-400',
        ];
        if (!subjectName) return colors[0];
        const sum = subjectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[sum % colors.length];
    };

    const dailyEvents = schedule[days[new Date().getDay() - 1]] || []; // Simple mapping for "Daily View" assuming Mon-Fri

    return (
        <div className="min-h-[80vh] bg-[#0f172a] rounded-3xl p-6 md:p-8 text-white font-sans shadow-2xl border border-gray-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Calendar className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-wide">My Timetable</h1>
                </div>
                <div className="flex items-center gap-3">

                    <div className="flex items-center gap-3 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <span className="text-sm font-medium text-gray-300">{user?.name || 'Student'}</span>
                    </div>
                </div>
            </div>

            {/* Navigation & Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-semibold text-gray-200 min-w-[200px] text-center">
                        {formatDateRange(weekStart, weekEnd)}
                    </span>
                    <button onClick={handleNextWeek} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="bg-gray-800/50 p-1 rounded-xl flex border border-gray-700">
                    {['Weekly View', 'Daily View'].map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${view === v
                                ? 'bg-gray-700 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-gray-500">
                            Loading schedule...
                        </div>
                    ) : view === 'Weekly View' ? (
                        <div className="grid grid-cols-[auto_repeat(5,1fr)] gap-4 overflow-x-auto min-w-[800px]">
                            {/* Header Row */}
                            <div className="text-gray-500 font-medium text-sm py-2">Time</div>
                            {days.map(d => (
                                <div key={d} className={`text-gray-400 font-medium text-sm py-2 text-center ${d === days[new Date().getDay() - 1] ? 'text-blue-400' : ''}`}>
                                    {d}
                                </div>
                            ))}

                            {/* Time Slots */}
                            {timeSlots.map((slot, index) => {
                                const slotStart = slot.split(' - ')[0];
                                return (
                                    <React.Fragment key={index}>
                                        <div className="text-gray-500 text-xs font-medium py-4">{slotStart}</div>
                                        {days.map(day => {
                                            const session = getClassForSlot(day, slotStart);
                                            const colorClass = getSubjectColor(session?.subjectId?.name);

                                            return (
                                                <div key={`${day}-${index}`} className="relative min-h-[100px]">
                                                    {session ? (
                                                        <div className={`absolute inset-0 m-1 rounded-xl border-l-4 p-3 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer ${colorClass} bg-opacity-10`}>
                                                            <div>
                                                                <p className="font-bold text-sm truncate">{session.subjectId?.name}</p>
                                                                <p className="text-xs opacity-80 mt-1">{session.startTime} - {session.endTime}</p>
                                                            </div>
                                                            <div className="flex items-center gap-1 mt-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>
                                                                <p className="text-xs opacity-70 truncate">Room {session.room || '101'}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="absolute inset-0 m-1 rounded-xl border border-gray-800/50 hover:bg-gray-800/20 transition-colors"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    ) : (
                        // Daily View (Simplified List)
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dailyEvents.length > 0 ? dailyEvents.map((session, idx) => (
                                <div key={idx} className={`p-6 rounded-2xl border border-gray-700 bg-gray-800/40 relative overflow-hidden group hover:border-gray-600 transition-all`}>
                                    <div className={`absolute top-0 left-0 w-1.5 h-full ${getSubjectColor(session.subjectId?.name).split(' ')[0].replace('/20', '')}`}></div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{session.subjectId?.name}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{session.teacherId?.name || 'Assigned Teacher'}</p>
                                        </div>
                                        <span className="bg-gray-700 text-gray-300 text-xs font-bold px-2 py-1 rounded-md">
                                            {session.startTime}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            Room {session.room || '101'}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-3 text-center py-20 text-gray-500">
                                    No classes scheduled for today.
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default StudentTimetable;
