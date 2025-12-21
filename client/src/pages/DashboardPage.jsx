// ============================================
// Dashboard Page
// ============================================
// User dashboard with tabs for openings, applications, teams, notifications

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Send, Users, Bell, Plus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Spinner, Button } from '../components/ui';
import { OpeningCard, ApplicationCard, TeamCard } from '../components/features';
import { getMyOpenings } from '../services/openingService';
import { getMyApplications } from '../services/applicationService';
import { getMyTeams } from '../services/teamService';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../services/notificationService';
import { getChatStats } from '../services/messageService';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'openings');

    const [openings, setOpenings] = useState([]);
    const [applications, setApplications] = useState([]);
    const [teams, setTeams] = useState([]);
    const [chats, setChats] = useState([]);
    const [chatStats, setChatStats] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Sync activeTab with URL parameter changes
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

    // Fetch notifications when tab changes to notifications
    useEffect(() => {
        if (activeTab === 'notifications') {
            fetchNotifications();
        }
    }, [activeTab]);

    // Fetch chat stats on mount to show unread count immediately
    useEffect(() => {
        const fetchChatStatsOnLoad = async () => {
            try {
                const statsRes = await getChatStats();
                const statsMap = {};
                (statsRes.data || []).forEach(stat => {
                    statsMap[stat.teamId] = {
                        unreadCount: stat.unreadCount,
                        lastMessageTime: stat.lastMessageTime
                    };
                });
                setChatStats(statsMap);
            } catch (error) {
                console.error('Failed to fetch chat stats:', error);
            }
        };
        fetchChatStatsOnLoad();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getNotifications();
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const tabs = [
        { id: 'openings', label: 'My Openings', icon: <FileText className="w-4 h-4" /> },
        { id: 'applications', label: 'Applications', icon: <Send className="w-4 h-4" /> },
        { id: 'teams', label: 'My Teams', icon: <Users className="w-4 h-4" /> },
        { id: 'chats', label: 'Chats', icon: <MessageCircle className="w-4 h-4" /> }
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'openings':
                    const openingsRes = await getMyOpenings();
                    setOpenings(openingsRes.data);
                    break;
                case 'applications':
                    const appsRes = await getMyApplications();
                    setApplications(appsRes.data);
                    break;
                case 'teams':
                    const teamsRes = await getMyTeams();
                    setTeams(teamsRes.data);
                    break;
                case 'chats':
                    const chatsRes = await getMyTeams();
                    setChats(chatsRes.data);
                    // Fetch chat statistics
                    const statsRes = await getChatStats();
                    const statsMap = {};
                    (statsRes.data || []).forEach(stat => {
                        statsMap[stat.teamId] = {
                            unreadCount: stat.unreadCount,
                            lastMessageTime: stat.lastMessageTime
                        };
                    });
                    setChatStats(statsMap);
                    break;
            }
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            // Refresh notifications to get updated read status
            await fetchNotifications();
            // Dispatch event to update navbar
            window.dispatchEvent(new Event('notificationsUpdated'));
            toast.success('All notifications marked as read');
        } catch (error) {
            toast.error('Failed to mark notifications as read');
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read');
        }
    };

    const handleNotificationClick = async (notification) => {
        // Route based on notification type
        switch (notification.type) {
            case 'application':
            case 'application_received':
                // Someone applied to your opening - go to opening details page
                if (notification.relatedId) {
                    navigate(`/openings/${notification.relatedId}`);
                }
                break;
            case 'application_accepted':
                // Your application was accepted - go to team page
                if (notification.relatedId) {
                    navigate(`/teams/${notification.relatedId}`);
                }
                break;
            case 'application_rejected':
                // Your application was rejected - go to applications tab
                navigate('/dashboard?tab=applications');
                break;
            case 'team_message':
                // New team message - go to team chat
                if (notification.relatedId) {
                    navigate(`/teams/${notification.relatedId}/chat`);
                }
                break;
            default:
                // Default: stay on dashboard
                break;
        }
    };

    const handleMarkSingleRead = async (notificationId, e) => {
        e.stopPropagation();
        try {
            await markAsRead(notificationId);
            setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
            toast.success('Notification marked as read');
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    const handleDeleteNotification = async (notificationId, e) => {
        e.stopPropagation();
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(n => n._id !== notificationId));
            toast.success('Notification deleted');
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const formatRelativeTime = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 transition-colors">
            <div className="container-app">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        My Dashboard
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Manage your openings, applications, and teams
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--color-border)] pb-4">
                    {tabs.map((tab) => {
                        // Calculate unread chats count from chatStats
                        const unreadChatsCount = tab.id === 'chats'
                            ? Object.values(chatStats).filter(stat => stat.unreadCount > 0).length
                            : 0;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white'
                                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.id === 'chats' && unreadChatsCount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                        {unreadChatsCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        {/* My Openings Tab */}
                        {activeTab === 'openings' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                        My Openings ({openings.length})
                                    </h2>
                                    <Link to="/openings/new">
                                        <Button>
                                            <Plus className="w-4 h-4" />
                                            Create Opening
                                        </Button>
                                    </Link>
                                </div>
                                {openings.length === 0 ? (
                                    <Card className="text-center py-12">
                                        <FileText className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No openings yet</h3>
                                        <p className="text-[var(--color-text-secondary)] mb-4">Create your first opening to find teammates</p>
                                        <Link to="/openings/new">
                                            <Button>Create Opening</Button>
                                        </Link>
                                    </Card>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {openings.map((opening) => (
                                            <OpeningCard key={opening._id} opening={opening} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Applications Tab */}
                        {activeTab === 'applications' && (
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                                    My Applications ({applications.length})
                                </h2>
                                {applications.length === 0 ? (
                                    <Card className="text-center py-12">
                                        <Send className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No applications yet</h3>
                                        <p className="text-[var(--color-text-secondary)] mb-4">Browse openings and apply to join teams</p>
                                        <Link to="/browse">
                                            <Button>Browse Openings</Button>
                                        </Link>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((application) => (
                                            <Card key={application._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-[var(--color-text-primary)]">
                                                        {application.opening?.title}
                                                    </h4>
                                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                                        By {application.opening?.creator?.name}
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${application.status === 'pending' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                                                    application.status === 'accepted' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                    }`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Teams Tab */}
                        {activeTab === 'teams' && (
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                                    My Teams ({teams.length})
                                </h2>
                                {teams.length === 0 ? (
                                    <Card className="text-center py-12">
                                        <Users className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No teams yet</h3>
                                        <p className="text-[var(--color-text-secondary)] mb-4">Create an opening or apply to join teams</p>
                                        <Link to="/browse">
                                            <Button>Browse Openings</Button>
                                        </Link>
                                    </Card>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {teams.map((team) => (
                                            <TeamCard key={team._id} team={team} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Chats Tab */}
                        {activeTab === 'chats' && (
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                                    Chats
                                </h2>
                                {chats.length === 0 ? (
                                    <Card className="text-center py-12">
                                        <MessageCircle className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No chats yet</h3>
                                        <p className="text-[var(--color-text-secondary)] mb-4">Join a team to start chatting</p>
                                        <Link to="/browse">
                                            <Button>Browse Openings</Button>
                                        </Link>
                                    </Card>
                                ) : (
                                    <div className="space-y-2">
                                        {chats.map((team) => {
                                            const stats = chatStats[team._id] || {};
                                            const unreadCount = stats.unreadCount || 0;
                                            const lastMessageTime = stats.lastMessageTime
                                                ? formatRelativeTime(stats.lastMessageTime)
                                                : 'No messages';
                                            const hasUnread = unreadCount > 0;
                                            return (
                                                <Link
                                                    key={team._id}
                                                    to={`/teams/${team._id}/chat`}
                                                    className="block"
                                                >
                                                    <Card className="hover:bg-[var(--color-bg-tertiary)] transition-all cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            {/* Team Avatar/Icon */}
                                                            <div className="relative flex-shrink-0">
                                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-lg">
                                                                    {team.opening?.title?.charAt(0) || 'T'}
                                                                </div>
                                                                {hasUnread && (
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[var(--color-bg-primary)]"></div>
                                                                )}
                                                            </div>

                                                            {/* Chat Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <h3 className={`font-semibold text-[var(--color-text-primary)] truncate ${hasUnread ? 'font-bold' : ''}`}>
                                                                        {team.opening?.title || 'Team Chat'}
                                                                    </h3>
                                                                    <span className="text-xs text-[var(--color-text-tertiary)] flex-shrink-0 ml-2">
                                                                        {lastMessageTime}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <p className={`text-sm text-[var(--color-text-secondary)] truncate ${hasUnread ? 'font-medium' : ''}`}>
                                                                        {[team.owner, ...team.members].length} members
                                                                    </p>
                                                                    {hasUnread && (
                                                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[18px] text-center flex-shrink-0">
                                                                            {unreadCount}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                        Notifications ({notifications.length})
                                    </h2>
                                    {notifications.some(n => !n.read) && (
                                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                                            Mark all as read
                                        </Button>
                                    )}
                                </div>
                                {notifications.length === 0 ? (
                                    <Card className="text-center py-12">
                                        <Bell className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No notifications</h3>
                                        <p className="text-[var(--color-text-secondary)]">You're all caught up!</p>
                                    </Card>
                                ) : (
                                    <div className="space-y-3">
                                        {notifications.map((notification) => (
                                            <Card
                                                key={notification._id}
                                                className={`transition-colors hover:bg-[var(--color-bg-tertiary)] ${!notification.read ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800' : ''
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-primary-600' : 'bg-[var(--color-text-tertiary)]'
                                                        }`} />
                                                    <div className="flex-1 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                                                        <p className="text-[var(--color-text-primary)]">{notification.message}</p>
                                                        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                                                            {new Date(notification.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={(e) => handleMarkSingleRead(notification._id, e)}
                                                                className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded transition-colors"
                                                                title="Mark as read"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => handleDeleteNotification(notification._id, e)}
                                                            className="p-1.5 text-[var(--color-text-secondary)] hover:text-red-600 hover:bg-[var(--color-bg-tertiary)] rounded transition-colors"
                                                            title="Delete notification"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
