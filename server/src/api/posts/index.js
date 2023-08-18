import express from 'express';
import * as postsCtrl from './posts.ctrl.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js'

const posts = express.Router();



posts.get('/:groupID', postsCtrl.list);
posts.post('/:groupID', checkLoggedIn, postsCtrl.write);
posts.patch('/:groupID/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.complete);
posts.delete('/:groupID/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.remove);


// posts.get('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.read);
posts.patch('/:id', checkLoggedIn, postsCtrl.getPostById, postsCtrl.checkOwnPost, postsCtrl.update);


export default posts;


