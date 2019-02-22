import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Request, Response } from 'express';
import { App } from '../../shared/App'

export function renderSSR(req: Request, res: Response): void {
  const mockup = renderToString(
    <App />
  );

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with React</title>
        <script src="/app.js" defer></script>
      </head>
      
      <body>
        <div id="app">${mockup}</div>
      </body>
    </html>
  `);
}
