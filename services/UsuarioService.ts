import { UsuarioModel, EnderecoModel } from "../models"; // Importa os modelos de usuário e endereço
import Redis from "ioredis"; // Importa a biblioteca Redis
import {
  sendEmail, // Função para enviar e-mails
  generateVerificationCode, // Função para gerar código de verificação
  buildVerificationEmailHTML, // Função para construir o HTML do e-mail
} from "../utils"; // Importa utilitários para enviar e-mails e gerar código

const redisClient = new Redis(); // Cria uma instância do cliente Redis

class UsuarioService {
  // Função para buscar um usuário pelo ID
  static async buscarUsuarioPorId(id_usuario: number) {
    try {
      // Busca o usuário e seus endereços associados no banco de dados
      const usuario = await UsuarioModel.findOne({
        where: { id_usuario },
        include: [{ model: EnderecoModel, as: "enderecos" }],
      });

      // Verifica se o usuário foi encontrado
      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      // Retorna o usuário encontrado
      return {
        status: "success",
        statusCode: 200,
        msg: "Usuário encontrado com sucesso.",
        usuario,
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro interno no servidor.",
      };
    }
  }

  // Função para solicitar a atualização da senha de um usuário
  static async requestUpdatePassword(id_usuario: number, novaSenha: string) {
    try {
      // Busca o usuário pelo email
      const usuario = await UsuarioModel.findByPk(id_usuario);

      // Verifica se o usuário existe
      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      // Gera um código de verificação e o HTML do e-mail
      const code = generateVerificationCode();
      const html = buildVerificationEmailHTML(code);

      // Armazena o código de verificação e a nova senha no Redis com expiração de 15 minutos
      await redisClient.hset(`verify_code_update_password:${id_usuario}`, {
        code,
        password: novaSenha,
      });
      await redisClient.expire(
        `verify_code_update_password:${id_usuario}`,
        60 * 15
      );

      // Envia o e-mail com o código de verificação
      await sendEmail(
        usuario.email,
        "Código de Verificação para Atualização de Senha",
        html
      );

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Código de verificação enviado para o e-mail.",
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao solicitar atualização de senha.",
      };
    }
  }

  // Função para confirmar a atualização da senha
  static async updatePassword(id_usuario: number, code: string) {
    try {
      // Recupera o código de verificação e a nova senha do Redis
      const redisCode = await redisClient.hget(
        `verify_code_update_password:${id_usuario}`,
        "code"
      );
      const novaSenha = await redisClient.hget(
        `verify_code_update_password:${id_usuario}`,
        "password"
      );

      // Verifica se o código expirou ou é inválido
      if (!redisCode || !novaSenha) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código expirado ou inválido.",
        };
      }

      // Verifica se o código informado é correto
      if (code !== redisCode) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código de verificação incorreto.",
        };
      }

      // Busca o usuário pelo e-mail
      const usuario = await UsuarioModel.findByPk(id_usuario);

      // Verifica se o usuário existe
      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      // Atualiza a senha do usuário
      await usuario.update({ password: novaSenha });

      // Remove o código de verificação do Redis
      await redisClient.del(`verify_code_update_password:${id_usuario}`);

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Senha atualizada com sucesso.",
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao confirmar atualização de senha.",
      };
    }
  }

  // Função para solicitar a atualização de e-mail de um usuário
  static async requestUpdateEmail(id_usuario: number, novoEmail: string) {
    try {
      // Busca o usuário pelo ID
      const usuario = await UsuarioModel.findByPk(id_usuario);

      // Verifica se o usuário existe
      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      // Verifica se o novo e-mail é igual ao atual
      if (usuario.email === novoEmail) {
        return {
          status: "error",
          statusCode: 400,
          msg: "O novo e-mail é igual ao atual.",
        };
      }

      // Gera um código de verificação e o HTML do e-mail
      const code = generateVerificationCode();
      const html = buildVerificationEmailHTML(code);

      // Armazena o código de verificação e o novo e-mail no Redis com expiração de 15 minutos
      await redisClient.hset(`verify_code_update_email:${usuario.id_usuario}`, {
        code,
        newEmail: novoEmail,
      });
      await redisClient.expire(
        `verify_code_update_email:${usuario.id_usuario}`,
        60 * 15
      );

      // Envia o e-mail com o código de verificação para o novo e-mail
      await sendEmail(novoEmail, "Solicitação de Atualização de E-mail", html);

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Código de verificação enviado para o novo e-mail.",
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao solicitar atualização de e-mail.",
      };
    }
  }

  // Função para confirmar a atualização do e-mail
  static async updateEmail(id_usuario: number, code: string) {
    try {
      // Recupera o código de verificação e o novo e-mail do Redis
      const redisCode = await redisClient.hget(
        `verify_code_update_email:${id_usuario}`,
        "code"
      );
      const novoEmail = await redisClient.hget(
        `verify_code_update_email:${id_usuario}`,
        "newEmail"
      );

      // Verifica se o código expirou ou é inválido
      if (!redisCode || !novoEmail) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código expirado ou inválido.",
        };
      }

      // Verifica se o código informado é correto
      if (code !== redisCode) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código de verificação incorreto.",
        };
      }

      // Busca o usuário pelo ID
      const usuario = await UsuarioModel.findByPk(id_usuario);

      // Verifica se o usuário existe
      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      // Atualiza o e-mail do usuário
      await usuario.update({ email: novoEmail });

      // Remove o código de verificação do Redis
      await redisClient.del(`verify_code_update_email:${id_usuario}`);

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Email atualizado com sucesso.",
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao confirmar atualização de email.",
      };
    }
  }

  // Função para deletar um usuário
  static async deletarUsuario(id_usuario: number, password: string) {
    try {
      // Busca o usuário pelo ID
      const usuario = await UsuarioModel.findByPk(id_usuario);

      // Verifica se o usuário existe
      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      if (!(await usuario.validPassword(password))) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Senha inválida.",
        };
      }

      // Realiza a exclusão suave do usuário (soft delete)
      await usuario.isSoftDeleted();

      // Retorna resposta de sucesso
      return {
        status: "success",
        statusCode: 200,
        msg: "Usuário deletado com sucesso.",
      };
    } catch (e) {
      // Caso ocorra um erro, loga o erro e retorna resposta de erro
      console.error("Erro ao deletar usuário:", e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro interno ao tentar deletar o usuário.",
      };
    }
  }
}

export default UsuarioService;
