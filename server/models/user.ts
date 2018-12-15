import { Document, Schema, Model, model } from 'mongoose';
import bcrypt from 'bcrypt';
import express from 'express';

interface UserModel extends Document {
  username: string;
  password: string;
}

export class User {
  private user: Model<UserModel>;

  constructor() {
    const userSchema: Schema = new Schema({
      username: String,
      hash: String,
      salt: String,
    });
    this.user = model('User', userSchema);
  }

  public getUserModel(): Model<UserModel> {
    return this.user;
  }

  public async createUser(user: UserModel, fn: (response: any) => {}) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
      user.save()
        .then(fn)
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err.message);
    }
  }

  public async getUser(req: express.Request, res: express.Response) {
    const id = req.params.id;
    try {
      const cursor = this.user.findOne({ id: id }).cursor();
      const user = await cursor.next();
      res.send(user);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

}
