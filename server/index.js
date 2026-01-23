import express from 'express';
import {PORT} from './config/env.js';
import http from 'http';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import postRouter from './routes/post.routes.js';
import followRouter from "./routes/follow.routes.js";
import commentRouter from './routes/comment.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middleware/error.middleware.js';
import router from './routes/cloudinary.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import initSocket from './socket/socket.js';
import conversationRouter from './routes/conversation.routes.js';
import messageRouter from './routes/messages.routes.js';

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
app.use(errorMiddleware);
app.use("/api/v1/cloudinary" , router);
app.use("/api/v1/auth" , authRouter);
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/posts" , postRouter);
app.use("/api/v1/comments" , commentRouter);
app.use("/api/v1/follows" , followRouter);
app.use("/api/v1/conversations" , conversationRouter);
app.use("/api/v1/messages" , messageRouter);
initSocket(server);

app.get('/' , (req, res) => {
    res.send("Welcome to the social media api");
})

server.listen(PORT, async () =>{
    console.log(`Listening to server on http://localhost:${PORT}`);

    await connectToDatabase();
});

export default app;