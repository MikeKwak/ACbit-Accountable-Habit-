import Chat from "../../models/chat.js";

export const list = async (req, res) => {
    try{
        const messages = await Chat.getMessages(req.params.groupID);
        res.send(messages);
    } catch (e) {
        res.status(500).send(e);
    }
}

export const send = async (req, res) => {
    const { message, groupID, username } = req.body
    
    try{
        const newMessage = new Chat({
            message,
            groupID,
            username,
        })
        await newMessage.save();
    } catch (e) {
        res.status(500).send(e);
    }
}