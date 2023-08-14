import express from 'express';
import * as profileCtrl from './profile.ctrl.js';

const profile = express.Router();

profile.patch('/image', profileCtrl.uploadImage);
profile.get('/image/:username', profileCtrl.getImage);

export default profile;
