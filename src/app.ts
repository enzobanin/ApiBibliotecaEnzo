import express from 'express';

// Importar Controllers
import { CategoriaLivroController } from './controller/CategoriaLivroController';
import { CategoriaUsuarioController } from './controller/CategoriaUsuarioController';
import { CursoController } from './controller/CursoController';
import { EmprestimoController } from './controller/EmprestimoController';
import { EstoqueController } from './controller/EstoqueController';
import { LivroController } from './controller/LivroController';
import { UsuarioController } from './controller/UsuarioController';

const app = express();
app.use(express.json());

const categoriaLivroController = new CategoriaLivroController();
const categoriaUsuarioController = new CategoriaUsuarioController();
const cursoController = new CursoController();
const emprestimoController = new EmprestimoController();
const estoqueController = new EstoqueController();
const livroController = new LivroController();
const usuarioController = new UsuarioController();


app.get('/library/categorias-usuario', (req, res) => categoriaUsuarioController.listarCategoriasUsuario(req, res));
// GET /library/categorias-livro - Lista categorias de livros. 
app.get('/library/categorias-livro', (req, res) => categoriaLivroController.listarCategoriasLivro(req, res));
// GET /library/cursos - Lista cursos disponíveis. 
app.get('/library/cursos', (req, res) => cursoController.listarCursos(req, res));


// --- Rotas para Usuários (/usuarios) ---
// POST /library/usuarios - Cadastra novo usuário. 
app.post('/library/usuarios', (req, res) => usuarioController.criarUsuario(req, res));
// GET /library/usuarios - Lista todos os usuários (com filtros opcionais). 
app.get('/library/usuarios', (req, res) => usuarioController.listarTodosUsuarios(req, res));
// GET /library/usuarios/:cpf - Retorna detalhes de um usuário específico. 
app.get('/library/usuarios/:cpf', (req, res) => usuarioController.buscarUsuarioPorCPF(req, res));
// PUT /library/usuarios/:cpf - Atualiza dados do usuário. 
app.put('/library/usuarios/:cpf', (req, res) => usuarioController.atualizarUsuario(req, res));
// DELETE /library/usuarios/:cpf - Remove usuário (se não tiver empréstimos). 
app.delete('/library/usuarios/:cpf', (req, res) => usuarioController.removerUsuario(req, res));


// POST /library/livros - Adiciona novo livro ao acervo. 
app.post('/library/livros', (req, res) => livroController.criarLivro(req, res));
// GET /library/livros - Lista todos os livros (com filtros). 
app.get('/library/livros', (req, res) => livroController.listarTodosLivros(req, res));
// GET /library/livros/:isbn - Mostra detalhes de um livro. 
app.get('/library/livros/:isbn', (req, res) => livroController.buscarLivroPorISBN(req, res));
// PUT /library/livros/:isbn - Atualiza informações do livro. 
app.put('/library/livros/:isbn', (req, res) => livroController.atualizarLivro(req, res));
// DELETE /library/livros/:isbn - Remove livro (se não estiver emprestado). 
app.delete('/library/livros/:isbn', (req, res) => livroController.removerLivro(req, res));


// POST /library/estoque - Cadastra novo exemplar. 
app.post('/library/estoque', (req, res) => estoqueController.novoEstoque(req, res));
// GET /library/estoque - Lista exemplares com disponibilidade. 
app.get('/library/estoque', (req, res) => estoqueController.listarTodosEstoquesDisponiveis(req, res));
// GET /library/estoque/:codigo - Detalhes do exemplar. 
app.get('/library/estoque/:codigo', (req, res) => estoqueController.buscarEstoquePorCodigo(req, res));
// PUT /library/estoque/:codigo - Atualiza disponibilidade. 
app.put('/library/estoque/:codigo', (req, res) => estoqueController.atualizarEstoque(req, res));
// DELETE /library/estoque/:codigo - Remove exemplar (se não estiver emprestado). 
app.delete('/library/estoque/:codigo', (req, res) => estoqueController.removerEstoque(req, res));



// POST /library/emprestimos - Registra novo empréstimo. 
app.post('/library/emprestimos', (req, res) => emprestimoController.realizarEmprestimo(req, res));
// GET /library/emprestimos - Lista todos os empréstimos (ativos/histórico). 
app.get('/library/emprestimos', (req, res) => emprestimoController.listarTodosEmprestimos(req, res));
// PUT /library/emprestimos/:id/devolucao - Registra devolução de livro. 
app.put('/library/emprestimos/:id/devolucao', (req, res) => emprestimoController.registrarDevolucao(req, res));


const PORT = process.env.PORT || 3090;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`URL base da API: http://localhost:${PORT}/library`); 
});