import mongoose from 'mongoose';

const { Schema } = mongoose;

export const PostSchema = new Schema({
    status: {
        type: String,
        enum: ['upcoming', 'completed'],
        required: true,
    },
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
    },
});

