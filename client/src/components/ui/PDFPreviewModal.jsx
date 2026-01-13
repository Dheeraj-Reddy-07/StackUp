// ============================================
// PDF Preview Modal Component
// ============================================
// Modal to preview PDF files with download option

import { X, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const PDFPreviewModal = ({ isOpen, onClose, pdfUrl, fileName = 'document.pdf' }) => {
    const [downloading, setDownloading] = useState(false);

    // Convert relative URL to absolute URL for iframe
    const getAbsoluteUrl = (url) => {
        if (!url) return null;

        // If already absolute, return as is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Convert relative to absolute
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        if (url.startsWith('/')) {
            return baseURL + url;
        }
        return `${baseURL}/api/files/${url}`;
    };

    const absoluteUrl = getAbsoluteUrl(pdfUrl);

    // Handle actual file download
    const handleDownload = async () => {
        if (!absoluteUrl) return;

        setDownloading(true);
        try {
            const response = await fetch(absoluteUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Download started!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download file');
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !absoluteUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-6xl h-[90vh] bg-[var(--color-bg-primary)] rounded-xl shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] truncate flex-1 mr-4">
                        {fileName}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors disabled:opacity-50"
                            title="Download PDF"
                        >
                            <Download className={`w-5 h-5 ${downloading ? 'animate-pulse' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* PDF Preview */}
                <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* Use object tag instead of iframe for better Chrome compatibility */}
                    <object
                        data={absoluteUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        aria-label="PDF Preview"
                    >
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                            <p className="text-[var(--color-text-primary)] mb-4">
                                Unable to display PDF in browser.
                            </p>
                            <button
                                onClick={handleDownload}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Download PDF
                            </button>
                        </div>
                    </object>
                </div>
            </div>
        </div>
    );
};

export default PDFPreviewModal;

