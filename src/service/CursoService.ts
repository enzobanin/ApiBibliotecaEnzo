import { Curso } from "../model/Curso";
import { CursoRepository } from "../repository/CursoRepository";

export class CursoService {
    private cursoRepository = CursoRepository.getInstance();

    constructor() {}

    public exibeTodosCursos(): Curso[] {
        return this.cursoRepository.ExibeTodosCursos();
    }

    public exibeCursoPorId(id: number): Curso | undefined {
        if (id === null || id === undefined) {
            throw new Error("ID do curso é obrigatório para a busca.");
        }
        return this.cursoRepository.AchaCursoPorId(id);
    }

}