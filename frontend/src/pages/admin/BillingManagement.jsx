import React, { useState, useEffect } from 'react';
import { FilePen, PlusCircle, Banknote, TrendingUp, CheckCircle, Clock, Search, Filter, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const BillingManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [students, setStudents] = useState([]);

    // Create Form Data
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        dueDate: '',
        classId: '' // We will auto-fill or let user select if student has multiple
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchInvoices();
        fetchStudents();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/invoices');
            if (data.success) setInvoices(data.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/users?role=Student');
            if (data.success) setStudents(data.data);
        } catch (error) { console.error(error); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            // Find classId from student if possible, or user must have provided
            // For simplicity, we get the classId from the selected student object
            const selectedStudent = students.find(s => s._id === formData.studentId);
            if (!selectedStudent || !selectedStudent.classId) {
                alert("Selected student is not assigned to a class.");
                setCreating(false);
                return;
            }

            await api.post('/invoices', {
                ...formData,
                classId: selectedStudent.classId
            });
            setShowCreateModal(false);
            setFormData({ studentId: '', amount: '', dueDate: '', classId: '' });
            alert("Invoice created!");
            fetchInvoices();
        } catch (error) {
            console.error(error);
            alert("Failed to create invoice.");
        } finally {
            setCreating(false);
        }
    };

    const handleMarkPaid = async (id) => {
        if (!window.confirm("Mark this invoice as PAID?")) return;
        try {
            await api.patch(`/invoices/${id}/pay`);
            fetchInvoices();
        } catch (error) {
            console.error(error);
            alert("Failed to update status.");
        }
    };

    // Stats
    const totalRevenue = invoices.filter(i => i.paid).reduce((acc, curr) => acc + curr.amount, 0);
    const paidCount = invoices.filter(i => i.paid).length;
    const pendingCount = invoices.filter(i => !i.paid).length;
    const pendingAmount = invoices.filter(i => !i.paid).reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fee & Invoice Management</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowCreateModal(true)} className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-semibold gap-2 hover:bg-primary-dark transition-colors shadow-sm">
                        <PlusCircle className="w-5 h-5" />
                        <span>Generate New Invoice</span>
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div variants={itemVariants} className="relative flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-bl-xl text-emerald-500 dark:text-emerald-400"><Banknote className="w-6 h-6" /></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Total Revenue</p>
                    <p className="text-gray-900 dark:text-white text-4xl font-bold">${totalRevenue.toLocaleString()}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-green-100 dark:bg-green-900/30 rounded-bl-xl text-green-500 dark:text-green-400"><CheckCircle className="w-6 h-6" /></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Paid Invoices</p>
                    <p className="text-gray-900 dark:text-white text-4xl font-bold">{paidCount}</p>
                </motion.div>
                <motion.div variants={itemVariants} className="relative flex flex-col gap-2 rounded-xl p-6 bg-card-light dark:bg-card-dark shadow-sm border border-border-light dark:border-border-dark overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-bl-xl text-amber-500 dark:text-amber-400"><Clock className="w-6 h-6" /></div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Pending Invoices</p>
                    <p className="text-gray-900 dark:text-white text-4xl font-bold">{pendingCount}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Totaling ${pendingAmount.toLocaleString()}</p>
                </motion.div>
            </div>

            {/* List */}
            <motion.div variants={itemVariants} className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                <div className="p-6 border-b border-border-light dark:border-border-dark flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-gray-900 dark:text-white text-xl font-bold">Invoice History</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage all student invoices.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3">Student</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-border-dark">
                            {loading ? <tr><td colSpan="5" className="p-4 text-center">Loading invoices...</td></tr> :
                                invoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {inv.studentId?.name}
                                            <span className="block text-xs text-gray-500">{inv.classId?.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">${inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium 
                                            ${inv.paid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                                                {inv.paid ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            {!inv.paid && <button onClick={() => handleMarkPaid(inv._id)} className="text-primary hover:underline font-medium">Mark Paid</button>}
                                        </td>
                                    </tr>
                                ))}
                            {!loading && invoices.length === 0 && <tr><td colSpan="5" className="p-4 text-center">No invoices found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg dark:text-white">Generate Invoice</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Student</label>
                                <select required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })}>
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount ($)</label>
                                <input required type="number" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="e.g. 500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Due Date</label>
                                <input required type="date" className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} />
                            </div>
                            <button type="submit" disabled={creating} className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex justify-center gap-2">
                                {creating && <Loader2 className="animate-spin w-5 h-5" />}
                                {creating ? 'Creating...' : 'Generate Invoice'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default BillingManagement;
