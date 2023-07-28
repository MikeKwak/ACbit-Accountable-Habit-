import Joi from 'joi';
import User from '../../models/user.js';

export const register = async (req, res) => {
    //validation schema
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
        console.log("Invalid username or password")
        res.status(400).send(result.error);
        return;
    }

    const { username, password } = req.body;
    try {
        const exists = await User.findByUsername(username);
        if (exists) {
            console.log("username is taken")
            res.sendStatus(409);       //conflict
            return;
        }

        //DB 
        const user = new User({
            username,
        });
        await user.setPassword(password);
        await user.save();

        //generate Token
        const token = user.generateToken();
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        });

        console.log("register sucess")
        res.send(user.serialize());
    } catch (e) {
        res.status(500).send(e);
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.sendStatus(401); //unauthroized
        return;
    }

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            console.log("User doens't exist")
            res.sendStatus(401);
            return;
        }
        const validPassword = await user.checkPassword(password);
        if (!validPassword) {
            console.log("wrong password")
            res.sendStatus(401);
            return;
        }

        const token = user.generateToken();
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        });

        res.send(user.serialize());
    } catch (e) {
        res.status(500).send(e);
    }
};

export const check = async (req, res) => {
    const { user } = res.locals;
    if (!user) {
        res.sendStatus(401);
        return;
    }
    res.send(user);
};

export const logout = async (req, res) => {
    res.clearCookie('access_token');
    res.status(204).end();
};
