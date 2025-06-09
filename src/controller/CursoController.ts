import { Request, Response } from 'express';
import { CursoService } from '../service/CursoService';

export class CursoController {
    private cursoService: CursoService;

    constructor() {
        this.cursoService = new CursoService();
    }

    public async listarCursos(req: Request, res: Response): Promise<Response> {
        try {
            const cursos = this.cursoService.exibeTodosCursos(); 
            return res.status(200).json(cursos);
        } catch (error: any) {
            console.error('Erro ao listar cursos:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar cursos.' });
        }
    }
}