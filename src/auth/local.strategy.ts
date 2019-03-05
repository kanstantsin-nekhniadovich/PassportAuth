import { UserModel } from '../models/user';
import { Model } from 'mongoose';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
import config from '../config';

export default function (User: UserModel, UserShema: Model<UserModel>) {
  passport.use(new LocalStrategy((username: string, password: string, done: Function) => {
    UserShema.findOne({ username: username }, (err: Error, user: UserModel) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!User.verifyPassword(password, user.hashed_psw)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  },
  ));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  },
    function (jwtPayload: { id: 'string' }, cb: Function) {

      // find the user in db if needed
      return UserShema.findOne({ '_id': jwtPayload.id })
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }),
  );

}
