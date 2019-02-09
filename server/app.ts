import express, { Application } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectMongo, { MongoStoreFactory } from 'connect-mongo';
import mongoose from 'mongoose';
import { MongooseConfiguration } from './mongoose';
import { Controller } from './controllers';
import { errorMiddleware } from './middlewares/errorMiddleware';

export class App {
  public app: Application;
  public port: number;
  public mongoStore: MongoStoreFactory;
  private endpointPrefix = 'api';

  constructor(controllers: Controller[]) {
    this.app = express();
    this.mongoStore = connectMongo(session);
    this.confiMongoose();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.port = 4000;
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`server is listening on port: ${this.port}`);
    });
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller: Controller) => {
      this.app.use(`/${this.endpointPrefix}`, controller.router);
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(session({
      secret: 'passport auth',
      saveUninitialized: true,
      resave: true,
      cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
      store: new this.mongoStore({
        mongooseConnection: mongoose.connection,
      }),
    }));
    this.app.use(cookieParser());
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private confiMongoose(): void {
    const mongooseConfig = new MongooseConfiguration();
    mongooseConfig.connect();
  }
}
