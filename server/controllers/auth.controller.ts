import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Controller } from './controller.interface';

export class AuthController implements Controller {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.post('/login', passport.authenticate('local'), this.login);
    this.router.get('/logout', this.logout);
    this.router.get('/auth/facebook', passport.authenticate('facebook')); // TODO: refactor problem with route 'api' prefix
    this.router.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
        successRedirect: '/api/users',
        failureRedirect: '/api/login',
      }));
    this.router.get('/auth/google',
      passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
    this.router.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }), this.googlSuccessRoute);
  }

  private login = (req: Request, res: Response, next: NextFunction): void => {
    res.redirect('/api/users/' + req.user.id);
  }

  private logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout();
    res.redirect('/');
  }

  private googlSuccessRoute = (req: Request, res: Response, next: NextFunction): void => {
    res.redirect('/api/users');
  }
}
