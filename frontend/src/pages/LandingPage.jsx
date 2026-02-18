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

                    {/* Terminal Preview */}
                    <div className="hero-preview">
                        <div className="terminal-window">
                            <div className="terminal-header">
                                <div className="terminal-buttons">
                                    <span className="t-btn red"></span>
                                    <span className="t-btn yellow"></span>
                                    <span className="t-btn green"></span>
                                </div>
                                <div className="terminal-title">codefolio-cli — v2.0.4</div>
                            </div>
                            <div className="terminal-body">
                                <div className="cmd-line">
                                    <span className="cmd-prompt">➜</span> <span className="cmd-path">~</span> <span className="cmd-text">npx create-portfolio resume.pdf</span>
                                </div>
                                <div className="cmd-output">
                                    <div className="log-line">ℹ  Parsing PDF structure... <span className="text-green">Done</span></div>
                                    <div className="log-line">ℹ  Extracting skills & experience... <span className="text-green">Done</span></div>
                                    <div className="log-line">ℹ  Generating custom bio... <span className="text-green">Done</span></div>
                                    <div className="log-line">ℹ  Building React components... <span className="text-green">Done</span></div>
                                    <div className="log-line">✔  <span className="text-green">Success!</span> Your portfolio is live:</div>
                                    <div className="log-line link">https://codefolio.dev/u/alex-dev</div>
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
