import express from 'express';
import posts from './posts/index.js';
import auth from './auth/index.js'
import groups from './groups/index.js'

const api = express.Router();

api.use('/posts', posts);
api.use('/auth', auth)
api.use('/groups', groups)

export default api;
