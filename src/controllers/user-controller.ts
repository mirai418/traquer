import express, { Request, Response, NextFunction } from 'express';
import { DatabaseError, ValidationError } from 'sequelize';

import Controller from './controller-interface.js';
import User from '../models/user.js';
import { NotUpdatableFieldError } from '../config/errors.js';
import { authMiddleware, RequestWithUser } from '../middlewares/auth-middleware.js';


class UserController implements Controller {
  public path = '/users';
  public router = express.Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, authMiddleware({isAdmin: true}), this.get);
    this.router.post(this.path, authMiddleware({isAdmin: true}), this.post);
    this.router.patch(this.path + '/:id', authMiddleware({isAdmin: true}), this.patch);
    this.router.delete(this.path + '/:id', authMiddleware({isAdmin: true}), this.delete);
    this.router.get(this.path + '/me', authMiddleware(), this.getMe);
    this.router.patch(this.path + '/me', authMiddleware(), this.patchMe);
    this.router.delete(this.path + '/me', authMiddleware(), this.deleteMe);
  }

  public async get(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await User.findAll({
        where: request.query,
      });
      response.json(result);
    } catch (error) {
      if (error instanceof DatabaseError) {
        response.status(401).json({
          message: 'Invalid query options.',
        });
      } else {
        next(error);
      }
    }
  }

  public async post(request: Request, response: Response, next: NextFunction) {
    try {
      const result = await User.create(request.body);
      response.json(result);
    } catch (error) {
      if (error instanceof ValidationError) {
        response.status(401).json({
          message: error.message,
        });
      } else {
        next(error);
      }
    }
  }

  public async patch(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(request.params.id);
      if (!user) {
        response.status(404).json({
          message: 'User not found.',
        });
      } else {
        await user.update(request.body);
        response.json(user);
      }
    } catch (error) {
      next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await User.findByPk(request.params.id);
      if (!user) {
        response.status(404).json({
          message: 'User not found.',
        });
      } else {
        await user.destroy();
        response.json({
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public async getMe(request: Request, response: Response, next: NextFunction) {
    try {
      response.json((request as RequestWithUser).user);
    } catch (error) {
      next(error);
    }
  }

  public async patchMe(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      await user.updateRestricted(request.body);
      response.json(user);
    } catch (error) {
      next(error);
      if (error instanceof NotUpdatableFieldError) {
        response.status(403).json({
          message: 'Forbidden. You do not have the rights to update this field.',
        });
      } else {
        next(error);
      }
    }
  }

  public async deleteMe(request: Request, response: Response, next: NextFunction) {
    try {
      const user = (request as RequestWithUser).user;
      await user.destroy();
      response.json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

}

export default UserController;
