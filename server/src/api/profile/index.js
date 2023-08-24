import express from 'express';
import * as profileCtrl from './profile.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const profile = express.Router();

profile.patch('/image', checkLoggedIn, profileCtrl.uploadImage);
// profile.get('/image/:username', profileCtrl.getImage);

export default profile;
