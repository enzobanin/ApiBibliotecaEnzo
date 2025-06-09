import { Usuario } from "../model/Usuario";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";
import { CursoRepository } from "../repository/CursoRepository";
import { Emprestimo } from "../model/Emprestimo";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { LivroRepository } from "../repository/LivroRepository";
import { EstoqueRepository } from "../repository/EstoqueRepository";


const Ilimitado = 9999;
export class UsuarioService{
    private UsuarioRepository = UsuarioRepository.getInstance();
    private categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance()
    private cursoRepository = CursoRepository.getInstance();
    private EmprestimoRepository = EmprestimoRepository.getInstance();
    private LivroRepository = LivroRepository.getInstance();
    private EstoqueRepository = EstoqueRepository.getInstance();

    private contadorIdUsu: number = 1;
    private contadorIdEmp: number = 1;
    constructor(){}
    
    novoUsuario(data:any):Usuario{
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
    realizaEmprestimo(usuarioCpf: string, livroId: number): Emprestimo {
        const usuario = this.UsuarioRepository.ExibeUsuarioPorCPF(usuarioCpf);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        if (!usuario.ativo) {
            throw new Error("Usuário inativo ou suspenso não pode realizar empréstimos.");
        }
        const emprestimosPendentes = this.EmprestimoRepository.BuscaEmpPendPorUsuario(usuario.id);
        if (emprestimosPendentes.length > 0) {
            throw new Error("Usuário possui empréstimos pendentes de regularização.");
        }
        const categoriaUsuario = this.categoriaUsuarioRepository.AchaCatUsuPorId(usuario.categoria_id);
        if(!categoriaUsuario){
            throw new Error("Categoria não encontrada");
        }
        //Limite dos empréstimos
        const emprestimosAtivos = this.EmprestimoRepository.BuscaEmpAtivoPorUsuario(usuario.id);
        let limiteEmprestimos : number;
        if (categoriaUsuario.nome === "Aluno") {
            limiteEmprestimos = 3;
        } else if (categoriaUsuario.nome === "Professor") {
            limiteEmprestimos = 5; 
        } else { 
            limiteEmprestimos = Ilimitado;
        }

        if(emprestimosAtivos.length >= limiteEmprestimos){
            throw new Error(`Limite (${limiteEmprestimos}) atingido`);
        }
        //Verificar a Disponibilidade
        const estoque = this.EstoqueRepository.BuscaEstoqueLivroPorId(livroId);
        if(!estoque){
            throw new Error("Livro não encontrado no estoque");
        }
        if(!estoque.disponivel || estoque.quantidade_emprestada>=estoque.quantidade){
            throw new Error("Livro indisponível neste momento");
        }
        const idEmprestimo = this.contadorIdEmp;
        this.contadorIdEmp++;

        const dataEmprestimo = new Date();
        const dataDevolucao = new Date(dataEmprestimo); 
        const livro = this.LivroRepository.ExibeLivroPorId(estoque.livro_id); 
        if (!livro) {
                throw new Error("Livro não encontrado"); 
        }
        //Prazo de Devolução
        let diasPrazo:number;
        if (categoriaUsuario.nome === "Aluno") {
            if(livro.categoria_id === usuario.curso_id){
                diasPrazo = 30;
            }else{
                diasPrazo = 15;
            }
        } else if (categoriaUsuario.nome === "Professor"){
                diasPrazo= 40;
        }else{
            throw new Error("Regra de prazo de empréstimo não definida para esta categoria de usuário.");
        }
        const novoEmprestimo = new Emprestimo(
            idEmprestimo, usuario.id, estoque.id,dataEmprestimo,
            dataDevolucao, null, 0,null  
        );
        this.EmprestimoRepository.InsereEmprestimo(novoEmprestimo);
        this.EstoqueRepository.AtualizaQtdEmp(estoque.id, 1); 

        return novoEmprestimo;
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


