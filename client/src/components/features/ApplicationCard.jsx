// ============================================
// Application Card Component
// ============================================
// Display for applications in dashboard/opening details

import { useState } from 'react';
import { Check, X, Clock, FileText, ExternalLink } from 'lucide-react';
import { Card, Badge, Avatar, Button, PDFPreviewModal } from '../ui';

const ApplicationCard = ({
    application,
    showActions = false,
    onAccept,
    onReject,
    isProcessing = false
}) => {
    const [showPDFPreview, setShowPDFPreview] = useState(false);

    // Get proper PDF URL - handle both relative and absolute URLs
    const getPDFUrl = () => {
        if (!application.resumeUrl) return null;

        // If it's already a full URL (http/https), use it as is
        if (application.resumeUrl.startsWith('http://') || application.resumeUrl.startsWith('https://')) {
            return application.resumeUrl + '#toolbar=0';
        }

        // If it's a relative path (starts with /), make it absolute
        if (application.resumeUrl.startsWith('/')) {
            const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            return baseURL + application.resumeUrl + '#toolbar=0';
        }

        // If it's just a file ID, construct the URL
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${baseURL}/api/files/${application.resumeUrl}#toolbar=0`;
    };
    // Status badge colors
    const statusColors = {
        pending: 'warning',
        accepted: 'success',
        rejected: 'error'
    };

    const statusIcons = {
        pending: <Clock className="w-4 h-4" />,
        accepted: <Check className="w-4 h-4" />,
        rejected: <X className="w-4 h-4" />
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const applicant = application.applicant;

    return (
        <Card className="flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Avatar name={applicant?.name} size="md" />
                    <div>
                        <h4 className="font-semibold text-[var(--color-text-primary)]">{applicant?.name}</h4>
                        <p className="text-sm text-[var(--color-text-secondary)]">{applicant?.email}</p>
                    </div>
                </div>
                <Badge variant={statusColors[application.status]}>
                    <span className="flex items-center gap-1">
                        {statusIcons[application.status]}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                </Badge>
            </div>

            {/* College & Skills */}
            {applicant?.college && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    <strong>College:</strong> {applicant.college}
                </p>
            )}
            {applicant?.skills?.length > 0 && (
                <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                    <strong>Skills:</strong> {applicant.skills.join(', ')}
                </p>
            )}

            {/* Message */}
            <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-3 mb-4">
                <p className="text-sm text-[var(--color-text-primary)]">{application.message}</p>
            </div>

            {/* Resume Button */}
            {application.resumeUrl && (
                <button
                    onClick={() => setShowPDFPreview(true)}
                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-4 cursor-pointer"
                >
                    <FileText className="w-4 h-4" />
                    View Resume
                </button>
            )}

            {/* PDF Preview Modal */}
            <PDFPreviewModal
                isOpen={showPDFPreview}
                onClose={() => setShowPDFPreview(false)}
                pdfUrl={getPDFUrl()}
                fileName={`${application.applicant?.name || 'applicant'}_resume.pdf`}
            />

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <span className="text-sm text-[var(--color-text-secondary)]">
                    Applied {formatDate(application.createdAt)}
                </span>

                {/* Action Buttons */}
                {showActions && application.status === 'pending' && (
                    <div className="flex gap-2">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onReject(application.id)}
                            disabled={isProcessing}
                        >
                            <X className="w-4 h-4" />
                            Reject
                        </Button>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => onAccept(application.id)}
                            disabled={isProcessing}
                            loading={isProcessing}
                        >
                            <Check className="w-4 h-4" />
                            Accept
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ApplicationCard;
