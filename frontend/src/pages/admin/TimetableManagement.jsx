import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Trash2, Save, Loader2, BookOpen, User, MoreVertical, Bell } from 'lucide-react';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const TimetableManagement = () => {
    // Data States
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [timetableData, setTimetableData] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    // UI States
    const [selectedClassId, setSelectedClassId] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);

    // Form States
    const [formState, setFormState] = useState({
        subjectId: '',
        teacherId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
    });

    const [eventForm, setEventForm] = useState({
        title: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        type: 'Other',
        description: ''
    });

    // Initial Data Fetch
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [clsRes, subjRes, teachRes, eventsRes] = await Promise.all([
                    api.get('/classes'),
                    api.get('/subjects'),
                    api.get('/users?role=Teacher'),
                    api.get('/events')
                ]);

                if (clsRes.data.success) {
                    const clsData = clsRes.data.data || clsRes.data.results || [];
                    setClasses(clsData);
                    if (clsData.length > 0) setSelectedClassId(clsData[0]._id);
                }

                if (subjRes.data.success) setSubjects(subjRes.data.data || subjRes.data.results || []);
                if (teachRes.data.success) setTeachers(teachRes.data.data || teachRes.data.results || []);
                if (eventsRes.data.success) setEvents(eventsRes.data.data || eventsRes.data.results || []);

            } catch (e) { console.error("Failed to load metadata", e); }
        };
        fetchMetadata();
    }, []);

    // Fetch Timetable when Class changes
    useEffect(() => {
        if (selectedClassId) {
            fetchTimetable();
        }
    }, [selectedClassId]);

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/timetables/class/${selectedClassId}`);
            if (data.success) {
                setTimetableData(data.data || []);
            } else {
                setTimetableData([]);
            }
        } catch (e) {
            console.error(e);
            setTimetableData([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            if (data.success) setEvents(data.data || data.results || []);
        } catch (e) { console.error(e); }
    };

    // Helper to get week days based on currentDate
    const getWeekDays = () => {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const weekDays = getWeekDays();
    const monthYear = weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Handlers
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

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', eventForm);
            alert("Event created successfully!");
            setIsEventModalOpen(false);
            setEventForm({
                title: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                type: 'Other',
                description: ''
            });
            fetchEvents();
        } catch (e) {
            console.error(e);
            alert("Failed to create event");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClassId) return alert("Please select a class first");

        try {
            // Determine day of week from selected date
            const dateObj = new Date(formState.date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = days[dateObj.getDay()];

            // Find existing periods for this day
            const existingDayData = timetableData.find(t => t.dayOfWeek === dayOfWeek);
            const currentPeriods = existingDayData ? existingDayData.periods : [];

            // prepare new period
            const newPeriod = {
                subjectId: formState.subjectId,
                teacherId: formState.teacherId,
                startTime: formState.startTime,
                endTime: formState.endTime,
                room: 'Default' // Adding default room
            };

            const updatedPeriods = [...currentPeriods, newPeriod];

            await api.post('/timetables', {
                classId: selectedClassId,
                dayOfWeek,
                periods: updatedPeriods
            });

            fetchTimetable();
            alert("Class added to timetable!");
            setFormState(prev => ({ ...prev, startTime: '', endTime: '' }));

        } catch (error) {
            console.error("Failed to add class", error);
            alert("Failed to add class");
        }
    };

    const handleDeletePeriod = async (dayOfWeek, periodId) => {
        if (!window.confirm("Delete this class?")) return;
        try {
            const dayData = timetableData.find(t => t.dayOfWeek === dayOfWeek);
            if (!dayData) return;

            const updatedPeriods = dayData.periods.filter(p => p._id !== periodId);

            await api.post('/timetables', {
                classId: selectedClassId,
                dayOfWeek,
                periods: updatedPeriods
            });
            fetchTimetable();
        } catch (e) {
            console.error(e);
        }
    };

    const colors = [
        'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300',
        'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300',
        'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
        'bg-orange-500/10 border-orange-500/20 text-orange-700 dark:text-orange-300',
        'bg-pink-500/10 border-pink-500/20 text-pink-700 dark:text-pink-300',
    ];

    return (
        <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">

            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable & Events</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsEventModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} />
                        Create Event
                    </button>

                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left: Calendar View */}
                <div className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-center bg-white dark:bg-card-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{monthYear}</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <button onClick={handlePrevWeek} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all shadow-sm"><ChevronLeft size={18} className="text-gray-600 dark:text-gray-300" /></button>
                                <button onClick={handleNextWeek} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all shadow-sm"><ChevronRight size={18} className="text-gray-600 dark:text-gray-300" /></button>
                            </div>
                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white">Week</button>
                                <button className="px-3 py-1.5 text-xs font-medium rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Day</button>
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
                        {loading ? (
                            <div className="p-20 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="min-w-[800px] flex flex-col">
                                    {/* Days Header */}
                                    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
                                        {weekDays.map((date, i) => (
                                            <div key={i} className={`p-4 text-center border-r border-gray-100 dark:border-gray-800 last:border-r-0 ${date.toDateString() === new Date().toDateString() ? 'bg-primary/5' : ''}`}>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                                <p className={`text-lg font-bold mt-1 ${date.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                                    {date.getDate()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Timetable Content */}
                                    <div className="grid grid-cols-7 bg-gray-50/50 dark:bg-gray-900/50 min-h-[500px]">
                                        {weekDays.map((date, i) => {
                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                                            const dayData = timetableData.find(t => t.dayOfWeek === dayName);
                                            const periods = dayData?.periods?.sort((a, b) => a.startTime.localeCompare(b.startTime)) || [];

                                            return (
                                                <div key={i} className="p-2 border-r border-gray-100 dark:border-gray-800 last:border-r-0 space-y-2">
                                                    {periods.map((period, idx) => {
                                                        const subject = subjects.find(s => s._id === (period.subjectId?._id || period.subjectId));
                                                        const randColor = colors[(subject?.name?.length || 0) % colors.length];

                                                        return (
                                                            <div key={idx} className={`p-3 rounded-lg border text-xs relative group transition-all hover:shadow-md cursor-pointer ${randColor}`}>
                                                                <div className="font-bold truncate text-sm mb-1">{subject?.name || 'Unknown'}</div>
                                                                <div className="opacity-90 font-medium">{period.startTime} - {period.endTime}</div>
                                                                <div className="mt-1 opacity-70 text-[10px]">{period.room || 'Room TBA'}</div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleDeletePeriod(dayName, period._id); }}
                                                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-black/10 rounded"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Create Form */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 sticky top-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create New Class</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Class Name</label>
                                <div className="relative">
                                    <select
                                        value={selectedClassId}
                                        onChange={(e) => setSelectedClassId(e.target.value)}
                                        className="w-full h-10 pl-3 pr-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    >
                                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Assign Subject</label>
                                <div className="relative">
                                    <select
                                        value={formState.subjectId}
                                        onChange={e => setFormState({ ...formState, subjectId: e.target.value })}
                                        className="w-full h-10 pl-3 pr-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                    </select>
                                    <BookOpen className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Assign Teacher</label>
                                <div className="relative">
                                    <select
                                        value={formState.teacherId}
                                        onChange={e => setFormState({ ...formState, teacherId: e.target.value })}
                                        className="w-full h-10 pl-3 pr-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        required
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                    <User className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={formState.date}
                                        onChange={e => setFormState({ ...formState, date: e.target.value })}
                                        className="w-full h-10 pl-3 pr-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1">Select date to set day of week recurrence.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Start Time</label>
                                    <input
                                        type="time"
                                        value={formState.startTime}
                                        onChange={e => setFormState({ ...formState, startTime: e.target.value })}
                                        className="w-full h-10 pl-2 pr-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">End Time</label>
                                    <input
                                        type="time"
                                        value={formState.endTime}
                                        onChange={e => setFormState({ ...formState, endTime: e.target.value })}
                                        className="w-full h-10 pl-2 pr-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Weekly Recurrence</span>
                                </label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setFormState(prev => ({ ...prev, startTime: '', endTime: '' }))} className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Clear</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">Add to Timetable</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Event Modal */}
            {isEventModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Event</h3>
                            <button onClick={() => setIsEventModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
                                <input
                                    required
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                    value={eventForm.title}
                                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                                    placeholder="e.g. Science Fair"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                        value={eventForm.startDate}
                                        onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                        value={eventForm.endDate}
                                        onChange={e => setEventForm({ ...eventForm, endDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <select
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                    value={eventForm.type}
                                    onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
                                >
                                    <option value="Other">Other</option>
                                    <option value="Holiday">Holiday</option>
                                    <option value="Exam">Exam</option>
                                    <option value="Meeting">Meeting</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                    value={eventForm.description}
                                    onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
                                    placeholder="Event details..."
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">Create Event</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default TimetableManagement;
