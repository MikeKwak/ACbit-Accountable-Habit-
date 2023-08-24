import Joi from 'joi';
import User from '../../models/user.js';

export const register = async (req, res) => {
    //validation schema
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string()
            .min(8)
            .pattern(/^(?=.*[!@#$%^&*])/, 'password')
            .required()
    });
    //validation result / error
    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message); //bad request
        return;
    }

    const { username, password } = req.body;

    if (!username || !password) {
        res.sendStatus(401); //unauthroized
        return;
    }
    
    try {
        const exists = await User.findByUsername(username);
        if (exists) {
            console.log('username is taken');
            res.sendStatus(409); //conflict
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

        res.send(user.serialize());
    } catch (e) {
        res.status(500).send(e); //internal server error
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
            console.log("User doens't exist");
            res.sendStatus(401); //unauthroized
            return;
        }
        const validPassword = await user.checkPassword(password);
        if (!validPassword) {
            console.log('wrong password');
            res.sendStatus(401); //unauthroized
            return;
        }
        //generate JWT token signed with secret key
        const token = user.generateToken();
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
        });
        //exclude password in response
        res.send(user.serialize());
    } catch (e) {
        res.status(500).send(e); //internal server error
    }
};

export const logout = async (req, res) => {
    //empty Set-Cookie header
    res.clearCookie('access_token');
    res.status(204).end();  //no content
};
