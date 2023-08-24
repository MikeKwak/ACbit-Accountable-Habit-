import Group from '../../models/group.js';
import User from '../../models/user.js';

//reduce img size
export const uploadImage = async (req, res) => {
    const { imgURL } = req.body;

    try {
        const user = await User.findByUsername(res.locals.user.username);
        user.imgURL = imgURL;
        await user.save();
    
        const groups = await Group.findGroupsByUsername(user.username)
        groups.map(async (group) => {
            group.users.map((groupUser) => {
                if (groupUser.username === user.username) {
                    groupUser.imgURL = imgURL;
                }
            });
            await group.save();
        })
        res.send();
    } catch (e) {
        res.status(500).send(e); //internal server error
    }
};

// export const getImage = async (req, res) => {
//     const { username } = req.params;
//     const user = await User.findByUsername(username);
//     if (!user) {
//         console.log("User doens't exist")
//         res.sendStatus(401);
//         return;
//     }
//     res.send(user.imgURL);
// }