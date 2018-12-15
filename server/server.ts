import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import './mongoose';

const app = express();
const MongoStore = connectMongo(session);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'passport auth',
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  }),
}));
app.use(cookieParser());

app.use('/', function (req, res) {
  res.json({
    app: 'passport',
  });
});

app.listen(3000, function () {
  console.log('server is running');
});
