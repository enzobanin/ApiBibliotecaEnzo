import { Request, Response } from 'express';
import { CategoriaLivroService } from '../service/CategoriaLivroService';

export class CategoriaLivroController {
    private categoriaLivroService: CategoriaLivroService;

    constructor() {
        this.categoriaLivroService = new CategoriaLivroService();
    }

    public async listarCategoriasLivro(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = this.categoriaLivroService.exibeTodasCategoriasLivro(); 
            return res.status(200).json(categorias);
        } catch (error: any) {
            console.error('Erro ao listar categorias de livro:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar categorias de livro.' });
        }
    }
}