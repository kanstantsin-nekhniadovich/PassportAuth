import { Model } from 'mongoose';
import { UserModel } from '../models/user';

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const CLIENT_ID = '1145756292155454';
const CLIENT_SECRET = 'c4700acb7152e3febed0be07d35b48c6';

interface FacebookProfile {
  id: string;
  username: string;
  name: string[];
}

export default function (UserShema: Model<UserModel>) {
  passport.use(new FacebookStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/auth/facebook/callback',
  }, (accessToken: string, refreshToken: string, profile: FacebookProfile, done: Function): void => {
    UserShema.findOne({ 'facebook.id': profile.id }, function (err: Error, user: UserModel) {
      if (err) {
        done(err, null);
      }
      if (user) {
        done(null, user);
      } else {
        const userData = {
          username: profile.username,
          hashed_psw: '',
          firstName: profile.name[0],
          lastName: profile.name[1],
          age: null,
          city: null,
          google: null,
          facebook: {
            id: profile.id,
            accessToken: accessToken,
          },
        };

        const userModel = new UserShema(userData);
        userModel.save().then((user: UserModel) => {
          done(null, user);
        }).catch((err: Error) => {
          done(err, null);
        });

      }
    });
  },
  ));
}
