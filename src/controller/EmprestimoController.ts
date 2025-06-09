import { Request, Response } from 'express';
import { EmprestimoService } from '../service/EmprestimoService';

export class EmprestimoController {
    private emprestimoService: EmprestimoService;

    constructor() {
        this.emprestimoService = new EmprestimoService();
    }

    public async realizarEmprestimo(req: Request, res: Response): Promise<Response> {
        try {
            const { usuarioCpf, exemplarLivroId } = req.body;
            if (!usuarioCpf || !exemplarLivroId) {
                return res.status(400).json({ message: 'CPF do usuário e ID do exemplar do livro são obrigatórios.' });
            }
            const novoEmprestimo = await this.emprestimoService.realizaEmprestimo(usuarioCpf, exemplarLivroId);
            return res.status(201).json(novoEmprestimo);
        } catch (error: any) {
            console.error('Erro ao realizar empréstimo:', error);
            if (error.message.includes('não encontrado') || error.message.includes('inativo ou suspenso')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('pendentes de regularização') || error.message.includes('Limite de empréstimos') || error.message.includes('indisponível para empréstimo')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao realizar empréstimo.' });
        }
    }

    public async registrarDevolucao(req: Request, res: Response): Promise<Response> {
        try {
            const emprestimoId = parseInt(req.params.id, 10);
            if (isNaN(emprestimoId)) {
                return res.status(400).json({ message: 'ID do empréstimo inválido.' });
            }
            const emprestimoDevolvido = await this.emprestimoService.registraDevolucao(emprestimoId);
            return res.status(200).json(emprestimoDevolvido);
        } catch (error: any) {
            console.error('Erro ao registrar devolução:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('já foi devolvido')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao registrar devolução.' });
        }
    }

    public async listarTodosEmprestimos(req: Request, res: Response): Promise<Response> {
        try {
            const emprestimos = await this.emprestimoService.exibeTodosEmprestimos();
            return res.status(200).json(emprestimos);
        } catch (error: any) {
            console.error('Erro ao listar todos os empréstimos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar empréstimos.' });
        }
    }

    public async listarEmprestimosAtivos(req: Request, res: Response): Promise<Response> {
        try {
            const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId as string, 10) : undefined;
            if (usuarioId !== undefined && isNaN(usuarioId)) {
                return res.status(400).json({ message: 'ID do usuário inválido.' });
            }
            const emprestimosAtivos = await this.emprestimoService.exibeEmprestimosAtivos(usuarioId);
            return res.status(200).json(emprestimosAtivos);
        } catch (error: any) {
            console.error('Erro ao listar empréstimos ativos:', error);
            if (error.message.includes('Usuário não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao listar empréstimos ativos.' });
        }
    }

    public async listarHistoricoEmprestimos(req: Request, res: Response): Promise<Response> {
        try {
            const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId as string, 10) : undefined;
            if (usuarioId !== undefined && isNaN(usuarioId)) {
                return res.status(400).json({ message: 'ID do usuário inválido.' });
            }
            const historicoEmprestimos = await this.emprestimoService.exibeHistoricoEmprestimos(usuarioId);
            return res.status(200).json(historicoEmprestimos);
        } catch (error: any) {
            console.error('Erro ao listar histórico de empréstimos:', error);
            if (error.message.includes('Usuário não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao listar histórico de empréstimos.' });
        }
    }

    public async listarEmprestimosPendentes(req: Request, res: Response): Promise<Response> {
        try {
            const usuarioId = req.query.usuarioId ? parseInt(req.query.usuarioId as string, 10) : undefined;
            if (usuarioId !== undefined && isNaN(usuarioId)) {
                return res.status(400).json({ message: 'ID do usuário inválido.' });
            }
            const emprestimosPendentes = await this.emprestimoService.exibeEmprestimosPendentes(usuarioId);
            return res.status(200).json(emprestimosPendentes);
        } catch (error: any) {
            console.error('Erro ao listar empréstimos pendentes:', error);
            if (error.message.includes('Usuário não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao listar empréstimos pendentes.' });
        }
    }
}