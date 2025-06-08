import { Estoque } from "../model/Estoque"

export class EstoqueRepository{
    private static instance: EstoqueRepository
    private EstoqueLista : Estoque[] = []
    private constructor(){}
    
    public static getInstance():EstoqueRepository{
        if(!this.instance){
            this.instance = new EstoqueRepository()
        }
        return this.instance
    }

    InsereEstoque(Estoque:Estoque):Estoque{
        this.EstoqueLista.push(Estoque);
        return Estoque;
    }

    ExibeEstoquePorId(id:number):Estoque|undefined{
        const index = this.EstoqueLista.findIndex(e=>e.id===id)
        if(index == -1){
            return undefined
        }
        return this.EstoqueLista[index]
    }

    RemoveEstoquePorId(id:number):boolean{
        const index = this.EstoqueLista.findIndex(e=>e.id===id)
        if(index == -1){
            return false;
        }
        this.EstoqueLista.splice(index,1)
        return true;
    }

    ExibeTodosEstoquesDisponiveis():Estoque[]{
        return this.EstoqueLista.filter(estoque => estoque.disponivel === true);
    }

    AtualizaEstoque(id:number, EstoqueAtualizado:Estoque):Estoque|undefined{
        const index = this.EstoqueLista.findIndex(e=>e.id===id)
        if(index == -1){
            return undefined;
        }
        let EstoqueExistente = this.EstoqueLista[index]; 

        EstoqueExistente.livro_id = EstoqueAtualizado.livro_id;
        EstoqueExistente.quantidade = EstoqueAtualizado.quantidade;
        EstoqueExistente.quantidade_emprestada = EstoqueAtualizado.quantidade_emprestada;
        EstoqueExistente.disponivel = EstoqueAtualizado.disponivel;

        return EstoqueExistente;
    }

    AtualizaQtdEmp(estoqueId:number, quantidade:number):Estoque|undefined{
        const estoque = this.ExibeEstoquePorId(estoqueId);
        if(estoque){
            estoque.quantidade_emprestada += quantidade;
            estoque.disponivel = estoque.quantidade_emprestada <estoque.quantidade;
            return this.AtualizaEstoque(estoque.id, estoque);
        }
        return undefined;
    }
    

    BuscaEstoqueLivroPorId(livroId:number):Estoque|undefined{
        return this.EstoqueLista.find(e=>e.livro_id === livroId);
    }
}


