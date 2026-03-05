import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autor } from '../interfaces/autor';
import { Observable, catchError, retry } from 'rxjs';
import errorPeticion from './errorPeticion';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class AutoresService {

  constructor(private http:HttpClient) { }

  getAutores():Observable<Autor[]>{
    return this.http.get<Autor[]>('/api/backProyectoFinal/public/api/autores')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Autor[]>(error)));
  }

  getAutoresVerif():Observable<Autor[]>{
    return this.http.get<Autor[]>('/api/backProyectoFinal/public/api/autoresVerif')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Autor[]>(error)));
  }

  deleteAutores(id:number):Observable<Autor>{
    return this.http.delete<Autor>('/api/backProyectoFinal/public/api/autores/'+id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Autor>(error)));
  }

  postAutor(autor:object):Observable<Autor>{
    return this.http.post<Autor>('/api/backProyectoFinal/public/api/autores',JSON.stringify(autor),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Autor>(error)));
  }

  putAutor(id:number,autor:Object):Observable<Autor>{
    return this.http.put<Autor>('/api/backProyectoFinal/public/api/autores/'+id,JSON.stringify(autor),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Autor>(error)));
  }
}
