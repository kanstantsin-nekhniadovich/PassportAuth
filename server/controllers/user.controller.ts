import express, { Router } from 'express';
import { Controller } from './controller.interface';
import { User } from '../models/user';

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
    this.router.get(this.path, this.getUsers);
    this.router.get(`${this.path}/:id`, this.getUserById);
    this.router.post(this.path, this.createUser);
    this.router.put(`${this.path}/:id`, this.updateUser);
    this.router.delete(`${this.path}/:id`, this.removeUser);
  }

  public getUsers = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    this.user.getUsers(req, res, next);
  }

  public getUserById = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    this.user.getUser(req, res, next);
  }

  public createUser = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    this.user.createUser(req, res, next);
  }

  public updateUser = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    this.user.updateUser(req, res, next);
  }

  public removeUser = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    this.user.removeUser(req, res, next);
  }
}
