import { Response, Request, Router, NextFunction } from 'express';
import { Controller } from './controller.interface';
import { User } from '../models/user';
const passport = require('passport');

export class UserController implements Controller {
  public router: Router;
  private path = '/users';
  private user: User;

  constructor() {
    this.router = Router();
    this.user = new User();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, passport.authenticate('jwt', { session: false }), this.getUsers);
    this.router.get(`${this.path}/:id`, passport.authenticate('jwt', { session: false }), this.getUserById);
    this.router.post(this.path, passport.authenticate('jwt', { session: false }), this.createUser);
    this.router.put(`${this.path}/:id`, passport.authenticate('jwt', { session: false }), this.updateUser);
    this.router.delete(`${this.path}/:id`, passport.authenticate('jwt', { session: false }), this.removeUser);
  }

  public getUsers = (req: Request, res: Response, next: NextFunction): void => {
    this.user.getUsers(req, res, next);
  }

  public getUserById = (req: Request, res: Response, next: NextFunction): void => {
    this.user.getUser(req, res, next);
  }

  public createUser = (req: Request, res: Response, next: NextFunction): void => {
    this.user.createUser(req, res, next);
  }

  public updateUser = (req: Request, res: Response, next: NextFunction): void => {
    this.user.updateUser(req, res, next);
  }

  public removeUser = (req: Request, res: Response, next: NextFunction): void => {
    this.user.removeUser(req, res, next);
  }
}
