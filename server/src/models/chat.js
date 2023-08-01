import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChatSchema = new Schema({
    message: String, 
    groupID: String,
    username: String,
    createdTime: {
        type: Date, 
        default: Date.now,
    }
});

ChatSchema.static.getMessages = function (groupID){
    return this.find({ groupID }).exec();
}

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;