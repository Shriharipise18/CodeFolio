import React from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const PortfolioCard = ({ portfolio, onDelete }) => {
    const handleDownload = async () => {
        try {
            const response = await api.get(`/portfolios/${portfolio.id}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `portfolio-${portfolio.id}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading portfolio:', error);
            alert('Failed to download portfolio.');
        }
    };

    return (
        <div className="portfolio-card">
            <div className="card-body">
                <div className="card-header">
                    <h3 className="card-role">{portfolio.role}</h3>
                    <span className="card-date">
                        {new Date(portfolio.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="card-bio-preview">
                    "{portfolio.generatedBio}"
                </p>
                <div className="card-tags">
                    {portfolio.skills.split(',').slice(0, 3).map((skill, index) => (
                        <span key={index} className="tag">
                            {skill.trim()}
                        </span>
                    ))}
                    {portfolio.skills.split(',').length > 3 && (
                        <span className="tag">+{portfolio.skills.split(',').length - 3} more</span>
                    )}
                </div>
            </div>
            <div className="card-footer">
                <Link
                    to={`/portfolios/${portfolio.id}`}
                    className="link-view"
                >
                    View Details
                </Link>
                <button
                    onClick={handleDownload}
                    className="btn-secondary"
                    style={{ marginRight: '8px', padding: '0.4rem 0.8rem', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                    Download
                </button>
                <button
                    onClick={() => onDelete(portfolio.id)}
                    className="btn-delete-text"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PortfolioCard;
