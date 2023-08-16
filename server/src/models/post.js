import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema({
    status: String,
    title: String,
    body: String,
    tags: {
        type: [String],
        default: null,
    },
    publishedDate: {
        type: Date,
        default: Date.now,
    },
    deadlineDate: Date,
    user: {
        _id: mongoose.Types.ObjectId,
        username: String,
        imgURL: {
            type: String,
            default: null,
        },
    },
});

//create model instance
const Post = mongoose.model('Post', PostSchema);
export default Post;
