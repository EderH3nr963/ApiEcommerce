import { body } from "express-validator";

const AuthValidatorData = {
  register: [
    body("usuario.email").isEmail().withMessage("Formato de e-mail inválido"),
    body("usuario.nome")
      .isString()
      .withMessage("Formato de nome inválido"),
    body("usuario.password")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,17}$/)
      .withMessage(
        "A senha deve possuir letras, numeros e caracteres especiais"
      )
      .isLength({ min: 8, max: 17 })
      .withMessage("A senha deve possuir entre 6 a 17 caracteres"),
    body("usuario.confirm_password").custom((value, { req }) => {
      if (value !== req.body.usuario.password) {
        throw new Error("As senha não coincidem");
      }

      return true;
    }),
    body("usuario.telefone")
      .matches(/^\d{2} 9\d{4}-\d{4}$/)
      .withMessage("Formato de telefone inválido"),
  ],

  login: [
    body("email").isEmail().withMessage("Formato de email inválido"),
    body("password")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
      .withMessage(
        "A senha deve possuir letras, numeros e caracteres especiais"
      )
      .isLength({ min: 6, max: 17 })
      .withMessage("A senha deve possuir entre 6 a 17 caracteres"),
  ],

  verify2fa: [
    body("email").isEmail().withMessage("Formato de e-mail inválido"),
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Digite um código válido"),
  ],

  resetPassword: [
    body("email").isEmail().withMessage("Formato de e-mail inválido"),
    body("code")
      .isLength({ min: 6, max: 6 })
      .withMessage("Digite um código válido"),
    body("new_password")
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/)
      .withMessage(
        "A senha deve possuir letras, numeros e caracteres especiais"
      )
      .isLength({ min: 6, max: 17 })
      .withMessage("A senha deve possuir entre 6 a 17 caracteres"),
    body("new_confirmPassword").custom((value, { req }) => {
      if (value !== req.body.usuario.password) {
        throw new Error("As senha não coincidem");
      }

      return true;
    }),
  ],
};

export default AuthValidatorData;
