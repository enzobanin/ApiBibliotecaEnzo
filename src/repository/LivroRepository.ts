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
    public InsereLivro(Livro:Livro):Livro{
        this.LivroLista.push(Livro);
        return Livro;
    }

    public ExibeLivroPorISBN(isbn:string):Livro|undefined{
        const index = this.LivroLista.findIndex(l=>l.isbn===isbn)
        if(index === -1){
            return undefined;
        }
        return this.LivroLista[index];
    }

    public RemoveLivroPorISBN(isbn:string):boolean{
        const index = this.LivroLista.findIndex(l=>l.isbn===isbn)
        if(index == -1){
            return false;
        }
        this.LivroLista.splice(index,1);
        return true;
    }
    public ExibeLivroPorId(id: number): Livro|undefined {
        return this.LivroLista.find(l=>l.id === id);
    }
    public ExibeTodosLivros():Livro[]{
        return this.LivroLista
    }

    public AtualizaLivro(isbn:string, LivroAtualizado:Livro):Livro|undefined{
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



