import { Emprestimo } from "../model/Emprestimo"


export class EmprestimoRepository{
    private static instance: EmprestimoRepository
    private EmprestimoLista : Emprestimo[] = []
    private constructor(){ }
    
    public static getInstance():EmprestimoRepository{
        if(!this.instance){
            this.instance = new EmprestimoRepository()
        }
        return this.instance
    }

    public InsereEmprestimo(emprestimo:Emprestimo):Emprestimo{
        this.EmprestimoLista.push(emprestimo);
        return emprestimo;
    }

    public ExibeEmprestimoPorId(id:number):Emprestimo|undefined{
        const index = this.EmprestimoLista.findIndex(e=>e.id===id)
        if(index == -1){
            return undefined;
        }
        return this.EmprestimoLista[index];
    }

    public RemoveEmprestimoPorId(id:number):boolean{
        const index = this.EmprestimoLista.findIndex(e=>e.id === id)
        if(index == -1){
            return false;
        }
        this.EmprestimoLista.splice(index,1)
        return true;
    }

    public ExibeTodosEmprestimos():Emprestimo[]{
        return this.EmprestimoLista;
    }

    public AtualizaEmprestimo(id:number, EmprestimoAtualizado:Emprestimo):Emprestimo|undefined{
        const index = this.EmprestimoLista.findIndex(e=>e.id === id)
        if(index == -1){
            return undefined;
        }
        let EmprestimoExistente = this.EmprestimoLista[index];

        EmprestimoExistente.usuario_id = EmprestimoAtualizado.usuario_id;
        EmprestimoExistente.estoque_id = EmprestimoAtualizado.estoque_id;
        EmprestimoExistente.data_emprestimo = EmprestimoAtualizado.data_emprestimo;
        EmprestimoExistente.data_devolucao = EmprestimoAtualizado.data_devolucao;
        EmprestimoExistente.data_entrega = EmprestimoAtualizado.data_entrega;
        EmprestimoExistente.dias_atraso = EmprestimoAtualizado.dias_atraso;
        EmprestimoExistente.suspensao_ate = EmprestimoAtualizado.suspensao_ate;

        return EmprestimoExistente;
    }

    public BuscaEmpPendPorUsuario(usuarioId:number):Emprestimo[]{
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        return this.EmprestimoLista.filter(
            e=>e.usuario_id === usuarioId &&
            e.data_entrega === null &&
            e.data_devolucao < hoje
        );
    }

    public BuscaEmpAtrasPorUsuario(usuarioId:number):Emprestimo[]{
        return this.EmprestimoLista.filter(
            e=>e.usuario_id === usuarioId &&
            e.dias_atraso > 0 &&
            e.data_entrega === null
        )
    }

    public BuscaEmpAtivoPorUsuario(usuarioId:number):Emprestimo[]{
        return this.EmprestimoLista.filter(
            e=>e.usuario_id === usuarioId &&
            e.data_entrega === null
        )
    }

}


