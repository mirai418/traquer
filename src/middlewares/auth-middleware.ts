import express from 'express';
import jwt from 'jsonwebtoken';
import { isEmpty } from 'lodash-es';
import { NotAdminError, NoUserError, TokenEmptyError } from '../config/errors.js';

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
        throw new TokenEmptyError();
      }
      const data = verify(token);
      const user = await User.findByPk(data.id);
      if (!user) {
        throw new NoUserError();
      }
      (request as RequestWithUser).user = user;
      if (options.isAdmin && !user.isAdmin) {
        throw new NotAdminError();
      }
      next();
    } catch (error) {
      if (error instanceof TokenEmptyError || error instanceof NoUserError) {
        response.status(401).json({
          message: 'Unauthorized. Authorization token is required.',
        });
      } else if (error instanceof jwt.TokenExpiredError) {
        response.status(401).json({
          message: 'Unauthorized. Authorization token is expired.',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        response.status(401).json({
          message: 'Unauthorized. Authorization token is invalid.',
        });
      }  else if (error instanceof NotAdminError) {
        response.status(403).json({
          message: 'Forbidden. You do not have the rights to perform this request.',
        });
      } else {
        response.status(500).json({
          message: 'Unknown error in authMiddleware.',
        });
      }
    }
  };
}

export { authMiddleware, RequestWithUser };
