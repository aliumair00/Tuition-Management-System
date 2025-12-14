import React, { useState, useEffect, useRef } from 'react';
import { Edit, Loader2, AlertCircle, UserPlus, Check, X, Save, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const ParentSettings = () => {
    const navigate = useNavigate();
    const { user, checkAuth } = useAuth();
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    // States
    const [error, setError] = useState(null);
    const [children, setChildren] = useState([]);

    // Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchChildren = async () => {
            if (!user) return;
            setLoading(true);
            setError(null);
            try {
                const { data } = await api.get('/parent/children');
                if (data.success) {
                    setChildren(data.data);
                }
            } catch (err) {
                // Only log non-401 errors
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch children:', err);
                }
                setError(err.response?.data?.error?.message || 'Failed to load children data');
            } finally {
                setLoading(false);
            }
        };

        fetchChildren();
    }, [user]);

    const handleEditProfile = () => {
        setIsEditing(true);
        setUpdateMessage(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setUpdateMessage(null);
        // Reset form data to user data
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validations
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setUpdateMessage({ type: 'error', text: 'Image size should be less than 5MB' });
            return;
        }

        if (!file.type.startsWith('image/')) {
            setUpdateMessage({ type: 'error', text: 'Please upload an image file' });
            return;
        }

        setIsUploadingImage(true);
        setUpdateMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload Image
            const uploadRes = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (uploadRes.data.success) {
                const imageUrl = uploadRes.data.data.fileUrl;

                // 2. Update User Profile with new Image URL
                const updateRes = await api.put('/auth/updatedetails', {
                    ...user, // Keep existing user data
                    profileImageUrl: imageUrl
                });

                if (updateRes.data.success) {
                    await checkAuth(); // Refresh context
                    setUpdateMessage({ type: 'success', text: 'Profile picture updated!' });
                    setTimeout(() => setUpdateMessage(null), 3000);
                }
            }
        } catch (err) {
            console.error('Image upload failed:', err);
            setUpdateMessage({
                type: 'error',
                text: 'Failed to upload image. Please try again.'
            });
        } finally {
            setIsUploadingImage(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setUpdateMessage(null);
        try {
            const { data } = await api.put('/auth/updatedetails', formData);
            if (data.success) {
                await checkAuth(); // Refresh user data in context
                setIsEditing(false);
                setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });

                // Clear message after 3 seconds
                setTimeout(() => setUpdateMessage(null), 3000);
            }
        } catch (err) {
            console.error('Failed to update profile:', err);
            setUpdateMessage({
                type: 'error',
                text: err.response?.data?.error?.message || 'Failed to update profile. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewChildProfile = (childId) => {
        navigate(`/parent/children/${childId}`);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Manage your personal and contact information.</p>

                {updateMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg flex items-center gap-2 ${updateMessage.type === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                            }`}
                    >
                        {updateMessage.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                        <p className="font-medium">{updateMessage.text}</p>
                    </motion.div>
                )}
            </div>

            <div className="flex flex-col gap-8">
                {/* Profile Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6"
                >
                    <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex gap-4 items-center flex-1">
                            <div className="relative group">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 border-4 border-white dark:border-gray-700 shadow-sm"
                                    style={{
                                        backgroundImage: user.profileImageUrl
                                            ? `url(${user.profileImageUrl})`
                                            : `url("https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4A90E2&color=fff&size=200")`
                                    }}
                                ></div>
                                <button
                                    onClick={handleImageClick}
                                    disabled={isUploadingImage}
                                    className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Change Profile Picture"
                                >
                                    {isUploadingImage ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Camera size={16} />
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <div className="flex flex-col justify-center w-full max-w-md">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-gray-900 dark:text-white text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">{user.name}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Parent Account</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={isSaving}
                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                                    >
                                        <X size={16} className="mr-2" />
                                        <span>Cancel</span>
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors disabled:opacity-70"
                                    >
                                        {isSaving ? (
                                            <Loader2 size={16} className="animate-spin mr-2" />
                                        ) : (
                                            <Save size={16} className="mr-2" />
                                        )}
                                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEditProfile}
                                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <Edit size={16} className="mr-2" />
                                    <span className="truncate">Edit Profile</span>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Contact Information Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <header className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em]">Contact Information</h2>
                        {!isEditing && (
                            <button
                                onClick={handleEditProfile}
                                className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Edit size={16} />
                                <span className="truncate">Edit</span>
                            </button>
                        )}
                    </header>
                    <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            ) : (
                                <p className="text-base text-gray-900 dark:text-white">{user.email}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <p className="text-base text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Home Address</label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Enter your address"
                                />
                            ) : (
                                <p className="text-base text-gray-900 dark:text-white">{user.address || 'Not provided'}</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Linked Children Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    <header className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight tracking-[-0.015em]">Linked Children</h2>
                    </header>
                    <div className="p-4 sm:p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <AlertCircle className="text-red-500 mb-2" size={32} />
                                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                            </div>
                        ) : children.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <UserPlus size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
                                <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-2">No Children Linked</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                                    No students are currently linked to your account. Please contact the school administration to link your child(ren).
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {children.map((child) => (
                                    <div
                                        key={child._id}
                                        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
                                                style={{
                                                    backgroundImage: child.profileImageUrl
                                                        ? `url(${child.profileImageUrl})`
                                                        : `url("https://ui-avatars.com/api/?name=${encodeURIComponent(child.name)}&background=4A90E2&color=fff&size=150")`
                                                }}
                                            ></div>
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{child.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {child.classId?.name || 'No Class Assigned'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewChildProfile(child._id)}
                                            className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-3 bg-white dark:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] border border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                                        >
                                            <span className="truncate">View Full Profile</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ParentSettings;
