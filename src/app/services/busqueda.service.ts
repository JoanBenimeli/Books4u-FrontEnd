import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  busqueda!:string

  constructor() { }

  setBusqueda(valor:string){
    this.busqueda = valor
  }

  getBusqueda(){
    return this.busqueda
  }
}
