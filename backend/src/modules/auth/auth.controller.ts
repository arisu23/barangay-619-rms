import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { UserService } from "../users/user.service.js";
import { ENV } from "../../config/env.js";

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

  logout(_req: Request, res: Response) {
    // JWT Logout = client deletes token
    res.json({ message: "Logged out successfully!" });
  },
};
