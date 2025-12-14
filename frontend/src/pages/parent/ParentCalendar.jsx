import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const ParentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        Holiday: true,
        Exam: true,
        Meeting: true,
        Other: true
    });

    // Helper to get days in month
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    // Filter colors mapping
    const eventColors = {
        Holiday: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200',
        Exam: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200',
        Meeting: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200',
        Other: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-200'
    };

    const eventIcons = {
        Holiday: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
        Exam: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
        Meeting: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
        Other: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30'
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/events');
            if (data.success) {
                setEvents(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const toggleFilter = (type) => {
        setSelectedFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const getEventsForDay = (day) => {
        return events.filter(event => {
            if (!selectedFilters[event.type]) return false;
            const eventDate = new Date(event.startDate);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const getUpcomingEvents = () => {
        const today = new Date();
        return events
            .filter(event => new Date(event.startDate) >= today)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            .slice(0, 3);
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Calendar Section */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 flex flex-col">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">School Calendar & Events</p>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                        <button onClick={goToToday} className="h-10 px-4 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">Today</button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px flex-1 border-t border-l border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700">
                    {/* Calendar Header */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-center py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for previous month */}
                    {[...Array(firstDay)].map((_, i) => (
                        <div key={`prev-${i}`} className="p-2 min-h-[100px] sm:h-28 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50">
                        </div>
                    ))}

                    {/* Current Month Days */}
                    {[...Array(days)].map((_, i) => {
                        const day = i + 1;
                        const dayEvents = getEventsForDay(day);

                        return (
                            <div key={`curr-${day}`} className="p-2 min-h-[100px] sm:h-28 bg-white dark:bg-gray-800 relative group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <span className={`font-semibold text-sm ${isToday(day) ? 'bg-primary text-white rounded-full size-7 flex items-center justify-center' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {day}
                                </span>
                                <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                    {dayEvents.map(event => (
                                        <div
                                            key={event._id}
                                            className={`text-xs p-1 rounded truncate cursor-help ${eventColors[event.type] || eventColors.Other}`}
                                            title={`${event.title} (${event.type})`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Next Month Days to fill grid - simplified */}
                    {[...Array(42 - days - firstDay)].map((_, i) => (
                        <div key={`next-${i}`} className="p-2 min-h-[100px] sm:h-28 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900/50">
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar with Filters and Upcoming Events */}
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Event Filters</h3>
                    <div className="flex flex-col gap-3">
                        {Object.keys(selectedFilters).map(type => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedFilters[type]}
                                    onChange={() => toggleFilter(type)}
                                    className={`form-checkbox h-5 w-5 rounded border-gray-300 focus:ring-opacity-50
                                        ${type === 'Holiday' ? 'text-green-500 focus:ring-green-500' :
                                            type === 'Exam' ? 'text-yellow-500 focus:ring-yellow-500' :
                                                type === 'Meeting' ? 'text-purple-500 focus:ring-purple-500' :
                                                    'text-orange-500 focus:ring-orange-500'}`}
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {type === 'Other' ? 'School Events' : type + 's'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Upcoming Events</h3>
                    <div className="flex flex-col gap-4">
                        {getUpcomingEvents().length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events scheduled.</p>
                        ) : (
                            getUpcomingEvents().map(event => {
                                const date = new Date(event.startDate);
                                return (
                                    <div key={event._id} className="flex gap-4 items-start">
                                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center ${eventIcons[event.type] || eventIcons.Other}`}>
                                            <span className="text-xs font-bold uppercase">{monthNames[date.getMonth()].slice(0, 3)}</span>
                                            <span className="text-xl font-extrabold">{date.getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{event.title}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentCalendar;
