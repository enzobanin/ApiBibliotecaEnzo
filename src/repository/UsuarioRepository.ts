import { Usuario } from "../model/Usuario";

export class UsuarioRepository{
    private static instance: UsuarioRepository
    private UsuarioLista : Usuario[] = []
    private constructor(){}
    
    public static getInstance():UsuarioRepository{
        if(!this.instance){
            this.instance = new UsuarioRepository()
        }
        return this.instance
    }
    InsereUsuario(usuario:Usuario){
        this.UsuarioLista.push(usuario)
    }

    ExibeUsuarioPorCPF(cpf:string):Usuario|undefined{
        const index = this.UsuarioLista.findIndex(u=>u.cpf===cpf)
        if(index == -1){
            return undefined;
        }
        return this.UsuarioLista[index]
    }

    RemoveUsuarioPorCPF(cpf:string):boolean{
        const index = this.UsuarioLista.findIndex(u=>u.cpf===cpf)
        if(index == -1){
            return false
        }
        this.UsuarioLista.splice(index,1)
        return true;
    }

    ExibeTodosUsuarios():Usuario[]{
        return this.UsuarioLista
    }

    AtualizaUsuario(cpf:string, UsuarioAtualizado:Usuario):Usuario|undefined{
        const index = this.UsuarioLista.findIndex(u=>u.cpf===cpf)
        if(index == -1){
            return undefined;
        }
        UsuarioAtualizado.cpf = cpf;
        this.UsuarioLista[index] = UsuarioAtualizado;
        return this.UsuarioLista[index];
    }
}


