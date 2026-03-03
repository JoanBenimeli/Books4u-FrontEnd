import { Component,EventEmitter,Output,Input } from '@angular/core';
import { Filtro } from '../../interfaces/filtro';
import { Autor } from '../../interfaces/autor';
import { Genero } from '../../interfaces/genero';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [],
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss'
})
export class FiltroComponent {
  @Output() eventFiltro = new EventEmitter<Filtro>()
  @Input() autores: Autor[] = []
  @Input() generos: Genero[] = []

  filtro:Filtro = {
    id_autor: 0,
    id_genero:0,
    numeroPaginas:0
  }


  filtrarPorAutor(event:Event){
    const target = event.target as HTMLSelectElement
    this.filtro.id_autor = parseInt(target.value)
    this.enviarFiltro()
  }

  filtrarPorPag(event:Event){
    const target = event.target as HTMLSelectElement
    this.filtro.numeroPaginas = parseInt(target.value)
    this.enviarFiltro()
  }

  filtrarPorGenero(event:Event){
    const target = event.target as HTMLSelectElement
    this.filtro.id_genero = parseInt(target.value)
    this.enviarFiltro()
  }

  borrarFiltro(){
    let autorSelect = document.getElementById('autorSelect') as HTMLSelectElement
    let pageNum = document.getElementById('pageNum') as HTMLSelectElement
    let generoSelect = document.getElementById('generoSelect') as HTMLSelectElement

    autorSelect.value = "0"
    pageNum.value = "0"
    generoSelect.value = "0"

    this.filtro.id_autor = 0
    this.filtro.id_genero = 0
    this.filtro.numeroPaginas = 0

    this.enviarFiltro()
  }

  enviarFiltro(){
    this.eventFiltro.emit(this.filtro)
  }
}
