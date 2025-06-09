import { CategoriaUsuario } from "../model/CategoriaUsuario";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";

export class CategoriaUsuarioService{
    private categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance();
    constructor() {}

    public exibeTodasCategoriasUsuario(): CategoriaUsuario[] {
        return this.categoriaUsuarioRepository.ExibeTodosCatUsuarios();
    }
    public exibeCategoriaUsuarioPorId(id: number): CategoriaUsuario | undefined {
        if (id === null || id === undefined) {
            throw new Error("ID da categoria do usuário é obrigatório para a busca.");
        }
        return this.categoriaUsuarioRepository.AchaCatUsuPorId(id);
    }
}