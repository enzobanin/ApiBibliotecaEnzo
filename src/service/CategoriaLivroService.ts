import { CategoriaLivro } from "../model/CategoriaLivro";
import { CategoriaLivroRepository } from "../repository/CategoriaLivroRepository";

export class CategoriaLivroService {
    private categoriaLivroRepository = CategoriaLivroRepository.getInstance();

    constructor() {}
    public exibeTodasCategoriasLivro(): CategoriaLivro[] {
        return this.categoriaLivroRepository.ExibeTodosCatLivros();
    }
    public exibeCategoriaLivroPorId(id: number): CategoriaLivro | undefined {
        if (id === null || id === undefined) {
            throw new Error("ID da categoria do livro é obrigatório para a busca.");
        }
        return this.categoriaLivroRepository.AchaCatLivroPorId(id);
    }
}