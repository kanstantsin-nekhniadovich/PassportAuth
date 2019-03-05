import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy, Profile } from 'passport-google-oauth';
import { Model } from 'mongoose';
import { UserModel } from '../models/user';
import { Request } from 'express';
import { google } from '../oauthData';

export default function (UserShema: Model<UserModel>): void {
  passport.use(new GoogleStrategy({
    clientID: google.CLIENT_ID,
    clientSecret: google.CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/api/auth/google/callback',
    passReqToCallback: false,
  }, (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: Function): void => {
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
          firstName: profile.name ? profile.name.givenName : '',
          lastName: profile.name ? profile.name.familyName : '',
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
