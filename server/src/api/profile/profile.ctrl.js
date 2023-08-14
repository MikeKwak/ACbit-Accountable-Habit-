import User from '../../models/user.js';

export const uploadImage = async (req, res) => {
    const { imgURL } = req.body;
    const user = await User.findByUsername(res.locals.user.username);
    if (!user) {
        console.log("User doens't exist")
        res.sendStatus(401);
        return;
    }
    user.imgURL = imgURL;
    await user.save();
    console.log(user)
    res.send();
};


export const getImage = async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username);
    if (!user) {
        console.log("User doens't exist")
        res.sendStatus(401);
        return;
    }
    res.send(user.imgURL);
}