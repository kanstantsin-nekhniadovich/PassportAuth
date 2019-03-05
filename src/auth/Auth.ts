import mongoose, { Model } from 'mongoose';
import { UserModel, UserType } from '../models/user';
import initLocalStrategy from './local.strategy';
// import initFacebookStrategy from './facebook.strategy';
// import initGoogleStrategy from './google.strategy';

const passport = require('passport');

export class Auth {
  private userShema: Model<UserModel>;
  private user: UserModel;

  constructor() {
    this.userShema = mongoose.model('User');
    this.user = new this.userShema();
  }

  public init(): void {
    initLocalStrategy(this.user, this.userShema);
    // initFacebookStrategy(this.userShema);
    // initGoogleStrategy(this.userShema);
    this.initSerializationFunctions();
  }

  public initSerializationFunctions(): void {
    passport.serializeUser((user: UserModel, done: Function) => {
      done(null, user.id);
    });

    passport.deserializeUser((id: string, done: Function): void => {
      this.userShema.findById(id, function (err: Error, user: UserType) {
        done(err, user);
      });
    });
  }

}
