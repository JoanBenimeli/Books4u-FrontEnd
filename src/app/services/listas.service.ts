import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Lista } from '../interfaces/lista';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class ListasService {

  constructor(private http:HttpClient) { }

  sincronizarListaLibro(libro_lista:object):Observable<Lista>{
    return this.http.post<Lista>('https://www.books4u.es/api/backProyectoFinal/public/api/guardarLibro',JSON.stringify(libro_lista),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Lista>(error)));
  }

  getIdLista(id:number):Observable<Lista>{
    return this.http.get<Lista>('https://www.books4u.es/api/backProyectoFinal/public/api/mostrarLista/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Lista>(error)));
  }

  deleteOfLista(libro_lista:object):Observable<Lista>{
    return this.http.post<Lista>('https://www.books4u.es/api/backProyectoFinal/public/api/deleteOfLista',JSON.stringify(libro_lista),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Lista>(error)));
  }
}
