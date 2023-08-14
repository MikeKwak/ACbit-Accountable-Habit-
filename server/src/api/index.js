import express from 'express';
import posts from './posts/index.js';
import auth from './auth/index.js';
import groups from './groups/index.js';
import chat from './chat/index.js';
import profile from './profile/index.js';

const api = express.Router();

api.use('/posts', posts);
api.use('/auth', auth);
api.use('/groups', groups);
api.use('/chat', chat);
api.use('/profile', profile);

export default api;
