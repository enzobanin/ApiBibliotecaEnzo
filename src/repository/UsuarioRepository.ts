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
    InsereUsuario(usuario:Usuario):Usuario{
        this.UsuarioLista.push(usuario)
        return usuario;
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
        let UsuarioExistente = this.UsuarioLista[index]; 

        UsuarioExistente.nome = UsuarioAtualizado.nome;
        UsuarioExistente.cpf = UsuarioAtualizado.cpf; 
        UsuarioExistente.ativo = UsuarioAtualizado.ativo;
        UsuarioExistente.categoria_id = UsuarioAtualizado.categoria_id;
        UsuarioExistente.curso_id = UsuarioAtualizado.curso_id;

        return UsuarioExistente; 
    }
    AtualizaUsuarioPorId(id: number, usuarioAtualizado: Usuario): Usuario | undefined {
        const index = this.UsuarioLista.findIndex(u => u.id === id);
        if (index === -1) {
            return undefined;
        }
        usuarioAtualizado.id = this.UsuarioLista[index].id;
        this.UsuarioLista[index] = usuarioAtualizado;
        return this.UsuarioLista[index];
    }
}


