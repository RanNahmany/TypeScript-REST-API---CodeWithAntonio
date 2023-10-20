import crypto from 'crypto';

const SECRET = 'RAN';

export const random = () => crypto.randomBytes(128).toString('base64');

export const auth = (password: string, salt: string) => {
    return crypto.createHmac('sha256', [password, salt].join(':')).digest('hex');
};