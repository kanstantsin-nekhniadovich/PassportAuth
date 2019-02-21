import mongoose from 'mongoose';
import 'dotenv/config';
import * as Utils from './utils';

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
} = process.env;

export class MongooseConfiguration {
  private connectionPath: string;

  constructor() {
    mongoose.Promise = global.Promise;
    this.connectionPath = Utils.isProdMode() ? `mongodb://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}` : 'mongodb://localhost/PassportAuth';
  }

  public connect() {
    mongoose.connect(this.connectionPath, {}, () => {
      console.log('mongoose connected');
    });
  }

}
