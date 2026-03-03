import { Libro } from "./libro";
import { Comentario } from "./comentario";
import { Lista } from "./lista";

export interface Usuario {
    id:number,
    nombre:string,
    nick:string,
    poblacion:string,
    provincia:string,
    comunidad:string,
    imagen:string,
    email:string,
    password:string,
    id_lista:number,
    rol:number
    libros:Libro[],
    created_at:Date,
    comentarios_recibidos:Comentario[],
    lista:Lista
}
