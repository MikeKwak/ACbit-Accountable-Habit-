import Joi from 'joi';
import Group from '../../models/group.js';
import User from '../../models/user.js';

export const list = async (req, res) => {
    const user = await User.findByUsername(res.locals.user.username);
    //denormalization
    const groupInfoPromises = user.groups.map(async (group) => {
        const groupDocument = await Group.findByID(group.groupID);
        
        const groupInfo = {
            groupID: groupDocument.groupID,
            name: groupDocument.name,
            users: groupDocument.users,
        };
        
        return groupInfo;
    });
    res.send(await Promise.all(groupInfoPromises));
};

export const create = async (req, res) => {
    //validation schema
    const schema = Joi.object().keys({
        name: Joi.string().max(20).required(),
        password: Joi.string().min(8).required(),
    });
    //validation result / error
    const result = schema.validate(req.body);
    if (result.error) {
        console.log(result.error.details[0].message)
        res.status(400).send(result.error.details[0].message); //bad request
        return;
    }

    const { name, password } = req.body;

    try {
        const user = await User.findByUsername(res.locals.user.username);
        const group = new Group({
            name,
        });
        await group.addMember({ ...res.locals.user, imgURL: user.imgURL });
        await group.setGroupID();
        await group.setPassword(password);
        await group.save();

        user.addGroup({
            groupID: group.groupID,
            name: group.name,
        });
        await user.save();

        res.send({
            name: group.name,
            groupID: group.groupID,
            users: group.users,
        });
    } catch (e) {
        res.status(500).send(e); //internal server error
    }
};

export const join = async (req, res) => {
    const { groupID, password } = req.body;

    if (!groupID || !password) {
        res.sendStatus(401); //unauthroized
        return;
    }

    try {
        const user = await User.findByUsername(res.locals.user.username);
        if (user.groups.some((group) => group.groupID === groupID)) {
            console.log('already joined');
            res.sendStatus(409); //conflict
            return;
        }

        const group = await Group.findByID(groupID);
        if (!group) {
            console.log('there is no group to that id');
            res.sendStatus(404); //not found
            return;
        }
        const valid = await group.checkPassword(password);
        if (!valid) {
            console.log('wrong password');
            res.sendStatus(401); //unauthroized
            return;
        }

        await group.addMember({ ...res.locals.user, imgURL: user.imgURL });
        await group.save();

        await user.addGroup({
            groupID: group.groupID,
            name: group.name,
        });
        await user.save(user.groups);

        res.send({
            name: group.name,
            groupID: group.groupID,
            users: group.users,
        });
    } catch (e) {
        res.status(500).send(e); //internal server error
    }
};

export const leave = async (req, res) => {
    const { groupID } = req.body;
    try {
        const user = await User.findByUsername(res.locals.user.username);

        await user.leaveGroup(groupID);

        const group = await Group.findByID(groupID);
        if (!group) {
            res.sendStatus(404); //not found
            return;
        }
        //if no user left in the group
        if (group.users.length === 1) {
            await Group.deleteOne({ groupID: groupID });
            await Chat.deleteMessages(groupID);
        } else {
            group.removeMember(user.username);
            await group.save();
        }
        res.send(user.groups);
    } catch (e) {
        res.status(500).send(e); //internal server error
    }
};

export const get = async (req, res) => {
    const { groupID } = req.params;
    try {
        const group = await Group.findByID(groupID);
        if (!group) {
            res.sendStatus(404); //not found
            return;
        }
        res.send(group.serialize());
    } catch (e) {
        res.status(500).send(e); //internal server error
    }
}
