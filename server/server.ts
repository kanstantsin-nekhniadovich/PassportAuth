import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import configRouter from './routes';
import './mongoose';

const app = express();
const router = express.Router();
const MongoStore = connectMongo(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'passport auth',
  saveUninitialized: true,
  resave: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));
app.use(cookieParser());

app.use('/', function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
  if (err) {
    return next(err);
  }
  res.json({
    app: 'passport',
  });
});

configRouter(router);
app.use(router);

app.use(function (err: Error, req: express.Request, res: express.Response) {
  console.error(err.stack);
  console.log('qwer');
  console.log(res);
  console.log('qwer');
  res.status(500).send(err.message);
});

app.listen(3000, function () {
  console.log('server is running');
});
