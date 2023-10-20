import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, auth } from '../helpers/index';


export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.sendStatus(400);
        }

        // get user by email from the MongoDB database, and select the authentication.salt and authentication.password fields
        const FieldsToInclude = '+authentication.salt +authentication.password';
        const user = await getUserByEmail(email, FieldsToInclude);

        if(!user) {
            return res.sendStatus(400);
        }

        const expectedHash = auth(password, user.authentication.salt);

        if(user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        // Generate a new session token for the user.
        const salt = random();
        user.authentication.sessionToken = auth(user._id.toString(), salt);

        await user.save();

        res.cookie('sessionToken', user.authentication.sessionToken, { domain: 'localhost', path: '/'});

        return res.status(200).json(user).end();
        

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

//  Register a new user
export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;

        //  Check if the request body is valid.
        if (!username || !email || !password) {
            return res.sendStatus(400);
        }

        //  Check if the email already exists in the database.
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.sendStatus(400);
        }

        //  Create a new user in the database.
        const salt = random();

        const user = await createUser({
            username,
            email,
            role: 'user',
            authentication: {
                password: auth(password, salt),
                salt,
            },
        })

        return res.status(200).json(user).end();

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}