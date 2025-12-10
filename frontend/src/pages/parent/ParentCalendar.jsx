import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const ParentCalendar = () => {
    const [current, setCurrent] = useState(() => {
        const d = new Date();
        return { year: d.getFullYear(), month: d.getMonth() };
    });
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                if (data.success) setEvents(data.data);
            } catch (e) {}
        };
        fetchEvents();
    }, []);

    const monthName = new Date(current.year, current.month, 1).toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
    const firstDayIndex = new Date(current.year, current.month, 1).getDay();
    const prevMonthDays = Array.from({ length: firstDayIndex }).map((_, i) => {
        const prevMonthLastDay = new Date(current.year, current.month, 0).getDate();
        return prevMonthLastDay - firstDayIndex + 1 + i;
    });
    const nextFillCount = Math.max(0, 42 - (prevMonthDays.length + daysInMonth + 7));
    const getEventsForDay = (day) => {
        const start = new Date(current.year, current.month, day);
        return events.filter(e => {
            const sd = new Date(e.startDate);
            return sd.getFullYear() === start.getFullYear() && sd.getMonth() === start.getMonth() && sd.getDate() === start.getDate();
        });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Calendar Section */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">School Calendar & Events</p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                        <button className="h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">Today</button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{monthName} {current.year}</h3>
                    <div className="hidden sm:flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <button className="px-3 py-1 rounded text-sm bg-white dark:bg-primary/20 dark:text-primary shadow-sm font-semibold text-primary">Month</button>
                        <button className="px-3 py-1 rounded text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Week</button>
                        <button className="px-3 py-1 rounded text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Day</button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px flex-1 border-t border-l border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700">
                    {/* Calendar Header */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                            {day}
                        </div>
                    ))}

                    {[...prevMonthDays].map((d) => (
                        <div key={`prev-${d}`} className="p-2 min-h-[100px] sm:h-28 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                            {d}
                        </div>
                    ))}

                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const dayEvents = getEventsForDay(day);

                        return (
                            <div key={`curr-${day}`} className="p-2 min-h-[100px] sm:h-28 bg-white dark:bg-gray-800 relative group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <span className={`font-semibold text-sm text-gray-700 dark:text-gray-300`}>
                                    {day}
                                </span>
                                {dayEvents.slice(0,2).map((ev) => (
                                    <div key={ev._id} className={`mt-1 text-xs p-1 rounded truncate ${
                                        ev.type === 'Exam' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200' :
                                        ev.type === 'Holiday' ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' :
                                        ev.type === 'Meeting' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200' :
                                        'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200'
                                    }`}>
                                        {ev.title}
                                    </div>
                                ))}
                            </div>
                        );
                    })}

                    {[...Array(Math.max(0, 42 - (prevMonthDays.length + daysInMonth)))].map((_, i) => (
                        <div key={`next-${i + 1}`} className="p-2 min-h-[100px] sm:h-28 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500">
                            {i + 1}
                        </div>
                    ))}

                </div>
            </div>

            {/* Sidebar with Filters and Upcoming Events */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Event Filters</h3>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input defaultChecked className="form-checkbox h-5 w-5 rounded text-green-500 border-gray-300 focus:ring-green-500" type="checkbox" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Holidays</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input defaultChecked className="form-checkbox h-5 w-5 rounded text-yellow-500 border-gray-300 focus:ring-yellow-500" type="checkbox" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Exams</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input defaultChecked className="form-checkbox h-5 w-5 rounded text-purple-500 border-gray-300 focus:ring-purple-500" type="checkbox" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Meetings</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input defaultChecked className="form-checkbox h-5 w-5 rounded text-orange-500 border-gray-300 focus:ring-orange-500" type="checkbox" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">School Events</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Upcoming Events</h3>
                    <div className="flex flex-col gap-4">
                        {events.slice(0,5).map(ev => {
                            const d = new Date(ev.startDate);
                            const mon = d.toLocaleString('default', { month: 'short' }).toUpperCase();
                            const day = d.getDate();
                            const color = ev.type === 'Meeting' ? 'purple' : ev.type === 'Holiday' ? 'green' : ev.type === 'Exam' ? 'yellow' : 'orange';
                            return (
                                <div key={ev._id} className="flex gap-4 items-start">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex flex-col items-center justify-center text-${color}-600 dark:text-${color}-400`}>
                                        <span className="text-xs font-bold uppercase">{mon}</span>
                                        <span className="text-xl font-extrabold">{day}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900 dark:text-white">{ev.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{ev.type}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentCalendar;
