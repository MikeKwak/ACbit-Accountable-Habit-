import { PostSchema} from '../../models/post.js';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import Joi from 'joi';
import Group from '../../models/group.js';
import User from '../../models/user.js';
import * as chrono from 'chrono-node'

const { ObjectId } = mongoose.Types;

// const sanitizeOption = {
//     allowedTags: [
//         'h1',
//         'h2',
//         'b',
//         'i',
//         'u',
//         's',
//         'p',
//         'ul',
//         'ol',
//         'li',
//         'blockquote',
//         'a',
//         'img',
//     ],
//     allowedAttributes: {
//         a: ['href', 'name', 'target'],
//         img: ['src'],
//         li: ['class'],
//     },
//     allowedSchemes: ['data', 'http'],
// };

export const list = async (req, res) => {
    const { groupID } = req.params;
    try {
        const group = await Group.findByID(groupID);
        if (!group) {
            res.sendStatus(404);
            return;
        }

        res.send(group.posts);
    } catch (e) {
        console.log(e);
        res.send(e);
    }
};

export const getPostById = async (req, res, next) => {
    const { id, groupID } = req.params;

    //check if id is a vlid ObjectId
    if (!ObjectId.isValid(id)) {
        res.sendStatus(400);
        return;
    }

    try {
        const group = await Group.findOne({ groupID: groupID })
        const post = group.posts.find(post => post._id.toString() === id);
        if (!post) {
            res.sendStatus(404);
            return;
        }
        res.locals.post = post;
        return next();
    } catch (e) {
        res.status(500).send(e);
    }
};

export const write = async (req, res) => {
    const schema = Joi.object().keys({
        title: Joi.string().required(), 
        tags: Joi.string(),
        body: Joi.string().required(),
        deadline: Joi.string(),
        // deadline: Joi.string().required(),
        // tags: Joi.array().items(Joi.string()), 
    });
    const result = schema.validate(req.body);
    
    if (result.error) {
        console.log('error')
        console.log(req.body)
        res.status(400).send(result.error);
        return;
    }
    

    const { title, body, tags } = req.body;
    const deadline = chrono.parseDate(req.body.deadline);
    const { username } = res.locals.user;
    const user = await User.findByUsername(username);
    try {
        const newPost = {
            status: 'upcoming',
            title,
            body,
            tags,
            deadlineDate: deadline,
            user: {
                ...res.locals.user,
                imgURL: user.imgURL,
            }
        };
        
        const { groupID } = req.params;
        const group =  await Group.findByID(groupID);
        await group.addPost(newPost);
        // await newPost.save();
   
        res.send(newPost);
    } catch (e) {
        console.log('fuck')
        res.status(500).send(e);
    }
};

export const complete = async (req, res) => {
    const { groupID, id } = req.params;
   
    try {
        const group =  await Group.findByID(groupID);
        await group.completePost(id)

        const { username } = res.locals.user;
        const user = await User.findByUsername(username);

        const currentDate = new Date();
        const todayDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
        );

        const updatedTaskData = user.taskData.map((task) => {
            const taskDate = new Date(task.date);

            if (taskDate.getTime() === todayDate.getTime()) {
                return {
                    ...task,
                    tasksCompleted: task.tasksCompleted + 1,
                };
            }

            return task;
        });

        const taskExistsForToday = updatedTaskData.some(
            (task) => new Date(task.date).getTime() === todayDate.getTime(),
        );

        if (!taskExistsForToday) {
            updatedTaskData.push({
                date: todayDate,
                tasksCompleted: 1,
            });
        }

        user.taskData = updatedTaskData;
        await user.save();

        res.send(group.posts);
    }catch (e) {
        console.log('fuck')
        res.status(500).send(e);
    }
}

const removeHtmlAndShorten = (body) => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

// export const list = async (req, res) => {
//     const page = parseInt(req.query.page || '1', 10);

//     if (page < 1) {
//         res.sendStatus(400);
//         return;
//     }

//     const { tag, username } = req.query;

//     const query = {
//         ...(username ? { 'user.username': username } : {}),
//         ...(tag ? { tags: tag } : {}),
//     };

//     try {
//         const posts = await Post.find(query)
//             .sort({ _id: -1 })
//             .limit(10)
//             .skip((page - 1) * 10)
//             .lean()
//             .exec();
//         const postCount = await Post.countDocuments(query).exec();
//         res.set('Last-Page', Math.ceil(postCount / 10));
//         res.send(
//             posts.map((post) => ({
//                 ...post,
//                 body:
//                     post.body.length < 200
//                         ? post.body
//                         : `${post.body.slice(0, 200)}...`,
//             })),
//         );
//     } catch (e) {
//         res.status(500).send(e);
//     }
// };

export const read = async (req, res) => {
    //if this throws error I swear to fucking god
    res.send(res.locals.post);
};

export const remove = async (req, res) => {
    const { groupID, id } = req.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        const group =  await Group.findByID(groupID);
        await group.removePost(id);
        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const update = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndUpdate(id, req.body, {
            new: true,
        }).exec();
        if (!post) {
            res.sendStatus(404);
            return;
        }
        res.send(post);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const checkOwnPost = (req, res, next) => {
    const { user, post } = res.locals;
    if (post.user._id.toString() !== user._id) {
        res.sendStatus(403);
        return;
    }
    return next();
};
