// ============================================
// StackUp Server - Main Entry Point
// ============================================
// Express server with Socket.IO for real-time chat

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const openingRoutes = require('./routes/openings');
const applicationRoutes = require('./routes/applications');
const teamRoutes = require('./routes/teams');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const uploadRoutes = require('./routes/upload');

// Import models for Socket.IO
const Message = require('./models/Message');
const Team = require('./models/Team');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// ============================================
// Middleware
// ============================================
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/openings', openingRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/files', uploadRoutes); // File retrieval


// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'StackUp API is running' });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// ============================================
// Socket.IO Configuration
// ============================================

// Store connected users: { odId: userId }
const connectedUsers = new Map();

// Socket.IO authentication middleware
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication required'));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.userId}`);
    connectedUsers.set(socket.id, socket.userId);

    // Join team room
    socket.on('join-team', async (teamId) => {
        try {
            // Verify user is a member of this team
            const team = await Team.findById(teamId);

            if (team && team.isMember(socket.userId)) {
                socket.join(`team-${teamId}`);
                console.log(`👥 User ${socket.userId} joined team ${teamId}`);
            } else {
                socket.emit('error', { message: 'Not authorized to join this team' });
            }
        } catch (error) {
            socket.emit('error', { message: 'Error joining team' });
        }
    });

    // Leave team room
    socket.on('leave-team', (teamId) => {
        socket.leave(`team-${teamId}`);
        console.log(`🚶 User ${socket.userId} left team ${teamId}`);
    });

    // Handle new message
    socket.on('send-message', async (data) => {
        try {
            const { teamId, content } = data;

            // Verify user is a member
            const team = await Team.findById(teamId);

            if (!team || !team.isMember(socket.userId)) {
                socket.emit('error', { message: 'Not authorized to send messages' });
                return;
            }

            // Save message to database
            const message = await Message.create({
                team: teamId,
                sender: socket.userId,
                content
            });

            // Initialize readBy with sender (sender has already "read" their own message)
            message.readBy = [socket.userId];
            await message.save();
            
            // Populate sender and readBy info
            await message.populate('sender', 'name email');
            await message.populate('readBy', 'name');

            // Broadcast to all team members
            io.to(`team-${teamId}`).emit('new-message', message);

        } catch (error) {
            console.error('Message error:', error);
            socket.emit('error', { message: 'Error sending message' });
        }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
        const { teamId, userName } = data;
        socket.to(`team-${teamId}`).emit('user-typing', { userName });
    });

    // Handle stop typing
    socket.on('stop-typing', (data) => {
        const { teamId } = data;
        socket.to(`team-${teamId}`).emit('user-stop-typing');
    });

    // Handle marking messages as read
    socket.on('mark-messages-read', async (data) => {
        try {
            const { teamId } = data;
            
            // Verify user is a member
            const team = await Team.findById(teamId);
            if (!team || !team.isMember(socket.userId)) {
                return;
            }

            // Mark all unread messages in this team as read by this user
            const result = await Message.updateMany(
                {
                    team: teamId,
                    sender: { $ne: socket.userId },
                    readBy: { $ne: socket.userId }
                },
                { $addToSet: { readBy: socket.userId } }
            );

            // If messages were updated, fetch and broadcast them
            if (result.modifiedCount > 0) {
                const updatedMessages = await Message.find({
                    team: teamId,
                    readBy: socket.userId
                })
                    .populate('sender', 'name email')
                    .populate('readBy', 'name')
                    .sort({ createdAt: -1 })
                    .limit(10); // Get recent messages that were just marked as read

                // Broadcast read status update with message IDs
                io.to(`team-${teamId}`).emit('messages-read', {
                    userId: socket.userId,
                    teamId,
                    messageIds: updatedMessages.map(m => m._id.toString())
                });
            }
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.userId}`);
        connectedUsers.delete(socket.id);
    });
});

// ============================================
// Start Server
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start listening
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 Socket.IO ready for connections`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
