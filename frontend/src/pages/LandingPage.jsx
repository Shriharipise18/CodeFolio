import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-badge animate-fade-in">
                        <span className="badge-pulse">
                            <span className="pulse-ring"></span>
                            <span className="pulse-dot"></span>
                        </span>
                        New: AI Resume Parsing & Analysis
                    </div>

                    <h1 className="hero-title">
                        Launch your developer portfolio <br className="break-desktop" />
                        <span className="highlight-text">in seconds.</span>
                    </h1>

                    <p className="hero-subtitle">
                        Stop wasting time on CSS. Upload your resume and let our AI build, write, and deploy a professional portfolio website that gets you hired.
                    </p>

                    <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
                        <Link to={user ? "/create" : "/login"} className="btn btn-primary btn-large" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            Build My Portfolio
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                        <Link to="/login" className="btn btn-secondary btn-large">
                            {user ? "Go to Dashboard" : "View Demo"}
                        </Link>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="hero-preview">
                        <div className="preview-frame">
                            <div className="browser-mockup">
                                {/* Fake Browser Header */}
                                <div className="browser-header">
                                    <div className="window-controls">
                                        <div className="control red"></div>
                                        <div className="control yellow"></div>
                                        <div className="control green"></div>
                                    </div>
                                    <div className="address-bar"></div>
                                </div>
                                {/* Preview Content */}
                                <div className="preview-content">
                                    <div className="sidebar">
                                        <div className="avatar"></div>
                                        <div className="skeleton-line long"></div>
                                        <div className="skeleton-line short"></div>
                                    </div>
                                    <div className="main-area">
                                        <div className="skeleton-hero"></div>
                                        <div className="skeleton-grid">
                                            <div className="skeleton-card"></div>
                                            <div className="skeleton-card"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="preview-overlay">
                                    <div className="overlay-badge">
                                        Live Interactive Preview
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="section section-trust">
                <div className="container text-center">
                    <p className="section-label">Trusted by developers from</p>
                    <div className="logo-strip">
                        <span className="company-logo">TechStart</span>
                        <span className="company-logo">DevCorp</span>
                        <span className="company-logo">CodeFlow</span>
                        <span className="company-logo">GitScale</span>
                        <span className="company-logo">StackBuild</span>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="section section-steps">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">From Resume to Website in 3 Steps</h2>
                        <p className="section-subtitle">No coding required. Just upload your resume and let our AI handle the rest.</p>
                    </div>

                    <div className="steps-grid">
                        {/* Connecting Line */}
                        <div className="steps-connector"></div>

                        {/* Step 1 */}
                        <div className="step-card">
                            <div className="step-icon-wrapper">
                                <span className="step-emoji">📄</span>
                                <div className="step-number">1</div>
                            </div>
                            <h3 className="step-title">Upload Resume</h3>
                            <p className="step-desc">Drag & drop your PDF. We instantly parse your skills, experience, and projects.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="step-card">
                            <div className="step-icon-wrapper">
                                <span className="step-emoji">✨</span>
                                <div className="step-number">2</div>
                            </div>
                            <h3 className="step-title">AI Generation</h3>
                            <p className="step-desc">Our AI writes your bio, structures your content, and designs your site layout.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="step-card">
                            <div className="step-icon-wrapper">
                                <span className="step-emoji">🚀</span>
                                <div className="step-number">3</div>
                            </div>
                            <h3 className="step-title">Publish & Share</h3>
                            <p className="step-desc">Get a hosted link or download the source code to deploy anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="section section-features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Everything you need to impress recruiters</h2>
                        <p className="section-subtitle">Built for modern developers who need to showcase their work effectively.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon icon-blue">📂</div>
                            <h3 className="feature-title">Smart Resume Parsing</h3>
                            <p className="feature-desc">Don't copy-paste. Our system extracts structured data from your PDF resume with high accuracy.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon icon-indigo">✍️</div>
                            <h3 className="feature-title">Professional Bio Writer</h3>
                            <p className="feature-desc">AI generates a compelling professional summary tailored to the specific role you're targeting.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon icon-green">📱</div>
                            <h3 className="feature-title">Mobile-First Design</h3>
                            <p className="feature-desc">Every portfolio is fully responsive, looking great on desktop, tablet, and mobile devices.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Analysis Feature */}
            <section className="section section-analysis">
                <div className="container">
                    <div className="split-layout">
                        <div className="split-media">
                            <div className="analysis-card">
                                <div className="card-header">
                                    <h4 className="card-title">Portfolio Health Score</h4>
                                    <span className="score-badge">92/100</span>
                                </div>
                                <div className="card-body-stack">
                                    <div className="metric-row">
                                        <div className="metric-label">
                                            <span>Skills Match</span>
                                            <span className="metric-val">95%</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill fill-blue" style={{ width: '95%' }}></div></div>
                                    </div>
                                    <div className="metric-row">
                                        <div className="metric-label">
                                            <span>Project Quality</span>
                                            <span className="metric-val">88%</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill fill-indigo" style={{ width: '88%' }}></div></div>
                                    </div>
                                    <div className="tip-box">
                                        <strong>💡 Optimization Tip:</strong> Add more quantitative metrics to your "Project Alpha" description.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="split-content">
                            <div className="feature-pill">
                                📈 AI Analytics
                            </div>
                            <h2 className="section-title split-title">Know exactly how you stack up.</h2>
                            <p className="split-desc">
                                Our bespoke AI doesn't just build your portfolio; it analyzes it locally against industry standards.
                                Get real-time feedback on your skills, project descriptions, and overall hireability score.
                            </p>
                            <ul className="check-list">
                                <li>
                                    <span className="check-icon">✓</span>
                                    Keyword optimization for ATS
                                </li>
                                <li>
                                    <span className="check-icon">✓</span>
                                    Skill gap analysis
                                </li>
                                <li>
                                    <span className="check-icon">✓</span>
                                    Actionable improvement tips
                                </li>
                            </ul>
                            <Link to={user ? "/create" : "/login"} className="btn btn-primary btn-large">
                                Analyze My Profile
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section section-cta">
                <div className="cta-bg-pattern">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                    </svg>
                </div>
                <div className="container cta-container">
                    <h2 className="cta-title">
                        Ready to stand out?
                    </h2>
                    <p className="cta-subtitle">
                        Join thousands of developers who have accelerated their careers with a professional, AI-generated portfolio.
                    </p>
                    <div className="cta-actions">
                        <Link to={user ? "/create" : "/signup"} className="btn btn-primary btn-large shadow-glow">
                            Start Building for Free
                        </Link>
                        <Link to="/login" className="btn btn-outline-white btn-large">
                            {user ? "Go to Dashboard" : "Log In"}
                        </Link>
                    </div>
                    <p className="cta-note">No credit card required. Free tier forever.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
