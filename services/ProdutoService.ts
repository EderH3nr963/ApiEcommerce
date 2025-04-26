import sequelize from "../config/database"; // Importação da configuração do banco de dados
import {
  AvaliacaoModel,
  ImagemAvaliacaoModel,
  ImagemProdutoModel,
  ProdutoModel,
} from "../models"; // Importação dos modelos Produto e ImagemProduto
import { literal } from "sequelize";

class ProdutoService {
  // Função para criar um novo produto
  static async create(produto: any) {
    try {
      // Cria o produto no banco de dados com os dados fornecidos
      const novoProduto = await ProdutoModel.create(produto);

      // Retorna a resposta de sucesso com o produto criado
      return {
        status: "success",
        statusCode: 201,
        msg: "Produto criado com sucesso.",
        produto: novoProduto,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao criar produto:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao criar produto.",
      };
    }
  }

  // Função para buscar um produto pelo seu ID
  static async findById(id_produto: number) {
    try {
      // Busca o produto pelo ID e inclui as imagens associadas
      const produto = await ProdutoModel.findByPk(id_produto, {
        attributes: {
          include: [
            [
              literal(`(
                SELECT AVG("valor_avaliacao")
                FROM "avaliacoes"
                WHERE "avaliacoes"."id_produto" = "ProdutoModel"."id_produto"
              )`),
              "mediaAvaliacao",
            ],
          ],
        },
        include: [
          { model: ImagemProdutoModel, as: "imagens_produto" },
          {
            model: AvaliacaoModel,
            as: "avaliacoes",
            include: [{ model: ImagemAvaliacaoModel, as: "imagens_avaliacao" }],
            limit: 10,
          },
        ],
      });

      // Verifica se o produto foi encontrado
      if (!produto) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Produto não encontrado.",
        };
      }

