import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Monitor, FlaskConical } from 'lucide-react';
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

const StudentTimetable = () => {
    const { user } = useAuth();
    const [view, setView] = useState('Timetable'); // 'Timetable' or 'Events'
    const [schedule, setSchedule] = useState({});
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const timeSlots = [
        "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00",
        "11:00 - 12:00", "12:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00"
    ];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        if (user && user.classId) {
            fetchTimetable();
        } else {
            setLoading(false);
        }
        fetchEvents();
    }, [user]);

    const fetchTimetable = async () => {
        try {
            const { data } = await api.get(`/timetables/class/${user.classId}`);
            if (data.success) {
                const map = {};
                days.forEach(d => map[d] = []);
                data.data.forEach(d => {
                    if (map[d.dayOfWeek] !== undefined) map[d.dayOfWeek] = d.periods;
                });
                setSchedule(map);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            if (data.success) setEvents(data.data);
        } catch (e) { console.error(e); }
    };

    const getClassForSlot = (day, slotStart) => {
        // Simple string matching for demo: backend: "09:00", frontend: "09:00"
        const startHour = parseInt(slotStart.split(':')[0]);
        const periods = schedule[day] || [];
        return periods.find(p => parseInt(p.startTime.split(':')[0]) === startHour);
    };

    return (
        <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight">My Schedule & Events</h2>
                </div>
                <div className="flex w-full md:w-auto items-center gap-2">
                    <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-200/80 dark:bg-gray-800 p-1">
                        {['Timetable', 'Events'].map((v) => (
                            <label key={v} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-3 text-sm font-medium leading-normal transition-all ${view === v ? 'bg-white dark:bg-gray-900 shadow-sm text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                                <span className="truncate">{v}</span>
                                <input className="invisible w-0" type="radio" name="view-toggle" value={v} checked={view === v} onChange={() => setView(v)} />
                            </label>
                        ))}
                    </div>
                </div>
            </motion.div>

            {view === 'Timetable' ? (
                <motion.div variants={itemVariants} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                    <div className="overflow-x-auto">
                        {loading ? <div className="p-10 text-center">Loading...</div> :
                            !user.classId ? <div className="p-10 text-center">You are not assigned to any class.</div> :
                                (
                                    <table className="w-full flex-1">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900/40">
                                                <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 w-28 text-sm font-medium leading-normal">Time</th>
                                                {days.map(d => <th key={d} className="px-4 py-3 text-left text-gray-600 dark:text-gray-300 min-w-[150px] w-1/5 text-sm font-medium leading-normal">{d}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {timeSlots.map((slot, idx) => {
                                                const slotStart = slot.split(' - ')[0]; // "08:00"
                                                return (
                                                    <tr key={idx} className="h-28">
                                                        <td className="px-4 py-2 text-gray-500 dark:text-gray-400 text-sm align-top">{slotStart}</td>
                                                        {days.map(day => {
                                                            const session = getClassForSlot(day, slotStart);
                                                            return (
                                                                <td key={day} className="px-2 py-2 align-top">
                                                                    {session && (
                                                                        <div className="group cursor-pointer rounded-lg p-2 transition-all hover:shadow-lg bg-blue-100/60 dark:bg-blue-900/30 border-l-4 border-blue-400">
                                                                            <p className="font-semibold text-blue-800 dark:text-blue-200 text-sm">{session.subjectId?.name}</p>
                                                                            <p className="text-xs text-blue-600 dark:text-blue-300">{session.startTime} - {session.endTime}</p>
                                                                            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Room {session.room}</p>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            )
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                )}
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((ev) => (
                        <motion.div variants={itemVariants} key={ev._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-2 h-full ${ev.type === 'Holiday' ? 'bg-green-500' : ev.type === 'Exam' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <div className="pl-4">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${ev.type === 'Holiday' ? 'bg-green-100 text-green-700' : ev.type === 'Exam' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{ev.type}</span>
                                <h3 className="text-xl font-bold mt-3 text-gray-900 dark:text-white">{ev.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{ev.description}</p>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-sm text-gray-600 dark:text-gray-300">
                                    <span>{new Date(ev.startDate).toLocaleDateString()}</span>
                                    {ev.startDate !== ev.endDate && <span className="mx-2">-</span>}
                                    {ev.startDate !== ev.endDate && <span>{new Date(ev.endDate).toLocaleDateString()}</span>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {events.length === 0 && <div className="col-span-3 text-center py-10 text-gray-500">No upcoming events.</div>}
                </div>
            )}
        </motion.div>
    );
};

export default StudentTimetable;
