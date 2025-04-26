import express from "express";
import UsuarioController from "../controllers/UsuarioController";
import { body } from "express-validator";
import MyValidatorResult from "../middlewares/MyValidatorResult";

const router = express.Router();

router.get("/", UsuarioController.get);

router.post(
  "/request-update-email",
  [
    body("email")
      .isEmail()
      .withMessage("Digite o formato válido do novo email"),
  ],
  MyValidatorResult,
  UsuarioController.requestUpdateEmail
);
router.patch(
  "/update-email",
  [
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Código de verificação inválido"),
  ],
  MyValidatorResult,
  UsuarioController.updateEmail
);

router.post(
  "/request-update-password",
  [
    body("password")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
      .withMessage(
        "A senha deve possuir letras, numeros e caracteres especiais"
      )
      .isLength({ min: 6, max: 17 })
      .withMessage("A senha deve possuir entre 6 a 17 caracteres"),
  ],
  MyValidatorResult,
  UsuarioController.requestUpdatePassword
);
router.patch(
  "/update-password",
  [
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Código de verificação inválido"),
  ],
  MyValidatorResult,
  UsuarioController.updatePassword
);

router.delete("/", UsuarioController.delete);

export default router;
