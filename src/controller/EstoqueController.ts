import { Request, Response } from 'express';
import { EstoqueService } from '../service/EstoqueService';

export class EstoqueController {
    private estoqueService: EstoqueService;

    constructor() {
        this.estoqueService = new EstoqueService();
    }

    public async novoEstoque(req: Request, res: Response): Promise<Response> {
        try {
            const { livro_id, quantidade, disponivel } = req.body;
            if (!livro_id || !quantidade) {
                return res.status(400).json({ message: 'ID do livro e quantidade são obrigatórios para o estoque.' });
            }
            const novoItemEstoque = await this.estoqueService.novoProdutoEstoque({ livro_id, quantidade, disponivel });
            return res.status(201).json(novoItemEstoque);
        } catch (error: any) {
            console.error('Erro ao criar novo item de estoque:', error);
            if (error.message.includes('Livro com o ID fornecido não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('Já existe um item de estoque para este livro')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao criar item de estoque.' });
        }
    }

    public async atualizarEstoque(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            const { quantidade, disponivel } = req.body;
            if (isNaN(id) || (quantidade === undefined && disponivel === undefined)) {
                return res.status(400).json({ message: 'ID do estoque e pelo menos um campo (quantidade ou disponivel) são obrigatórios para atualização.' });
            }
            const estoqueAtualizado = await this.estoqueService.atualizaEstoque(id, { quantidade, disponivel });
            if (!estoqueAtualizado) {
                return res.status(404).json({ message: 'Item de estoque não encontrado para atualização.' });
            }
            return res.status(200).json(estoqueAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar estoque:', error);
            if (error.message.includes('Item de estoque não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('quantidade total não pode ser menor')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao atualizar estoque.' });
        }
    }

    public async removerEstoque(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID do estoque inválido.' });
            }
            const sucesso = await this.estoqueService.removeEstoque(id);
            if (!sucesso) {
                return res.status(404).json({ message: 'Item de estoque não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao remover estoque:', error);
            if (error.message.includes('Item de estoque não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('com livros emprestados')) {
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao remover estoque.' });
        }
    }

    public async listarTodosEstoquesDisponiveis(req: Request, res: Response): Promise<Response> {
        try {
            const estoques = await this.estoqueService.exibeTodosEstoquesDisponiveis();
            return res.status(200).json(estoques);
        } catch (error: any) {
            console.error('Erro ao listar estoques disponíveis:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar estoques.' });
        }
    }

    public async buscarEstoquePorLivroId(req: Request, res: Response): Promise<Response> {
        try {
            const livroId = parseInt(req.params.livroId, 10); // Assumindo que a rota será /estoque/livro/:livroId
            if (isNaN(livroId)) {
                return res.status(400).json({ message: 'ID do livro inválido.' });
            }
            const estoque = await this.estoqueService.exibeEstoquePorLivroId(livroId);
            if (!estoque) {
                return res.status(404).json({ message: 'Estoque para este livro não encontrado.' });
            }
            return res.status(200).json(estoque);
        } catch (error: any) {
            console.error('Erro ao buscar estoque por ID do livro:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar estoque.' });
        }
    }

    public async buscarEstoquePorId(req: Request, res: Response): Promise<Response> {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID do estoque inválido.' });
            }
            const estoque = await this.estoqueService.exibeEstoquePorId(id);
            if (!estoque) {
                return res.status(404).json({ message: 'Estoque não encontrado.' });
            }
            return res.status(200).json(estoque);
        } catch (error: any) {
            console.error('Erro ao buscar estoque por ID:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar estoque.' });
        }
    }
}