import { Request, Response } from "express";
import UsuarioService from "../services/UsuarioService";

class UsuarioController {
  static async get(req: Request, res: Response) {
    if (!req.session.id_usuario) {
      res.status(500).json({
        status: "error",
        statusCode: 500,
        msg: "Usuário não autentificado",
      });
      return;
    }

    const response = await UsuarioService.buscarUsuarioPorId(
      req.session.id_usuario
    );

    res.status(response.statusCode).json(response);
  }

  static async requestUpdateEmail(req: Request, res: Response) {
    const { email } = req.body;
    const id_usuario = req.session.id_usuario;

    if (!id_usuario || typeof id_usuario !== "number") {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        msg: "Usuário não autenticado",
      });
      return;
    }

    const response = await UsuarioService.requestUpdateEmail(id_usuario, email);

    res.status(response.statusCode).json(response);
  }

  static async updateEmail(req: Request, res: Response) {
    const { code } = req.body;
    const id_usuario = req.session.id_usuario;

    if (!id_usuario || typeof id_usuario !== "number") {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        msg: "Usuário não autenticado",
      });
      return;
    }

    const response = await UsuarioService.updateEmail(id_usuario, code);

    res.status(response.statusCode).json(response);
  }

  static async requestUpdatePassword(req: Request, res: Response) {
    const { password } = req.body;
    const id_usuario = req.session.id_usuario;

    if (!id_usuario || typeof id_usuario !== "number") {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        msg: "Usuário não autenticado",
      });
      return;
    }

    const response = await UsuarioService.requestUpdatePassword(
      id_usuario,
      password
    );

    res.status(response.statusCode).json(response);
  }

  static async updatePassword(req: Request, res: Response) {
    const { code } = req.body;
    const id_usuario = req.session.id_usuario;

    if (!id_usuario || typeof id_usuario !== "number") {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        msg: "Usuário não autenticado",
      });
      return;
    }

    const response = await UsuarioService.updateEmail(id_usuario, code);

    res.status(response.statusCode).json(response);
  }

  static async delete(req: Request, res: Response) {
    const { password } = req.body;
    const id_usuario = req.session.id_usuario;

    if (!id_usuario || typeof id_usuario !== "number") {
      res.status(400).json({
        status: "error",
        statusCode: 400,
        msg: "Usuário não autenticado",
      });
      return;
    }

    const response = await UsuarioService.deletarUsuario(id_usuario, password);

    res.status(response.statusCode).json(response);
  }
}

export default UsuarioController;
