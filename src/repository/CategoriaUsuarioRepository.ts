import { CategoriaUsuario } from "../model/CategoriaUsuario"

export class CategoriaUsuarioRepository{
    private static instance :CategoriaUsuarioRepository
    private CatUsuarioLista: CategoriaUsuario[] =[]

    private constructor(){
        this.CatUsuarioLista.push(new CategoriaUsuario(1,"Professor"));
        this.CatUsuarioLista.push(new CategoriaUsuario(2,"Aluno"));
        this.CatUsuarioLista.push(new CategoriaUsuario(3,"Bibliotecário"));
    }

    public static getInstance():CategoriaUsuarioRepository{
        if(!this.instance){
            this.instance = new CategoriaUsuarioRepository()
        }
        return this.instance
    }

    InsereCatUsuario(catUsuario:CategoriaUsuario){
        this.CatUsuarioLista.push(catUsuario)
    }

    ExibeTodosCatUsuarios():CategoriaUsuario[]{
        return this.CatUsuarioLista
    }

    AchaCatUsuPorId(id:number):CategoriaUsuario|undefined{
        return this.CatUsuarioLista.find(categoria =>categoria.id ===id);
    }

}