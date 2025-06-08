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

    InsereEmprestimo(emprestimo:Emprestimo){
        this.EmprestimoLista.push(emprestimo)
    }

    ExibeEmprestimoPorId(id:number):Emprestimo|undefined{
        const index = this.EmprestimoLista.findIndex(e=>e.id===id)
        if(index == -1){
            return undefined;
        }
        return this.EmprestimoLista[index];
    }

    RemoveEmprestimoPorId(id:number):boolean{
        const index = this.EmprestimoLista.findIndex(e=>e.id === id)
        if(index == -1){
            return false;
        }
        this.EmprestimoLista.splice(index,1)
        return true;
    }

    ExibeTodosEmprestimos():Emprestimo[]{
        return this.EmprestimoLista;
    }

    AtualizaEmprestimo(id:number, EmprestimoAtualizado:Emprestimo):Emprestimo|undefined{
        const index = this.EmprestimoLista.findIndex(e=>e.id === id)
        if(index == -1){
            return undefined;
        }
        EmprestimoAtualizado.id = id;
        this.EmprestimoLista[index] = EmprestimoAtualizado;
        return this.EmprestimoLista[index];
    }

    BuscaEmpPendPorUsuario(usuarioId:number):Emprestimo[]{
        const hoje = new Date();
        return this.EmprestimoLista.filter(
            e=>e.usuario_id === usuarioId &&
            e.data_entrega === null &&
            e.data_devolucao < hoje
        );
    }

    BuscaEmpAtrasPorUsuario(usuarioId:number):Emprestimo[]{
        return this.EmprestimoLista.filter(
            e=>e.usuario_id === usuarioId &&
            e.dias_atraso > 0 &&
            e.data_entrega === null
        )
    }

    BuscaEmpAtivoPorUsuario(usuarioId:number):Emprestimo[]{
        return this.EmprestimoLista.filter(
            e=>e.usuario_id === usuarioId &&
            e.data_entrega === null
        )
    }

}


