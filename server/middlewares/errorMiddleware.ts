import { Response, Request } from 'express';
import { HttpException } from '../exceptions/HttpException';

export function errorMiddleware(err: HttpException, req: Request, res: Response) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).send({
    status,
    message,
  });
}
