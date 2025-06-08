import { Usuario } from "../model/Usuario";

export class UsuarioRepository{
    private static instance: UsuarioRepository
    private UsuarioLista : Usuario[] = []
    private constructor(){}
    
    static getInstance():UsuarioRepository{
        if(!this.instance){
            this.instance = new UsuarioRepository()
        }
        return this.instance
    }

    private findIndex(cpf:string):number{
        const index = this.UsuarioLista.findIndex(p=>p.cpf == cpf)
        if(index == -1){
            throw new Error("ID não encontrado")
        }
        return index
    }

    InsereUsuario(usuario:Usuario){
        this.UsuarioLista.push(usuario)
    }

    ExibeUsuarioPorCPF(cpf:string){
        const index = this.findIndex(cpf)
        this.UsuarioLista[index]
    }

    RemoveUsuarioPorCPF(cpf:string){
        const index = this.findIndex(cpf)
        this.UsuarioLista.splice(index,1)
    }

    ExibeTodosUsuarios():Usuario[]{
        return this.UsuarioLista
    }

    AtualizaUsuario(cpf:string, UsuarioAtualizado:Usuario):Usuario{
        const index = this.findIndex(cpf)
        let UsuarioExistente = this.UsuarioLista[index];
        UsuarioExistente.nome = UsuarioAtualizado.nome;
        UsuarioExistente.cpf = UsuarioAtualizado.cpf;
        UsuarioExistente.ativo = UsuarioAtualizado.ativo;
        UsuarioExistente.categoria_id = UsuarioAtualizado.categoria_id;
        UsuarioExistente.curso_id = UsuarioAtualizado.curso_id;

        return UsuarioExistente;
    }
}


