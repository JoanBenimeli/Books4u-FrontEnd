import { Component,OnInit,CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { Libro } from '../../interfaces/libro';
import { ActivatedRoute } from '@angular/router';
import { Lista } from '../../interfaces/lista';
import { LibroComponent } from '../libro/libro.component';
import { ListasService } from '../../services/listas.service';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
// register Swiper custom elements
register()


@Component({
  selector: 'app-libros-favs',
  standalone: true,
  imports: [LibroComponent],
  templateUrl: './libros-favs.component.html',
  styleUrl: './libros-favs.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class LibrosFavsComponent implements OnInit,AfterViewInit{
  libros!:Libro[]
  lista!:Lista
  userLog!:Usuario
  swiper: Swiper | undefined;

  constructor(private route:ActivatedRoute,private listaServ:ListasService, private authUser:AuthService){}

  ngOnInit(): void {
    this.route.data.subscribe(({ lista }) => this.lista = lista)
    this.libros = this.lista.libros
    console.log(this.lista)
    this.userLog = this.authUser.getUser()
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  initializeSwiper(): void {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  actualizarLibros(){
    this.listaServ.getIdLista(this.userLog.id).subscribe(
      response=>this.libros = response.libros,
      error=>console.error("No se puede actualizar la lista", error)
    )
  }

  
}
