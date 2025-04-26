import { NextFunction, Request, Response } from "express";

export default function ValidateAuth(req: Request, res: Response, next: NextFunction)  {
    const id_usuario = req.session.id_usuario;
    
    if (!id_usuario) {
        res.status(400).json({
            status: "error",
            statusCode: 400,
            msg: "Usuário não autentificado"
        })
    }

    next();
}