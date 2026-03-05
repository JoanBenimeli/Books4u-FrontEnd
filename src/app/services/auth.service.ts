import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, retry, tap, throwError } from 'rxjs';
import errorPeticion from './errorPeticion';
import { Token } from '../interfaces/token';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private logUser!: Usuario;

  constructor(private http: HttpClient) {}

  login(user: object): Observable<Token> {
    return this.http.post<Token>('/api/backProyectoFinal/public/api/login', JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } })
      .pipe(catchError((error: HttpErrorResponse) => errorPeticion<Token>(error)));
  }

  isLoged(): boolean {
    const token = sessionStorage.getItem('token');
  
    if (token || this.logUser) {
      return true
    } else {
      return false;
    }
  }

  isAdmin():boolean{
    if(this.logUser){
      if(this.logUser.rol == 2){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }

  logout(user: object): Observable<Token> {
    return this.http.post<Token>('/api/backProyectoFinal/public/api/logout', JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } })
      .pipe(retry(3), catchError((error: HttpErrorResponse) => errorPeticion<Token>(error)));
  }

  getUserId():Observable<Usuario>{
    return this.http.get<Usuario>('/api/backProyectoFinal/public/api/userLog')
      .pipe(retry(3), catchError((error: HttpErrorResponse) => {return throwError(error)}));
  }

  setUser(usuario:Usuario){
    this.logUser = usuario
  }

  getUser(){
    return this.logUser
  }
}
