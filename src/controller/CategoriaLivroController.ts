import { Request, Response } from 'express';
import { CategoriaLivroService } from '../service/CategoriaLivroService'; // Assumindo que você criará este Service

export class CategoriaLivroController {
    private categoriaLivroService: CategoriaLivroService;

    constructor() {
        this.categoriaLivroService = new CategoriaLivroService();
    }

    public async criarCategoriaLivro(req: Request, res: Response): Promise<Response> {
        try {
            const { nome } = req.body;
            if (!nome) {
                return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
            }
            const novaCategoria = await this.categoriaLivroService.novaCategoriaLivro({ nome });
            return res.status(201).json(novaCategoria);
        } catch (error: any) {
            console.error('Erro ao criar categoria de livro:', error);
            if (error.message.includes('já cadastrada')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao criar categoria de livro.' });
        }
    }

    public async listarCategoriasLivro(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = await this.categoriaLivroService.exibeTodasCategoriasLivro();
            return res.status(200).json(categorias);
        } catch (error: any) {
            console.error('Erro ao listar categorias de livro:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar categorias de livro.' });
        }
    }

    public async buscarCategoriaLivroPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID da categoria inválido.' });
            }
            const categoria = await this.categoriaLivroService.achaCatLivroPorId(id);
            if (!categoria) {
                return res.status(404).json({ message: 'Categoria de livro não encontrada.' });
            }
            return res.status(200).json(categoria);
        } catch (error: any) {
            console.error('Erro ao buscar categoria de livro por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar categoria de livro.' });
        }
    }

    public async atualizarCategoriaLivro(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            const { nome } = req.body;
            if (isNaN(id) || !nome) {
                return res.status(400).json({ message: 'ID da categoria e nome são obrigatórios para atualização.' });
            }
            const categoriaAtualizada = await this.categoriaLivroService.atualizaCategoriaLivro(id, { nome });
            if (!categoriaAtualizada) {
                return res.status(404).json({ message: 'Categoria de livro não encontrada para atualização.' });
            }
            return res.status(200).json(categoriaAtualizada);
        } catch (error: any) {
            console.error('Erro ao atualizar categoria de livro:', error);
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('já existe')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar categoria de livro.' });
        }
    }

    public async deletarCategoriaLivro(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID da categoria inválido.' });
            }
            const sucesso = await this.categoriaLivroService.removeCategoriaLivro(id);
            if (!sucesso) {
                // Isso pode indicar que não foi encontrada, mas o service já lançaria erro
                return res.status(404).json({ message: 'Categoria de livro não encontrada para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao deletar categoria de livro:', error);
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('livros associados')) { // Assumindo que o service valida isso
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao deletar categoria de livro.' });
        }
    }
}