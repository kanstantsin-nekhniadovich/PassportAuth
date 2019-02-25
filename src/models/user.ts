import { Document, Schema, Model, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { HttpException, UserNotFoundException } from '../exceptions';

export interface UserType {
  username: string;
  hashed_psw: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  facebook: {
    id: string;
    accessToken: string;
  };
  google: {
    id: string;
    accessToken: string;
  };
}

export interface UserModel extends Document, UserType {
  verifyPassword: (password: string, hash: string) => boolean;
}

export class User {
  private UserModel: Model<UserModel>;

  constructor() {
    const userSchema: Schema = new Schema({
      username: String,
      hashed_psw: String,
      firstName: String,
      lastName: String,
      age: Number,
      city: String,
      facebook: {
        type: Object,
      },
      google: {
        type: Object,
      },
    });

    userSchema.methods.verifyPassword = function (password: string, hash: string): boolean {
      return bcrypt.compareSync(password, hash);
    };
    this.UserModel = model('User', userSchema);
  }

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userData = {
      username: req.body.username,
      hashed_psw: '',
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      city: req.body.city,
    };

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      userData.hashed_psw = hash;
      const user = new this.UserModel(userData);
      user.save()
        .then(() => {
          res.status(200).send({
            message: `User ${userData.username} was successfully created`,
          });
        }).catch((err) => {
          const error = new HttpException(500, err.message);
          next(error);
        });
    } catch (err) {
      const error = new HttpException(500, err.message);
      next(error);
    }
  }

  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    if (!Types.ObjectId.isValid(id)) {
      const error = new UserNotFoundException(id);
      return next(error);
    }

    try {
      const user = await this.UserModel.findOne({ _id: id }).exec();
      res.status(200).send(user);
    } catch (err) {
      const error = new UserNotFoundException(id);
      return next(error);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.UserModel.find().exec();
      res.status(200).send(users);
    } catch (err) {
      const error = new HttpException(404, 'users not found');
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    if (!Types.ObjectId.isValid(id)) {
      const error = new UserNotFoundException(id);
      return next(error);
    }

    const userData = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      city: req.body.city,
    };

    try {
      const result = await this.UserModel.update({ _id: id }, userData).exec();
      res.status(200).send(result);
    } catch (err) {
      const error = new HttpException(500, err.message);
      next(error);
    }
  }

  public async removeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = req.params.id;

    if (!Types.ObjectId.isValid(id)) {
      const error = new UserNotFoundException(id);
      return next(error);
    }

    try {
      await this.UserModel.deleteOne({ _id: id }).exec();
      res.status(200).send({
        message: `User with id = ${id} was successfully removed`,
      });
    } catch (err) {
      const error = new HttpException(500, err.message);
      next(error);
    }
  }
}
