import Joi from 'joi';
import Group from '../../models/group.js';
import User from '../../models/user.js';

export const list = async (req, res) => {
    //get user id from token in the req object
    const user = await User.findByUsername(res.locals.user.username);
    
    console.log(user.groups)

    res.send()
    //get user object using user id 

    //list teamspaces that user has
}

export const create = async (req, res) => {
    //validation schema
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        password: Joi.string().required(),
        body: Joi.string().required(),
    })

    const result = schema.validate(req.body)

    if (result.error) {
        res.status(400).send(result.error);
        return;
    }

    const { name, password, body } = req.body;

    try {
        const group = new Group({
            name,
            body: body,
        })
        group.addMember(res.locals.user);
        await group.setPassword(password);
        await group.save()

        const user = await User.findByUsername(res.locals.user.username);
        user.addGroup({
            _id: group.id,
            name: group.name,
        })
        await user.save()

        console.log(user.groups)
        
        res.send()
    } catch (e) {
        res.status(500).send(e);
    }
}

export const join = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        res.sendStatus(401); //unauthroized
        return;
    }

    try {
        const user = await User.findByUsername(res.locals.user.username);
        if(user.groups.some(group => group._id.toString() === id.toString())){
            console.log("already joined")
            res.sendStatus(401);
            return;
        }

        const group = await Group.findById(id)
        if (!group) {
            console.log("there is no group to that id")
            res.sendStatus(401);
            return;
        }
        const valid = await group.checkPassword(password);
        if (!valid) {
            console.log("wrong password")
            res.sendStatus(401);
            return;
        }

        group.addMember(res.locals.user)
        await group.save()

        
        user.addGroup({
            _id: group.id,
            name: group.name,
        })
        await user.save()

        res.send()
    } catch (e) {
        res.status(500).send(e);
    }

}

