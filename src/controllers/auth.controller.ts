import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Controller } from './controller.interface';
import config from '../config';
import { verifyToken } from '../auth/verifyToken';

export class AuthController implements Controller {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post('/login', this.login);
    this.router.get('/logout', this.logout);
    this.router.get('/token', verifyToken);
    // this.router.get('/auth/facebook', passport.authenticate('facebook')); // TODO: refactor problem with route 'api' prefix
    // this.router.get('/auth/facebook/callback',
    //   passport.authenticate('facebook', {
    //     failureRedirect: '/api/login',
    //   }));
    // this.router.get('/auth/google',
    //   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
    // this.router.get('/auth/google/callback',
    //   passport.authenticate('google', { failureRedirect: '/login' }), this.googlSuccessRoute);
  }

  private login = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('local', { session: false }, (err: Error, jwtUser, info) => {
      if (err || !jwtUser) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: jwtUser,
        });
      }

      return req.login(jwtUser, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }
        const user = {
          id: jwtUser._id,
          username: jwtUser.username,
          firstName: jwtUser.firstName,
          lastName: jwtUser.lastName,
          age: jwtUser.age,
          city: jwtUser.city,
        };
        const token = jwt.sign(user, config.jwtSecret);
        return res.json({ user, token });
      });
    })(req, res);
  }

  private logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout();
    res.redirect('/');
  }

  // private googlSuccessRoute = (req: Request, res: Response, next: NextFunction): void => {
  //   res.redirect('/api/users');
  // }
}
