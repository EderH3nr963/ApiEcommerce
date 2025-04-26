import { Request, Response } from "express";
import AuthService from "../services/AuthServices";

class AuthController {
  static async register(req: Request, res: Response) {
    const { confirm_password, ...usuario } = req.body.usuario;

    const response = await AuthService.register(usuario);

    res.status(response.statusCode).json(response);
  }

  static async verify2faRegister(req: Request, res: Response) {
    const { email, code } = req.body;

    const response = await AuthService.verify2faRegister(email, code);

    res.status(response.statusCode).json(response);
  }

  static async requestResetPassword(req: Request, res: Response) {
    const { email } = req.body;

    const response = await AuthService.requestResetPassword(email);

    res.status(response.statusCode).json(response);
  }

  static async resend2faRegister(req: Request, res: Response) {
    const { email } = req.body;

    const response = await AuthService.resend2faRegister(email);

    res.status(response.statusCode).json(response);
  }

  static async verifyResetCode(req: Request, res: Response) {
    const { email, code } = req.body;

    const response = await AuthService.verifyResetCode(email, code);

    res.status(response.statusCode).json(response);
  }

  static async resetPassword(req: Request, res: Response) {
    const { email, code, new_password } = req.body;

    const response = await AuthService.resetPassword(email, code, new_password);

    res.status(response.statusCode).json(response);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!req.session.tentativa_login)
      req.session.tentativa_login = { email, count: 0 };

    /* if (
      req.session.tentativa_login.email === email &&
      req.session.tentativa_login.count > 3
    ) {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        msg: "Limite de tentativa de login expedida, tente novamente mais tarde",
      });
      return;
    } */

    const response = await AuthService.login(email, password);

    switch (response.status) {
      case "error":
        req.session.tentativa_login.count++;
        break;
      case "success":
        req.session.tentativa_login.count = 0;
        break;
    }

    res.status(response.statusCode).json(response);
  }

  static async verify2faLogin(req: Request, res: Response) {
    const { email, code } = req.body;

    const response = await AuthService.verify2faLogin(email, code);

    if (response.status == "success") {
      req.session.id_usuario = response.usuario.id_usuario;
      req.session.is_admin = response.usuario.is_admin;
    }

    res.status(response.statusCode).json(response);
  }

  static async resend2faLogin(req: Request, res: Response) {
    const { email } = req.body;

    const response = await AuthService.resend2faLogin(email);

    res.status(response.statusCode).json(response);
  }

  static async verifySession(req: Request, res: Response) {
    if (!req.session.id_usuario) {
      res.status(500).json({
        status: "error",
        statusCode: 500,
        msg: "Usuário nao autenticado",
      });
      return;
    }

    res.status(200).json({
      status: "error",
      statusCode: 200,
      msg: "Usuário autenticado",
    });
  }

  static async logout(req: Request, res: Response) {
    req.session.destroy;

    res.status(200).json({
      status: "sucesso",
      statusCode: 200,
      msg: "Logout feito com sucesso",
    });
  }
}

export default AuthController;
