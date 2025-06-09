import { Request, Response } from 'express';
import { CursoService } from '../service/CursoService'; // Assumindo que você criará este Service

export class CursoController {
    private cursoService: CursoService;

    constructor() {
        this.cursoService = new CursoService();
    }

    public async criarCurso(req: Request, res: Response): Promise<Response> {
        try {
            const { nome } = req.body;
            if (!nome) {
                return res.status(400).json({ message: 'O nome do curso é obrigatório.' });
            }
            const novoCurso = await this.cursoService.novoCurso({ nome });
            return res.status(201).json(novoCurso);
        } catch (error: any) {
            console.error('Erro ao criar curso:', error);
            if (error.message.includes('já cadastrado')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao criar curso.' });
        }
    }

    public async listarCursos(req: Request, res: Response): Promise<Response> {
        try {
            const cursos = await this.cursoService.exibeTodosCursos();
            return res.status(200).json(cursos);
        } catch (error: any) {
            console.error('Erro ao listar cursos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar cursos.' });
        }
    }

    public async buscarCursoPorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID do curso inválido.' });
            }
            const curso = await this.cursoService.achaCursoPorId(id);
            if (!curso) {
                return res.status(404).json({ message: 'Curso não encontrado.' });
            }
            return res.status(200).json(curso);
        } catch (error: any) {
            console.error('Erro ao buscar curso por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar curso.' });
        }
    }

    public async atualizarCurso(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            const { nome } = req.body;
            if (isNaN(id) || !nome) {
                return res.status(400).json({ message: 'ID do curso e nome são obrigatórios para atualização.' });
            }
            const cursoAtualizado = await this.cursoService.atualizaCurso(id, { nome });
            if (!cursoAtualizado) {
                return res.status(404).json({ message: 'Curso não encontrado para atualização.' });
            }
            return res.status(200).json(cursoAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar curso:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('já existe')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar curso.' });
        }
    }

    public async deletarCurso(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID do curso inválido.' });
            }
            const sucesso = await this.cursoService.removeCurso(id);
            if (!sucesso) {
                return res.status(404).json({ message: 'Curso não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao deletar curso:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('usuários associados')) { // Assumindo que o service valida isso
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao deletar curso.' });
        }
    }
}