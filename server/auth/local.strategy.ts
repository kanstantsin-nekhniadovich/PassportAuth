import { UserModel, UserType } from '../models/user';
import { Model } from 'mongoose';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

export default function (User: UserModel, UserShema: Model<UserModel>) {
  passport.use(new LocalStrategy((username: string, password: string, done: Function) => {
    UserShema.findOne({ username: username }, (err: Error, user: UserModel) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!User.verifyPassword(password, user.id)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  },
  ));
}
