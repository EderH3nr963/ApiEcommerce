import { body } from "express-validator";

const EnderecoValidatorData = {
  create: [
    body("endereco.logradouro")
      .isString()
      .withMessage("O logradouro deve ser do tipo de texo")
      .isLength({ min: 10 })
      .withMessage("O logradouro deve ter no minimo 10 digitos"),
    body("endereco.numero")
      .isInt()
      .withMessage("O número deve ser um número inteiro"),
    body("endereco.complemento")
      .isString()
      .withMessage("O logradouro deve ser do tipo de texo"),
    body("endereco.cep")
        .matches(/^\d{5}-\d{3}$/)
        .withMessage("Formato do CEP inválido. Ex: 00000-000")
  ],
};

export default EnderecoValidatorData;
