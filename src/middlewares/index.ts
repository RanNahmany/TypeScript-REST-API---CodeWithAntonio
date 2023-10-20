import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { userId } = req.params;
        const currentUserId = get(req, 'user._id') as String;

        console.log(req.body)

        if (!currentUserId) {
            console.log('no current user id');
            return res.sendStatus(401);
        }

        if (userId !== currentUserId.toString()) {
            return res.sendStatus(403);
        }

        return next();

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        // Get the session token from the request cookies
        const sessionToken = req.cookies['sessionToken'];

        // If there is no session token, the user is not authenticated.
        if (!sessionToken) {
            console.log('no session token');
            return res.sendStatus(401);
        }

        // Get the user by their session token from the database.
        const ExistingUser = await getUserBySessionToken(sessionToken);
        if (!ExistingUser) {
            console.log('no existing user');
            return res.sendStatus(401);
        }

        merge(req, { user: ExistingUser });     // the merge imported from lodash lib

        return next();

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }

}