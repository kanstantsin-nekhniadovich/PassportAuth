import { Document, Schema, Model, model } from 'mongoose';
import bcrypt from 'bcrypt';
import express from 'express';

interface UserModel extends Document {
  username: string,
  password: string
}

export class User {
  private user: Model<UserModel>;

  constructor() {
    const userSchema: Schema = new Schema({
      username: String,
      hash: String,
      salt: String
    });
    this.user = model('User', userSchema);
  }

  public getUserModel(): Model<UserModel> {
    return this.user;
  }

  public createUser(user: UserModel, fn: () => {}) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return;
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        user.save(fn);
      });
    });
  }

  public async getUser(req: express.Request, res: express.Response) {
    const id = req.params.id;
    try {
      const user = await this.user.findOne({ id: id });
      res.send(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

}