import { Router } from "express";
import { Request, Response } from 'express';

import { verifyToken } from "../middlewares/auth.middleware";
import authController from "../controllers/auth.controller";


const authRoute: Router = Router();

authRoute.post("/login", authController.login);
authRoute.post("/register", authController.register);
authRoute.post("/forgot-password", authController.forgotPassword);
authRoute.get("/me", verifyToken, async (req: Request, res: Response) => {
  await authController.fetchMe(req, res)
});



export default authRoute;