import { Document, Schema, Model, model } from 'mongoose';
import bcrypt from 'bcrypt';
import express from 'express';

export interface UserType {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
}

interface UserModel extends Document { }

export class User {
  private UserModel: Model<UserModel>;

  constructor() {
    const userSchema: Schema = new Schema({
      username: String,
      password: String,
      firstName: String,
      lastName: String,
      age: Number,
      city: String,
    });
    this.UserModel = model('User', userSchema);
  }

  public async createUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const userData = {
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      city: req.body.city,
    };

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(userData.password, salt);
      userData.password = hash;
      const user = new this.UserModel(userData);
      user.save()
        .then(() => {
          res.json({
            message: `User ${userData.username} was successfully created`,
          });
        }).catch((err) => {
          next(err);
        });
    } catch (err) {
      next(err);
    }
  }

  public async getUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;

    try {
      const cursor = this.UserModel.findOne({ _id: id }).cursor();
      const user = await cursor.next();
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  public async getUsers(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const cursor = this.UserModel.find().cursor();
      const users = await cursor.next();
      res.json(users);
    } catch (err) {
      console.log('here');
      next(err);
    }
  }

  public async updateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;
    const userData = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      city: req.body.city,
    };

    try {
      const cursor = this.UserModel.update({ _id: id }, userData).cursor();
      const result = await cursor.next();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  public async removeUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    const id = req.params.id;

    try {
      const cursor = this.UserModel.deleteOne({ _id: id }).cursor();
      await cursor.next();
      res.json({
        message: `User with id = ${id} was successfully removed`,
      });
    } catch (err) {
      next(err);
    }
  }

}
