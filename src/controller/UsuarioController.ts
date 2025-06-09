import { Request, Response } from 'express';
import { UsuarioService } from '../service/UsuarioService';

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor() {
        this.usuarioService = new UsuarioService();
    }

    public async criarUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const { nome, cpf, categoria_id, curso_id } = req.body;
            if (!nome || !cpf || !categoria_id || !curso_id) {
                return res.status(400).json({ message: 'Todos os campos (nome, cpf, categoria_id, curso_id) são obrigatórios.' });
            }
            const novoUsuario = await this.usuarioService.novoUsuario({ nome, cpf, categoria_id, curso_id });
            return res.status(201).json(novoUsuario);
        } catch (error: any) {
            console.error('Erro ao criar usuário:', error);
            if (error.message.includes('CPF já cadastrado')) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('Categoria de usuário inválida') || error.message.includes('Curso inválido')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao criar usuário.' });
        }
    }

    public async listarTodosUsuarios(req: Request, res: Response): Promise<Response> {
        try {
            const usuarios = await this.usuarioService.exibeTodosUsuarios();
            return res.status(200).json(usuarios);
        } catch (error: any) {
            console.error('Erro ao listar todos os usuários:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
        }
    }

    public async buscarUsuarioPorCPF(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.params.cpf;
            if (!cpf) {
                return res.status(400).json({ message: 'CPF do usuário é obrigatório para a busca.' });
            }
            const usuario = await this.usuarioService.exibeUsuarioPorCPF(cpf);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            return res.status(200).json(usuario);
        } catch (error: any) {
            console.error('Erro ao buscar usuário por CPF:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
        }
    }

    public async atualizarUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.params.cpf;
            const dataAtualizada = req.body; // Pode conter nome, ativo, categoria_id, curso_id
            if (!cpf || Object.keys(dataAtualizada).length === 0) {
                return res.status(400).json({ message: 'CPF do usuário e pelo menos um campo para atualização são obrigatórios.' });
            }
            const usuarioAtualizado = await this.usuarioService.atualizaUsuario(cpf, dataAtualizada);
            if (!usuarioAtualizado) {
                return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
            }
            return res.status(200).json(usuarioAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar usuário:', error);
            if (error.message.includes('Usuário não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('inválida') || error.message.includes('inválido')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
        }
    }

    public async removerUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.params.cpf;
            if (!cpf) {
                return res.status(400).json({ message: 'CPF do usuário é obrigatório para remoção.' });
            }
            const sucesso = await this.usuarioService.removeUsuario(cpf);
            if (!sucesso) {
                return res.status(404).json({ message: 'Usuário não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao remover usuário:', error);
            if (error.message.includes('Usuário não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('empréstimos ativos')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao remover usuário.' });
        }
    }
}