      // Retorna o produto encontrado com a resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Produto encontrado com sucesso.",
        produto: produto,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao buscar produto por ID:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao buscar produto.",
      };
    }
  }

  static async findAll() {
    try {
      const produtos = await ProdutoModel.findAll({
        attributes: {
          include: [
            [
              literal(`(
                SELECT AVG("valor_avaliacao")
                FROM "avaliacoes"
                WHERE "avaliacoes"."id_produto" = "ProdutoModel"."id_produto"
              )`),
              "mediaAvaliacao",
            ],
          ],
        },
        include: [{ model: ImagemProdutoModel, as: "imagem", limit: 1 }],
      });

      if (!produtos || produtos.length === 0) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Nenhum produto encontrado.",
        };
      }

      return {
        status: "success",
        statusCode: 200,
        msg: "Produtos encontrados com sucesso.",
        produtos: produtos,
      };
    } catch (e) {
      console.error("Erro ao buscar produtos:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao buscar produtos.",
      };
    }
  }

  // Função para atualizar o nome de um produto
  static async updateName(nome: string, id_produto: number) {
    try {
      // Busca o produto pelo ID
      const produto = await ProdutoModel.findByPk(id_produto);

      // Verifica se o produto foi encontrado
      if (!produto) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Produto não encontrado.",
        };
      }

      // Verifica se o nome do produto já está igual ao nome informado
      if (produto.nome_produto === nome) {
        return {
          status: "error",
          statusCode: 400,
          msg: "O nome do produto já está atualizado.",
        };
      }

      // Atualiza o nome do produto
      await produto.update({ nome_produto: nome });

      // Retorna a resposta de sucesso com o produto atualizado
      return {
        status: "success",
        statusCode: 200,
        msg: "Nome do produto atualizado com sucesso.",
        produto,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao atualizar nome do produto:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao atualizar nome do produto.",
      };
    }
  }

  // Função para atualizar a quantidade de estoque de um produto
  static async updateEstoque(numeroProdutos: number, id_produto: number) {
    try {
      // Busca o produto pelo ID
      const produto = await ProdutoModel.findByPk(id_produto);

      // Verifica se o produto foi encontrado
      if (!produto) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Produto não encontrado.",
        };
      }

      // Verifica se a quantidade de estoque já está igual à informada
      if (produto.qtd_estoque === numeroProdutos) {
        return {
          status: "error",
          statusCode: 400,
          msg: "A quantidade de estoque já está atualizada.",
        };
      }

      // Atualiza a quantidade de estoque do produto
      await produto.update({ qtd_estoque: numeroProdutos });

      // Retorna a resposta de sucesso com o produto atualizado
      return {
        status: "success",
        statusCode: 200,
        msg: "Quantidade de estoque atualizada com sucesso.",
        produto,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao atualizar quantidade de estoque:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao atualizar quantidade de estoque.",
      };
    }
  }

  // Função para atualizar o valor de um produto
  static async updatePrice(novoValor: number, id_produto: number) {
    try {
      // Busca o produto pelo ID
      const produto = await ProdutoModel.findByPk(id_produto);

      // Verifica se o produto foi encontrado
      if (!produto) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Produto não encontrado.",
        };
      }

      // Verifica se o valor do produto já está igual ao valor informado
      if (produto.price === novoValor) {
        return {
          status: "error",
          statusCode: 400,
          msg: "O valor do produto já está atualizado.",
        };
      }

      // Atualiza o valor do produto
      await produto.update({ price: novoValor });

      // Retorna a resposta de sucesso com o produto atualizado
      return {
        status: "success",
        statusCode: 200,
        msg: "Valor do produto atualizado com sucesso.",
        produto,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao atualizar valor do Produto:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao atualizar valor do produto.",
      };
    }
  }

  // Função para atualizar a descrição de um produto
  static async updateDescricao(novaDescricao: string, id_produto: number) {
    try {
      // Busca o produto pelo ID
      const produto = await ProdutoModel.findByPk(id_produto);

      // Verifica se o produto foi encontrado
      if (!produto) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Produto não encontrado.",
        };
      }

      // Verifica se a descrição do produto já está igual à informada
      if (produto.descricao === novaDescricao) {
        return {
          status: "error",
          statusCode: 400,
          msg: "A descrição do produto já está atualizada.",
        };
      }

      // Atualiza a descrição do produto
      await produto.update({ descricao: novaDescricao });

      // Retorna a resposta de sucesso com o produto atualizado
      return {
        status: "success",
        statusCode: 200,
        msg: "Descrição do produto atualizada com sucesso.",
        produto,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao atualizar descrição do Produto:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao atualizar descrição do produto.",
      };
    }
  }

  // Função para realizar o upload de imagens para um produto
  static async uploadImagens(nome_imagens: string[], id_produto: number) {
    const transaction = await sequelize.transaction(); // Inicia uma transação no banco de dados

    try {
      // Processa todas as imagens para associá-las ao produto
      await Promise.all(
        nome_imagens.map(async (nome_imagem) => {
          await ImagemProdutoModel.create(
            { nome_imagem: nome_imagem, id_poduto: id_produto },
            { transaction }
          );
        })
      );

      // Confirma a transação, salvando as alterações
      await transaction.commit();

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Imagens enviadas com sucesso.",
      };
    } catch (e) {
      // Caso ocorra um erro, desfaz a transação
      await transaction.rollback();
      console.error("Erro ao fazer upload das imagens:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao enviar imagens.",
      };
    }
  }

  static async excluirImagens(nome_imagens: Array<string>) {
    const transaction = await sequelize.transaction(); // Inicia uma transação no banco de dados

    try {
      // Deleta todas as imagens
      await Promise.all(
        nome_imagens.map(async (nome_imagem) => {
          await ImagemProdutoModel.destroy({
            where: { nome_imagem: nome_imagem },
          });
        })
      );

      // Confirma a transação, salvando as alterações
      await transaction.commit();

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Imagens enviadas com sucesso.",
      };
    } catch (e) {
      // Caso ocorra um erro, desfaz a transação
      await transaction.rollback();
      console.error("Erro ao fazer upload das imagens:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao enviar imagens.",
      };
    }
  }

  // Função para deletar um produto
  static async delete(id_produto: number) {
    try {
      // Busca o produto no banco de dados pelo ID
      const produto = await ProdutoModel.findByPk(id_produto);

      // Verifica se o produto foi encontrado
      if (!produto) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Produto não encontrado.",
        };
      }

      // Chama o método de soft delete (exclui sem remover fisicamente)
      await produto.isSoftDeleted();

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Produto deletado com sucesso.",
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao deletar produto:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao deletar produto.",
      };
    }
  }
}

export default ProdutoService;
