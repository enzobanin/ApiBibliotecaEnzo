import { Livro } from "../model/Livro";
import { LivroRepository } from "../repository/LivroRepository";
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository"; 
import { EstoqueRepository } from "../repository/EstoqueRepository"; 

export class LivroService {
    private livroRepository = LivroRepository.getInstance();
    private categoriaLivroRepository = CategoriaLivroRepository.getInstance();
    private estoqueRepository = EstoqueRepository.getInstance(); 
    private contadorIdLivro: number = 1; 

    constructor() {
        this.inicializarContadorId();
    }

    private inicializarContadorId(): void {
        const todosLivros = this.livroRepository.ExibeTodosLivros();
        if (todosLivros.length > 0) {
            const maxId = Math.max(...todosLivros.map(l => l.id));
            this.contadorIdLivro = maxId + 1;
        } else {
            this.contadorIdLivro = 1;
        }
    }

    public novoLivro(data: { titulo: string; autor: string; editora: string; edicao:string;  isbn: string;categoria_id: number }): Livro {
        if (!data.titulo || !data.autor || !data.editora ||!data.edicao|| !data.categoria_id || !data.isbn) {
            throw new Error("Favor informar todos os campos obrigatórios: titulo, autor, ano_publicacao, categoria_id, isbn.");
        }

        const categoriaValida = this.categoriaLivroRepository.AchaCatLivroPorId(data.categoria_id);
        if (!categoriaValida) {
            throw new Error("Categoria de livro inválida.");
        }

        const isbnExistente = this.livroRepository.ExibeTodosLivros().find(livro => livro.isbn === data.isbn);
        if (isbnExistente) {
            throw new Error("Já existe um livro cadastrado com este ISBN.");
        }

        const idLivro = this.contadorIdLivro++; 
        const novoLivro = new Livro(
            idLivro,
            data.titulo,
            data.autor,
            data.editora,
            data.edicao,
            data.isbn,
            data.categoria_id
        );

        this.livroRepository.InsereLivro(novoLivro);
        return novoLivro;
    }

    
    public exibeTodosLivros(): Livro[] {
        return this.livroRepository.ExibeTodosLivros();
    }

    
    public exibeLivroPorId(id: number): Livro | undefined {
        if (!id) {
            throw new Error("ID do livro é obrigatório para a busca.");
        }
        return this.livroRepository.ExibeLivroPorId(id);
    }

    public buscaLivroPorNome(nome: string): Livro[] {
        if (!nome) {
            throw new Error("O nome do livro é obrigatório para a busca.");
        }
        const nomeLowerCase = nome.toLowerCase();
        return this.livroRepository.ExibeTodosLivros().filter(livro =>
        livro.titulo.toLowerCase().includes(nomeLowerCase)
    );
    }

    public buscaLivroPorCategoria(categoriaId: number): Livro[] {
        if (!categoriaId) {
            throw new Error("ID da categoria é obrigatório para buscar livros.");
        }
        const categoriaValida = this.categoriaLivroRepository.AchaCatLivroPorId(categoriaId);
        if (!categoriaValida) {
            throw new Error("Categoria de livro inválida.");
        }
        return this.exibeTodosLivros().filter(l =>l.categoria_id === categoriaId);
    }

    public atualizaLivro(id: number, dataAtualizada: { titulo?: string; autor?: string; editora?: string; edicao?: string ; isbn?: string, categoria_id?: number}): Livro | undefined {
        const livroExistente = this.livroRepository.ExibeLivroPorId(id);
        if (!livroExistente) {
            throw new Error("Livro não encontrado.");
        }

        if (dataAtualizada.categoria_id !== undefined && !this.categoriaLivroRepository.AchaCatLivroPorId(dataAtualizada.categoria_id)) {
            throw new Error("Nova categoria de livro inválida.");
        }
        if (dataAtualizada.isbn !== undefined && dataAtualizada.isbn !== livroExistente.isbn) {
            const isbnExistente = this.livroRepository.ExibeTodosLivros().find(livro => livro.isbn === dataAtualizada.isbn && livro.id !== id);
            if (isbnExistente) {
                throw new Error("Já existe outro livro cadastrado com este ISBN.");
            }
        }

        const livroParaAtualizar = new Livro(
            livroExistente.id,
            dataAtualizada.titulo !== undefined ? dataAtualizada.titulo : livroExistente.titulo,
            dataAtualizada.autor !== undefined ? dataAtualizada.autor : livroExistente.autor,
            dataAtualizada.editora !== undefined ? dataAtualizada.editora : livroExistente.editora,
            dataAtualizada.edicao !== undefined ? dataAtualizada.edicao : livroExistente.edicao,
            dataAtualizada.isbn !== undefined ? dataAtualizada.isbn : livroExistente.isbn,
            dataAtualizada.categoria_id !== undefined ? dataAtualizada.categoria_id : livroExistente.categoria_id,
        );

        return this.livroRepository.AtualizaLivro(livroExistente.isbn, livroParaAtualizar);
    }

    public removeLivro(id: number): boolean {
        const livro = this.livroRepository.ExibeLivroPorId(id);
        if (!livro) {
            throw new Error("Livro não encontrado para remoção.");
        }
        const estoqueDoLivro = this.estoqueRepository.BuscaEstoqueLivroPorId(livro.id);
        if (estoqueDoLivro) {
            throw new Error("Não é possível remover o livro, pois ele possui itens em estoque. Remova o estoque primeiro.");
        }

        return this.livroRepository.RemoveLivroPorISBN(livro.isbn);
    }
}