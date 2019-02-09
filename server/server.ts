import { App } from './app';
import { UserController } from './controllers';
import * as Utils from './utils';

if (Utils.isProdMode()) {
  Utils.validateEnv();
}

const app = new App([
  new UserController(),
]);

app.listen();
