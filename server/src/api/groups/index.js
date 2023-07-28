import express from 'express';
import * as groupsCtrl from './groups.ctrl.js';
import posts from '../posts/index.js'
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const groups = express.Router();

groups.get('/', checkLoggedIn, groupsCtrl.list)
groups.post('/create', checkLoggedIn, groupsCtrl.create)
groups.post('/join', checkLoggedIn, groupsCtrl.join)
groups.post('/leave', groupsCtrl.leave)


export default groups;
