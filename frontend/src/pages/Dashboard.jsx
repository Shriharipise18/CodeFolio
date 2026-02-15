import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PortfolioCard from '../components/PortfolioCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const PortfolioList = () => {
    const [portfolios, setPortfolios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        try {
            const response = await api.get('/portfolios');
            setPortfolios(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load portfolios.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this portfolio?')) return;
        try {
            await api.delete(`/portfolios/${id}`);
            setPortfolios(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            console.error(err);
            alert('Failed to delete portfolio.');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Your Portfolios</h1>
                    <p className="text-slate-500 mt-1">Manage and edit your saved resumes and websites.</p>
                </div>
                <Link to="/create" className="btn btn-primary">
                    + Create New
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>
            )}

            {portfolios.length === 0 && !loading && !error ? (
                <div className="card text-center py-16">
                    <div className="text-6xl mb-4">📂</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No portfolios yet</h3>
                    <p className="text-slate-500 mb-6">Create your first AI-generated portfolio in seconds.</p>
                    <Link to="/create" className="btn btn-primary">
                        Get Started
                    </Link>
                </div>
            ) : (
                <div className="portfolio-grid">
                    {portfolios.map(portfolio => (
                        <PortfolioCard
                            key={portfolio.id}
                            portfolio={portfolio}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PortfolioList;
