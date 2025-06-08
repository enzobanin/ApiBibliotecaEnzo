import { Livro } from "../model/Livro"

export class LivroRepository{
    private static instance: LivroRepository
    private LivroLista : Livro[] = []
    private constructor(){}
    
    static getInstance():LivroRepository{
        if(!this.instance){
            this.instance = new LivroRepository()
        }
        return this.instance
    }

    private findIndex(isbn:string):number{
        const index = this.LivroLista.findIndex(p=>p.isbn == isbn)
        if(index == -1){
            throw new Error("ISBN não encontrado")
        }
        return index
    }

    InsereLivro(Livro:Livro){
        this.LivroLista.push(Livro)
    }

    ExibeLivroPorISBN(isbn:string){
        const index = this.findIndex(isbn)
        this.LivroLista[index]
    }

    RemoveLivroPorISBN(isbn:string){
        const index = this.findIndex(isbn)
        this.LivroLista.splice(index,1)
    }

    ExibeTodosLivros():Livro[]{
        return this.LivroLista
    }

    AtualizaLivro(isbn:string, LivroAtualizado:Livro):Livro{
        const index = this.findIndex(isbn)
        let LivroExistente = this.LivroLista[index];
        LivroExistente.titulo = LivroAtualizado.titulo;
        LivroExistente.autor = LivroAtualizado.autor;
        LivroExistente.editora = LivroAtualizado.editora;
        LivroExistente.edicao = LivroAtualizado.edicao;
        LivroExistente.isbn = LivroAtualizado.isbn;
        LivroExistente.categoria_id = LivroAtualizado.categoria_id;

        return LivroExistente;
    }
}


