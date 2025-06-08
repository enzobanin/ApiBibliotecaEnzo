import { Usuario } from "../model/Usuario";

export class UsuarioRepository{
    private static instance: UsuarioRepository
    private usuarioLista: Usuario[]=[]
}