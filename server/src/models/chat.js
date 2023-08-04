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

ChatSchema.statics.getMessages = async function (groupID){
        console.log(groupID)
    const messages = await this.find({ groupID }).exec();
    return messages;
}

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;