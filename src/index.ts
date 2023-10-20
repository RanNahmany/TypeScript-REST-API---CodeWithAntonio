import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router';

const app = express();

app.use(
    cors({
        credentials: true,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

//  load env variables, then connect to MongoDB
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI || '';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
}); 

mongoose.connection.on('error', (error: Error) => {
    console.log('Error connecting to mongo:', error);
});

app.use('/', router());