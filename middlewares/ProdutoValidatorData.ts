import { body } from "express-validator";

const ProdutoValidatorData = {
  create: [
    body("produto.nome_produto")
      .isString()
      .withMessage("o nome do produto deve ser dot tipo texto")
      .isLength({ min: 5 })
      .withMessage("O nome deve conter ao menos 5 letras"),
    body("produto.qtd_estoque")
      .isInt()
      .withMessage("A quantidade de produtos deve ser um numero inteiro"),
    body("produto.valor_pdt")
      .isFloat()
      .withMessage(
        "O valor do produto deve ser um numero com ponto decimal. Ex: 10.00"
      ),
    body("produto.descricao")
      .isString()
      .withMessage("o nome do produto deve ser dot tipo texto")
      .isLength({ min: 20, max: 200 })
      .withMessage(
        "O nome deve conter ao menos 20 letras explicando o que o produto faz"
      ),
  ],

  updateNome: [
    body("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
    body("nome")
      .isString()
      .withMessage("o nome do produto deve ser dot tipo texto")
      .isLength({ min: 5 })
      .withMessage("O nome deve conter ao menos 5 letras"),
  ],

  updateDescricao: [
    body("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
    body("descricao")
      .isString()
      .withMessage("o nome do produto deve ser dot tipo texto")
      .isLength({ min: 20, max: 200 })
      .withMessage(
        "O nome deve conter ao menos 20 letras explicando o que o produto faz"
      ),
  ],

  updatePrice: [
    body("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
    body("price")
      .isFloat()
      .withMessage(
        "O valor do produto deve ser um numero com ponto decimal. Ex: 10.00"
      ),
  ],

  updateEstoque: [
    body("id_produto")
      .isInt()
      .withMessage("O ID deve ser um número inteiro")
      .toInt(),
    body("qtd_estoque")
      .isInt()
      .withMessage("A quantidade de produtos deve ser um numero inteiro"),
  ],
};

export default ProdutoValidatorData;
