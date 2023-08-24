import { config } from 'dotenv';
config();

import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import api from './api/index.js';
import jwtMiddleware from './lib/jwtMiddleware.js';
import cookieParser from 'cookie-parser';
import Chat from "./models/chat.js";

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected');
    })
    .catch((e) => {
        console.error(e);
    });

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);
app.use(bodyParser.json());

app.use(cookieParser());
//extends JWT if exists in the request, if not, does nothing
app.use(jwtMiddleware);

const router = express.Router();

router.use('/api', api);

app.use(router);
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', async (groupID) => {
        console.log('joined');
        socket.join(groupID); // Join the user to a socket room
        const messages = await Chat.getMessages(groupID);
        console.log(messages)
        io.to(groupID).emit('last100_messages', messages)
    });

    socket.on('send_message', async (msg) => {
        const { message, username, groupID, createdTime } = msg;
        // socket.join(groupID);
        io.to(groupID).emit('receive_message', msg);

        const newMessage = new Chat({
            message,
            groupID,
            username,
            createdTime,
        });
        await newMessage.save();
    });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
