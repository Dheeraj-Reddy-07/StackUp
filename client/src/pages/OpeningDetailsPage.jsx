// ============================================
// Opening Details Page
// ============================================
// Full opening details with apply functionality

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, ArrowLeft, FileText, Send, Check, X, ExternalLink } from 'lucide-react';
import { Card, Button, Spinner, Badge, SkillTag, Modal, Avatar } from '../components/ui';
import { ApplicationCard } from '../components/features';
import { getOpening } from '../services/openingService';
import { createApplication, getOpeningApplications, acceptApplication, rejectApplication } from '../services/applicationService';
import { uploadFile } from '../services/uploadService';
import toast from 'react-hot-toast';

const OpeningDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [opening, setOpening] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    // Apply modal state
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [applyData, setApplyData] = useState({ message: '', resumeFile: null });
    const [applying, setApplying] = useState(false);
    const [uploading, setUploading] = useState(false);

    const typeColors = {
        hackathon: 'primary',
        project: 'success',
        startup: 'warning',
        study: 'gray'
    };

    useEffect(() => {
        fetchOpening();
    }, [id]);

    const fetchOpening = async () => {
        setLoading(true);
        try {
            const response = await getOpening(id);
            setOpening(response.data);

            // Check if current user is the owner
            const ownerCheck = response.data.creator._id === user?._id;
            setIsOwner(ownerCheck);

            // Fetch applications if owner
            if (ownerCheck) {
                const appsResponse = await getOpeningApplications(id);
                setApplications(appsResponse.data);
            }
        } catch (error) {
            console.error('Failed to load opening:', error);
            console.error('Opening ID:', id);
            console.error('Error response:', error.response);

            const errorMessage = error.response?.data?.message || 'Failed to load opening';
            toast.error(errorMessage);
            navigate('/browse');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();

        if (!applyData.message.trim()) {
            toast.error('Please write a message');
            return;
        }

        setApplying(true);
        try {
            let resumeUrl = null;

            // Upload resume if provided
            if (applyData.resumeFile) {
                setUploading(true);
                const uploadRes = await uploadFile(applyData.resumeFile);
                resumeUrl = uploadRes.data.url;
                setUploading(false);
            }

            await createApplication({
                openingId: id,
                message: applyData.message,
                resumeUrl
            });

            toast.success('Application submitted!');
            setShowApplyModal(false);
            setApplyData({ message: '', resumeFile: null });
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to submit application';
            toast.error(message);
        } finally {
            setApplying(false);
            setUploading(false);
        }
    };

    const handleAccept = async (applicationId) => {
        try {
            await acceptApplication(applicationId);
            toast.success('Application accepted!');
            fetchOpening();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to accept');
        }
    };

    const handleReject = async (applicationId) => {
        try {
            await rejectApplication(applicationId);
            toast.success('Application rejected');
            fetchOpening();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!opening) {
        return null;
    }

    const availableSlots = opening.totalSlots - opening.filledSlots;

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
            <div className="container-app max-w-4xl">
                {/* Back Link */}
                <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Browse
                </Link>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Opening Details */}
                    <div className="lg:col-span-2">
                        <Card className="mb-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <Badge variant={typeColors[opening.projectType]}>
                                    {opening.projectType.charAt(0).toUpperCase() + opening.projectType.slice(1)}
                                </Badge>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${opening.status === 'open' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                                    }`}>
                                    {opening.status === 'open' ? 'Open' : 'Closed'}
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                                {opening.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)] mb-6 pb-6 border-b border-[var(--color-border)]">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {availableSlots} / {opening.totalSlots} slots available
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Posted {new Date(opening.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-gray max-w-none mb-6">
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">About this Opening</h3>
                                <p className="text-[var(--color-text-primary)] whitespace-pre-wrap">{opening.description}</p>
                            </div>

                            {/* Skills */}
                            {opening.requiredSkills?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {opening.requiredSkills.map((skill) => (
                                            <SkillTag key={skill} skill={skill} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Applications (Owner Only) */}
                        {isOwner && (
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
                                    Applications ({applications.length})
                                </h2>
                                {applications.length === 0 ? (
                                    <Card className="text-center py-8">
                                        <Send className="w-10 h-10 text-[var(--color-text-tertiary)] mx-auto mb-3" />
                                        <p className="text-[var(--color-text-secondary)]">No applications yet</p>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((app) => (
                                            <ApplicationCard
                                                key={app._id}
                                                application={app}
                                                showActions
                                                onAccept={handleAccept}
                                                onReject={handleReject}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Creator Card */}
                        <Card className="mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Posted by</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar name={opening.creator.name} size="lg" />
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">{opening.creator.name}</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{opening.creator.college || 'Student'}</p>
                                </div>
                            </div>
                            {opening.creator.bio && (
                                <p className="text-sm text-[var(--color-text-secondary)]">{opening.creator.bio}</p>
                            )}
                        </Card>

                        {/* Apply Button */}
                        {!isOwner && opening.status === 'open' && availableSlots > 0 && (
                            <Button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate('/login', { state: { from: { pathname: `/openings/${id}` } } });
                                        return;
                                    }
                                    setShowApplyModal(true);
                                }}
                                className="w-full"
                                size="lg"
                            >
                                <Send className="w-5 h-5" />
                                Apply to Join
                            </Button>
                        )}

                        {availableSlots === 0 && (
                            <div className="bg-amber-50 text-amber-700 px-4 py-3 rounded-lg text-center">
                                All slots are filled
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <Modal
                isOpen={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                title="Apply to Join"
                size="md"
            >
                <form onSubmit={handleApply} className="space-y-4">
                    <div>
                        <label className="label">Your Message *</label>
                        <textarea
                            value={applyData.message}
                            onChange={(e) => setApplyData(prev => ({ ...prev, message: e.target.value }))}
                            rows={4}
                            placeholder="Tell the team owner why you'd be a great addition..."
                            className="input resize-none"
                        />
                    </div>

                    <div>
                        <label className="label">Resume (Optional)</label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setApplyData(prev => ({ ...prev, resumeFile: e.target.files[0] }))}
                            className="input"
                        />
                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">PDF only, max 5MB</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setShowApplyModal(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={applying}
                            className="flex-1"
                        >
                            {uploading ? 'Uploading...' : 'Submit Application'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default OpeningDetailsPage;
