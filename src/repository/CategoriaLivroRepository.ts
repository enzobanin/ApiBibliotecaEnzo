import { CategoriaLivro } from "../model/CategoriaLivro";

export class CategoriaLivroRepository{
    private static instance :CategoriaLivroRepository
    private CatLivroLista: CategoriaLivro[] =[]

    private constructor(){}

    public static getInstance():CategoriaLivroRepository{
        if(!this.instance){
            this.instance = new CategoriaLivroRepository()
        }
        return this.instance
    }

    InsereCatLivro(catLivro:CategoriaLivro){
        this.CatLivroLista.push(catLivro)
    }

    ExibeTodosCatLivros():CategoriaLivro[]{
        return this.CatLivroLista
    }

}