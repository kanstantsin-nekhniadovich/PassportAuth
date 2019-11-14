import fs from 'fs';
import https from 'https';
import { App } from './app';
import { UserController, AuthController } from './controllers';
import * as Utils from './utils';
import config from './config';

if (Utils.isProdMode()) {
  Utils.validateEnv();
}

const expressApp = new App([
  new UserController(),
  new AuthController(),
]);

https.createServer({
  key: fs.readFileSync('server.key'), // for generation: openssl req -nodes -new -x509 -keyout server.key -out server.cert, server name: localhost
  cert: fs.readFileSync('server.cert'),
}, expressApp.app).listen(config.port, () => {
  console.log(`the app is listening on port ${config.port}`);
});
