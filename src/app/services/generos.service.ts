import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Genero } from '../interfaces/genero';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  constructor(private http:HttpClient){ }

  getGeneros():Observable<Genero[]>{
    return this.http.get<Genero[]>('/api/backProyectoFinal/public/api/generos')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Genero[]>(error)));
  }

  getGenerosVerif():Observable<Genero[]>{
    return this.http.get<Genero[]>('/api/backProyectoFinal/public/api/generoVerif')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Genero[]>(error)));
  }

  deleteGenero(id:number):Observable<Genero>{
    return this.http.delete<Genero>('/api/backProyectoFinal/public/api/generos/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Genero>(error)));
  }

  postGenero(genero:Object):Observable<Genero>{
    return this.http.post<Genero>('/api/backProyectoFinal/public/api/generos',JSON.stringify(genero),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Genero>(error)));
  }

  putGenero(id:number,genero:object):Observable<Genero>{
    return this.http.put<Genero>('/api/backProyectoFinal/public/api/generos/' + id,JSON.stringify(genero),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Genero>(error)));
  }
}
