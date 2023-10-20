import express from 'express';

import { getUsers, deleteUserById, getUserById, updateUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        console.log('getAllUsers Handler has been called');
        return res.status(200).json(users).end();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params;

        const deletedUser = await deleteUserById(userId);

        return res.status(200).json(deletedUser).end();

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { userId } = req.params;
        const { username } = req.body;

        if (!username) {
            return res.sendStatus(400);
        }

        const user = await getUserById(userId);

        if (!user) {
            return res.sendStatus(400);
        }

        user.username = username;

        await user.save();

        return res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}