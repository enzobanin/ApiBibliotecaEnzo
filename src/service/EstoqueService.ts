import { Estoque } from "../model/Estoque";
import { EstoqueRepository } from "../repository/EstoqueRepository";
import { LivroRepository } from "../repository/LivroRepository"; 

export class EstoqueService {
    private estoqueRepository = EstoqueRepository.getInstance();
    private livroRepository = LivroRepository.getInstance(); 
    private proximoIdEstoque: number = 1;
    constructor() {
        this.inicializaProximoIdEstoque();
    }
      public inicializaProximoIdEstoque(): void{
        const todosEstoques = this.estoqueRepository.ExibeTodosEstoquesDisponiveis();
        if (todosEstoques.length > 0) {
            const maxId = Math.max(...todosEstoques.map(e => e.id));
            this.proximoIdEstoque = maxId + 1;
        } else {
            this.proximoIdEstoque = 1;
        }
      }
    public novoProdutoEstoque(data: { livroISBN: string;id:number; quantidade: number; disponivel?: boolean }): Estoque {
        if (!data.livroISBN || !data.quantidade) {
            throw new Error("Favor informar o ID do livro e a quantidade para o estoque.");
        }

        // Verifica se o livro_id corresponde a um livro existente
        const livroExistente = this.livroRepository.ExibeLivroPorISBN(data.livroISBN);
        if (!livroExistente) {
            throw new Error("Livro com o ID fornecido não encontrado.");
        }

        // Verifica se já existe um estoque para este livroISBN (se o estoque é único por livro)
        const estoqueExistente = this.estoqueRepository.ExibeEstoquePorId(data.id);
        if (estoqueExistente) {
             throw new Error("Já existe um item de estoque para este livro. ");
        }
        let proximoIdEstoque: number;
 
        this.incrementarContadorEstoque();
        proximoIdEstoque = this.proximoIdEstoque;

        const novoEstoque = new Estoque(
            proximoIdEstoque,
            data.id,
            data.quantidade,
            0, 
            data.disponivel !== undefined ? data.disponivel : true 
        );

        this.estoqueRepository.InsereEstoque(novoEstoque);
        return novoEstoque;
    }

    public incrementarContadorEstoque(): void {
        const todosEstoques = this.estoqueRepository.ExibeTodosEstoquesDisponiveis();
        if (todosEstoques.length > 0) {
            const maxId = Math.max(...todosEstoques.map(e => e.id));
            this.proximoIdEstoque = maxId + 1;
        } else {
            this.proximoIdEstoque = 1;
        }
    }


    public atualizaEstoque(id: number, dataAtualizada: { quantidade?: number; disponivel?: boolean }): Estoque | undefined {
        const estoqueExistente = this.estoqueRepository.ExibeEstoquePorId(id);
        if (!estoqueExistente) {
            throw new Error("Item de estoque não encontrado.");
        }

        const estoqueParaAtualizar = new Estoque(
            estoqueExistente.id,
            estoqueExistente.livro_id,
            dataAtualizada.quantidade !== undefined ? dataAtualizada.quantidade : estoqueExistente.quantidade,
            estoqueExistente.quantidade_emprestada, // Manter quantidade emprestada
            dataAtualizada.disponivel !== undefined ? dataAtualizada.disponivel : estoqueExistente.disponivel
        );
        if (estoqueParaAtualizar.quantidade_emprestada > estoqueParaAtualizar.quantidade) {
            throw new Error("A quantidade total não pode ser menor que a quantidade já emprestada.");
        }

        return this.estoqueRepository.AtualizaEstoque(id, estoqueParaAtualizar);
    }

    public removeEstoque(id: number): boolean {
        const estoque = this.estoqueRepository.ExibeEstoquePorId(id);
        if (!estoque) {
            throw new Error("Item de estoque não encontrado para remoção.");
        }
        if (estoque.quantidade_emprestada > 0) {
            throw new Error("Não é possível remover itens de estoque com livros emprestados.");
        }
        return this.estoqueRepository.RemoveEstoquePorId(id);
    }

    public exibeTodosEstoquesDisponiveis(): Estoque[] {
        return this.estoqueRepository.ExibeTodosEstoquesDisponiveis();
    }

   
    public exibeEstoquePorLivroId(livroId: number): Estoque | undefined {
        if (!livroId) {
            throw new Error("ID do livro é obrigatório para buscar o estoque.");
        }
        return this.estoqueRepository.BuscaEstoqueLivroPorId(livroId);
    }

    public exibeEstoquePorId(id: number): Estoque | undefined {
        if (!id) {
            throw new Error("ID do estoque é obrigatório para a busca.");
        }
        return this.estoqueRepository.ExibeEstoquePorId(id);
    }

}