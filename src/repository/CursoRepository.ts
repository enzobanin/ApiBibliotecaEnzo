import { Curso } from "../model/Curso"

export class CursoRepository{
    private static instance :CursoRepository
    private CursoLista: Curso[] =[]

    private constructor(){
        this.CursoLista.push(new Curso(1,"ADS"));
        this.CursoLista.push(new Curso(1,"Pedagogia"));
        this.CursoLista.push(new Curso(1,"Administração"));
    }

    public static getInstance():CursoRepository{
        if(!this.instance){
            this.instance = new CursoRepository()
        }
        return this.instance
    }

    InsereCurso(curso:Curso){
        this.CursoLista.push(curso)
    }

    ExibeTodosCursos():Curso[]{
        return this.CursoLista
    }

    AchaCursoPorId(id:number):Curso|undefined{
        return this.CursoLista.find(curso =>curso.id ===id);
    }
}