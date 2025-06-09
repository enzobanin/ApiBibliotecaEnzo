import { Request, Response } from 'express';
import { CategoriaUsuarioService } from '../service/CategoriaUsuarioService'; // Assumindo que você criará este Service

export class CategoriaUsuarioController {
    private categoriaUsuarioService: CategoriaUsuarioService;

    constructor() {
        this.categoriaUsuarioService = new CategoriaUsuarioService();
    }

    public async criarCategoriaUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const { nome } = req.body;
            if (!nome) {
                return res.status(400).json({ message: 'O nome da categoria é obrigatório.' });
            }
            const novaCategoria = await this.categoriaUsuarioService.novaCategoriaUsuario({ nome });
            return res.status(201).json(novaCategoria);
        } catch (error: any) {
            console.error('Erro ao criar categoria de usuário:', error);
            if (error.message.includes('já cadastrada')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao criar categoria de usuário.' });
        }
    }

    public async listarCategoriasUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const categorias = await this.categoriaUsuarioService.exibeTodasCategoriasUsuario();
            return res.status(200).json(categorias);
        } catch (error: any) {
            console.error('Erro ao listar categorias de usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar categorias de usuário.' });
        }
    }

    public async buscarCategoriaUsuarioPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID da categoria inválido.' });
            }
            const categoria = await this.categoriaUsuarioService.achaCatUsuPorId(id);
            if (!categoria) {
                return res.status(404).json({ message: 'Categoria de usuário não encontrada.' });
            }
            return res.status(200).json(categoria);
        } catch (error: any) {
            console.error('Erro ao buscar categoria de usuário por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar categoria de usuário.' });
        }
    }

    public async atualizarCategoriaUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            const { nome } = req.body;
            if (isNaN(id) || !nome) {
                return res.status(400).json({ message: 'ID da categoria e nome são obrigatórios para atualização.' });
            }
            const categoriaAtualizada = await this.categoriaUsuarioService.atualizaCategoriaUsuario(id, { nome });
            if (!categoriaAtualizada) {
                return res.status(404).json({ message: 'Categoria de usuário não encontrada para atualização.' });
            }
            return res.status(200).json(categoriaAtualizada);
        } catch (error: any) {
            console.error('Erro ao atualizar categoria de usuário:', error);
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('já existe')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar categoria de usuário.' });
        }
    }

    public async deletarCategoriaUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID da categoria inválido.' });
            }
            const sucesso = await this.categoriaUsuarioService.removeCategoriaUsuario(id);
            if (!sucesso) {
                return res.status(404).json({ message: 'Categoria de usuário não encontrada para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao deletar categoria de usuário:', error);
            if (error.message.includes('não encontrada')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('usuários associados')) { // Assumindo que o service valida isso
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao deletar categoria de usuário.' });
        }
    }
}