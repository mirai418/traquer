import express, { Request, Response, NextFunction } from 'express';
import EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';

import Controller from './controller-interface.js';
import User from '../models/user.js';
import { sign, verify } from '../config/jwt.js';
import { send } from '../utils/mailer.js';
import { merge } from 'lodash-es';

const VERIFICATION_TOKEN_EXPIRY = 60;
const AUTH_TOKEN_EXPIRY = 60 * 60;

class AuthController implements Controller {
  public path = '/auth';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.get);
    this.router.post(this.path, this.post);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const verificationToken = (request.query.token)?.toString() || '';
      const verifiedData = verify(verificationToken);
      const [user, created] = await User.findOrCreate({
        where: verifiedData,
        defaults: merge(verifiedData, {
          isVerified: true,
        }),
      });
      const authToken = sign(user, AUTH_TOKEN_EXPIRY);
      response.json({
        authToken: authToken,
        userCreated: created,
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        response.status(401).json({
          message: 'Could not parse token because it is expired.',
        });
      } else {
        next(error);
      }
    }
  }

  public async post(request: Request, response: Response, next: NextFunction) {
    try {
      const email: string = request.body.email;
      const isEmailValid = EmailValidator.validate(email);
      if (!isEmailValid) {
        response.status(401).json({
          message: `"${email}" is not a valid email address.`,
        });
      } else {
        const data = {
          email: email,
        };
        const token = sign(data, VERIFICATION_TOKEN_EXPIRY);
        send(email, '[traquer] Verify your email address', 'verify-email-template', {
          email: email,
          name: '',
          token: token,
        });
        response.json({
          success: true,
          message: 'an email has been sent to the provided address to verify your ownership.',
        });
      }
    } catch (error) {
      next(error);
    }
  }

}

export default AuthController;
