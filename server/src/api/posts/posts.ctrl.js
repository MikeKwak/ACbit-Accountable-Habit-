import Post from '../../models/post.js';
import mongoose from 'mongoose';
import sanitizeHtml from 'sanitize-html';
import Joi from 'joi'

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
    allowedTags: [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http'],
};

//middleware
export const getPostById = async (req, res, next) => {
    const { id } = req.params;

    //check if id is a vlid ObjectId
    if (!ObjectId.isValid(id)) {
        res.sendStatus(400);
        return;
    }

    try {
        const post = await Post.findById(id);
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
        // 객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), // required() 가 있으면 필수 항목
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
    });

    // 검증 후, 검증 실패시 에러처리
    const result = Joi.validate(ctx.request.body, schema);
    if (result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = req.body;

    const post = new Post({
        title,
        body,
        tags,
        user: res.locals.user,
    });

    console.log(res.locals.user);

    try {
        await post.save();
        res.send(post);
    } catch (e) {
        res.status(500).send(e);
    }
};

const removeHtmlAndShorten = (body) => {
    const filtered = sanitizeHtml(body, {
        allowedTags: [],
    });
    return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

export const list = async (req, res) => {
    const page = parseInt(req.query.page || '1', 10);

    if (page < 1) {
        res.sendStatus(400);
        return;
    }

    const { tag, username } = req.query;

    const query = {
        ...(username ? { 'user.username': username } : {}),
        ...(tag ? { tags: tag } : {}),
    };

    try {
        const posts = await Post.find(query)
            .sort({ _id: -1 })
            .limit(10)
            .skip((page - 1) * 10)
            .lean()
            .exec();
        const postCount = await Post.countDocuments(query).exec();
        res.set('Last-Page', Math.ceil(postCount / 10));
        res.send(
            posts.map((post) => ({
                ...post,
                body:
                    post.body.length < 200
                        ? post.body
                        : `${post.body.slice(0, 200)}...`,
            })),
        );
    } catch (e) {
        res.status(500).send(e);
    }
};

export const read = async (req, res) => {
    //if this throws error I swear to fucking god
    res.send(res.locals.post);
};

export const remove = async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndRemove(id).exec();
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
