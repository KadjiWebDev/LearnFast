const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/api/apiRoutes');
const MentorsRoutes = require('./routes/Dashboard/Indexing/MentorsRoutes');
const StudentsRoutes = require('./routes/Dashboard/Indexing/StudentsRoutes');
const AdminRoutes = require('./routes/Dashboard/Administrator/AdminRoutes');
const connectDB = require('./config/db');
const cors = require('cors')

// Load .env and connect to DB
dotenv.config();
connectDB();

const app = express();
app.use(cors());

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: { // White list / Black List
        origin: "*", // Allow all origins for now — restrict later
        methods: ["GET", "POST"]
    }
});

// ====== Middleware ======
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// ====== Routes ======
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/dashboard/mentor', MentorsRoutes);
app.use('/dashboard/student', StudentsRoutes);
app.use('/' + process.env.ADMIN_PANEL + '/', AdminRoutes);

// ====== Static HTML Routes ======
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/views/login.html'));
app.get('/signup', (req, res) => res.sendFile(__dirname + '/views/signup.html'));

// ====== SOCKET.IO Logic ======
io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Join meeting room
    socket.on('join-room', (roomId, user) => {
        socket.join(roomId);
        console.log(` ${user?.username || 'Anonymous'} joined room ${roomId}`);
        socket.to(roomId).emit('user-joined', { id: socket.id, username: user?.username || 'Student' });
    });

    // Chat message
    socket.on('chat-message', (data) => {
        const { roomId, username, message } = data;
        console.log(`💬 [${roomId}] ${username}: ${message}`);
        io.to(roomId).emit('chat-message', { username, message, timestamp: new Date() });
    });

    // Mentor starts meeting
    socket.on('mentor-start', (roomId) => {
        io.to(roomId).emit('system-message', 'Mentor has started the meeting!');
    });
    // WebRTC Signaling Relay
    socket.on("offer", (data) => {
        socket.to(data.room).emit("offer", data);
    });

    socket.on("answer", (data) => {
        socket.to(data.room).emit("answer", data);
    });

    socket.on("ice-candidate", (data) => {
        socket.to(data.room).emit("ice-candidate", data);
    });
    // Disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit('user-left', { id: socket.id });
    });
});

// ====== Start Server ======
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}/`));
