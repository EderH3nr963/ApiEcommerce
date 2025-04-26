import sequelize from "../config/database";
import { AvaliacaoModel, CompraModel } from "../models";

class AvaliacaoService {
  static async create(id_produto: number, id_usuario: number, avaliacao: any) {
    try {
      const compra = await CompraModel.findOne({
        where: {
          id_produto,
          id_usuario,
        },
      });

      if (!compra || compra.status_compra !== "entregue") {
        return {
          status: "error",
          statusCode: 500,
          msg: "Você só pode avaliar o produto após comprá-lo",
        };
      }

      const avaliacaoExisting = await AvaliacaoModel.findOne({
        where: {
          id_produto,
          id_usuario,
        },
      });

      if (avaliacaoExisting) {
        return {
          status: "error",
          statusCode: 500,
          msg: "Você já avaliou este produto",
        };
      }

      await AvaliacaoModel.create({ ...avaliacao, id_usuario, id_produto });

      return {
        status: "success",
        statusCode: 201,
        msg: "Avaliação feita com sucesso",
      };
    } catch (e) {
      console.log(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao criar avaliação",
      };
    }
  }

  static async update(
    id_usuario: number,
    id_produto: number,
    avaliacaoReq: any
  ) {
    try {
      const transaction = await sequelize.transaction();
      const avaliacao = await AvaliacaoModel.findOne({
        where: {
          id_produto,
          id_usuario,
        },
      });

      if (!avaliacao) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Avaliação não encontrada",
        };
      }

      if (avaliacao.valor_avaliacao !== avaliacaoReq.valor_avaliacao) {
        avaliacao.update(
          { valor_avaliacao: avaliacaoReq.valor_avaliacao },
          { transaction }
        );
      }

      if (avaliacao.titulo !== avaliacaoReq.titulo) {
        avaliacao.update({ titulo: avaliacaoReq.titulo }, { transaction });
      }

      if (avaliacao.descricao !== avaliacaoReq.descricao) {
        avaliacao.update(
          { descricao: avaliacaoReq.descricaoo },
          { transaction }
        );
      }

      await transaction.commit();

      return {
        status: "success",
        statusCode: 200,
        msg: "Avaliação atualizada com sucesso",
      };
    } catch (e) {
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao atualizar avaliação",
      };
    }
  }

  static async delete(id_usuario: number, id_avaliacao: number) {
    try {
      const avaliacao = await AvaliacaoModel.findByPk(id_avaliacao);

      if (!avaliacao || avaliacao.id_usuario !== id_usuario) {
        return {};
      }

      await avaliacao.destroy();

      return {
        status: "success",
        statusCode: 200,
        msg: "Sucesso ao deletar avaliação",
      };
    } catch (e) {
      console.log(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao deletar avaliação",
      };
    }
  }
}

export default AvaliacaoService;