import { CategoriaUsuario } from "../model/CategoriaUsuario"

export class CategoriaUsuarioRepository{
    private static instance :CategoriaUsuarioRepository
    private CatUsuarioLista: CategoriaUsuario[] =[]

    private constructor(){}

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

}