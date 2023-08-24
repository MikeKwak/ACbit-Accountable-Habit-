import express from 'express';
import * as authCtrl from './auth.ctrl.js';

const auth = express.Router();

auth.post('/register', authCtrl.register);
auth.post('/login', authCtrl.login);
auth.post('/logout', authCtrl.logout);
// auth.get('/check', authCtrl.check);

export default auth;
