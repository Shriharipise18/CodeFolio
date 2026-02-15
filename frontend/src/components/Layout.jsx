import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header className="app-navbar">
                <div className="app-navbar-container">
                    <Link to="/" className="app-navbar-brand">
                        <div className="app-navbar-logo">P</div>
                        {/* Always show title unless very small, managed by CSS if needed */}
                        <span className="app-navbar-title">
                            Portfolio<span style={{ color: 'var(--color-primary)' }}>AI</span>
                        </span>
                    </Link>

                    <nav className="app-navbar-menu">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="app-nav-link desktop-only">
                                    Dashboard
                                </Link>
                                <Link to="/create" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    + <span className="desktop-only ml-1" style={{ display: 'inline' }}>New Project</span>
                                </Link>
                                <div className="app-nav-divider desktop-only"></div>
                                <div className="app-user-menu">
                                    <Link to="/profile" className="app-user-avatar" title="View Profile">
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="h-9 px-4 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all shadow-sm desktop-only"
                                    >
                                        Logout
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-ghost btn-circle mobile-only text-red-600 hover:bg-red-50"
                                        title="Logout"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                        </svg>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/#features" className="app-nav-link desktop-only">
                                    Features
                                </Link>
                                <Link to="/login" className="app-nav-link">
                                    Log in
                                </Link>
                                <Link to="/signup" className="btn btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            <footer className="app-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <Link to="/" className="footer-logo">
                                Portfolio<span style={{ color: 'var(--color-primary)' }}>AI</span>
                            </Link>
                            <p className="footer-desc">
                                The smartest way for developers to build, host, and share professional portfolios.
                                <br /><br />
                                Powered by advanced AI to analyze your resume and craft the perfect personal brand.
                            </p>
                        </div>

                        <div>
                            <h4 className="footer-heading">Product</h4>
                            <ul className="footer-links">
                                <li><Link to="/#features" className="footer-link">Features</Link></li>
                                <li><Link to="/create" className="footer-link">Generator</Link></li>
                                <li><Link to="/#pricing" className="footer-link">Pricing</Link></li>
                                <li><Link to="/showcase" className="footer-link">Showcase</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-heading">Resources</h4>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">Documentation</a></li>
                                <li><a href="#" className="footer-link">API Reference</a></li>
                                <li><a href="#" className="footer-link">Blog</a></li>
                                <li><a href="#" className="footer-link">Community</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-heading">Company</h4>
                            <ul className="footer-links">
                                <li><a href="#" className="footer-link">About Us</a></li>
                                <li><a href="#" className="footer-link">Careers</a></li>
                                <li><a href="#" className="footer-link">Legal</a></li>
                                <li><a href="#" className="footer-link">Contact</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div>&copy; {new Date().getFullYear()} PortfolioAI. All rights reserved.</div>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">GitHub</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
