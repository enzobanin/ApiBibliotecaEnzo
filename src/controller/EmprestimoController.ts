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
            if (error.message.includes('não encontrado') || error.message.includes('inativo') || error.message.includes('inválido')) {
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
            const statusFilter = req.query.status as string;

            let emprestimos;
            if (statusFilter === 'ativos') {
                emprestimos = await this.emprestimoService.exibeEmprestimosAtivos(); 
            } else if (statusFilter === 'historico') {
                emprestimos = await this.emprestimoService.exibeHistoricoEmprestimos(); 
            } else {
                emprestimos = await this.emprestimoService.exibeTodosEmprestimos();
            }
            return res.status(200).json(emprestimos);
        } catch (error: any) {
            console.error('Erro ao listar empréstimos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar empréstimos.' });
        }
    }
}