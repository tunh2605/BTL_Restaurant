import express from "express";
import { AuthController } from "../controllers/authController.js";

const createAuthRouter = (env) => {
    const router = express.Router();
    const authController = new AuthController(env);

    // OAuth routes
    router.get("/login-by-oauth", authController.login);
    router.get("/logout-by-oauth", authController.logout);
    router.get("/set-user-data", authController.setUserData);
    
    return router;
};

export { createAuthRouter };