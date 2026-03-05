import { Injectable } from '@angular/core';
import { Comentario } from '../interfaces/comentario';
import { Observable, catchError, retry } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

  constructor(private http:HttpClient) { }
  
  postComentario(comentario:object):Observable<Comentario>{
    return this.http.post<Comentario>('/api/backProyectoFinal/public/api/comentarios',JSON.stringify(comentario),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Comentario>(error)));
  }

  deleteComentario(id:number):Observable<Comentario>{
    return this.http.delete<Comentario>('/api/backProyectoFinal/public/api/comentarios/' + id)
    .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Comentario>(error)))
  }

  putComentario(id:number,comentario:object):Observable<Comentario>{
    return this.http.put<Comentario>('/api/backProyectoFinal/public/api/comentarios/' + id,JSON.stringify(comentario),{ headers: { 'Content-Type': 'application/json' }})
    .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Comentario>(error)))
  }
}
