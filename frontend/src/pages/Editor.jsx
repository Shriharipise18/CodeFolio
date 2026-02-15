import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortfolioForm from '../components/PortfolioForm';
import api from '../services/api';

const Editor = () => {
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedBio, setGeneratedBio] = useState('');
    const [error, setError] = useState('');

    const [isGeneratingWebsite, setIsGeneratingWebsite] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState('');
    // Function to populate form data from parent
    // const [prefilledData, setPrefilledData] = useState(null); // Removed as redundant

    const handleGenerate = async (formData) => {
        setIsGenerating(true);
        setError('');
        try {
            const response = await api.post('/ai/generate-bio', formData);
            setGeneratedBio(response.data.bio);
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to generate bio.';
            setError(`Error: ${msg}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateWebsite = async (formData, isReactExport = false) => {
        console.log("Generating website with data:", formData); // Debug: Check sectionOrder
        setIsGeneratingWebsite(true);
        setError('');
        try {
            if (isReactExport) {
                const response = await api.post('/ai/download-react', formData, {
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'portfolio-react.zip');
                document.body.appendChild(link);
                link.click();
            } else {
                const response = await api.post('/ai/generate-website', formData);
                setGeneratedHtml(response.data.html);
            }
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to generate website.';
            setError(`Error: ${msg}`);
        } finally {
            setIsGeneratingWebsite(false);
        }
    };

    const handleSave = async (completeData) => {
        setIsSaving(true);
        setError('');
        try {
            // 'completeData' includes generatedBio and generatedHtml from the form state
            await api.post('/portfolios', completeData);
            navigate('/dashboard'); // Redirect to Dashboard after save
        } catch (err) {
            console.error(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('You must be logged in to save your portfolio. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to save portfolio.';
                setError(`Error: ${msg}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container max-w-4xl py-12">
            {/* Header for Editor Mode */}

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <PortfolioForm
                onGenerate={handleGenerate}
                onGenerateWebsite={handleGenerateWebsite}
                onSave={handleSave}
                isGenerating={isGenerating}
                isGeneratingWebsite={isGeneratingWebsite}
                generatedBio={generatedBio}
                generatedHtml={generatedHtml}
                isSaving={isSaving}
                initialData={null}
            />
        </div>
    );
};

export default Editor;
