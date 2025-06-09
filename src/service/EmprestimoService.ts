import { Emprestimo } from "../model/Emprestimo";
import { EmprestimoRepository } from "../repository/EmprestimoRepository";
import { UsuarioRepository } from "../repository/UsuarioRepository";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { LivroRepository } from "../repository/LivroRepository";
import { CategoriaUsuarioRepository } from "../repository/CategoriaUsuarioRepository";
import { Usuario } from "../model/Usuario";

const Ilimitado = 9999; 

export class EmprestimoService {
    private emprestimoRepository = EmprestimoRepository.getInstance();
    private usuarioRepository = UsuarioRepository.getInstance();
    private estoqueRepository = EstoqueRepository.getInstance();
    private livroRepository = LivroRepository.getInstance();
    private categoriaUsuarioRepository = CategoriaUsuarioRepository.getInstance();

    private contadorIdEmp: number = 1;

    constructor() {
        this.inicializaContador();
    }
    private inicializaContador(): void {
        const todosEmprestimos = this.emprestimoRepository.ExibeTodosEmprestimos();
        if (todosEmprestimos.length > 0) {
            const maxId = Math.max(...todosEmprestimos.map(e => e.id));
            this.contadorIdEmp = maxId + 1;
        } else {
            this.contadorIdEmp = 1;
        }
    }
    public realizaEmprestimo(usuarioCpf: string, exemplarLivroId: number): Emprestimo {
        const usuario = this.usuarioRepository.ExibeUsuarioPorCPF(usuarioCpf);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        if (!usuario.ativo) {
            throw new Error("Usuário inativo ou suspenso não pode realizar empréstimos.");
        }
        const emprestimosPendentesDeRegularizacao = this.emprestimoRepository.BuscaEmpPendPorUsuario(usuario.id);
        if (emprestimosPendentesDeRegularizacao.length > 0) {
            throw new Error("Usuário possui empréstimos pendentes de regularização.");
        }

        const categoriaUsuario = this.categoriaUsuarioRepository.AchaCatUsuPorId(usuario.categoria_id);
        if (!categoriaUsuario) {
            throw new Error("Categoria do usuário não encontrada (erro interno).");
        }

        //Valida Limite de Empréstimos por Categoria
        const emprestimosAtivos = this.emprestimoRepository.BuscaEmpAtivoPorUsuario(usuario.id);
        let limiteEmprestimos: number;

        if (categoriaUsuario.nome === "Aluno") {
            limiteEmprestimos = 3; 
        } else if (categoriaUsuario.nome === "Professor") {
            limiteEmprestimos = 5;
        } else {

            limiteEmprestimos = Ilimitado;
        }

        if (emprestimosAtivos.length >= limiteEmprestimos) {
            let mensagemLimite = `${limiteEmprestimos} livros`;
            if (limiteEmprestimos === Ilimitado) {
                mensagemLimite = "o máximo de livros permitidos";
            }
            throw new Error(`Limite de empréstimos (${mensagemLimite}) atingido para a sua categoria.`);
        }

        //Valida Disponibilidade do Livro
        const estoque = this.estoqueRepository.BuscaEstoqueLivroPorId(exemplarLivroId);
        if (!estoque) {
            throw new Error("Livro não encontrado no estoque com o ID fornecido.");
        }
        if (!estoque.disponivel || estoque.quantidade_emprestada >= estoque.quantidade) {
            throw new Error("Livro indisponível para empréstimo no momento.");
        }

        const livro = this.livroRepository.ExibeLivroPorId(estoque.livro_id);
        if (!livro) {
            throw new Error("Erro interno: Livro associado ao estoque não encontrado.");
        }

        //Define Prazo de Devolução
        const dataEmprestimo = new Date();
        const dataDevolucao = new Date(dataEmprestimo);
        let diasPrazo: number;

        if (categoriaUsuario.nome === "Aluno") {
            
            if (livro.categoria_id === usuario.curso_id) {
                diasPrazo = 30;
            } else {
                diasPrazo = 15; 
            }
        } else if (categoriaUsuario.nome === "Professor") {
            diasPrazo = 40;
        } else {
          
            throw new Error("Regra de prazo de empréstimo não definida para esta categoria de usuário.");
        }
        dataDevolucao.setDate(dataEmprestimo.getDate() + diasPrazo);

        //Cria e Insere o Empréstimo
        const idEmprestimo = this.contadorIdEmp++; 
        const novoEmprestimo = new Emprestimo(
            idEmprestimo,
            usuario.id,
            estoque.id,
            dataEmprestimo,
            dataDevolucao,
            null, 
            0,    
            null 
        );
        this.emprestimoRepository.InsereEmprestimo(novoEmprestimo);

        // atualiza Quantidade de Livros Emprestados no Estoque
        this.estoqueRepository.AtualizaQtdEmp(estoque.id, 1); // Incrementa 1 no contador

        return novoEmprestimo;
    }

    
     public registraDevolucao(emprestimoId: number): Emprestimo {
        const emprestimo = this.emprestimoRepository.ExibeEmprestimoPorId(emprestimoId);
        if (!emprestimo) {
            throw new Error("Empréstimo não encontrado.");
        }
        if (emprestimo.data_entrega !== null) {
            throw new Error("Este empréstimo já foi devolvido anteriormente.");
        }

        const dataEntrega = new Date();
        dataEntrega.setHours(0, 0, 0, 0);
        emprestimo.data_devolucao.setHours(0, 0, 0, 0);
        const dataPrevistaDevolucaoParaComparacao = new Date(emprestimo.data_devolucao);
        dataPrevistaDevolucaoParaComparacao.setHours(0, 0, 0, 0);

        let diasAtraso = 0;
        if (dataEntrega > dataPrevistaDevolucaoParaComparacao) {
            const diffTime = Math.abs(dataEntrega.getTime() - dataPrevistaDevolucaoParaComparacao.getTime());
            diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        emprestimo.data_entrega = dataEntrega;
        emprestimo.dias_atraso = diasAtraso;

        // Atualiza o empréstimo no repositório
        const emprestimoAtualizado = this.emprestimoRepository.AtualizaEmprestimo(emprestimo.id, emprestimo);
        if (!emprestimoAtualizado) {
            throw new Error("Falha ao atualizar o empréstimo durante a devolução");
        }

        // Atualiza a quantidade de livros emprestados
        this.estoqueRepository.AtualizaQtdEmp(emprestimo.estoque_id, -1); 

        if (diasAtraso > 0) {
            const usuarioOriginal = this.usuarioRepository.ExibeTodosUsuarios().find(u => u.id === emprestimo.usuario_id);

            if (usuarioOriginal) {
                const diasSuspensao = diasAtraso * 3; 

                const dataSuspensaoAte = new Date(dataEntrega);
                dataSuspensaoAte.setDate(dataEntrega.getDate() + diasSuspensao);
                emprestimoAtualizado.suspensao_ate = dataSuspensaoAte; 

                if (diasSuspensao > 60) {
        
                    const usuarioParaAtualizar = new Usuario(
                        usuarioOriginal.id,
                        usuarioOriginal.nome,
                        usuarioOriginal.cpf,
                        false, 
                        usuarioOriginal.categoria_id,
                        usuarioOriginal.curso_id
                  
                    );
                    this.usuarioRepository.AtualizaUsuario(usuarioOriginal.cpf, usuarioParaAtualizar);
                }
            } else {
                console.warn(`Aviso: Usuário com ID ${emprestimo.usuario_id} não encontrado durante a devolução. Status de suspensão pode não ter sido atualizado.`);
            }
        }
        
        return emprestimoAtualizado; 
    }


    public exibeTodosEmprestimos(): Emprestimo[] {
        return this.emprestimoRepository.ExibeTodosEmprestimos();
    }


    public exibeEmprestimosAtivos(usuarioId?: number): Emprestimo[] {
        if (usuarioId) {
            return this.emprestimoRepository.BuscaEmpAtivoPorUsuario(usuarioId);
        }

        return this.emprestimoRepository.ExibeTodosEmprestimos().filter(emp => emp.data_entrega === null);
    }


    public exibeHistoricoEmprestimos(usuarioId?: number): Emprestimo[] {
        if (usuarioId) {
            const usuario = this.usuarioRepository.ExibeTodosUsuarios().find(u=>u.id === usuarioId); // Precisará de ExibeUsuarioPorId
            if (!usuario) {
                throw new Error("Usuário não encontrado");
            }
            return this.emprestimoRepository.ExibeTodosEmprestimos().filter(
                emp => emp.usuario_id === usuarioId && emp.data_entrega !== null
            );
        }
        return this.emprestimoRepository.ExibeTodosEmprestimos().filter(emp => emp.data_entrega !== null);
    }

    public exibeEmprestimosPendentes(usuarioId?: number): Emprestimo[] {
        if (usuarioId) {
            return this.emprestimoRepository.BuscaEmpPendPorUsuario(usuarioId);
        }

        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        return this.emprestimoRepository.ExibeTodosEmprestimos().filter(
            e => e.data_entrega === null && e.data_devolucao < hoje
        );
    }
}