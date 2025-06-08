import { CategoriaLivro } from "../model/CategoriaLivro";

export class CategoriaLivroRepository{
    private static instance :CategoriaLivroRepository
    private CatLivroLista: CategoriaLivro[] =[]

    private constructor(){
        this.CatLivroLista.push(new CategoriaLivro(1,"Romance"));
        this.CatLivroLista.push(new CategoriaLivro(2,"Computação"));
        this.CatLivroLista.push(new CategoriaLivro(3,"Letras"));
        this.CatLivroLista.push(new CategoriaLivro(4,"Gestão"));
    }

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

    AchaCatLivroPorId(id:number):CategoriaLivro|undefined{
            return this.CatLivroLista.find(categoria =>categoria.id ===id);
        }
}