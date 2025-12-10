import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Bell, Clock, Trash2, Save, Loader2 } from 'lucide-react';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const TimetableManagement = () => {
    const [viewMode, setViewMode] = useState('timetable'); // 'timetable' or 'events'
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [timetable, setTimetable] = useState([]); // Periods for selected class/day
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);

    // Form states
    const [periodForm, setPeriodForm] = useState({ subjectId: '', teacherId: '', startTime: '', endTime: '', room: '' });
    const [eventForm, setEventForm] = useState({ title: '', startDate: '', endDate: '', type: 'Other', description: '' });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        fetchMetadata();
        fetchEvents();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchTimetable();
        }
    }, [selectedClassId, selectedDay]);

    const fetchMetadata = async () => {
        try {
            const [clsRes, subjRes, teachRes] = await Promise.all([
                api.get('/classes'),
                api.get('/subjects'),
                api.get('/users?role=Teacher')
            ]);
            if (clsRes.data.success) setClasses(clsRes.data.data);
            if (subjRes.data.success) setSubjects(subjRes.data.data);
            if (teachRes.data.success) setTeachers(teachRes.data.data);
        } catch (e) { console.error(e); }
    };

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            // Our API getClassTimetable returns ALL days. We need to filter locally or update API.
            // For simplicity, let's fetch all and filter client side
            const { data } = await api.get(`/timetables/class/${selectedClassId}`);
            if (data.success) {
                const dayData = data.data.find(t => t.dayOfWeek === selectedDay);
                setTimetable(dayData ? dayData.periods : []);
            }
        } catch (e) { console.error(e); setTimetable([]); }
        finally { setLoading(false); }
    };

    const fetchEvents = async () => {
        try {
            const { data } = await api.get('/events');
            if (data.success) setEvents(data.data);
        } catch (e) { console.error(e); }
    };

    const handleAddPeriod = async (e) => {
        e.preventDefault();
        try {
            // Optimistic update
            const newPeriod = { ...periodForm };
            const updatedPeriods = [...timetable, newPeriod];
            // We need to send ALL periods for the day to updateTimetable endpoint
            await api.post('/timetables', {
                classId: selectedClassId,
                dayOfWeek: selectedDay,
                periods: updatedPeriods
            });
            fetchTimetable();
            setPeriodForm({ subjectId: '', teacherId: '', startTime: '', endTime: '', room: '' });
        } catch (e) { console.error(e); alert("Failed to save period"); }
    };

    const handleDeletePeriod = async (idx) => {
        if (!confirm("Remove period?")) return;
        try {
            const updatedPeriods = timetable.filter((_, i) => i !== idx);
            await api.post('/timetables', {
                classId: selectedClassId,
                dayOfWeek: selectedDay,
                periods: updatedPeriods
            });
            fetchTimetable();
        } catch (e) { console.error(e); }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', eventForm);
            setEventForm({ title: '', startDate: '', endDate: '', type: 'Other', description: '' });
            alert("Event created");
            fetchEvents();
        } catch (e) { console.error(e); alert("Failed"); }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm("Delete event?")) return;
        try {
            await api.delete(`/events/${id}`);
            fetchEvents();
        } catch (e) { console.error(e); }
    };

    return (
        <motion.div className="flex flex-col gap-6" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable & Events</h2>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button onClick={() => setViewMode('timetable')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'timetable' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Timetable</button>
                    <button onClick={() => setViewMode('events')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'events' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>Events</button>
                </div>
            </motion.div>

            {viewMode === 'timetable' ? (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Timetable View */}
                    <motion.div variants={itemVariants} className="flex-1 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {days.map(day => (
                                    <button key={day} onClick={() => setSelectedDay(day)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border ${selectedDay === day ? 'bg-primary text-white border-primary' : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {!selectedClassId ? (
                            <div className="text-center py-20 text-gray-500">Please select a class to view/edit timetable.</div>
                        ) : (
                            <div className="space-y-4">
                                {loading ? <div className="text-center p-10"><Loader2 className="animate-spin mx-auto" /></div> :
                                    timetable.length > 0 ? (
                                        timetable.map((period, idx) => {
                                            const subj = subjects.find(s => s._id === period.subjectId);
                                            const teacher = teachers.find(t => t._id === period.teacherId);
                                            // Note: If backend populates, we use objects. Our update sends IDs.
                                            // getClassTimetable does populate. So period.subjectId is likely an object { _id, name }
                                            // Let's check safely
                                            const subjName = period.subjectId.name || (subjects.find(s => s._id === period.subjectId)?.name);
                                            const teachName = period.teacherId.name || (teachers.find(t => t._id === period.teacherId)?.name);

                                            return (
                                                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><Clock size={20} /></div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 dark:text-white">{subjName || 'Unknown Subject'}</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{teachName} • {period.room}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900 dark:text-white">{period.startTime} - {period.endTime}</p>
                                                        </div>
                                                        <button onClick={() => handleDeletePeriod(idx)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg"><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-center py-10 text-gray-500 italic">No periods scheduled for this day.</div>
                                    )}
                            </div>
                        )}
                    </motion.div>

                    {/* Add Period Form */}
                    {selectedClassId && (
                        <motion.div variants={itemVariants} className="w-full lg:w-80 bg-white dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 h-fit">
                            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Add Period</h3>
                            <form onSubmit={handleAddPeriod} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                                    <select required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={periodForm.subjectId} onChange={e => setPeriodForm({ ...periodForm, subjectId: e.target.value })}>
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Teacher</label>
                                    <select required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={periodForm.teacherId} onChange={e => setPeriodForm({ ...periodForm, teacherId: e.target.value })}>
                                        <option value="">Select Teacher</option>
                                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start</label>
                                        <input required type="time" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={periodForm.startTime} onChange={e => setPeriodForm({ ...periodForm, startTime: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End</label>
                                        <input required type="time" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={periodForm.endTime} onChange={e => setPeriodForm({ ...periodForm, endTime: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Room</label>
                                    <input type="text" placeholder="e.g. 101" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={periodForm.room} onChange={e => setPeriodForm({ ...periodForm, room: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark">Add to {selectedDay}</button>
                            </form>
                        </motion.div>
                    )}
                </div>
            ) : (
                /* Events View */
                <div className="flex flex-col lg:flex-row gap-6">
                    <motion.div variants={itemVariants} className="flex-1 bg-white dark:bg-card-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upcoming Events</h3>
                        <div className="space-y-4">
                            {events.map(ev => (
                                <div key={ev._id} className="flex items-start justify-between p-4 border-l-4 border-primary bg-gray-50 dark:bg-gray-800/50 rounded-r-lg">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{ev.title} <span className="text-xs font-normal text-gray-500 ml-2 py-0.5 px-2 bg-gray-200 dark:bg-gray-700 rounded-full">{ev.type}</span></h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ev.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1"><CalendarIcon size={12} /> {new Date(ev.startDate).toLocaleDateString()} - {new Date(ev.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleDeleteEvent(ev._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-gray-500 text-center">No events found.</p>}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="w-full lg:w-80 bg-white dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 h-fit">
                        <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Create Event</h3>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
                                <input required className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
                                <select className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })}>
                                    <option>Other</option>
                                    <option>Holiday</option>
                                    <option>Exam</option>
                                    <option>Meeting</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Start</label>
                                    <input required type="date" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={eventForm.startDate} onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">End</label>
                                    <input required type="date" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={eventForm.endDate} onChange={e => setEventForm({ ...eventForm, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                <textarea rows="3" className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark">Create Event</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default TimetableManagement;
