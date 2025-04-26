import EnderecoController from "../controllers/EnderecoController";
import express from "express";
import EnderecoValidatorData from "../middlewares/EnderecoValidatorData";
import MyValidatorResult from "../middlewares/MyValidatorResult";
import { param } from "express-validator";

const router = express.Router();

router.post(
  "/",
  EnderecoValidatorData.create,
  MyValidatorResult,
  EnderecoController.create
);

router.get("/", EnderecoController.findAll);
router.get(
  "/:id_endereco",
  [
    param("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
  ],
  MyValidatorResult,
  EnderecoController.findById
);

router.delete(
  "/:id_endereco",
  [
    param("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
  ],
  MyValidatorResult,
  EnderecoController.delete
);

export default router;
