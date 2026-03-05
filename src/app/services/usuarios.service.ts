import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import errorPeticion from './errorPeticion';
import { Observable, catchError, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http:HttpClient) { }

  getUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>('/api/backProyectoFinal/public/api/usuarios')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Usuario[]>(error)));
  }

  getIdUser(id:string):Observable<Usuario>{
    return this.http.get<Usuario>('/api/backProyectoFinal/public/api/usuarios/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error)));
  }

  deleteUsuario(id:number):Observable<Usuario>{
    return this.http.delete<Usuario>('/api/backProyectoFinal/public/api/usuarios/' + id)
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error)));
  }

  postUsuario(usuario:Object):Observable<Usuario>{
    return this.http.post<Usuario>('/api/backProyectoFinal/public/api/usuarios',JSON.stringify(usuario),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error)));
  }

  putUsuario(id:number,usuario:Object):Observable<Usuario>{
    return this.http.put<Usuario>('/api/backProyectoFinal/public/api/usuarios/' + id,JSON.stringify(usuario),{ headers: { 'Content-Type': 'application/json' }})
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Usuario>(error)));
  }
}
