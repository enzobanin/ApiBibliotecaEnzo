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
app.use(express.json()); // Middleware para parsear JSON do corpo das requisições

// Instanciar Controllers
const categoriaLivroController = new CategoriaLivroController();
const categoriaUsuarioController = new CategoriaUsuarioController();
const cursoController = new CursoController();
const emprestimoController = new EmprestimoController();
const estoqueController = new EstoqueController();
const livroController = new LivroController();
const usuarioController = new UsuarioController();

// --- Rotas para CategoriaLivro ---
app.post('/api/categorias-livro', (req, res) => categoriaLivroController.criarCategoriaLivro(req, res));
app.get('/api/categorias-livro', (req, res) => categoriaLivroController.listarCategoriasLivro(req, res));
app.get('/api/categorias-livro/:id', (req, res) => categoriaLivroController.buscarCategoriaLivroPorId(req, res));
app.put('/api/categorias-livro/:id', (req, res) => categoriaLivroController.atualizarCategoriaLivro(req, res));
app.delete('/api/categorias-livro/:id', (req, res) => categoriaLivroController.deletarCategoriaLivro(req, res));

// --- Rotas para CategoriaUsuario ---
app.post('/api/categorias-usuario', (req, res) => categoriaUsuarioController.criarCategoriaUsuario(req, res));
app.get('/api/categorias-usuario', (req, res) => categoriaUsuarioController.listarCategoriasUsuario(req, res));
app.get('/api/categorias-usuario/:id', (req, res) => categoriaUsuarioController.buscarCategoriaUsuarioPorId(req, res));
app.put('/api/categorias-usuario/:id', (req, res) => categoriaUsuarioController.atualizarCategoriaUsuario(req, res));
app.delete('/api/categorias-usuario/:id', (req, res) => categoriaUsuarioController.deletarCategoriaUsuario(req, res));

// --- Rotas para Curso ---
app.post('/api/cursos', (req, res) => cursoController.criarCurso(req, res));
app.get('/api/cursos', (req, res) => cursoController.listarCursos(req, res));
app.get('/api/cursos/:id', (req, res) => cursoController.buscarCursoPorId(req, res));
app.put('/api/cursos/:id', (req, res) => cursoController.atualizarCurso(req, res));
app.delete('/api/cursos/:id', (req, res) => cursoController.deletarCurso(req, res));

// --- Rotas para Emprestimo ---
app.post('/api/emprestimos', (req, res) => emprestimoController.realizarEmprestimo(req, res));
app.put('/api/emprestimos/:id/devolucao', (req, res) => emprestimoController.registrarDevolucao(req, res)); // Devolution by ID
app.get('/api/emprestimos', (req, res) => emprestimoController.listarTodosEmprestimos(req, res));
app.get('/api/emprestimos/ativos', (req, res) => emprestimoController.listarEmprestimosAtivos(req, res));
app.get('/api/emprestimos/historico', (req, res) => emprestimoController.listarHistoricoEmprestimos(req, res));
app.get('/api/emprestimos/pendentes', (req, res) => emprestimoController.listarEmprestimosPendentes(req, res));

// --- Rotas para Estoque ---
app.post('/api/estoque', (req, res) => estoqueController.novoEstoque(req, res));
app.put('/api/estoque/:id', (req, res) => estoqueController.atualizarEstoque(req, res));
app.delete('/api/estoque/:id', (req, res) => estoqueController.removerEstoque(req, res));
app.get('/api/estoque', (req, res) => estoqueController.listarTodosEstoquesDisponiveis(req, res));
app.get('/api/estoque/livro/:livroId', (req, res) => estoqueController.buscarEstoquePorLivroId(req, res)); // Busca estoque pelo ID do Livro
app.get('/api/estoque/:id', (req, res) => estoqueController.buscarEstoquePorId(req, res)); // Busca estoque pelo ID do Estoque

// --- Rotas para Livro ---
app.post('/api/livros', (req, res) => livroController.criarLivro(req, res));
app.get('/api/livros', (req, res) => livroController.listarTodosLivros(req, res));
app.get('/api/livros/:id', (req, res) => livroController.buscarLivroPorId(req, res));
app.get('/api/livros/busca/nome', (req, res) => livroController.buscarLivroPorNome(req, res)); // Busca por nome (query param: ?nome=...)
app.get('/api/livros/busca/categoria/:categoriaId', (req, res) => livroController.buscarLivroPorCategoria(req, res)); // Busca por categoria ID
app.put('/api/livros/:id', (req, res) => livroController.atualizarLivro(req, res));
app.delete('/api/livros/:id', (req, res) => livroController.removerLivro(req, res));

// --- Rotas para Usuario ---
app.post('/api/usuarios', (req, res) => usuarioController.criarUsuario(req, res));
app.get('/api/usuarios', (req, res) => usuarioController.listarTodosUsuarios(req, res));
app.get('/api/usuarios/cpf/:cpf', (req, res) => usuarioController.buscarUsuarioPorCPF(req, res)); // Busca por CPF
app.put('/api/usuarios/cpf/:cpf', (req, res) => usuarioController.atualizarUsuario(req, res));
app.delete('/api/usuarios/cpf/:cpf', (req, res) => usuarioController.removerUsuario(req, res));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});