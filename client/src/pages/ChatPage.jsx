// ============================================
// Chat Page
// ============================================
// Real-time team chat using Socket.IO

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { ArrowLeft, Send, Users, Check, CheckCheck } from 'lucide-react';
import { Card, Spinner, Avatar, Button } from '../components/ui';
import { getTeam } from '../services/teamService';
import { getMessages } from '../services/messageService';
import toast from 'react-hot-toast';

const ChatPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { socket, connected, joinTeam, leaveTeam, sendMessage, emitTyping, stopTyping, markMessagesRead } = useSocket();

    const [team, setTeam] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [typingUser, setTypingUser] = useState(null);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchData();

        return () => {
            if (socket && id) {
                leaveTeam(id);
            }
        };
    }, [id]);

    // Join team room when connected
    useEffect(() => {
        if (connected && id) {
            joinTeam(id);
            // Mark messages as read when joining
            markMessagesRead(id);
        }
    }, [connected, id, markMessagesRead]);

    // Mark messages as read when viewing chat and when new messages arrive
    useEffect(() => {
        if (connected && id && messages.length > 0) {
            markMessagesRead(id);
        }
    }, [connected, id, messages.length, markMessagesRead]);

    // Listen for new messages and errors
    useEffect(() => {
        if (!socket) return;

        socket.on('new-message', (message) => {
            setMessages(prev => [...prev, message]);
            scrollToBottom();
            // Mark as read if it's not our own message
            if (message.sender.id !== user.id && id) {
                markMessagesRead(id);
            }
        });

        socket.on('user-typing', ({ userName }) => {
            setTypingUser(userName);
        });

        socket.on('user-stop-typing', () => {
            setTypingUser(null);
        });

        socket.on('error', (error) => {
            const errorMessage = error.message || 'An error occurred';
            toast.error(errorMessage);
        });

        socket.on('messages-read', (data) => {
            // Update read status for messages
            if (data.messageIds) {
                setMessages(prev => prev.map(msg => {
                    if (data.messageIds.includes(msg.id) && data.userId) {
                        const readBy = msg.readBy || [];
                        const userIdStr = data.userId.toString();
                        const alreadyRead = readBy.some(r => {
                            const id = r.id || r;
                            return id.toString() === userIdStr;
                        });
                        if (!alreadyRead) {
                            return {
                                ...msg,
                                readBy: [...readBy, data.userId]
                            };
                        }
                    }
                    return msg;
                }));
            }
        });

        return () => {
            socket.off('new-message');
            socket.off('user-typing');
            socket.off('user-stop-typing');
            socket.off('error');
            socket.off('messages-read');
        };
    }, [socket]);

    // Scroll on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchData = async () => {
        try {
            const teamRes = await getTeam(id);
            setTeam(teamRes.data);

            // Only fetch messages if team exists
            try {
                const messagesRes = await getMessages(id);
                setMessages(messagesRes.data);
            } catch (msgError) {
                console.error('Failed to load messages:', msgError);
                setMessages([]);
                // Don't show error for messages, just use empty array
            }
        } catch (error) {
            console.error('Failed to load team:', error);
            const errorMessage = error.response?.data?.message || 'Failed to load chat';
            toast.error(errorMessage);
            setTeam(null); // Ensure team is null so error UI shows
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (!newMessage.trim() || sending) return;

        setSending(true);
        sendMessage(id, newMessage.trim());
        setNewMessage('');
        setSending(false);
        stopTyping(id);
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);

        // Emit typing indicator
        emitTyping(id, user.name);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(id);
        }, 2000);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    // Group messages by date first
    const messagesByDate = messages.reduce((groups, message) => {
        const date = formatDate(message.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    // Then group messages within each date by sender and time (within 1 minute)
    const groupedMessages = Object.entries(messagesByDate).reduce((acc, [date, dateMessages]) => {
        const grouped = [];

        dateMessages.forEach((message, index) => {
            const prevMessage = index > 0 ? dateMessages[index - 1] : null;
            const timeDiff = prevMessage ? new Date(message.createdAt) - new Date(prevMessage.createdAt) : Infinity;
            const sameSender = prevMessage && prevMessage.sender.id === message.sender.id;
            const shouldGroup = sameSender && timeDiff < 60000; // Within 1 minute

            if (shouldGroup && grouped.length > 0) {
                // Add to last group
                const lastGroup = grouped[grouped.length - 1];
                lastGroup.messages.push(message);
            } else {
                // Create new group
                grouped.push({
                    sender: message.sender,
                    messages: [message],
                    firstMessageTime: message.createdAt
                });
            }
        });

        acc[date] = grouped;
        return acc;
    }, {});

    // Get all team members for read receipt calculation
    const allMembers = team ? [team.owner, ...team.members].filter(m => m) : [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)]">
                <Card className="text-center py-12 px-8 max-w-md">
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Failed to load chat</h2>
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        Unable to load the team chat. Please try again later.
                    </p>
                    <Link to="/dashboard?tab=teams">
                        <Button>Go to Dashboard</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[var(--color-bg-secondary)]">
            {/* Header */}
            <div className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] px-4 py-3">
                <div className="container-app flex items-center gap-4">
                    <Link
                        to="/dashboard?tab=chats"
                        className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] rounded-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1">
                        <h1 className="font-semibold text-[var(--color-text-primary)]">{team.opening?.title || 'Team Chat'}</h1>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                            <Users className="w-4 h-4" />
                            <span>{[team.owner, ...team.members].length} members</span>
                            {connected ? (
                                <span className="flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Connected
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-amber-600">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Connecting...
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="container-app max-w-3xl">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-[var(--color-text-tertiary)]">No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        Object.entries(groupedMessages).map(([date, messageGroups]) => (
                            <div key={date}>
                                {/* Date Separator */}
                                <div className="flex items-center gap-4 my-6">
                                    <div className="flex-1 h-px bg-[var(--color-border)]"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)] font-medium">{date}</span>
                                    <div className="flex-1 h-px bg-[var(--color-border)]"></div>
                                </div>

                                {/* Messages */}
                                {messageGroups.map((messageGroup, groupIndex) => {
                                    const isOwn = messageGroup.sender.id === user.id;
                                    const firstMessage = messageGroup.messages[0];
                                    const lastMessage = messageGroup.messages[messageGroup.messages.length - 1];

                                    // Calculate read receipts
                                    const readBy = lastMessage.readBy || [];
                                    const readByIds = readBy.map(r => {
                                        if (typeof r === 'object' && r.id) return r.id.toString();
                                        return r.toString();
                                    });
                                    const senderId = messageGroup.sender.id.toString();
                                    const otherMembers = allMembers.filter(m => m && m.id && m.id.toString() !== senderId);
                                    const readByOthers = readByIds.filter(id => id !== senderId);
                                    const isReadByAll = otherMembers.length > 0 && readByOthers.length >= otherMembers.length;
                                    const showSingleTick = readByOthers.length > 0 && !isReadByAll;
                                    const showDoubleTick = isReadByAll;

                                    return (
                                        <div
                                            key={`${firstMessage.id}-${groupIndex}`}
                                            className={`flex gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                                        >
                                            {!isOwn && (
                                                <Avatar name={messageGroup.sender.name} size="sm" className="mt-1" />
                                            )}
                                            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                                {!isOwn && (
                                                    <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 px-1">
                                                        {messageGroup.sender.name}
                                                    </p>
                                                )}
                                                <div className="flex flex-col gap-0.5 w-full">
                                                    {messageGroup.messages.map((message, msgIndex) => {
                                                        return (
                                                            <div
                                                                key={message.id}
                                                                className={`${isOwn ? 'chat-bubble-sent' : 'chat-bubble-received'} relative max-w-[75%] min-w-[200px] ${isOwn ? 'self-end' : 'self-start'}`}
                                                            >
                                                                <p className="pr-[70px] pb-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                                                                    {message.content}
                                                                </p>
                                                                <span className={`absolute bottom-1 right-2 inline-flex items-center gap-0.5 text-xs ${isOwn ? 'text-white/70' : 'text-[var(--color-text-tertiary)]'
                                                                    }`}>
                                                                    <span className="whitespace-nowrap">{formatTime(message.createdAt)}</span>
                                                                    {isOwn && (
                                                                        <span className="inline-flex items-center">
                                                                            {showDoubleTick ? (
                                                                                <CheckCheck className="w-4 h-4 text-blue-300" strokeWidth={2.5} />
                                                                            ) : showSingleTick ? (
                                                                                <Check className="w-4 h-4" strokeWidth={2.5} />
                                                                            ) : (
                                                                                <Check className="w-4 h-4 opacity-50" strokeWidth={2.5} />
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))
                    )}

                    {/* Typing Indicator */}
                    {typingUser && typingUser !== user.name && (
                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-[var(--color-text-tertiary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                            <span>{typingUser} is typing...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input */}
            <div className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border)] px-4 py-3">
                <div className="container-app max-w-3xl">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleTyping}
                            placeholder="Type a message..."
                            className="input flex-1"
                            disabled={!connected}
                        />
                        <Button type="submit" disabled={!newMessage.trim() || !connected}>
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
