import { Request, Response } from 'express';
import { LivroService } from '../service/LivroService';

export class LivroController {
    private livroService: LivroService;

    constructor() {
        this.livroService = new LivroService();
    }

    public async criarLivro(req: Request, res: Response): Promise<Response> {
        try {
            // Campos obrigatórios: título, ISBN, autor, editora, edição, categoria. 
            const { titulo, isbn, autor, editora, edicao, categoria_id } = req.body;
            if (!titulo || !isbn || !autor || !editora || !edicao || !categoria_id) {
                return res.status(400).json({ message: 'Todos os campos (titulo, ISBN, autor, editora, edicao, categoria) são obrigatórios.' });
            }
            const novoLivro = await this.livroService.novoLivro({ titulo, isbn, autor, editora, edicao, categoria_id });
            return res.status(201).json(novoLivro);
        } catch (error: any) {
            console.error('Erro ao adicionar novo livro:', error);
            if (error.message.includes('já existe um livro cadastrado com este ISBN') || error.message.includes('combinação de autor, editora e edição')) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('Categoria de livro inválida')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao adicionar livro.' });
        }
    }

    public async listarTodosLivros(req: Request, res: Response): Promise<Response> {
        try {
            // O PDF diz "Lista todos os livros (com filtros)." 
            // Assumo que os filtros serão passados como query parameters (ex: /livros?nome=...)
            const nomeFilter = req.query.nome as string;
            const categoriaFilter = req.query.categoriaId ? parseInt(req.query.categoriaId as string, 10) : undefined;

            let livros;
            if (nomeFilter) {
                livros = this.livroService.buscaLivroPorNome(nomeFilter);
            } else if (categoriaFilter) {
                livros = this.livroService.buscaLivroPorCategoria(categoriaFilter);
            } else {
                livros = this.livroService.exibeTodosLivros();
            }
            return res.status(200).json(livros);
        } catch (error: any) {
            console.error('Erro ao listar livros:', error);
            if (error.message.includes('Categoria de livro inválida') || error.message.includes('nome para busca é obrigatório')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao listar livros.' });
        }
    }

    public async buscarLivroPorISBN(req: Request, res: Response): Promise<Response> {
        try {
            const isbn = req.params.isbn; // PDF especifica ":isbn" 
            if (!isbn) {
                return res.status(400).json({ message: 'ISBN do livro é obrigatório para a busca.' });
            }
            const livro = this.livroService.exibeLivroPorISBN(isbn); // Seu service tem exibeLivroPorISBN
            if (!livro) {
                return res.status(404).json({ message: 'Livro não encontrado.' });
            }
            return res.status(200).json(livro);
        } catch (error: any) {
            console.error('Erro ao mostrar detalhes do livro por ISBN:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar livro.' });
        }
    }

    public async atualizarLivro(req: Request, res: Response): Promise<Response> {
        try {
            const isbn = req.params.isbn; // PDF especifica ":isbn" 
            const dataAtualizada = req.body;
            if (!isbn || Object.keys(dataAtualizada).length === 0) {
                return res.status(400).json({ message: 'ISBN do livro e pelo menos um campo para atualização são obrigatórios.' });
            }
            const livroAtualizado = await this.livroService.atualizaLivro(isbn, dataAtualizada); // Seu service aceita ISBN
            if (!livroAtualizado) {
                return res.status(404).json({ message: 'Livro não encontrado para atualização.' });
            }
            return res.status(200).json(livroAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar livro:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('inválida') || error.message.includes('já existe outro livro cadastrado com este ISBN') || error.message.includes('A combinação de autor, editora e edição fornecida já existe')) {
                return res.status(400).json({ message: error.message }); // 400 ou 409, dependendo do contexto
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar livro.' });
        }
    }

    public async removerLivro(req: Request, res: Response): Promise<Response> {
        try {
            const isbn = req.params.isbn; // PDF especifica ":isbn" 
            if (!isbn) {
                return res.status(400).json({ message: 'ISBN do livro é obrigatório para remoção.' });
            }
            // "Remove livro (se não estiver emprestado)." 
            const sucesso = await this.livroService.removeLivro(isbn); // Seu service aceita ISBN
            if (!sucesso) {
                return res.status(404).json({ message: 'Livro não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao remover livro:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('exemplares emprestados') || error.message.includes('itens em estoque')) { // Mensagem de erro do Service
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao remover livro.' });
        }
    }
}