import express from 'express';
import 'express-async-errors'
import { json } from 'body-parser';
import mongoose from 'mongoose';

import {currentUserRouter} from './routes/current-user';
import {signupRouter} from './routes/signup';
import {errorHandler} from './middlewares/error-handler';
import {NotFoundError} from './errors/not-found-error';

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use('/api', signupRouter);

// This has to come before the errorHandler middleware
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });
// Use express-async-error (ensures that if we throw an error inside an async function that express listens for it)
app.all('*', async (req, res) => {
    throw new NotFoundError();
});
app.use(errorHandler);

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
        });
        console.log('Auth connected to MongoDB');
        
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => console.log('Auth service is running on  Port 3000'));
}

start();