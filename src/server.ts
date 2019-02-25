import { App } from './app';
import { UserController, AuthController } from './controllers';
import * as Utils from './utils';

if (Utils.isProdMode()) {
  Utils.validateEnv();
}

const app = new App([
  new UserController(),
  new AuthController(),
]);

app.listen();
