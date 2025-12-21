// ============================================
// PDF Preview Modal Component
// ============================================
// Modal to preview PDF files with download option

import { X, Download } from 'lucide-react';
import { useEffect } from 'react';

const PDFPreviewModal = ({ isOpen, onClose, pdfUrl, fileName = 'document.pdf' }) => {
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
                        <a
                            href={absoluteUrl}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                            title="Download PDF"
                        >
                            <Download className="w-5 h-5" />
                        </a>
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
                            <a
                                href={absoluteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 underline"
                            >
                                Click here to open PDF in a new tab
                            </a>
                        </div>
                    </object>
                </div>
            </div>
        </div>
    );
};

export default PDFPreviewModal;
