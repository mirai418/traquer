import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import { DatabaseError, ValidationError } from 'sequelize';
import jwt from 'jsonwebtoken';

function errorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
  if (error instanceof jwt.TokenExpiredError) {
    error = new createHttpError.Unauthorized('"Authorization: Bearer" token expired.');
  } else if (error instanceof jwt.JsonWebTokenError) {
    error = new createHttpError.Unauthorized('"Authorization: Bearer" token invalid.');
  } else if (error instanceof ValidationError) {
    error = new createHttpError.BadRequest(error.message);
  } else if (error instanceof DatabaseError) {
    error = new createHttpError.BadRequest(error.message);
  }
  if (process.env.NODE_ENV === 'production') {
    delete error.stack;
  }
  next(error);
}

export default errorHandler;
