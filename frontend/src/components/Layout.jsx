import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/logo.png';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header className="app-navbar">
                <div className="app-navbar-container">
                    <Link to="/" className="app-navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={Logo} alt="CodeFolio" style={{ height: '60px', width: 'auto', display: 'block' }} />
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
                                <div className="app-user-menu" style={{ position: 'relative' }}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="app-user-avatar"
                                        title="User Menu"
                                        style={{ border: 'none', cursor: 'pointer' }}
                                    >
                                        {user.fullName ? user.fullName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="dropdown-menu">
                                            <Link
                                                to="/profile"
                                                className="dropdown-item"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="dropdown-item dropdown-item-danger"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
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
                                <img src={Logo} alt="CodeFolio" style={{ height: '40px', width: 'auto' }} />
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
                        <div>&copy; {new Date().getFullYear()} CodeFolio. All rights reserved.</div>
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
