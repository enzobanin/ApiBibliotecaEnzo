import { Livro } from "../model/Livro"

export class LivroRepository{
    private static instance: LivroRepository
    private LivroLista : Livro[] = []
    private constructor(){}
    
    public static getInstance():LivroRepository{
        if(!this.instance){
            this.instance = new LivroRepository()
        }
        return this.instance
    }
    InsereLivro(Livro:Livro){
        this.LivroLista.push(Livro)
    }

    ExibeLivroPorISBN(isbn:string):Livro|undefined{
        const index = this.LivroLista.findIndex(l=>l.isbn===isbn)
        if(index === -1){
            return undefined;
        }
        return this.LivroLista[index];
    }

    RemoveLivroPorISBN(isbn:string):boolean{
        const index = this.LivroLista.findIndex(l=>l.isbn===isbn)
        if(index == -1){
            return false;
        }
        this.LivroLista.splice(index,1);
        return true;
    }

    ExibeTodosLivros():Livro[]{
        return this.LivroLista
    }

    AtualizaLivro(isbn:string, LivroAtualizado:Livro):Livro|undefined{
        const index = this.LivroLista.findIndex(l=>l.isbn===isbn)
        if(index == -1){
            return undefined;
        }
        LivroAtualizado.isbn = isbn;
        this.LivroLista[index] = LivroAtualizado
        return this.LivroLista[index];
    }
}


