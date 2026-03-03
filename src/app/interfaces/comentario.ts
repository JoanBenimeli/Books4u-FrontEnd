import { Usuario } from "./usuario"

export interface Comentario {
    id:number,
    id_usuario_emisor:number,
    id_usuario_receptor:number,
    contenido:string,
    valoracion:number,
    created_at:Date,
    updated_at:Date,
    usuario_emisor:Usuario
}
