import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { Rol } from '../interfaces/rol';
import errorPeticion from './errorPeticion';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http:HttpClient) { }

  getRoles():Observable<Rol[]>{
    return this.http.get<Rol[]>('/api/backProyectoFinal/public/api/roles')
      .pipe(retry(3),catchError((error: HttpErrorResponse) => errorPeticion<Rol[]>(error)));
  }
}
