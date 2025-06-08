import { Curso } from "../model/Curso"

export class CursoRepository{
    private static instance :CursoRepository
    private CursoLista: Curso[] =[]

    private constructor(){}

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

}