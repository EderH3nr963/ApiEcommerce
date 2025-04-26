import { where } from "sequelize";
import { EnderecoModel } from "../models";
import axios from "axios";

class EnderecoService {
  static async create(endereco: any, id_usuario: number) {
    try {
      const numeroEnderecos = await EnderecoModel.count({
        where: { id_usuario },
      });

      if (numeroEnderecos >= 5) {
        return {
          status: "error",
          statusCode: 400,
          msg: "O usuário só pode ter 5 endereços cadastrados",
        };
      }

      const response = await axios.get(
        `https://viacep.com.br/ws/${endereco.cep.replace("-", "")}/json/`
      );

      if (!response.data || response.data.erro) {
        return {
          status: "error",
          statusCode: 400,
          msg: "CEP inválido ou não encontrado.",
        };
      }

      const enderecoCriado = await EnderecoModel.create({
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento,
        cep: response.data.cep,
        cidade: response.data.localidade,
        uf: response.data.uf,
        estado: response.data.estado,
        bairro: response.data.bairro,
        id_usuario,
      });

      if (!enderecoCriado) {
        throw new Error("Algum erro ao manipular o banco de dados");
      }

      return {
        status: "success",
        statusCode: 500,
        msg: "Endereço cadastrado com sucesso",
        endereco: enderecoCriado,
      };
    } catch (e) {
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao cadastrar endereço",
      };
    }
  }

  static async findAll(id_usuario: number) {
    try {
      const enderecos = EnderecoModel.findAll({ where: { id_usuario } });

      return {
        status: "success",
        statusCode: 200,
        msg: "Endereços encontrados",
        enderecos,
      };
    } catch (e) {
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao buscar enderecos",
      };
    }
  }

  static async findById(id_usuario: number, id_endereco: number) {
    try {
      const endereco = EnderecoModel.findOne({
        where: { id_usuario, id_endereco },
      });

      if (!endereco) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Endereço não encontrado ou acesso não autorizado",
          endereco,
        };
      }

      return {
        status: "success",
        statusCode: 200,
        msg: "Endereço encontrados",
        endereco,
      };
    } catch (e) {
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao buscar enderecos",
      };
    }
  }

  static async delete(id_endereco: number, id_usuario: number) {
    try {
      const endereco = await EnderecoModel.findOne({
        where: {
          id_endereco,
          id_usuario,
        },
      });

      if (!endereco) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Endereco não encontrado ou acesso não autorizado",
        };
      }

      await endereco.destroy();

      return {
        status: "success",
        statusCode: 500,
        msg: "Endereço excluído com sucesso",
      };
    } catch (e) {
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro inesperado ao excluir endereço",
      };
    }
  }
}

export default EnderecoService;
