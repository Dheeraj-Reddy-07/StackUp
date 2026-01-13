// ============================================
// Navbar Component
// ============================================
// Main navigation bar with auth state

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Menu, X, Bell, User, LogOut, Plus, Layers, Moon, Sun } from 'lucide-react';
import Button from '../ui/Button';
import { getNotifications, markAsRead } from '../../services/notificationService';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    // Fetch notifications
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Refresh every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data.slice(0, 5)); // Show last 5
            setUnreadCount(response.data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read if unread
        if (!notification.read) {
            try {
                await markAsRead(notification.id);
                await fetchNotifications();
            } catch (error) {
                console.error('Failed to mark as read');
            }
        }

        // Route based on notification type
        switch (notification.type) {
            case 'application':
            case 'application_received':
                // Someone applied to your opening
                if (notification.relatedId) {
                    navigate(`/openings/${notification.relatedId}`);
                } else {
                    console.error('Notification missing relatedId:', notification);
                    navigate('/dashboard');
                }
                break;
            case 'application_accepted':
                // Your application was accepted - navigate to team
                if (notification.relatedId) {
                    // relatedId is the opening ID, we need to find the team
                    navigate(`/dashboard?tab=teams`);
                }
                break;
            case 'application_rejected':
                // Your application was rejected
                navigate('/dashboard?tab=applications');
                break;
            case 'team_message':
                // New team message
                if (notification.relatedId) {
                    navigate(`/teams/${notification.relatedId}/chat`);
                }
                break;
            default:
                // Default: go to dashboard
                navigate('/dashboard');
        }

        setNotificationMenuOpen(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Listen for notification updates from dashboard
    useEffect(() => {
        const handleNotificationsUpdated = () => {
            fetchNotifications();
        };
        window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
        return () => window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] sticky top-0 z-40 transition-colors">
            <div className="container-app">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={isAuthenticated ? '/welcome' : '/'} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--color-text-primary)]">StackUp</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}

                        <Link
                            to="/browse"
                            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors"
                        >
                            Browse Openings
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/openings/new"
                                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium transition-colors flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Post Opening
                                </Link>

                                {/* Theme Toggle Button */}
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'light' ? (
                                        <Moon className="w-5 h-5" />
                                    ) : (
                                        <Sun className="w-5 h-5" />
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                                        className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                                    >
                                        <Bell className="w-5 h-5" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {notificationMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-[var(--color-bg-primary)] rounded-xl shadow-lg border border-[var(--color-border)] animate-scale-in max-h-96 flex flex-col z-50">
                                            <div className="px-4 py-2 border-b border-[var(--color-border)] flex items-center justify-between flex-shrink-0">
                                                <h3 className="font-semibold text-[var(--color-text-primary)]">Notifications</h3>
                                                {unreadCount > 0 && (
                                                    <span className="text-xs text-[var(--color-text-secondary)]">{unreadCount} unread</span>
                                                )}
                                            </div>
                                            {notifications.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-[var(--color-text-tertiary)]">
                                                    No notifications
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="overflow-y-auto flex-1">
                                                        {notifications.map((notification) => (
                                                            <button
                                                                key={notification.id}
                                                                onClick={() => handleNotificationClick(notification)}
                                                                className={`w-full text-left px-4 py-3 hover:bg-[var(--color-bg-tertiary)] transition-colors border-b border-[var(--color-border)] ${!notification.read ? 'bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20' : ''
                                                                    }`}
                                                            >
                                                                <div className="flex items-start gap-2">
                                                                    {!notification.read && (
                                                                        <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm text-[var(--color-text-primary)]">{notification.message}</p>
                                                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                                                            {new Date(notification.createdAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="border-t border-[var(--color-border)] flex-shrink-0">
                                                        <Link
                                                            to="/dashboard?tab=notifications"
                                                            className="block px-4 py-2 text-center text-sm text-primary-600 hover:bg-[var(--color-bg-tertiary)]"
                                                            onClick={() => setNotificationMenuOpen(false)}
                                                        >
                                                            View all notifications
                                                        </Link>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                        className="flex items-center gap-2 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </button>

                                    {profileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[var(--color-bg-primary)] rounded-xl shadow-lg border border-[var(--color-border)] py-2 animate-scale-in">
                                            <div className="px-4 py-2 border-b border-[var(--color-border)]">
                                                <p className="font-medium text-[var(--color-text-primary)]">{user?.name}</p>
                                                <p className="text-sm text-[var(--color-text-secondary)] truncate" title={user?.email}>{user?.email}</p>
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                                                onClick={() => setProfileMenuOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary">Sign up</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button and theme toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--color-border)] animate-slide-up">
                        <div className="flex flex-col gap-2">
                            <Link
                                to="/browse"
                                className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Browse Openings
                            </Link>

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/openings/new"
                                        className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Post Opening
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
