import { Request, Response } from 'express';
import { UsuarioService } from '../service/UsuarioService';

export class UsuarioController {
    private usuarioService: UsuarioService;

    constructor() {
        this.usuarioService = new UsuarioService();
    }

    public async criarUsuario(req: Request, res: Response): Promise<Response> {
        try {
            // Campos obrigatórios: nome, CPF, email, categoria, curso. 
            const { nome, cpf, email, categoria_id, curso_id } = req.body;
            if (!nome || !cpf || !email || !categoria_id || !curso_id) {
                return res.status(400).json({ message: 'Todos os campos (nome, CPF, email, categoria, curso) são obrigatórios.' });
            }
            const novoUsuario = await this.usuarioService.novoUsuario({ nome, cpf, email, categoria_id, curso_id });
            return res.status(201).json(novoUsuario);
        } catch (error: any) {
            console.error('Erro ao cadastrar novo usuário:', error);
            if (error.message.includes('CPF já cadastrado')) {
                return res.status(409).json({ message: error.message });
            }
            if (error.message.includes('Categoria de usuário inválida') || error.message.includes('Curso inválido')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao cadastrar usuário.' });
        }
    }

    public async listarTodosUsuarios(req: Request, res: Response): Promise<Response> {
        try {
            // "Lista todos os usuários (com filtros opcionais)." 
            // Implementação de filtro genérico ou específicos se o service suportar
            // Por simplicidade, retorno todos se não houver filtros específicos implementados no service.
            const usuarios = this.usuarioService.exibeTodosUsuarios(); // Não é async no service
            return res.status(200).json(usuarios);
        } catch (error: any) {
            console.error('Erro ao listar todos os usuários:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar usuários.' });
        }
    }

    public async buscarUsuarioPorCPF(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.params.cpf; // PDF especifica ":cpf" 
            if (!cpf) {
                return res.status(400).json({ message: 'CPF do usuário é obrigatório para a busca.' });
            }
            const usuario = this.usuarioService.exibeUsuarioPorCPF(cpf);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            return res.status(200).json(usuario);
        } catch (error: any) {
            console.error('Erro ao retornar detalhes de usuário por CPF:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar usuário.' });
        }
    }

    public async atualizarUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.params.cpf; // PDF especifica ":cpf" 
            const dataAtualizada = req.body;
            if (!cpf || Object.keys(dataAtualizada).length === 0) {
                return res.status(400).json({ message: 'CPF do usuário e pelo menos um campo para atualização são obrigatórios.' });
            }
            const usuarioAtualizado = await this.usuarioService.atualizaUsuario(cpf, dataAtualizada);
            if (!usuarioAtualizado) {
                return res.status(404).json({ message: 'Usuário não encontrado para atualização.' });
            }
            return res.status(200).json(usuarioAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar dados do usuário:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('inválida') || error.message.includes('inválido') || error.message.includes('já está cadastrado')) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar usuário.' });
        }
    }

    public async removerUsuario(req: Request, res: Response): Promise<Response> {
        try {
            const cpf = req.params.cpf; // PDF especifica ":cpf" 
            if (!cpf) {
                return res.status(400).json({ message: 'CPF do usuário é obrigatório para remoção.' });
            }
            // "Remove usuário (se não tiver empréstimos)." 
            const sucesso = await this.usuarioService.removeUsuario(cpf);
            if (!sucesso) {
                return res.status(404).json({ message: 'Usuário não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao remover usuário:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('empréstimos ativos')) { // Mensagem de erro do Service
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao remover usuário.' });
        }
    }
}