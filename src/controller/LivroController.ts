import { Request, Response } from 'express';
import { LivroService } from '../service/LivroService';

export class LivroController {
    private livroService: LivroService;

    constructor() {
        this.livroService = new LivroService();
    }

    public async criarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const { titulo, autor, editora, edicao, isbn, categoria_id } = req.body;
            if (!titulo || !autor || !editora || !edicao || !isbn || !categoria_id) {
                return res.status(400).json({ message: 'Todos os campos (titulo, autor, editora, edicao, isbn, categoria_id) são obrigatórios.' });
            }
            const novoLivro = await this.livroService.novoLivro({ titulo, autor, editora, edicao, isbn, categoria_id });
            return res.status(201).json(novoLivro);
        } catch (error: any) {
            console.error('Erro ao criar livro:', error);
            if (error.message.includes('Categoria de livro inválida')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('já existe um livro cadastrado com este ISBN')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao criar livro.' });
        }
    }

    public async listarTodosLivros(req: Request, res: Response): Promise<Response> {
        try {
            const livros = await this.livroService.exibeTodosLivros();
            return res.status(200).json(livros);
        } catch (error: any) {
            console.error('Erro ao listar todos os livros:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar livros.' });
        }
    }

    public async buscarLivroPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID do livro inválido.' });
            }
            const livro = await this.livroService.exibeLivroPorId(id);
            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado.' });
            }
            return res.status(200).json(livro);
        } catch (error: any) {
            console.error('Erro ao buscar livro por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar livro.' });
        }
    }

    public async buscarLivroPorNome(req: Request, res: Response): Promise<Response> {
        try {
            const nome = req.query.nome as string;
            if (!nome) {
                return res.status(400).json({ message: 'O nome do livro é obrigatório para a busca.' });
            }
            const livros = await this.livroService.buscaLivroPorNome(nome);
            return res.status(200).json(livros);
        } catch (error: any) {
            console.error('Erro ao buscar livro por nome:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar livro.' });
        }
    }

    public async buscarLivroPorCategoria(req: Request, res: Response): Promise<Response> {
        try {
            const categoriaId = parseInt(req.params.categoriaId, 10); // Assumindo rota /livros/categoria/:categoriaId
            if (isNaN(categoriaId)) {
                return res.status(400).json({ message: 'ID da categoria inválido.' });
            }
            const livros = await this.livroService.buscaLivroPorCategoria(categoriaId);
            return res.status(200).json(livros);
        } catch (error: any) {
            console.error('Erro ao buscar livro por categoria:', error);
            if (error.message.includes('Categoria de livro inválida')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar livro por categoria.' });
        }
    }

    public async atualizarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            const dataAtualizada = req.body; // Aceita qualquer campo para atualização
            if (isNaN(id) || Object.keys(dataAtualizada).length === 0) {
                return res.status(400).json({ message: 'ID do livro e pelo menos um campo para atualização são obrigatórios.' });
            }
            const livroAtualizado = await this.livroService.atualizaLivro(id, dataAtualizada);
            if (!livroAtualizado) {
                return res.status(404).json({ message: 'Livro não encontrado para atualização.' });
            }
            return res.status(200).json(livroAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar livro:', error);
            if (error.message.includes('Livro não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('inválida') || error.message.includes('ISBN')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar livro.' });
        }
    }

    public async removerLivro(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID do livro inválido.' });
            }
            const sucesso = await this.livroService.removeLivro(id);
            if (!sucesso) {
                return res.status(404).json({ message: 'Livro não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao remover livro:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('itens em estoque')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao remover livro.' });
        }
    }
}