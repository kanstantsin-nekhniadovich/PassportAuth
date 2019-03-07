import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../config';
import { UserModel } from '../models/user';
import { UserNotFoundException } from '../exceptions';

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const UserShema = mongoose.model('User');
  const { authorization = '' } = req.headers;
  const token = authorization.split(' ')[1];

  if (!token) {
    res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.user = decoded;
    UserShema.findOne({ _id: req.user.id }, (err: Error, result: UserModel) => {
      if (err) {
        const error = new UserNotFoundException(req.user.id);
        return next(error);
      }
      const user = {
        id: result._id,
        username: result.username,
        firstName: result.firstName,
        lastName: result.lastName,
        age: result.age,
        city: result.city,
      };
      res.send(user);
    });
  });

}
