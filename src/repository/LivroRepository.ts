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
    InsereLivro(Livro:Livro):Livro{
        this.LivroLista.push(Livro);
        return Livro;
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
    ExibeLivroPorId(id: number): Livro|undefined {
        return this.LivroLista.find(l=>l.id === id);
    }
    ExibeTodosLivros():Livro[]{
        return this.LivroLista
    }

    AtualizaLivro(isbn:string, LivroAtualizado:Livro):Livro|undefined{
        const index = this.LivroLista.findIndex(l=>l.isbn===isbn)
        if(index == -1){
            return undefined;
        }
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



