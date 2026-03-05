import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Local } from '../interfaces/local';
import { Observable, catchError, retry } from 'rxjs';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class LocalesService {

  constructor(private http:HttpClient) { }

  getLocales():Observable<Local[]>{
    return this.http.get<Local[]>('/api/backProyectoFinal/public/api/locales')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Local[]>(error)));
  }

  deleteLocal(id:number):Observable<Local>{
    return this.http.delete<Local>('/api/backProyectoFinal/public/api/locales/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Local>(error)));
  }

  showLocal(id:string):Observable<Local>{
    return this.http.get<Local>('/api/backProyectoFinal/public/api/locales/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Local>(error)));
  }

  postLocal(local:object):Observable<Local>{
    return this.http.post<Local>('/api/backProyectoFinal/public/api/locales', JSON.stringify(local),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Local>(error)));
  }

  putLocal(id:number,local:Object):Observable<Local>{
    return this.http.put<Local>('/api/backProyectoFinal/public/api/locales/' + id,JSON.stringify(local),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Local>(error)));
  }

  getLocalVerif():Observable<Local[]>{
    return this.http.get<Local[]>('/api/backProyectoFinal/public/api/localesVerif')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Local[]>(error)));
  }
}
