import express from 'express';
import createHttpError from 'http-errors';
import { isEmpty } from 'lodash-es';

import { verify } from '../config/jwt.js';
import User from '../models/user.js';

interface RequestWithUser extends express.Request {
  user: User
}

function authMiddleware(options: {isAdmin?: boolean} = {}) {
  return async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    try {
      const header = request.header('authorization') || '';
      const token = header.replace('Bearer ', '');
      if (isEmpty(token)) {
        throw new createHttpError.Unauthorized('"Authorization: Bearer" token required.');
      }
      const data = verify(token);
      const user = await User.findByPk(data.id);
      if (!user) {
        throw new createHttpError.BadRequest('We could not figure out who you are.');
      }
      (request as RequestWithUser).user = user;
      if (options.isAdmin && !user.isAdmin) {
        throw new createHttpError.Forbidden('You do not have the rights to perform this request.');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export { authMiddleware, RequestWithUser };
