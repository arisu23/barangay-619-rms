import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { UserService } from "../users/user.service.js";
import { ENV } from "../../config/env.js";
import { AuditTrailRepository } from "../audit/audit.repository.js";

export const AuthController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body;

      const user = await UserService.validateUser(username, password);
      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials!",
        });
      }

      const token = jwt.sign(
        { userId: user.UserID, role: user.Role },
        ENV.JWT_SECRET,
        { expiresIn: "1h" },
      );

      res.json({ token });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;

      await AuditTrailRepository.log({
        userId,
        action: "USER_LOGOUT",
        newValue: JSON.stringify({ loggedOutAt: new Date().toISOString() })
      });

      res.json({ success: true, message: "Logged out successfully!" });
    } catch (err) {
      next(err);
    }
  },

  verify(req: Request, res: Response) {
    //If we reached here the token is valid
    const user = (req as any).user;
    res.json({
      success: true,
      data: {
        userId: user.userId,
        role: user.role
      }
    });
  }
};
