import dotenv from 'dotenv';
dotenv.config();

import createError from 'http-errors';
import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import { userRouter } from './routes/users';

const port = process.env.PORT;

export const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

const whitelist = ['http://localhost:3000', 'http://localhost:3001'];

app.get('/', (req, res) => {
  res.render('index.pug');
});

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(cors(corsOptions));

app.use('/users', userRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: (arg0: any) => void) => {
  next(createError(404));
});

// error handler
app.use(
  (
    err: { message: string; status: number },
    req: { app: { get: (arg0: string) => string } },
    res: {
      locals: {
        message: string;
        error: { message: string; status: number } | {};
      };
      status: (arg0: number) => void;
      render: (arg0: string) => void;
    },
    next: any
  ): void => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
