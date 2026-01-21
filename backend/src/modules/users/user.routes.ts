import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeRole } from "../../middlewares/role.middleware.js";
import { UserService } from "./user.service.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRole("Admin"),
  async (req, res, next) => {
    try {
      const { username, password, role } = req.body;
      const id = await UserService.createUser(username, password, role);
      res.json({ userId: id });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
