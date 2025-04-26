import express from "express";
import ProdutoController from "../controllers/ProdutoController";
import { upload } from "../middlewares/uploadImagesProduto";
import { param } from "express-validator";
import MyValidatorResult from "../middlewares/MyValidatorResult";
import ProdutoValidatorData from "../middlewares/ProdutoValidatorData";
import isAdmin from "../middlewares/IsAdmin";

const router = express.Router();

router.post(
  "/",
  isAdmin,
  ProdutoValidatorData.create,
  MyValidatorResult,
  ProdutoController.create
);

router.get("/", ProdutoController.getAll);
router.get(
  "/:id_produto",
  [
    param("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
  ],
  MyValidatorResult,
  ProdutoController.get
);

router.patch(
  "/nome",
  isAdmin,
  ProdutoValidatorData.updateNome,
  MyValidatorResult,
  ProdutoController.updateNome
);
router.patch(
  "/descricao",
  isAdmin,
  ProdutoValidatorData.updateDescricao,
  MyValidatorResult,
  ProdutoController.updateDescricao
);
router.patch(
  "/valor",
  isAdmin,
  ProdutoValidatorData.updatePrice,
  MyValidatorResult,
  ProdutoController.updatePrice
);
router.patch(
  "/estoque",
  isAdmin,
  ProdutoValidatorData.updateEstoque,
  MyValidatorResult,
  ProdutoController.updateEstoque
);

router.post(
  "/:id_produto/updload-images",
  isAdmin,
  [
    param("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
  ],
  MyValidatorResult,
  upload.array("imagens", 10),
  ProdutoController.uploadImages
);

router.delete(
  "/:id_produto",
  isAdmin,
  [
    param("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
  ],
  MyValidatorResult,
  ProdutoController.delete
);

export default router;
