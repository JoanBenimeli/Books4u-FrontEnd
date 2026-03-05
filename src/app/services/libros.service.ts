import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Libro } from '../interfaces/libro';
import { Observable, catchError, retry, throwError } from 'rxjs';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  constructor(private http:HttpClient) { }

  getLibros():Observable<Libro[]>{
    return this.http.get<Libro[]>('/api/backProyectoFinal/public/api/libros')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Libro[]>(error)));
  }

  getLibroId(id:string):Observable<Libro>{
    return this.http.get<Libro>('/api/backProyectoFinal/public/api/libros/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Libro>(error)));
  }

  postLibro(libro:object):Observable<Libro>{
    return this.http.post<Libro>('/api/backProyectoFinal/public/api/libros',JSON.stringify(libro),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Libro>(error)));
  }

  deleteLibro(id:number):Observable<Libro>{
    return this.http.delete<Libro>('/api/backProyectoFinal/public/api/libros/'+id)
      .pipe(catchError((error: HttpErrorResponse) => errorPeticion<Libro>(error)));
  }

  putLibro(id:number,libro:object):Observable<Libro>{
    return this.http.put<Libro>('/api/backProyectoFinal/public/api/libros/'+id, JSON.stringify(libro),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Libro>(error)));
  }
}


