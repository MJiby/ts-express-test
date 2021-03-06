import express from 'express';
import { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session'
import dotenv from 'dotenv';
import passport from 'passport';
import hpp from 'hpp';
import helmet from 'helmet';

// import { sequelize } from './models';

import userRouter from './routes/user'

dotenv.config();
const app = express();
const prod: boolean = process.env.NODE_ENV === 'production';

app.set('port', prod ? process.env.PORT : 3065);
// sequelize.sync({ force: false })
//     .then(() => {
//         console.log('데이터베이스 연결 성공');
//     })
//     .catch((err: Error) => {
//         console.error(err);
//     });

if (prod) {
    app.use(hpp());
    app.use(helmet());
    app.use(morgan('combined'));
    app.use(cors({
        // origin: /pythonlecture\.com$/,
        credentials: true,
    }));
} else {
    app.use(morgan('dev'));
    app.use(cors({
        origin: true,
        credentials: true,
    }))
}

app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    // secret: process.env.COOKIE_SECRET!,
    secret: process.env.COOKIE_SECRET || 'secret_code',
    cookie: {
        httpOnly: true,
        secure: false, // https -> true
        domain: prod ? '.nodebird.com' : undefined,
    },
    name: 'tsstudy',
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', userRouter)


const defaultRouter =