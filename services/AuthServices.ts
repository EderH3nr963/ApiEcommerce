import { UsuarioModel, EnderecoModel } from "../models";
import {
  sendEmail,
  generateVerificationCode,
  buildVerificationEmailHTML,
} from "../utils";
import Redis from "ioredis";

const redisClient = new Redis();

interface UsuarioRequest {
  nome_completo: string;
  email: string;
  password: string;
  telefone: string;
}

class AuthService {
  static async register(usuarioReq: UsuarioRequest) {
    try {
      const usuario = await UsuarioModel.findOne({
        where: { email: usuarioReq.email },
      });

      if (usuario) {
        return {
          status: "error",
          statusCode: 400,
          msg: "E-mail já cadastrado",
        };
      }

      const code = generateVerificationCode();
      const html = buildVerificationEmailHTML(code);

      await redisClient.hset(`verify_2fa_register:${usuarioReq.email}`, {
        code,
        usuario: JSON.stringify(usuarioReq),
        time: Date.now(),
      });

      await redisClient.expire(
        `verify_2fa_register:${usuarioReq.email}`,
        60 * 5
      );

      await sendEmail(usuarioReq.email, "Código de Verificação", html);

      return {
        status: "success",
        statusCode: 200,
        msg: "Código de verificação enviado para o e-mail.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro interno ao registrar.",
      };
    }
  }

  static async verify2faRegister(email: string, code: string) {
    try {
      const codeRedis = await redisClient.hget(
        `verify_2fa_register:${email}`,
        "code"
      );
      const usuario = await redisClient.hget(
        `verify_2fa_register:${email}`,
        "usuario"
      );

      if (!codeRedis || !usuario) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código expirado ou inválido. Por favor, solicite um novo.",
        };
      }

