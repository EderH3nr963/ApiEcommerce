import express from "express";
import AuthController from "../controllers/AuthController";
import AuthValidatorData from "../middlewares/AuthValidatorData";
import MyValidatorResult from "../middlewares/MyValidatorResult";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/register",
  AuthValidatorData.register,
  MyValidatorResult,
  AuthController.register
);
router.post(
  "/verify-2fa-register",
  AuthValidatorData.verify2fa,
  MyValidatorResult,
  AuthController.verify2faRegister
);
router.post(
  "/resend-2fa-register",
  [body("email").isEmail().withMessage("Formato de e-mail inválido")],
  MyValidatorResult,
  AuthController.resend2faRegister
);

router.post(
  "/request-reset-password",
  [body("email").isEmail().withMessage("Formato de e-mail inválido")],
  MyValidatorResult,
  AuthController.requestResetPassword
);
router.post(
  "/verify-reset-password",
  AuthValidatorData.verify2fa,
  MyValidatorResult,
  AuthController.verifyResetCode
);
router.post(
  "/reset-password",
  AuthValidatorData.resetPassword,
  MyValidatorResult,
  AuthController.resetPassword
);

router.post(
  "/login",
  AuthValidatorData.login,
  MyValidatorResult,
  AuthController.login
);
router.post(
  "/verify-2fa-login",
  AuthValidatorData.verify2fa,
  MyValidatorResult,
  AuthController.verify2faLogin
);
router.post(
  "/resend-2fa-login",
  [body("email").isEmail().withMessage("Formato de e-mail inválido")],
  MyValidatorResult,
  AuthController.resend2faLogin
);

router.get("/verify-session", AuthController.verifySession);

router.post("/logout", AuthController.logout);

export default router;
