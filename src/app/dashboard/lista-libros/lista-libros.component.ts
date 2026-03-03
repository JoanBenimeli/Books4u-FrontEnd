import { Component, OnInit, DoCheck } from '@angular/core';
import { LibroComponent } from '../libro/libro.component';
import { Libro } from '../../interfaces/libro';
import { Autor } from '../../interfaces/autor';
import { ActivatedRoute } from '@angular/router';
import { Genero } from '../../interfaces/genero';
import { FiltroComponent } from '../filtro/filtro.component';
import { Filtro } from '../../interfaces/filtro';
import { BusquedaService } from '../../services/busqueda.service';
import { Subscription } from 'rxjs';
import { LibrosService } from '../../services/libros.service';
import { ListasService } from '../../services/listas.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';


@Component({
  selector: 'app-lista-libros',
  standalone: true,
  imports: [LibroComponent, FiltroComponent],
  templateUrl: './lista-libros.component.html',
  styleUrl: './lista-libros.component.scss'
})
export class ListaLibrosComponent implements OnInit, DoCheck {

  filtro: Filtro = {
    id_autor: 0,
    id_genero: 0,
    numeroPaginas: 0
  }

  orden!: string

  constructor(private route: ActivatedRoute, private busquedaServ: BusquedaService, private libroServ: LibrosService, private listaServ: ListasService, private authServ: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(({ libros }) => this.libros = libros)
    this.route.data.subscribe(({ autores }) => this.autores = autores)
    this.route.data.subscribe(({ generos }) => this.generos = generos)
    this.userLog = this.authServ.getUser()
    console.log(this.userLog)
    
    if(this.userLog){
      this.listaServ.getIdLista(this.userLog.id).subscribe(
        response => this.favoritos = response.libros,
        error => console.error(error)
      )
    }

    const darkChanger = document.getElementsByClassName('darkChanger')
    if (sessionStorage.getItem("theme") == "dark") {
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.add('darkMode');
      }
    } else {
      for (let i = 0; i < darkChanger.length; i++) {
        darkChanger[i].classList.remove('darkMode');
      }
    }

    this.librosFiltro = this.libros
  }

  ngDoCheck(): void {
    this.aplicarFiltros(this.filtro)
  }

  libros!: Libro[]
  librosFiltro!: Libro[]

  autores!: Autor[]
  generos!: Genero[]

  favoritos!: Libro[]
  userLog!: Usuario

  ordenar(orden: string) {
    switch (orden) {
      case 'alfAsc':
        this.librosFiltro.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'alfDec':
        this.librosFiltro.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'preAsc':
        this.librosFiltro.sort((a, b) => a.precio - b.precio);
        break;
      case 'preDesc':
        this.librosFiltro.sort((a, b) => b.precio - a.precio);
        break;
    }
  }

  aplicarFiltros(filtro: Filtro) {
    this.librosFiltro = this.libros
    this.filtrar(filtro);
    this.filtrarNombre();
    this.ordenar(this.orden)
  }

  filtrar(filtro: Filtro) {
    if (filtro.id_autor !== 0) {
      this.librosFiltro = this.librosFiltro.filter(libro => libro.id_autor === filtro.id_autor);
    }

    if (filtro.id_genero !== 0) {
      this.librosFiltro = this.librosFiltro.filter(libro => libro.generos.some(genero => genero.id === filtro.id_genero));
    }

    if (filtro.numeroPaginas !== 0) {
      this.librosFiltro = this.librosFiltro.filter(libro => {
        switch (filtro.numeroPaginas) {
          case 1:
            return libro.paginas <= 50;
          case 2:
            return libro.paginas > 50 && libro.paginas <= 200;
          case 3:
            return libro.paginas > 200 && libro.paginas <= 400;
          case 4:
            return libro.paginas > 400 && libro.paginas <= 600;
          case 5:
            return libro.paginas > 600 && libro.paginas <= 800;
          default:
            return libro.paginas > 800;
        }
      })
    }
  }

  filtrarNombre() {
    if (this.busquedaServ.getBusqueda() != "" && this.busquedaServ.getBusqueda() != null) {
      this.librosFiltro = this.librosFiltro.filter(libro => libro.nombre.toLowerCase().includes(this.busquedaServ.getBusqueda().toLowerCase()));
    }
  }

  setFiltro(filtro: Filtro) {
    this.filtro = filtro
  }

  setOrden(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.orden = target.value
  }

  actualizarLibros() {
    this.libroServ.getLibros().subscribe(
      response => {
        this.libros = response
        this.librosFiltro = response
      },
      error => {
        console.error("Error al actualizar los libros: " + error)
      }
    )

    console.log(this.userLog)
    this.listaServ.getIdLista(this.userLog.id).subscribe(
      response => this.favoritos = response.libros,
      error => console.error("Error al actualizar los libros: " + error)
    )
  }

  comprobarFavorito(libro: Libro) {
    if (this.favoritos != undefined) {
      if (this.favoritos.find((favorito) => favorito.id == libro.id) != undefined) {
        return true
      } else {
        return false
      }
    }
    return false
  }
}
