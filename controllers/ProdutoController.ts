import { Request, Response } from "express";
import ProdutoService from "../services/ProdutoService";

class ProdutoController {
  static async create(req: Request, res: Response) {
    const { produto } = req.body;

    const response = await ProdutoService.create(produto);

    res.status(response.statusCode).json(response);
  }

  static async getAll(req: Request, res: Response) {
    const response = await ProdutoService.findAll();

    res.status(response.statusCode).json(response);
  }

  static async get(req: Request, res: Response) {
    const { id_produto } = req.params;

    const response = await ProdutoService.findById(Number(id_produto));

    res.status(response.statusCode).json(response);
  }

  static async updateNome(req: Request, res: Response) {
    const { id_produto, nome } = req.params;

    const response = await ProdutoService.updateName(nome, Number(id_produto));

    res.status(response.statusCode).json(response);
  }

  static async updateDescricao(req: Request, res: Response) {
    const { descricao, id_produto } = req.body;

    const response = await ProdutoService.updateDescricao(
      descricao,
      Number(id_produto)
    );

    res.status(response.statusCode).json(response);
  }

  static async updatePrice(req: Request, res: Response) {
    const { price, id_produto } = req.body;

    const response = await ProdutoService.updatePrice(
      price,
      Number(id_produto)
    );

    res.status(response.statusCode).json(response);
  }

  static async updateEstoque(req: Request, res: Response) {
    const { qtd_estoque, id_produto } = req.body;

    const response = await ProdutoService.updateEstoque(
      qtd_estoque,
      Number(id_produto)
    );

    res.status(response.statusCode).json(response);
  }

  static async uploadImages(req: Request, res: Response) {
    const { id_produto } = req.params;
    const files = req.files as Express.Multer.File[];

    const nome_imagens = files.map((img) => img.filename);

    const response = await ProdutoService.uploadImagens(
      nome_imagens,
      Number(id_produto)
    );

    res.status(response.statusCode).json(response);
  }

  static async delete(req: Request, res: Response) {
    const { id_produto } = req.params;

    const response = await ProdutoService.delete(Number(id_produto));

    res.status(response.statusCode).json(response);
  }
}

export default ProdutoController;
