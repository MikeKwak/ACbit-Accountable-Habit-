import express from 'express'
import * as chatCtrl from './chat.ctrl.js';

const chat = express.Router();

chat.get('/:groupID', chatCtrl.list);
chat.post('/:groupID', chatCtrl.send);


export default chat;