import React, { useState, useEffect } from 'react';

const PortfolioForm = ({
    initialData = {},
    onGenerate,
    onGenerateWebsite,
    onSave,
    isGenerating,
    isGeneratingWebsite,
    generatedBio,
    generatedHtml,
    isSaving
}) => {
    const [step, setStep] = useState(0); // Start at 0 for Template Selection
    const [formData, setFormData] = useState({
        role: initialData?.role || '',
        skills: initialData?.skills || '',
        experience: initialData?.experience || '',
        projects: initialData?.projects || '',
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        linkedin: initialData?.linkedin || '',
        github: initialData?.github || '',
        themeColor: '#4f46e5', // Default Indigo
        fontStyle: 'Inter',
        template: 'Modern',
        backgroundStyle: 'clean',
        sectionSpacing: 'comfortable',
        cornerStyle: 'rounded',
        sectionOrder: ['Skills', 'Experience', 'Projects'], // Default Order
        generatedBio: '',
        generatedHtml: ''
    });

    const [bio, setBio] = useState(generatedBio || '');
    const [html, setHtml] = useState(generatedHtml || '');
    const [activeTab, setActiveTab] = useState('bio');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Update local state when props change
    useEffect(() => {
        if (generatedBio) {
            setBio(generatedBio);
            setActiveTab('bio');
            if (step === 2) setStep(3); // Auto-advance to preview if generated
        }
    }, [generatedBio]);

    useEffect(() => {
        if (generatedHtml) {
            setHtml(generatedHtml);
            setActiveTab('website');
        }
    }, [generatedHtml]);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                role: initialData.role || '',
                skills: initialData.skills || '',
                experience: initialData.experience || '',
                projects: initialData.projects || '',
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                linkedin: initialData.linkedin || '',
                github: initialData.github || '',
                profileImageBase64: initialData.profileImageBase64 || '',
            }));
            if (initialData.role) setStep(2); // Auto-advance if data is present
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    profileImageBase64: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('http://localhost:8081/api/ai/parse-resume', {
                method: 'POST',
                body: uploadData,
            });

            if (!response.ok) throw new Error('Failed to parse resume');

            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                name: data.name || prev.name,
                email: data.email || prev.email,
                phone: data.phone || prev.phone,
                linkedin: data.linkedin || prev.linkedin,
                github: data.github || prev.github,
                role: data.role || prev.role,
                skills: data.skills || prev.skills,
                experience: data.experience || prev.experience,
                projects: data.projects || prev.projects,
            }));
            alert("Resume parsed successfully! Moving to details...");
            setStep(2);
        } catch (error) {
            console.error("Error parsing resume:", error);
            alert("Failed to parse resume. Please try again.");
        } finally {
            setIsUploading(false);
            e.target.value = null;
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        try {
            const response = await fetch('http://localhost:8081/api/ai/analyze-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            console.error("Analysis failed", error);
            alert("Failed to analyze resume.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmitBio = (e) => {
        e.preventDefault();
        onGenerate(formData);
    };

    const handleGenerateWeb = (e) => {
        e.preventDefault();
        setActiveTab('website');
        onGenerateWebsite(formData);
    };

    const handleSaveBackend = () => {
        onSave({ ...formData, generatedBio: bio, generatedHtml: html });
    };

    // Wizard Navigation
    const nextStep = () => {
        if (step === 2 && !formData.role.trim()) {
            alert("Please enter a Target Role (e.g., Software Engineer) to continue.");
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };
    const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

    const selectTemplate = (templateName) => {
        setFormData(prev => ({ ...prev, template: templateName }));
        nextStep(); // Move to Upload
    };

    const templates = [
        { id: 'Modern', name: 'Modern Glass', desc: 'Dark mode, neon accents, glassmorphism.', icon: '🔮', gradientClass: 'gradient-modern' },
        { id: 'Minimal', name: 'Minimalist', desc: 'Clean, white, typography-focused.', icon: '📝', gradientClass: 'gradient-minimal' },
        { id: 'Professional', name: 'Professional', desc: 'Corporate, trustworthy, navy blue.', icon: '💼', gradientClass: 'gradient-professional' },
        { id: 'Creative', name: 'Creative Bold', desc: 'High contrast, brutalist, loud.', icon: '🎨', gradientClass: 'gradient-creative' },
        { id: 'Developer', name: 'Developer', desc: 'Terminal theme, matrix green.', icon: '💻', gradientClass: 'gradient-developer' },
    ];

    return (
        <div className="container max-w-4xl mx-auto">

            {/* Stepper */}
            <div className="wizard-stepper">
                <div className="step-indicator">
                    <div className={`step-item ${step >= 0 ? 'completed' : ''} ${step === 0 ? 'active' : ''}`}>
                        <div className="step-circle">1</div>
                        <span className="text-sm font-bold">Template</span>
                    </div>
                    <div className={`step-line ${step >= 1 ? 'completed' : ''}`}></div>
                    <div className={`step-item ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
                        <div className="step-circle">2</div>
                        <span className="text-sm font-bold">Upload</span>
                    </div>
                    <div className={`step-line ${step >= 2 ? 'completed' : ''}`}></div>
                    <div className={`step-item ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
                        <div className="step-circle">3</div>
                        <span className="text-sm font-bold">Details</span>
                    </div>
                    <div className={`step-line ${step >= 3 ? 'completed' : ''}`}></div>
                    <div className={`step-item ${step >= 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>
                        <div className="step-circle">4</div>
                        <span className="text-sm font-bold">Preview</span>
                    </div>
                </div>
            </div>

            <div className="wizard-content card p-8">

                {/* STEP 1: TEMPLATE SELECTION (New Step 0) - MARKETPLACE REDESIGN */}
                {step === 0 && (
                    <div className="animate-fade-in gallery-wrapper">
                        {/* Header / Filters */}
                        <div className="gallery-header">
                            <h2 className="gallery-title">Choose Your Style</h2>
                            <div className="gallery-filters">
                                {['Pricing', 'Styles', 'Features'].map(filter => (
                                    <button key={filter} className="filter-pill">
                                        {filter} <span style={{ opacity: 0.5 }}>▼</span>
                                    </button>
                                ))}
                                <div className="filter-divider"></div>
                                <button className="filter-pill">
                                    Popular <span style={{ opacity: 0.5 }}>▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="gallery-grid">
                            {templates.map(tmpl => (
                                <div
                                    key={tmpl.id}
                                    onClick={() => selectTemplate(tmpl.id)}
                                    className={`template-card ${formData.template === tmpl.id ? 'selected' : ''}`}
                                >
                                    {/* Preview Image Area */}
                                    <div className={`template-preview ${tmpl.gradientClass}`}>
                                        <div className="template-icon-wrapper">
                                            {tmpl.icon}
                                        </div>

                                        {/* Overlay */}
                                        <div className="template-overlay">
                                            <button className="btn-select-template">
                                                Select Template
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="template-info">
                                        <div className="template-header">
                                            <h3 className="template-name">{tmpl.name}</h3>
                                            <span className="template-tag">Free</span>
                                        </div>
                                        <p className="template-desc">{tmpl.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: UPLOAD (Formerly Step 1) */}
                {step === 1 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6">Let's Start with your Resume</h2>
                        <p className="text-slate-500 mb-8 max-w-lg">
                            Upload your resume PDF to automatically extract your skills, experience, and contact info. Or skip this step to enter details manually.
                        </p>

                        <div className="w-full max-w-xl mb-8">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-indigo-50 hover:border-indigo-500 transition-all">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                />
                                <div className="text-6xl mb-4">📄</div>
                                <div className="text-xl font-bold text-slate-700 mb-2">
                                    {isUploading ? 'Analyzing Resume...' : 'Click to Upload Resume'}
                                </div>
                                <div className="text-sm text-slate-400">
                                    Supports PDF formats (Max 5MB)
                                </div>
                            </label>
                        </div>

                        <button onClick={nextStep} className="btn btn-secondary">
                            Skip to Manual Entry &rarr;
                        </button>
                    </div>
                )}

                {/* STEP 2: DETAILS FORM */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 pb-4 border-b">Customize Your Profile</h2>
                        <form className="flex flex-col gap-8">
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone</label>
                                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Target Role</label>
                                    <input type="text" name="role" value={formData.role} onChange={handleChange} className="form-input" placeholder="e.g. Full Stack Developer" />
                                </div>
                            </div>

                            {/* Skills & Experience */}
                            <div className="form-group">
                                <label className="form-label">Key Skills</label>
                                <textarea name="skills" value={formData.skills} onChange={handleChange} className="form-textarea h-32" placeholder="Java, Python, React..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Experience Summary</label>
                                <textarea name="experience" value={formData.experience} onChange={handleChange} className="form-textarea h-32" placeholder="Briefly describe your past roles..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Key Projects</label>
                                <textarea name="projects" value={formData.projects} onChange={handleChange} className="form-textarea h-32" placeholder="Describe your best projects..." />
                            </div>

                            {/* Design & Customization */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-xl border">
                                <div className="form-group">
                                    <label className="form-label">Template Style</label>
                                    <select name="template" value={formData.template || 'Modern'} onChange={handleChange} className="form-select">
                                        <option value="Modern">Modern (Glass/Dark)</option>
                                        <option value="Minimal">Minimal (Clean/Light)</option>
                                        <option value="Professional">Professional (Corporate/Navy)</option>
                                        <option value="Creative">Creative (Bold/Brutalist)</option>
                                        <option value="Developer">Developer (Terminal/Hacker)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Theme Color</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} className="h-10 w-12 p-0 border-0 rounded cursor-pointer" />
                                        <span className="text-sm font-mono text-slate-500">{formData.themeColor}</span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <select name="fontStyle" value={formData.fontStyle} onChange={handleChange} className="form-select">
                                        <option value="Outfit, sans-serif">Modern Sans (Outfit)</option>
                                        <option value="Playfair Display, serif">Elegant Serif (Playfair)</option>
                                        <option value="Archivo Black, sans-serif">Bold Display (Archivo)</option>
                                        <option value="Courier Prime, monospace">Tech Mono (Courier)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Background Style</label>
                                    <select name="backgroundStyle" value={formData.backgroundStyle || 'gradient'} onChange={handleChange} className="form-select">
                                        <option value="clean">Clean / Solid</option>
                                        <option value="gradient">Modern Gradient</option>
                                        <option value="mesh">Mesh / Aurora</option>
                                        <option value="particles">Animated Particles</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Corner Style</label>
                                    <select name="cornerStyle" value={formData.cornerStyle || 'rounded'} onChange={handleChange} className="form-select">
                                        <option value="sharp">Sharp (0px)</option>
                                        <option value="rounded">Rounded (8px)</option>
                                        <option value="pill">Pill / Soft (24px)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Section Spacing</label>
                                    <select name="sectionSpacing" value={formData.sectionSpacing || 'comfortable'} onChange={handleChange} className="form-select">
                                        <option value="compact">Compact (High Density)</option>
                                        <option value="comfortable">Comfortable (Standard)</option>
                                        <option value="spacious">Spacious (Airy)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Section Ordering */}
                            <div className="form-group">
                                <label className="form-label mb-2">Section Ordering</label>
                                <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border">
                                    {formData.sectionOrder.map((section, index) => (
                                        <div key={section} className="flex items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
                                            <span className="font-medium text-slate-700">{section} Section</span>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveSection(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
                                                    title="Move Up"
                                                >
                                                    ▲
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveSection(index, 'down')}
                                                    disabled={index === formData.sectionOrder.length - 1}
                                                    className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
                                                    title="Move Down"
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="text-xs text-slate-400 mt-2 text-center">Reorder how sections appear on your website.</p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="form-label">LinkedIn</label>
                                    <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="form-input" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">GitHub</label>
                                    <input type="text" name="github" value={formData.github} onChange={handleChange} className="form-input" />
                                </div>
                            </div>
                        </form>

                        <div className="wizard-nav">
                            <button onClick={prevStep} className="btn btn-secondary">Back</button>
                            <button onClick={nextStep} className="btn btn-primary">Next: Preview & Generate &rarr;</button>
                        </div>
                    </div>
                )}

                {/* STEP 3: PREVIEW */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold mb-6 pb-4 border-b">Generate & Preview</h2>

                        <div className="flex flex-col gap-4 mb-8 items-center">
                            <div className="flex gap-4">
                                <button onClick={handleSubmitBio} disabled={isGenerating} className="btn btn-primary bg-indigo-500 hover:bg-indigo-600">
                                    {isGenerating ? 'Generating Bio...' : 'Generate Bio'}
                                </button>
                                <button onClick={handleGenerateWeb} disabled={isGeneratingWebsite} className="btn btn-secondary">
                                    {isGeneratingWebsite ? 'Generating Preview...' : 'Generate Preview (HTML)'}
                                </button>
                            </div>
                            <button
                                onClick={() => onGenerateWebsite(formData, true)}
                                disabled={isGeneratingWebsite}
                                className="btn btn-accent w-full max-w-md py-3 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg transform transition hover:scale-105"
                            >
                                {isGeneratingWebsite ? 'Preparing Download...' : '🚀 Download Full React App'}
                            </button>
                            <p className="text-xs text-slate-400">
                                * Preview is a simplified HTML version. Download the React App for the full source code.
                            </p>
                        </div>

                        {/* Preview Tabs */}
                        {(bio || html) && (
                            <div className="bg-slate-50 rounded-xl border p-4">
                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={() => setActiveTab('bio')}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'bio' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Bio Preview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('website')}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'website' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                                        disabled={!html}
                                    >
                                        Website Preview
                                    </button>
                                </div>

                                {activeTab === 'bio' && bio && (
                                    <div className="bg-white p-6 rounded-lg border min-h-[300px] whitespace-pre-wrap font-serif text-lg leading-relaxed">
                                        {bio}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Website Full Control */}
                        {activeTab === 'website' && html && (
                            <div className="fixed inset-0 z-[2000] bg-white flex flex-col">
                                <div className="h-16 border-b flex items-center justify-between px-6">
                                    <h3 className="font-bold">Website Preview</h3>
                                    <button onClick={() => setActiveTab('bio')} className="btn btn-secondary text-sm">Close Preview</button>
                                </div>
                                <iframe srcDoc={html} className="flex-1 w-full border-0" title="Preview" />
                            </div>
                        )}

                        <div className="wizard-nav mt-8">
                            <button onClick={prevStep} className="btn btn-secondary">Back to Edit</button>
                            <button onClick={handleSaveBackend} disabled={isSaving} className="btn btn-primary bg-green-600 hover:bg-green-700 text-white border-transparent">
                                {isSaving ? 'Saving...' : 'Save Portfolio'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PortfolioForm;
