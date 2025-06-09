import { Usuario } from "../model/Usuario";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";
import { CursoRepository } from "../repository/CursoRepository";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";



const Ilimitado = 9999;
export class UsuarioService{
    private UsuarioRepository = UsuarioRepository.getInstance();
    private categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance()
    private cursoRepository = CursoRepository.getInstance();
    private EmprestimoRepository = EmprestimoRepository.getInstance();

    private contadorIdUsu: number = 1;
    constructor(){
        this.inicializaContadorId();
    }
     private inicializaContadorId(): void {
        const todosUsuarios = this.UsuarioRepository.ExibeTodosUsuarios();
        if (todosUsuarios.length > 0) {
            const maxId = Math.max(...todosUsuarios.map(u => u.id));
            this.contadorIdUsu = maxId + 1;
        } else {
            this.contadorIdUsu = 1;
        }
    }
    public novoUsuario(data:any):Usuario{
        if(!data.nome ||!data.cpf
            ||!data.categoria_id||!data.curso_id
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
        const id = this.contadorIdUsu;
        this.contadorIdUsu++;
        const UsuarioNovo = new Usuario(id,data.nome,data.cpf,true,
            data.categoria_id, data.curso_id);
        this.UsuarioRepository.InsereUsuario(UsuarioNovo)
        return UsuarioNovo;
    }
    public exibeTodosUsuarios(): Usuario[] {
        return this.UsuarioRepository.ExibeTodosUsuarios();
    }

    public exibeUsuarioPorCPF(cpf: string): Usuario|undefined {
        return this.UsuarioRepository.ExibeUsuarioPorCPF(cpf);
    }

    public atualizaUsuario(cpf: string, dataAtualizada: any): Usuario|undefined {
        const usuarioExistente = this.UsuarioRepository.ExibeUsuarioPorCPF(cpf);
        if (!usuarioExistente) {
            throw new Error("Usuário não encontrado");
        }

        if (dataAtualizada.categoria_id && !this.categoriaUsuarioRepository.AchaCatUsuPorId(dataAtualizada.categoria_id)) {
            throw new Error("Nova categoria de usuário inválida");
        }
        if (dataAtualizada.curso_id && !this.cursoRepository.AchaCursoPorId(dataAtualizada.curso_id)) {
            throw new Error("Novo curso inválido");
        }
        const usuarioParaAtualizar = new Usuario(
            usuarioExistente.id, 
            dataAtualizada.nome !== undefined ? dataAtualizada.nome : usuarioExistente.nome,
            dataAtualizada.cpf !== undefined ? dataAtualizada.cpf : usuarioExistente.cpf,
            dataAtualizada.ativo !== undefined ? dataAtualizada.ativo : usuarioExistente.ativo,
            dataAtualizada.categoria_id !== undefined ? dataAtualizada.categoria_id : usuarioExistente.categoria_id,
            dataAtualizada.curso_id !== undefined ? dataAtualizada.curso_id : usuarioExistente.curso_id
        );
    
        return this.UsuarioRepository.AtualizaUsuario(cpf, usuarioParaAtualizar);
    }

    public removeUsuario(cpf: string): boolean {
        const usuario = this.UsuarioRepository.ExibeUsuarioPorCPF(cpf);
        if (!usuario) {
            throw new Error("Usuário não encontrado para remoção.");
        }
        const emprestimosAtivos = this.EmprestimoRepository.BuscaEmpAtivoPorUsuario(usuario.id);
        if (emprestimosAtivos.length > 0) {
            throw new Error("Usuário possui empréstimos ativos e não pode ser removido.");
        }
        return this.UsuarioRepository.RemoveUsuarioPorCPF(cpf);
    }
}


