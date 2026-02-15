import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';

const PortfolioDetail = () => {
    const { id } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [viewMode, setViewMode] = useState('details');

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await api.get(`/portfolios/${id}`);
                setPortfolio(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load portfolio details.');
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, [id]);

    if (loading) return <Loader />;
    if (error) return <div className="error-message">{error}</div>;
    if (!portfolio) return <div className="error-message">Portfolio not found.</div>;

    return (
        <div className="detail-container">
            <Link to="/portfolios" className="back-link">
                &larr; Back to List
            </Link>

            <div className="detail-card">
                <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="detail-role">{portfolio.role}</h1>
                        <p className="detail-date">Created on {new Date(portfolio.createdAt).toLocaleDateString()}</p>
                    </div>
                    {portfolio.generatedHtml && (
                        <button
                            onClick={() => setViewMode(viewMode === 'details' ? 'website' : 'details')}
                            className="btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            {viewMode === 'details' ? 'View Website' : 'Back to Details'}
                        </button>
                    )}
                </div>

                {viewMode === 'details' ? (
                    <div className="detail-body">
                        <section>
                            <h2 className="detail-section-title">Professional Bio</h2>
                            <div className="bio-box">
                                "{portfolio.generatedBio}"
                            </div>
                        </section>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <section>
                                <h2 className="detail-section-title">Top Skills</h2>
                                <div className="card-tags">
                                    {portfolio.skills.split(',').map((skill, index) => (
                                        <span key={index} className="tag">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h2 className="detail-section-title">Experiences</h2>
                                <p className="detail-text">{portfolio.experience}</p>
                            </section>
                        </div>

                        <section>
                            <h2 className="detail-section-title">Key Projects</h2>
                            <p className="detail-text">{portfolio.projects}</p>
                        </section>
                    </div>
                ) : (
                    <div className="website-preview" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    const element = document.createElement("a");
                                    const file = new Blob([portfolio.generatedHtml], { type: 'text/html' });
                                    element.href = URL.createObjectURL(file);
                                    element.download = "index.html";
                                    document.body.appendChild(element);
                                    element.click();
                                }}
                                className="btn-secondary"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', cursor: 'pointer' }}
                            >
                                Download HTML
                            </button>
                        </div>
                        <iframe
                            srcDoc={portfolio.generatedHtml}
                            title="Website Preview"
                            style={{ width: '100%', height: '800px', border: '1px solid #ddd', borderRadius: '8px' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioDetail;
