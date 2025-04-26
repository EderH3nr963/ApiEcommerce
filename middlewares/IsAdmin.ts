import { NextFunction, Request, Response } from "express";

export default function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.session.is_admin) {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      msg: "Usuário não possui permissões de administrador",
    });
  }

  next();
}
