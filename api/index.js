import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import chatRoutes from './routes/chat.route.js';
import cors from 'cors';
import http from 'http'; 
import { Server }from 'socket.io'; 
import notificationRoutes from './routes/notifications.route.js';
import favoriteRoutes from './routes/favourites.route.js'
import path from "path";


dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected Successfully!");
}).catch((error) => {
  console.log("❌ MongoDB Connection Error:", error.message);
});

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listings', listingRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });

  console.error("Error:", err.stack);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

export { io };

app.set("io", io);

const users = {};


io.on("connection", (socket) => {

  socket.on("addUser", (userId) => {
    users[userId] = socket.id;  
  });
  

  socket.on("sendMessage", (message) => {
    const receiverSocketId = users[message.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", message);
    }
  });

  socket.on("deleteMessage", (message) => {
    const receiverSocketId = users[message.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deleteMessage", message.msgId);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`);
});
