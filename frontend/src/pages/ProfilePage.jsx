import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
    User, Mail, Edit2, Upload, FileText,
    CheckCircle, AlertCircle, TrendingUp, Download, Briefcase,
    LogOut, ChevronRight
} from 'lucide-react';
import './ProfilePage.css'; // Import the new CSS file

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
            setActiveTab('resume');
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
        <div className="loader-container">
            <div className="spinner"></div>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-content-wrapper">

                {/* Header Section */}
                <div className="profile-header">
                    <div className="profile-welcome">
                        <h1>Welcome back, {user.fullName?.split(' ')[0] || 'User'}! 👋</h1>
                        <p>Manage your profile, analyze your resume, and track your progress.</p>
                    </div>
                    <div>
                        <button onClick={handleLogout} className="btn-logout">
                            <LogOut className="btn-icon" />
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="profile-grid">

                    {/* LEFT COLUMN: Profile Card & Navigation */}
                    <div className="profile-sidebar">

                        {/* Profile Card */}
                        <div className="profile-card">
                            <div className="profile-card-header-bg"></div>
                            <div className="profile-card-content">
                                <div className="avatar-container">
                                    <div className="avatar-circle">
                                        <div className="avatar-initial">
                                            {user.fullName ? user.fullName.charAt(0) : 'U'}
                                        </div>
                                    </div>
                                    {!isEditing && (
                                        <button onClick={handleEditClick} className="edit-trigger-btn" title="Edit Profile">
                                            <Edit2 size={14} />
                                        </button>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <div>
                                        <h2 className="profile-name">{user.fullName || 'Guest User'}</h2>
                                        <div className="profile-email">
                                            <Mail size={14} />
                                            {user.email}
                                        </div>
                                        <div className="status-badge">
                                            <div className="status-dot"></div>
                                            Active Account
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="profile-edit-form">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="form-input-styled"
                                            placeholder="Full Name"
                                            required
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="form-input-styled"
                                            placeholder="New Password (optional)"
                                        />
                                        <div className="form-actions">
                                            <button type="submit" disabled={loadingUpdate} className="btn-save-sm">
                                                {loadingUpdate ? 'Saving...' : 'Save'}
                                            </button>
                                            <button type="button" onClick={handleCancelEdit} className="btn-cancel-sm">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">Portfolios</div>
                                <div className="stat-value text-slate">{stats.loading ? '-' : stats.totalPortfolios}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">Match Score</div>
                                <div className="stat-value text-indigo">{analysisResult ? `${analysisResult.matchScore}%` : '-'}</div>
                            </div>
                        </div>

                        {/* Navigation / Actions */}
                        <div className="nav-card">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                            >
                                <span className="nav-label"><User size={16} /> Overview</span>
                                <ChevronRight size={16} className="opacity-50" />
                            </button>
                            <button
                                onClick={() => setActiveTab('resume')}
                                className={`nav-btn ${activeTab === 'resume' ? 'active' : ''}`}
                            >
                                <span className="nav-label"><FileText size={16} /> Resume Data</span>
                                <ChevronRight size={16} className="opacity-50" />
                            </button>
                            <button
                                onClick={() => setActiveTab('analysis')}
                                className={`nav-btn ${activeTab === 'analysis' ? 'active' : ''}`}
                            >
                                <span className="nav-label"><TrendingUp size={16} /> AI Analysis</span>
                                <ChevronRight size={16} className="opacity-50" />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Main Content */}
                    <div className="profile-main">

                        {/* Status Messages */}
                        {(message.text || resumeMessage.text) && (
                            <div className={`alert-box ${(message.type === 'error' || resumeMessage.type === 'error') ? 'alert-error' : 'alert-success'
                                }`}>
                                {(message.type === 'error' || resumeMessage.type === 'error') ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                                <span>{message.text || resumeMessage.text}</span>
                            </div>
                        )}

                        {/* Resume Upload Box */}
                        <div className="upload-card">
                            <div className="upload-info">
                                <h3>Update Resume</h3>
                                <p>Upload your latest PDF resume to verify skills and get personalized job analysis scores.</p>
                            </div>
                            <label className="upload-btn-wrapper">
                                <button className="btn-upload" disabled={resumeLoading}>
                                    {resumeLoading ? 'Parsing...' : <><Upload size={16} style={{ marginRight: '8px' }} /> Upload PDF</>}
                                </button>
                                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden-input" disabled={resumeLoading} />
                            </label>
                        </div>

                        {/* TAB CONTENT: Overview */}
                        {activeTab === 'overview' && (
                            <div className="tab-content-card empty-dashboard">
                                <div className="dashboard-content">
                                    <Briefcase className="dashboard-icon-large" />
                                    <h3 className="dashboard-title">My Career Dashboard</h3>
                                    <p className="dashboard-desc">Access your resume data, improve your profile strength, and check your job match score.</p>

                                    <div className="dashboard-actions">
                                        <button onClick={() => setActiveTab('resume')} className="action-card-btn">
                                            <div className="btn-header">
                                                <FileText size={20} className="text-indigo" />
                                                <ChevronRight size={16} color="#94a3b8" />
                                            </div>
                                            <div className="action-title">Review Resume</div>
                                            <div className="action-desc">Check extracted skills & bio</div>
                                        </button>
                                        <button onClick={() => setActiveTab('analysis')} className="action-card-btn">
                                            <div className="btn-header">
                                                <TrendingUp size={20} className="text-indigo" />
                                                <ChevronRight size={16} color="#94a3b8" />
                                            </div>
                                            <div className="action-title">AI Analysis</div>
                                            <div className="action-desc">Get job match scores</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Resume Data */}
                        {activeTab === 'resume' && (
                            <div className="tab-content-card">
                                <div className="section-heading-row">
                                    <Briefcase size={20} className="text-indigo" />
                                    <span>Resume Details</span>
                                </div>

                                <div className="resume-data-content">
                                    <div className="data-section">
                                        <div className="data-label">Professional Summary</div>
                                        {user.bio ? (
                                            <div className="data-box">{user.bio}</div>
                                        ) : (
                                            <div className="no-data">No summary available.</div>
                                        )}
                                    </div>

                                    <div className="data-section">
                                        <div className="data-label">Skills</div>
                                        {user.skills ? (
                                            <div className="skills-container">
                                                {user.skills.split(/,/).map((skill, i) => (
                                                    <span key={i} className="skill-pill">
                                                        {skill.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-data">No skills found.</div>
                                        )}
                                    </div>

                                    <div className="data-section">
                                        <div className="data-label">Experience</div>
                                        {user.experience ? (
                                            <div className="data-box">{user.experience}</div>
                                        ) : (
                                            <div className="no-data">No experience listed.</div>
                                        )}
                                    </div>

                                    <div className="data-section">
                                        <div className="data-label">Projects</div>
                                        {user.projects ? (
                                            <div className="data-box">{user.projects}</div>
                                        ) : (
                                            <div className="no-data">No projects listed.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: Analysis */}
                        {activeTab === 'analysis' && (
                            <div className="analysis-wrapper">
                                {/* Input Card */}
                                <div className="analysis-input-card">
                                    <h3 className="section-heading-row">
                                        <TrendingUp size={20} className="text-indigo" />
                                        Job Match Analysis
                                    </h3>

                                    <div className="input-group-row">
                                        <input
                                            type="text"
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            placeholder="Enter target job title (e.g. Frontend Developer)"
                                            className="role-input"
                                        />
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={analyzing}
                                            className="btn-analyze"
                                        >
                                            {analyzing ? 'Analyzing...' : 'Analyze Match'}
                                        </button>
                                    </div>
                                    {analysisMessage.text && (
                                        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: analysisMessage.type === 'error' ? '#ef4444' : '#64748b' }}>
                                            {analysisMessage.text}
                                        </p>
                                    )}
                                </div>

                                {/* Results Section */}
                                {analysisResult ? (
                                    <div className="analysis-result-card fade-in">
                                        {/* Portfolio Health Card */}
                                        <div className="health-score-card">
                                            <div className="health-header">
                                                <h3>Portfolio Health Score</h3>
                                                <div className={`health-badge ${analysisResult.matchScore >= 80 ? 'health-high' : analysisResult.matchScore >= 50 ? 'health-med' : 'health-low'}`}>
                                                    {analysisResult.matchScore}/100
                                                </div>
                                            </div>

                                            <div className="health-metrics">
                                                {/* Skills Match */}
                                                <div className="metric-row">
                                                    <div className="metric-info">
                                                        <span>Skills Match</span>
                                                        <span className="metric-val">{analysisResult.sectionScores?.Skills || 0}%</span>
                                                    </div>
                                                    <div className="progress-bar-container">
                                                        <div
                                                            className="progress-fill fill-blue"
                                                            style={{ width: `${analysisResult.sectionScores?.Skills || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {/* Project Quality */}
                                                <div className="metric-row">
                                                    <div className="metric-info">
                                                        <span>Project Quality</span>
                                                        <span className="metric-val">{analysisResult.sectionScores?.Projects || 0}%</span>
                                                    </div>
                                                    <div className="progress-bar-container">
                                                        <div
                                                            className="progress-fill fill-purple"
                                                            style={{ width: `${analysisResult.sectionScores?.Projects || 0}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Optimization Tip */}
                                            {analysisResult.improvementTips?.length > 0 && (
                                                <div className="optimization-tip-box">
                                                    <div className="tip-icon">💡</div>
                                                    <div className="tip-content">
                                                        <strong>Optimization Tip:</strong> {analysisResult.improvementTips[0]}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Detailed Insights */}
                                        <div className="result-body">
                                            <div className="insights-grid">
                                                <div className="insight-col">
                                                    <h4 className="text-success"><CheckCircle size={16} /> Key Strengths</h4>
                                                    <ul className="insight-list">
                                                        {analysisResult.strengths?.slice(0, 3).map((item, i) => (
                                                            <li key={i} className="insight-item">
                                                                <div className="bullet bullet-success"></div>{item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="insight-col">
                                                    <h4 className="text-danger"><AlertCircle size={16} /> Improvements</h4>
                                                    <ul className="insight-list">
                                                        {analysisResult.weaknesses?.slice(0, 3).map((item, i) => (
                                                            <li key={i} className="insight-item">
                                                                <div className="bullet bullet-danger"></div>{item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                            {analysisResult.id && (
                                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                                                    <button onClick={downloadReport} className="btn-download">
                                                        <Download size={14} /> Download Full Report
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="empty-analysis-state">
                                        <TrendingUp size={48} className="empty-icon" />
                                        <h3>Ready to Evaluate?</h3>
                                        <p>Enter a target role above to see your <strong>Portfolio Health Score</strong> and get AI-powered improvement tips.</p>
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
