// ============================================
// Demo Banner
// ============================================
// Fixed banner shown while the app is in demo mode.
// Lets visitors exit back to the real (logged-out) app.

import { isDemoMode, disableDemoMode } from '../../services/demoData';

const DemoBanner = () => {
    if (!isDemoMode()) return null;

    const exitDemo = () => {
        disableDemoMode();
        window.location.href = '/';
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-primary-600 text-white shadow-lg text-sm font-medium">
            <span>✨ Demo mode — sample data, no backend</span>
            <button
                onClick={exitDemo}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
                Exit
            </button>
        </div>
    );
};

export default DemoBanner;
