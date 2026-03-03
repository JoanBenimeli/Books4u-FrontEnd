import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserLogedService {

  userLog:Usuario | null = null

  constructor() { }

  setUser(valor:Usuario | null){
    console.log(valor)
    this.userLog = valor
  }

  getUser(){
    console.log(this.userLog)
    return this.userLog
  }
}
