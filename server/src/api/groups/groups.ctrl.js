import Joi from 'joi';
import Group from '../../models/group.js';
import User from '../../models/user.js';

export const list = async (req, res) => {
    const user = await User.findByUsername(res.locals.user.username);
    res.send(user.groups);
};

export const create = async (req, res) => {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    const { name, password } = req.body;

    try {
        const group = new Group({
            name,
        });
        console.log(res.locals.user);
        await group.addMember(res.locals.user);
        await group.setGroupID();
        await group.setPassword(password);
        await group.save();

        const user = await User.findByUsername(res.locals.user.username);
        user.addGroup({
            groupID: group.groupID,
            name: group.name,
        });
        await user.save();

        res.send(group.serialize());
    } catch (e) {
        res.status(500).send(e);
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
            res.sendStatus(401);
            return;
        }

        const group = await Group.findByID(groupID);
        if (!group) {
            console.log('there is no group to that id');
            res.sendStatus(401);
            return;
        }
        const valid = await group.checkPassword(password);
        if (!valid) {
            console.log('wrong password');
            res.sendStatus(401);
            return;
        }

        await group.addMember(res.locals.user);
        await group.save();

        await user.addGroup({
            groupID: group.groupID,
            name: group.name,
        });
        await user.save(user.groups);

        res.send(group);
    } catch (e) {
        res.status(500).send(e);
    }
};

export const leave = async (req, res) => {
    const { groupID } = req.body;
    const user = await User.findByUsername(res.locals.user.username);
    
    try{
        await user.leaveGroup(groupID);
    } catch {
        console.log("error leaveGroup")
    }

    const group = await Group.findByID(groupID);
   
    
    if (group.users.length === 1) {
        await Group.deleteOne({ groupID: groupID })
        // await Group.save()
    } else {
        await group.removeMember(user.username);
        await group.save()
    }
    res.send(user.groups)
}
