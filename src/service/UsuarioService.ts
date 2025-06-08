import { Usuario } from "../model/Usuario";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";
import { CursoRepository } from "../repository/CursoRepository";
import { Emprestimo } from "../model/Emprestimo";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { LivroRepository } from "../repository/LivroRepository";
import { EstoqueRepository } from "../repository/EstoqueRepository";

export class UsuarioService{
    private UsuarioRepository = UsuarioRepository.getInstance();
    private categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance()
    private cursoRepository = CursoRepository.getInstance();

    constructor(){}
    
    novoUsuario(data:any):Usuario{
        if(!data.nome ||!data.cpf
            ||!data.categoria_id||!data.curso
        ){
            throw new Error("Favor informar todos os campos")
        }
        const CpfExistente = this.UsuarioRepository.ExibeUsuarioPorCPF(data.cpf)
            if(CpfExistente){
                throw new Error ("CPF já cadastrado.")
            }
        const categoriaValida = this.categoriaUsuarioRepository.AchaCatUsuPorId(data.categoria_id)
        if(!categoriaValida){
            throw new Error("Categoria de usuário inválida.")
        }
        const cursoValido = this.cursoRepository.AchaCursoPorId(data.curso_id)
        if(!cursoValido){
            throw new Error("Curso inválido")
        }
        data.ativo = true
        let contadorId: number = 0;
        contadorId ++
        const id = contadorId;
        const UsuarioNovo = new Usuario(id,data.nome,data.cpf,true,
            data.categoria_id, data.curso_id);
        this.UsuarioRepository.InsereUsuario(UsuarioNovo)
        return UsuarioNovo;
    }
}

realizaEmprestimo(usuarioId: number, livroId:number):Emprestimo{
    const usuario = this.UsuarioRepository.AchaCatUsuPorId()
}