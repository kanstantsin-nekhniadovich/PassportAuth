import express, { Application } from 'express';
import bodyParser from 'body-parser';
// import session from 'express-session';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import { MongoStoreFactory } from 'connect-mongo';
// import mongoose from 'mongoose';
import passport from 'passport';
import { MongooseConfiguration } from './mongoose';
import { Controller } from './controllers';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { Auth } from './auth/Auth';

export class App {
  public app: Application;
  // public mongoStore: MongoStoreFactory;
  private endpointPrefix = 'api';
  private auth: Auth;

  constructor(controllers: Controller[]) {
    this.app = express();
    // this.mongoStore = connectMongo(session);
    this.configMongoose();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.auth = new Auth();
    this.auth.init();
    this.initializeErrorHandling();
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use(`/${this.endpointPrefix}`, controller.router);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    // this.app.use(session({
    //   secret: 'passport auth',
    //   saveUninitialized: true,
    //   resave: true,
    //   cookie: {
    //     path: '/',
    //     httpOnly: true,
    //     maxAge: 24 * 60 * 60 * 1000,
    //   },
    //   store: new this.mongoStore({
    //     mongooseConnection: mongoose.connection,
    //   }),
    // }));
    // remove it after check including index.html
    this.app.use(express.static(__dirname));
    this.app.set('view engine', 'html');

    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    // this.app.use(passport.session());
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  private configMongoose(): void {
    const mongooseConfig = new MongooseConfiguration();
    mongooseConfig.connect();
  }
}
