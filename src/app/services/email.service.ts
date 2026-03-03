import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http:HttpClient) { }

  postComentario(datos:object):Observable<object>{
    console.log(JSON.stringify(datos))
    return this.http.post<object>('https://www.books4u.es/api/backProyectoFinal/public/api/factura',JSON.stringify(datos),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(catchError((error: HttpErrorResponse) => errorPeticion<object>(error)));
  }
}
