import express from 'express';
import { applyUserRoutes } from './user';

export default function configRouter(router: express.Router): void {
  applyUserRoutes(router);
}
