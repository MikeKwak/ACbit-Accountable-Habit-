import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { PostSchema } from './post.js'

const { Schema } = mongoose;

const GroupSchema = new Schema({
    name: String,
    groupID: String,
    hashedPassword: String,
    posts: {
        type: [PostSchema],
        default: [],
    },
    users: {
        type: [
            {
                _id: mongoose.Types.ObjectId,
                username: String,
                imgURL: String,
            },
        ],
        default: [],
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

function generateRandomID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomID = '';
    const length = 6;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomID += characters.charAt(randomIndex);
    }
  
    return randomID;
}

GroupSchema.methods.setPassword = async function (password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

GroupSchema.methods.setGroupID = function () {
    const randomID = generateRandomID();
    while(!Group.findOne({ groupID: randomID})){
        randomID = generateRandomID();
    }
    this.groupID = randomID;
};

GroupSchema.methods.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};

GroupSchema.methods.addMember = function (member) {
    this.users.push(member);
};

GroupSchema.methods.removeMember = async function (username) {
    this.users = this.users.filter((user) => user.username !== username)
    await this.save();
}

GroupSchema.methods.addPost = async function (post) {
    this.posts.push(post);
    await this.save()
};

GroupSchema.methods.completePost = async function(id) {
    const postIndex = this.posts.findIndex(post => post._id.toString() === id);
    
    if (postIndex !== -1) {
        this.posts[postIndex].status = 'completed';
        await this.save();
    }
}

GroupSchema.methods.removePost = async function(id) {
    this.posts = this.posts.filter((post) => !post._id.equals(id))
    await this.save()
}

GroupSchema.methods.serialize = function () {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

GroupSchema.statics.findByID = async function (id) {
    return await this.findOne({ groupID : id });
};

GroupSchema.statics.findGroupsByUsername = async function (username) {
    return await this.find({ 'users.username': username });
};

// GroupSchema.statics.removeGroupByID = async function (id) {
//     const deleted = await Group.deleteOne({ groupID: id })
//     return deleted;
// }   

const Group = mongoose.model('Group', GroupSchema);
export default Group;