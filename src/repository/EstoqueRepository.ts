import { Estoque } from "../model/Estoque"

export class EstoqueRepository{
    private static instance: EstoqueRepository
    private EstoqueLista : Estoque[] = []
    private constructor(){}
    
    static getInstance():EstoqueRepository{
        if(!this.instance){
            this.instance = new EstoqueRepository()
        }
        return this.instance
    }

    private findIndex(id:number):number{
        const index = this.EstoqueLista.findIndex(p=>p.id == id)
        if(index == -1){
            throw new Error("ID não encontrado")
        }
        return index
    }

    InsereEstoque(Estoque:Estoque){
        this.EstoqueLista.push(Estoque)
    }

    ExibeEstoquePorId(id:number){
        const index = this.findIndex(id)
        this.EstoqueLista[index]
    }

    RemoveEstoquePorId(id:number){
        const index = this.findIndex(id)
        this.EstoqueLista.splice(index,1)
    }

    ExibeTodosEstoquesDisponiveis():Estoque[]{
        return this.EstoqueLista.filter(estoque => estoque.disponivel === true);
    }

    AtualizaEstoque(id:number, EstoqueAtualizado:Estoque):Estoque{
        const index = this.findIndex(id)
        let EstoqueExistente = this.EstoqueLista[index];
        EstoqueExistente.livro_id = EstoqueAtualizado.livro_id;
        EstoqueExistente.quantidade = EstoqueAtualizado.quantidade;
        EstoqueExistente.quantidade_emprestada = EstoqueAtualizado.quantidade_emprestada;
        EstoqueExistente.disponivel = EstoqueAtualizado.disponivel;
        
        return EstoqueExistente;
    }
}


