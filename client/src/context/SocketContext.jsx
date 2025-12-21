// ============================================
// Socket Context
// ============================================
// Provides Socket.IO connection across the app
// Handles real-time chat connections

import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

/**
 * Custom hook to access socket context
 */
export const useSocket = () => {
    return useContext(SocketContext);
};

/**
 * Socket Provider Component
 * Manages Socket.IO connection lifecycle
 */
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const { token, isAuthenticated } = useAuth();

    useEffect(() => {
        // Only connect if authenticated
        if (!isAuthenticated || !token) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        // Create socket connection with auth token
        const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token },
            transports: ['websocket', 'polling']
        });

        socketInstance.on('connect', () => {
            console.log('🔌 Socket connected');
            setConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
            setConnected(false);
        });

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error);
            // Show toast for socket errors
            if (error.message) {
                toast.error(error.message);
            }
        });

        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
            socketInstance.disconnect();
        };
    }, [isAuthenticated, token]);

    /**
     * Join a team chat room
     */
    const joinTeam = (teamId) => {
        if (socket) {
            socket.emit('join-team', teamId);
        }
    };

    /**
     * Leave a team chat room
     */
    const leaveTeam = (teamId) => {
        if (socket) {
            socket.emit('leave-team', teamId);
        }
    };

    /**
     * Send a message to team chat
     */
    const sendMessage = (teamId, content) => {
        if (socket) {
            socket.emit('send-message', { teamId, content });
        }
    };

    /**
     * Emit typing indicator
     */
    const emitTyping = (teamId, userName) => {
        if (socket) {
            socket.emit('typing', { teamId, userName });
        }
    };

    /**
     * Stop typing indicator
     */
    const stopTyping = (teamId) => {
        if (socket) {
            socket.emit('stop-typing', { teamId });
        }
    };

    /**
     * Mark messages as read
     */
    const markMessagesRead = (teamId) => {
        if (socket) {
            socket.emit('mark-messages-read', { teamId });
        }
    };

    const value = {
        socket,
        connected,
        joinTeam,
        leaveTeam,
        sendMessage,
        emitTyping,
        stopTyping,
        markMessagesRead
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};
