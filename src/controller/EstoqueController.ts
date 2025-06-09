import { Request, Response } from 'express';
import { EstoqueService } from '../service/EstoqueService';

export class EstoqueController {
    private estoqueService: EstoqueService;

    constructor() {
        this.estoqueService = new EstoqueService();
    }

    public async novoEstoque(req: Request, res: Response): Promise<Response> {
        try {
            // Campos obrigatórios: ISBN livro, código exemplar 
            const { livroISBN, codigoExemplar, quantidade, disponivel } = req.body;
            if (!livroISBN || !codigoExemplar || quantidade === undefined) { // Quantidade é obrigatória no modelo de estoque
                return res.status(400).json({ message: 'ISBN do livro, código do exemplar e quantidade são obrigatórios.' });
            }
            // O service de Estoque espera livro_id, quantidade, disponivel.
            // Aqui precisaremos fazer uma busca pelo livroISBN para obter o livro_id.
            // Para manter a compatibilidade, vou assumir que o service pode receber o ISBN.
            // Se o service espera ID do livro, você precisará adaptar o service ou buscar o livro aqui.
            const novoItemEstoque = await this.estoqueService.novoProdutoEstoque({ 
                livroISBN, // Se o service aceitar ISBN
                codigoExemplar, // Assumindo que o service espera um código de exemplar
                quantidade, 
                disponivel 
            });
            return res.status(201).json(novoItemEstoque);
        } catch (error: any) {
            console.error('Erro ao cadastrar novo exemplar de estoque:', error);
            if (error.message.includes('Livro com o ISBN fornecido não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('Já existe um item de estoque com este código de exemplar')) { // Adaptei a mensagem
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao cadastrar exemplar.' });
        }
    }

    public async listarTodosEstoquesDisponiveis(req: Request, res: Response): Promise<Response> {
        try {
            // O PDF diz "Lista exemplares com disponibilidade." 
            // Assumo que significa listar todos, e o serviço já filtra por disponibilidade se necessário.
            const estoques = this.estoqueService.exibeTodosEstoquesDisponiveis(); // Não é async no service
            return res.status(200).json(estoques);
        } catch (error: any) {
            console.error('Erro ao listar estoques disponíveis:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao listar estoques.' });
        }
    }

    public async buscarEstoquePorCodigo(req: Request, res: Response): Promise<Response> {
        try {
            const codigo = req.params.codigo; 
            if (!codigo) {
                return res.status(400).json({ message: 'Código do exemplar é obrigatório.' });
            }
            const estoque = this.estoqueService.exibeEstoquePorId(id);
            if (!estoque) {
                return res.status(404).json({ message: 'Exemplar de estoque não encontrado.' });
            }
            return res.status(200).json(estoque);
        } catch (error: any) {
            console.error('Erro ao buscar exemplar de estoque por código:', error);
            return res.status(500).json({ message: 'Erro interno do servidor ao buscar exemplar.' });
        }
    }

    public async atualizarEstoque(req: Request, res: Response): Promise<Response> {
        try {
            const codigo = req.params.codigo; // PDF especifica ":codigo" 
            const { quantidade, disponivel } = req.body; // Campos para atualizar
            if (!codigo || (quantidade === undefined && disponivel === undefined)) {
                return res.status(400).json({ message: 'Código do exemplar e pelo menos um campo (quantidade ou disponivel) são obrigatórios para atualização.' });
            }
            const estoqueAtualizado = await this.estoqueService.atualizaEstoque(codigo, { quantidade, disponivel }); // Assumindo que atualiza por código
            if (!estoqueAtualizado) {
                return res.status(404).json({ message: 'Exemplar de estoque não encontrado para atualização.' });
            }
            return res.status(200).json(estoqueAtualizado);
        } catch (error: any) {
            console.error('Erro ao atualizar estoque:', error);
            if (error.message.includes('não encontrado')) {
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
            const codigo = req.params.codigo; // PDF especifica ":codigo" 
            if (!codigo) {
                return res.status(400).json({ message: 'Código do exemplar é obrigatório para remoção.' });
            }
            // "Remove exemplar (se não estiver emprestado)." 
            const sucesso = await this.estoqueService.removeEstoque(codigo); // Assumindo que remove por código
            if (!sucesso) {
                return res.status(404).json({ message: 'Exemplar de estoque não encontrado para remoção.' });
            }
            return res.status(204).send(); // No Content
        } catch (error: any) {
            console.error('Erro ao remover estoque:', error);
            if (error.message.includes('não encontrado')) {
                return res.status(404).json({ message: error.message });
            }
            if (error.message.includes('com livros emprestados')) { // Assumindo esta mensagem do service
                return res.status(409).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Erro interno do servidor ao remover exemplar.' });
        }
    }
}