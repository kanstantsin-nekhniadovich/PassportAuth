import { Model } from 'mongoose';
import { UserModel } from '../models/user';

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const CLIENT_ID = '499286742753-aln8lr6eiba3iq3le1unc4au7mm37m20.apps.googleusercontent.com';
const CLIENT_SECRET = 'yREGrdZNvKSr4PcGXMsZ8Rf7';

interface GoogleProfile {
  id: string;
  username: string;
  name: string[];
}

export default function (UserShema: Model<UserModel>): void {
  passport.use(new GoogleStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/auth/google/callback',
  }, (accessToken: string, refreshToken: string, profile: GoogleProfile, done: Function): void => {
    UserShema.findOne({ 'google.id': profile.id }, function (err: Error, user: UserModel) {
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
          facebook: null,
          google: {
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
