import { Request, Response } from "express";
import EnderecoService from "../services/EnderecoService";

class EnderecoController {
    static async create(req: Request, res: Response) {
        const id_usuario = await req.session.id_usuario;
        const { endereco } = req.body;

        const response = await EnderecoService.create(endereco, Number(id_usuario));

        res.status(response.statusCode).json(response);
    }

    static async findById(req: Request, res: Response) {
        const id_usuario = await req.session.id_usuario;
        const { id_endereco } = req.params;
        
        const response = await EnderecoService.findById(Number(id_endereco), Number(id_usuario));
        
        res.status(response.statusCode).json(response);
    }
    
    static async findAll(req: Request, res: Response) {
        const id_usuario = await req.session.id_usuario;
        
        const response = await EnderecoService.findAll(Number(id_usuario));
        
        res.status(response.statusCode).json(response);
    }

    static async delete(req: Request, res: Response) {
        const id_usuario = await req.session.id_usuario;
        const { id_endereco } = req.params;
    
        const response = await EnderecoService.delete(Number(id_endereco), Number(id_usuario));
    
        res.status(response.statusCode).json(response);
    }
}

export default EnderecoController;