import { Emprestimo } from "../model/Emprestimo"

export class EmprestimoRepository{
    private static instance: EmprestimoRepository
    private EmprestimoLista : Emprestimo[] = []
    private constructor(){}
    
    static getInstance():EmprestimoRepository{
        if(!this.instance){
            this.instance = new EmprestimoRepository()
        }
        return this.instance
    }

    private findIndex(id:number):number{
        const index = this.EmprestimoLista.findIndex(p=>p.id == id)
        if(index == -1){
            throw new Error("ID não encontrado")
        }
        return index
    }

    InsereEmprestimo(Emprestimo:Emprestimo){
        this.EmprestimoLista.push(Emprestimo)
    }

    ExibeEmprestimoPorId(id:number){
        const index = this.findIndex(id)
        this.EmprestimoLista[index]
    }

    RemoveEmprestimoPorId(id:number){
        const index = this.findIndex(id)
        this.EmprestimoLista.splice(index,1)
    }

    ExibeTodosEmprestimos():Emprestimo[]{
        return this.EmprestimoLista;
    }

    AtualizaEmprestimo(id:number, EmprestimoAtualizado:Emprestimo):Emprestimo{
        const index = this.findIndex(id)
        let EmprestimoExistente = this.EmprestimoLista[index];
        EmprestimoExistente.data_entrega = EmprestimoAtualizado.data_entrega;
        EmprestimoExistente.dias_atraso = EmprestimoAtualizado.dias_atraso;
        EmprestimoExistente.suspensao_ate = EmprestimoAtualizado.suspensao_ate;
        
        return EmprestimoExistente;
    }
}


