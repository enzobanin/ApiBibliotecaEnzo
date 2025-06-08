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

    private findIndex(id:number):number{
        const index = this.UsuarioLista.findIndex(p=>p.id == id)
        if(index == -1){
            throw new Error("ID não encontrado")
        }
        return index
    }

    InsereUsuario(usuario:Usuario){
        this.UsuarioLista.push(usuario)
    }

    AchaPorId(id:number){
        const index = this.findIndex(id)
        this.UsuarioLista[index]
    }

    RemoveUsuarioPorID(id:number){
        const index = this.findIndex(id)
        this.UsuarioLista.splice(index,1)
    }

    MostraTodosUsuarios():Usuario[]{
        return this.UsuarioLista
    }
}


