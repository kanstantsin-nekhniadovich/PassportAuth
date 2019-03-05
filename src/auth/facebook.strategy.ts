import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import { Model } from 'mongoose';
import { UserModel } from '../models/user';

const CLIENT_ID = '1145756292155454';
const CLIENT_SECRET = 'c4700acb7152e3febed0be07d35b48c6';

export default function (UserShema: Model<UserModel>): void {
  passport.use(new FacebookStrategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/auth/facebook/callback',
  }, (accessToken: string, refreshToken: string, profile: Profile, done: Function): void => {
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
          firstName: profile.name ? profile.name.givenName : '',
          lastName: profile.name ? profile.name.familyName : '',
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
