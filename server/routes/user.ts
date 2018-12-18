import express from 'express';
import { User } from '../models/user';

const user = new User();

export function applyUserRoutes(router: express.Router) {
  router.get('/users', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    user.getUsers(req, res, next);
  });

  router.get('/users/:id', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    user.getUser(req, res, next);
  });

  router.post('/users', (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    user.createUser(req, res, next);
  });

  router.put('/users/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    user.updateUser(req, res, next);
  });

  router.delete('/users/:id', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    user.removeUser(req, res, next);
  });
}
