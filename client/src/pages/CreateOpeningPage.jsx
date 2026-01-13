// ============================================
// Create Opening Page
// ============================================
// Form to create a new project opening

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { Card, Button, SkillTag } from '../components/ui';
import { createOpening } from '../services/openingService';
import toast from 'react-hot-toast';

const CreateOpeningPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        projectType: 'project',
        totalSlots: 2,
        requiredSkills: []
    });
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});

    const projectTypes = [
        { value: 'hackathon', label: 'Hackathon', description: 'Time-bound coding competition' },
        { value: 'project', label: 'Project', description: 'Side project or portfolio piece' },
        { value: 'startup', label: 'Startup', description: 'Build a business together' },
        { value: 'study', label: 'Study Group', description: 'Prepare for interviews or exams' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const addSkill = () => {
        const skill = skillInput.trim();
        if (skill && !formData.requiredSkills.includes(skill)) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skill]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
        }));
    };

    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description should be at least 50 characters';
        }
        if (!formData.projectType) {
            newErrors.projectType = 'Project type is required';
        }
        if (!formData.totalSlots || formData.totalSlots < 1) {
            newErrors.totalSlots = 'At least 1 slot is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await createOpening(formData);
            toast.success('Opening created successfully!');
            navigate(`/openings/${response.data.id}`);
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to create opening';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
            <div className="container-app max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        Post an Opening
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Create an opening to find teammates for your project
                    </p>
                </div>

                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="label">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Looking for React developers for HackMIT"
                                className={`input ${errors.title ? 'input-error' : ''}`}
                            />
                            {errors.title && (
                                <p className="mt-1.5 text-sm text-error">{errors.title}</p>
                            )}
                        </div>

                        {/* Project Type */}
                        <div>
                            <label className="label">Project Type *</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {projectTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, projectType: type.value }))}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.projectType === type.value
                                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
                                            }`}
                                    >
                                        <div className="font-medium text-[var(--color-text-primary)]">{type.label}</div>
                                        <div className="text-xs text-[var(--color-text-secondary)] mt-1">{type.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="label">Description *</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Describe your project, what you're building, and what you're looking for in teammates..."
                                className={`input resize-none ${errors.description ? 'input-error' : ''}`}
                            />
                            <div className="flex justify-between mt-1.5">
                                {errors.description && (
                                    <p className="text-sm text-error">{errors.description}</p>
                                )}
                                <p className="text-sm text-[var(--color-text-secondary)] ml-auto">
                                    {formData.description.length} characters
                                </p>
                            </div>
                        </div>

                        {/* Total Slots */}
                        <div>
                            <label className="label">Number of Team Slots *</label>
                            <input
                                type="number"
                                name="totalSlots"
                                value={formData.totalSlots}
                                onChange={handleChange}
                                min={1}
                                max={20}
                                className={`input w-32 ${errors.totalSlots ? 'input-error' : ''}`}
                            />
                            <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
                                How many people do you need for your team?
                            </p>
                            {errors.totalSlots && (
                                <p className="text-sm text-error">{errors.totalSlots}</p>
                            )}
                        </div>

                        {/* Required Skills */}
                        <div>
                            <label className="label">Required Skills</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={handleSkillKeyPress}
                                    placeholder="e.g., React, Python, UI/UX..."
                                    className="input flex-1"
                                />
                                <Button type="button" onClick={addSkill} variant="secondary">
                                    <Plus className="w-4 h-4" />
                                    Add
                                </Button>
                            </div>
                            {formData.requiredSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.requiredSkills.map((skill) => (
                                        <SkillTag
                                            key={skill}
                                            skill={skill}
                                            removable
                                            onRemove={removeSkill}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                                className="flex-1"
                            >
                                Create Opening
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateOpeningPage;
