import { Autor } from "./autor"
import { Genero } from "./genero"
import { Usuario } from "./usuario"

export interface Libro {
    id:number,
    nombre:string,
    descripcion:string,
    imagen:string,
    precio:number,
    paginas:number,
    id_autor:number,
    id_usuario:number,
    id_lista:number,
    generos:Genero[],
    usuario:Usuario,
    autor:Autor
}
