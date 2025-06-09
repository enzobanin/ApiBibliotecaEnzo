import { Curso } from "../model/Curso"

export class CursoRepository{
    private static instance :CursoRepository
    private CursoLista: Curso[] =[]

    private constructor(){
        this.CursoLista.push(new Curso(1,"ADS"));
        this.CursoLista.push(new Curso(2,"Pedagogia"));
        this.CursoLista.push(new Curso(3,"Administração"));
    }

    public static getInstance():CursoRepository{
        if(!this.instance){
            this.instance = new CursoRepository()
        }
        return this.instance
    }

    public InsereCurso(curso:Curso):Curso{
        this.CursoLista.push(curso)
        return curso;
    }

    public ExibeTodosCursos():Curso[]{
        return this.CursoLista
    }

    public AchaCursoPorId(id:number):Curso|undefined{
        return this.CursoLista.find(curso =>curso.id ===id);
    }
}