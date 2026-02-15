import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalPortfolios: 0, loading: true });

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    // Resume State
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeMessage, setResumeMessage] = useState({ type: '', text: '' });

    // Analysis State
    const [targetRole, setTargetRole] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisMessage, setAnalysisMessage] = useState({ type: '', text: '' });

    const handleAnalyze = async () => {
        if (!targetRole.trim()) {
            setAnalysisMessage({ type: 'error', text: 'Please enter a target role.' });
            return;
        }
        if (!user.skills && !user.experience && !user.projects) {
            setAnalysisMessage({ type: 'error', text: 'Please upload a resume or fill out your profile first.' });
            return;
        }

        setAnalyzing(true);
        setAnalysisMessage({ type: '', text: '' });
        setAnalysisResult(null);

        try {
            const payload = {
                role: targetRole,
                skills: user.skills || '',
                experience: user.experience || '',
                projects: user.projects || '',
                // include other fields if needed
            };

            const response = await api.post('/resume/analyze', payload);
            console.log("Analysis Result:", response.data); // Debug log
            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysisMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to analyze profile'
            });
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/portfolios');
                setStats({ totalPortfolios: response.data.length, loading: false });
            } catch (error) {
                console.error("Failed to fetch stats", error);
                setStats({ totalPortfolios: 0, loading: false });
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleEditClick = () => {
        setFormData({
            fullName: user.fullName || '',
            password: '',
            bio: user.bio || '',
            skills: user.skills || '',
            experience: user.experience || '',
            projects: user.projects || ''
        });
        setIsEditing(true);
        setMessage({ type: '', text: '' });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingUpdate(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await api.put('/auth/me', formData);
            updateUser(response.data);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed", error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to update profile'
            });
        } finally {
            setLoadingUpdate(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setResumeLoading(true);
        setResumeMessage({ type: '', text: '' });

        const formData = new FormData();
        formData.append('file', file);

        try {
            // New endpoint to upload and save to profile
            // CORRECT: Do NOT set Content-Type manually. Let browser set it with boundary.
            // BUT: We DO need to set the Authorization header explicitly if the interceptor isn't catching it.
            const token = localStorage.getItem('token');
            console.log("Uploading resume with token:", token ? "Present" : "Missing"); // Debug log

            if (!token) {
                setResumeMessage({ type: 'error', text: 'Authentication token missing. Please login again.' });
                setResumeLoading(false);
                return;
            }

            // CORRECT: Use direct axios call to avoid default Content-Type: application/json from api instance
            const response = await axios.post('http://localhost:8081/api/resume/upload-to-profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                    // No Content-Type header here -> Browser sets it to multipart/form-data with boundary
                }
            });

            // The response contains the parsed data. 
            // We also know the backend has updated the user entity.
            // So we can merge this data into our local user context.
            // Note: response.data is PortfolioRequestDTO, which has generatedBio, skills, etc.

            updateUser({
                bio: response.data.generatedBio,
                skills: response.data.skills,
                experience: response.data.experience,
                projects: response.data.projects
            });

            setResumeMessage({ type: 'success', text: 'Resume parsed and saved to profile!' });
        } catch (error) {
            console.error("Resume upload failed", error);
            setResumeMessage({
                type: 'error',
                text: error.response?.data?.error || 'Failed to upload/parse resume'
            });
        } finally {
            setResumeLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>

            {message.text && (
                <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="card p-8 mb-8">
                {/* Profile Header */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    {!isEditing ? (
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{user.fullName || 'User'}</h2>
                                    <p className="text-slate-500">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleEditClick}
                                    className="btn btn-sm btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="New password"
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-4 mt-4">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Resume Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            className="input w-full h-24"
                                            placeholder="Professional summary..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Skills <span className="text-slate-400 font-normal">(comma separated)</span></label>
                                        <textarea
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            className="input w-full"
                                            placeholder="Java, React, Spring Boot..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                                        <textarea
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="input w-full h-32"
                                            placeholder="Work experience details..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Projects</label>
                                        <textarea
                                            name="projects"
                                            value={formData.projects}
                                            onChange={handleChange}
                                            className="input w-full h-32"
                                            placeholder="Project details..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary bg-indigo-600 text-white"
                                    disabled={loadingUpdate}
                                >
                                    {loadingUpdate ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn btn-ghost text-slate-600"
                                    disabled={loadingUpdate}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {!isEditing && (
                    <>
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Total Portfolios</h3>
                                <p className="text-4xl font-bold text-indigo-600">
                                    {stats.loading ? '...' : stats.totalPortfolios}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Account Status</h3>
                                <p className="text-lg font-bold text-green-600 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Active
                                </p>
                            </div>
                        </div>

                        {/* Resume Section */}
                        <div className="border-t border-slate-100 pt-8 mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Resume Data</h2>
                                <label className="btn btn-sm btn-primary bg-indigo-600 text-white cursor-pointer">
                                    {resumeLoading ? 'Uploading...' : 'Upload Resume'}
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                        disabled={resumeLoading}
                                    />
                                </label>
                            </div>

                            {resumeMessage.text && (
                                <div className={`p-4 mb-6 rounded-lg ${resumeMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {resumeMessage.text}
                                </div>
                            )}

                            {user.bio || user.skills ? (
                                <div className="space-y-6">
                                    {user.bio && (
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Bio</h3>
                                            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm leading-relaxed">{user.bio}</p>
                                        </div>
                                    )}
                                    {user.skills && (
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills.split(',').map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {user.experience && (
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Experience</h3>
                                            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{user.experience}</p>
                                        </div>
                                    )}
                                    {user.projects && (
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Projects</h3>
                                            <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm leading-relaxed whitespace-pre-wrap">{user.projects}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                    <p className="text-slate-500 mb-2">No resume data found.</p>
                                    <p className="text-sm text-slate-400">Upload your resume to automatically populate your profile.</p>
                                </div>
                            )}
                        </div>

                        {/* Analysis Section */}
                        <div className="border-t border-slate-100 pt-8 mb-8">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Analysis</h2>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Target Role</label>
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        className="input flex-1"
                                        placeholder="e.g. Full Stack Developer, Product Manager"
                                    />
                                    <button
                                        onClick={handleAnalyze}
                                        disabled={analyzing}
                                        className="btn btn-primary bg-indigo-600 text-white"
                                    >
                                        {analyzing ? 'Analyzing...' : 'Analyze Profile'}
                                    </button>
                                </div>
                                {analysisMessage.text && (
                                    <p className={`mt-3 text-sm ${analysisMessage.type === 'error' ? 'text-red-600' : 'text-slate-600'}`}>
                                        {analysisMessage.text}
                                    </p>
                                )}
                            </div>

                            {analysisResult && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Match Score */}
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-slate-800">Match Score</h3>
                                            <div className="flex items-center gap-4">
                                                {analysisResult.id && (
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                const response = await axios.get(`http://localhost:8081/api/resume/analyze/${analysisResult.id}/download`, {
                                                                    headers: { 'Authorization': `Bearer ${token}` },
                                                                    responseType: 'blob'
                                                                });
                                                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                                                const link = document.createElement('a');
                                                                link.href = url;
                                                                link.setAttribute('download', 'Analysis_Report.docx');
                                                                document.body.appendChild(link);
                                                                link.click();
                                                                link.remove();
                                                            } catch (error) {
                                                                console.error("Download failed", error);
                                                                // Fallback or error message could go here
                                                            }
                                                        }}
                                                        className="btn btn-sm btn-outline text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-2"
                                                    >
                                                        <span>⬇️</span> Download Report
                                                    </button>
                                                )}
                                                <span className={`text-2xl font-bold ${analysisResult.matchScore >= 80 ? 'text-green-600' :
                                                    analysisResult.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {analysisResult.matchScore}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${analysisResult.matchScore >= 80 ? 'bg-green-500' :
                                                    analysisResult.matchScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${analysisResult.matchScore}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {analysisResult.summary && (
                                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                            <h3 className="text-lg font-bold text-blue-800 mb-2">Executive Summary</h3>
                                            <p className="text-blue-900 text-sm leading-relaxed">{analysisResult.summary}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Strengths */}
                                        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                                            <h3 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-4">Strengths</h3>
                                            <ul className="space-y-2">
                                                {analysisResult.strengths?.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-green-700 text-sm">
                                                        <span className="mt-1">✓</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Weaknesses */}
                                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide mb-4">Gaps & Weaknesses</h3>
                                            <ul className="space-y-2">
                                                {analysisResult.weaknesses?.map((item, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-red-700 text-sm">
                                                        <span className="mt-1">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Missing Keywords */}
                                    {analysisResult.missingKeywords?.length > 0 && (
                                        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                                            <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-4">Missing Keywords</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {analysisResult.missingKeywords.map((keyword, i) => (
                                                    <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Improvement Tips */}
                                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                                        <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wide mb-4">How to Improve</h3>
                                        <ul className="space-y-3">
                                            {analysisResult.improvementTips?.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-indigo-900 text-sm bg-white p-3 rounded-lg border border-indigo-100">
                                                    <span className="font-bold text-indigo-500">{i + 1}.</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Recommended Projects */}
                                        {analysisResult.recommendedProjects?.length > 0 && (
                                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                                <h3 className="text-sm font-bold text-purple-800 uppercase tracking-wide mb-4">Recommended Projects</h3>
                                                <ul className="space-y-3">
                                                    {analysisResult.recommendedProjects.map((project, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-purple-900 text-sm bg-white p-3 rounded-lg border border-purple-100">
                                                            <span className="mt-1">🚀</span>
                                                            <span>{project}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Interview Questions */}
                                        {analysisResult.interviewQuestions?.length > 0 && (
                                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                                <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-4">Interview Prep</h3>
                                                <ul className="space-y-3">
                                                    {analysisResult.interviewQuestions.map((q, i) => (
                                                        <li key={i} className="text-orange-900 text-sm bg-white p-3 rounded-lg border border-orange-100 italic">
                                                            " {q} "
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-8">
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
