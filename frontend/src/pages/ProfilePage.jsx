import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Edit2, Upload, FileText,
    CheckCircle, AlertCircle, TrendingUp, Download, Briefcase,
    Code, Layers, Award, LogOut, ChevronRight
} from 'lucide-react';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalPortfolios: 0, loading: true });
    const [activeTab, setActiveTab] = useState('overview'); // overview, resume, analysis

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        password: '',
        bio: '',
        skills: '',
        experience: '',
        projects: ''
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
            const response = await api.post('/resume/upload-to-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            updateUser({
                bio: response.data.generatedBio,
                skills: response.data.skills,
                experience: response.data.experience,
                projects: response.data.projects
            });

            setResumeMessage({ type: 'success', text: 'Resume parsed securely!' });
            setActiveTab('resume'); // Switch to resume tab to show data
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

    const handleAnalyze = async () => {
        if (!targetRole.trim()) {
            setAnalysisMessage({ type: 'error', text: 'Please enter a target role.' });
            return;
        }
        if (!user.skills && !user.experience) {
            setAnalysisMessage({ type: 'error', text: 'Please upload a resume first.' });
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
                projects: user.projects || ''
            };

            const response = await api.post('/resume/analyze', payload);
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

    const downloadReport = async () => {
        if (!analysisResult?.id) return;
        try {
            const response = await api.get(`/resume/analyze/${analysisResult.id}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Analysis_Report_${new Date().toISOString().slice(0, 10)}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    if (!user) return (
        <div className="flex justify-center items-center h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Welcome back, {user.fullName?.split(' ')[0] || 'User'}! 👋
                        </h1>
                        <p className="text-slate-500 mt-1">Manage your profile, analyze your resume, and track your progress.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Profile Card & Navigation */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                            <div className="px-6 pb-6 mt-[-40px]">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 rounded-full bg-white p-1 shadow-md">
                                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-indigo-600 uppercase">
                                            {user.fullName ? user.fullName.charAt(0) : 'U'}
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <button
                                            onClick={handleEditClick}
                                            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                                            title="Edit Profile"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div className="mt-3">
                                        <h2 className="text-xl font-bold text-slate-900">{user.fullName || 'Guest User'}</h2>
                                        <div className="flex items-center text-slate-500 text-sm mt-1">
                                            <Mail className="w-3.5 h-3.5 mr-1.5" />
                                            {user.email}
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                                Active Account
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                            placeholder="Full Name"
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                                            placeholder="New Password (optional)"
                                        />
                                        <div className="flex gap-2 pt-2">
                                            <button type="submit" disabled={loadingUpdate} className="flex-1 bg-indigo-600 text-white py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700">
                                                {loadingUpdate ? 'Saving...' : 'Save'}
                                            </button>
                                            <button type="button" onClick={handleCancelEdit} className="flex-1 bg-white border border-slate-300 text-slate-700 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Portfolios</div>
                                <div className="text-2xl font-bold text-slate-900">{stats.loading ? '-' : stats.totalPortfolios}</div>
                            </div>
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Analysis Score</div>
                                <div className="text-2xl font-bold text-indigo-600">{analysisResult ? `${analysisResult.matchScore}%` : '-'}</div>
                            </div>
                        </div>

                        {/* Navigation / Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="flex items-center"><User className="w-4 h-4 mr-3" /> Overview</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                            <button
                                onClick={() => setActiveTab('resume')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'resume' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="flex items-center"><FileText className="w-4 h-4 mr-3" /> Resume Data</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                            <button
                                onClick={() => setActiveTab('analysis')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analysis' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="flex items-center"><TrendingUp className="w-4 h-4 mr-3" /> AI Analysis</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Main Content */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Status Messages */}
                        {(message.text || resumeMessage.text) && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${(message.type === 'error' || resumeMessage.type === 'error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                                }`}>
                                {(message.type === 'error' || resumeMessage.type === 'error') ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                                <p className="text-sm font-medium">{message.text || resumeMessage.text}</p>
                            </div>
                        )}

                        {/* Resume Upload Box (Always visible at top of right col) */}
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold">Update Resume</h3>
                                    <p className="text-indigo-100 text-sm mt-1 max-w-md">
                                        Upload your latest PDF resume to verify skills and get personalized job analysis scores.
                                    </p>
                                </div>
                                <label className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 cursor-pointer transition-all">
                                    {resumeLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Parsing...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload PDF
                                        </>
                                    )}
                                    <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" disabled={resumeLoading} />
                                </label>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-8 translate-y-8">
                                <FileText className="w-32 h-32" />
                            </div>
                        </div>

                        {/* TAB CONTENT: Overview */}
                        {activeTab === 'overview' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <Briefcase className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">My Career Dashboard</h3>
                                    <p className="text-slate-500 mb-8">Access your resume data, improve your profile strength, and check your job match score.</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <button onClick={() => setActiveTab('resume')} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-200 transition-all text-left group">
                                            <div className="flex items-center justify-between mb-2">
                                                <FileText className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div className="font-semibold text-slate-900">Review Resume</div>
                                            <div className="text-xs text-slate-500 mt-1">Check extracted skills & bio</div>
                                        </button>
                                        <button onClick={() => setActiveTab('analysis')} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-indigo-200 transition-all text-left group">
                                            <div className="flex items-center justify-between mb-2">
                                                <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div className="font-semibold text-slate-900">AI Analysis</div>
                                            <div className="text-xs text-slate-500 mt-1">Get job match scores</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Resume Data */}
                        {activeTab === 'resume' && (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                    <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
                                    Resume Details
                                </h3>

                                <div className="space-y-8">
                                    {/* Bio */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Professional Summary</h4>
                                        {user.bio ? (
                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-slate-700 text-sm leading-relaxed">
                                                {user.bio}
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 italic text-sm">No summary available.</div>
                                        )}
                                    </div>

                                    {/* Skills */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Skills</h4>
                                        {user.skills ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills.split(/,/).map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-semibold">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 italic text-sm">No skills found.</div>
                                        )}
                                    </div>

                                    {/* Experience */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Experience</h4>
                                        {user.experience ? (
                                            <div className="bg-white border border-slate-100 rounded-lg p-4 text-sm text-slate-600 whitespace-pre-line">
                                                {user.experience}
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 italic text-sm">No experience listed.</div>
                                        )}
                                    </div>

                                    {/* Projects */}
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Projects</h4>
                                        {user.projects ? (
                                            <div className="bg-white border border-slate-100 rounded-lg p-4 text-sm text-slate-600 whitespace-pre-line">
                                                {user.projects}
                                            </div>
                                        ) : (
                                            <div className="text-slate-400 italic text-sm">No projects listed.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Analysis */}
                        {activeTab === 'analysis' && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Input Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                                        Job Match Analysis
                                    </h3>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1">
                                            <label className="sr-only">Target Role</label>
                                            <input
                                                type="text"
                                                value={targetRole}
                                                onChange={(e) => setTargetRole(e.target.value)}
                                                placeholder="Enter target job title (e.g. Frontend Developer)"
                                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2.5 border text-sm"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={analyzing}
                                            className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                                        >
                                            {analyzing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    Analyzing...
                                                </>
                                            ) : 'Analyze Match'}
                                        </button>
                                    </div>
                                    {analysisMessage.text && (
                                        <p className={`mt-2 text-sm ${analysisMessage.type === 'error' ? 'text-red-500' : 'text-slate-500'}`}>
                                            {analysisMessage.text}
                                        </p>
                                    )}
                                </div>

                                {/* Results Card */}
                                {analysisResult && (
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="border-b border-slate-100 p-6 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
                                            <div>
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Overall Match Score</div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className={`text-4xl font-extrabold ${analysisResult.matchScore >= 80 ? 'text-green-600' : analysisResult.matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                        {analysisResult.matchScore}
                                                    </span>
                                                    <span className="text-slate-400 text-lg">/ 100</span>
                                                </div>
                                            </div>
                                            {analysisResult.id && (
                                                <button onClick={downloadReport} className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50">
                                                    <Download className="w-3.5 h-3.5 mr-1.5" />
                                                    Download Report
                                                </button>
                                            )}
                                        </div>

                                        <div className="p-6 space-y-8">
                                            {analysisResult.summary && (
                                                <div className="prose prose-sm max-w-none text-slate-600">
                                                    <p>{analysisResult.summary}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Strengths */}
                                                <div>
                                                    <h4 className="flex items-center text-sm font-bold text-green-700 mb-3">
                                                        <CheckCircle className="w-4 h-4 mr-2" /> Key Strengths
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {analysisResult.strengths?.map((item, i) => (
                                                            <li key={i} className="flex items-start text-sm text-slate-600">
                                                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Weaknesses */}
                                                <div>
                                                    <h4 className="flex items-center text-sm font-bold text-red-700 mb-3">
                                                        <AlertCircle className="w-4 h-4 mr-2" /> Areas for Improvement
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {analysisResult.weaknesses?.map((item, i) => (
                                                            <li key={i} className="flex items-start text-sm text-slate-600">
                                                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Tips */}
                                            {analysisResult.improvementTips?.length > 0 && (
                                                <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                                                    <h4 className="flex items-center text-sm font-bold text-indigo-800 mb-3">
                                                        <TrendingUp className="w-4 h-4 mr-2" /> Improvement Tips
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {analysisResult.improvementTips.map((tip, i) => (
                                                            <li key={i} className="flex items-start text-sm text-indigo-900">
                                                                <span className="font-bold mr-2">{i + 1}.</span>
                                                                {tip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
