import { Request, Response } from 'express';
import { CategoriaUsuarioService } from '../service/CategoriaUsuarioService';

export class CategoriaUsuarioController {
    private categoriaUsuarioService: CategoriaUsuarioService;

    constructor() {
        this.categoriaUsuarioService = new CategoriaUsuarioService();
    }

    public async listarCategoriasUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = this.categoriaUsuarioService.exibeTodasCategoriasUsuario(); 
            return res.status(200).json(categorias);
        } catch (error: any) {
            console.error('Erro ao listar categorias de usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar categorias de usuário.' });
        }
    }
}