      if (code !== codeRedis) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código de verificação inválido.",
        };
      }

      await UsuarioModel.create(JSON.parse(usuario));
      await redisClient.del(`verify_2fa_register:${email}`);

      return {
        status: "success",
        statusCode: 200,
        msg: "Usuário criado com sucesso.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro interno ao verificar email.",
      };
    }
  }

  static async resend2faRegister(email: string) {
    try {
      const usuario = await redisClient.hget(
        `verify_2fa_register:${email}`,
        "usuario"
      );
      const codeRedis = await redisClient.hget(
        `verify_2fa_register:${email}`,
        "code"
      );
      const time = await redisClient.hget(
        `verify_2fa_register:${email}`,
        "time"
      );

      if (!usuario || !codeRedis || !time) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Nenhum código anterior encontrado. Inicie o registro novamente.",
        };
      }

      if (Date.now() < Number(time) + 60000) {
        return {
          status: "error",
          statusCode: 429,
          msg: "Aguarde 1 minuto antes de solicitar um novo código.",
        };
      }

      const newCode = generateVerificationCode();
      const html = buildVerificationEmailHTML(newCode);

      await redisClient.hset(`verify_2fa_register:${email}`, {
        usuario,
        code: newCode,
        time: Date.now(),
      });

      await redisClient.expire(`verify_2fa_register:${email}`, 60 * 5);
      await sendEmail(email, "Novo Código de Verificação", html);

      return {
        status: "success",
        statusCode: 200,
        msg: "Novo código de verificação enviado para o e-mail.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao reenviar o código de verificação.",
      };
    }
  }

  static async login(email: string, passwordReq: string) {
    try {
      const usuario = await UsuarioModel.findOne({
        where: { email: email },
        include: [
          {
            model: EnderecoModel,
            as: "enderecos",
          },
        ],
      });

      if (!usuario || !(await usuario.validPassword(passwordReq))) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Email ou senha inválidos",
        };
      }

      const { password, ...usuarioRetornar } = usuario.dataValues;

      const code = generateVerificationCode();
      const html = buildVerificationEmailHTML(code);

      console.log(usuarioRetornar)

      await redisClient.hset(`verify_2fa_login:${email}`, {
        code,
        usuario: JSON.stringify(usuarioRetornar),
        time: Date.now(),
      });

      await redisClient.expire(`verify_2fa_login:${email}`, 60 * 5);
      await sendEmail(email, "Código de Verificação 2FA", html);

      return {
        status: "success",
        statusCode: 200,
        msg: "Código de verificação enviado para o e-mail.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro interno ao tentar logar.",
      };
    }
  }

  static async verify2faLogin(email: string, code: string) {
    try {
      const codeRedis = await redisClient.hget(
        `verify_2fa_login:${email}`,
        "code"
      );
      const usuario = await redisClient.hget(
        `verify_2fa_login:${email}`,
        "usuario"
      );

      if (!codeRedis || !usuario) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código expirado ou inválido. Por favor, solicite um novo.",
        };
      }

      if (code !== codeRedis) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código de verificação inválido.",
        };
      }

      await redisClient.del(`verify_2fa_login:${email}`);

      return {
        status: "success",
        statusCode: 200,
        msg: "Login realizado com sucesso",
        usuario: JSON.parse(usuario),
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro interno ao tentar logar.",
      };
    }
  }

  static async resend2faLogin(email: string) {
    try {
      const usuario = await redisClient.hget(
        `verify_2fa_login:${email}`,
        "usuario"
      );
      const codeRedis = await redisClient.hget(
        `verify_2fa_login:${email}`,
        "code"
      );
      const time = await redisClient.hget(`verify_2fa_login:${email}`, "time");

      if (!usuario || !codeRedis || !time) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Nenhum código anterior encontrado. Faça login novamente.",
        };
      }

      if (Date.now() < Number(time) + 60000) {
        return {
          status: "error",
          statusCode: 429,
          msg: "Aguarde 1 minuto antes de solicitar um novo código.",
        };
      }

      const newCode = generateVerificationCode();
      const html = buildVerificationEmailHTML(newCode);

      await redisClient.hset(`verify_2fa_login:${email}`, {
        usuario,
        code: newCode,
        time: Date.now(),
      });

      await redisClient.expire(`verify_2fa_login:${email}`, 60 * 5);
      await sendEmail(email, "Novo Código de Verificação 2FA", html);

      return {
        status: "success",
        statusCode: 200,
        msg: "Novo código de verificação enviado para o e-mail.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao reenviar o código 2FA.",
      };
    }
  }

  static async requestResetPassword(email: string) {
    try {
      const usuario = await UsuarioModel.findOne({ where: { email } });

      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "E-mail não encontrado.",
        };
      }

      const code = generateVerificationCode();
      const html = buildVerificationEmailHTML(code);

      await redisClient.hset(`reset_password:${email}`, {
        code,
        time: Date.now(),
      });

      await redisClient.expire(`reset_password:${email}`, 60 * 5); // expira em 5 min

      await sendEmail(email, "Código para Redefinição de Senha", html);

      return {
        status: "success",
        statusCode: 200,
        msg: "Código enviado para o e-mail.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao solicitar redefinição de senha.",
      };
    }
  }

  // 2. Verifica o código enviado por e-mail
  static async verifyResetCode(email: string, code: string) {
    try {
      const codeRedis = await redisClient.hget(
        `reset_password:${email}`,
        "code"
      );

      if (!codeRedis) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código expirado ou inválido.",
        };
      }

      if (code !== codeRedis) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código incorreto.",
        };
      }

      return {
        status: "success",
        statusCode: 200,
        msg: "Código verificado com sucesso.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao verificar código.",
      };
    }
  }

  // 3. Redefine a senha
  static async resetPassword(email: string, code: string, novaSenha: string) {
    try {
      const codeRedis = await redisClient.hget(
        `reset_password:${email}`,
        "code"
      );

      if (!codeRedis) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código expirado ou inválido.",
        };
      }

      console.log(codeRedis)

      if (code !== codeRedis) {
        return {
          status: "error",
          statusCode: 400,
          msg: "Código incorreto.",
        };
      }

      const usuario = await UsuarioModel.findOne({ where: { email } });

      if (!usuario) {
        return {
          status: "error",
          statusCode: 404,
          msg: "Usuário não encontrado.",
        };
      }

      // Atualiza a senha — assume que `usuario.setPassword()` define e hasheia a senha
      await usuario.update({ password: novaSenha });

      await redisClient.del(`reset_password:${email}`); // Remove o código após uso

      return {
        status: "success",
        statusCode: 200,
        msg: "Senha redefinida com sucesso.",
      };
    } catch (e) {
      console.error(e);
      return {
        status: "error",
        statusCode: 500,
        msg: "Erro ao redefinir a senha.",
      };
    }
  }
}

export default AuthService;
