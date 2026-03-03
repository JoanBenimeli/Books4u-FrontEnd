import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { Libro } from '../../interfaces/libro';
import { LibrosService } from '../../services/libros.service';
import { Router, RouterLink } from '@angular/router';
import { ListasService } from '../../services/listas.service';
import { Lista } from '../../interfaces/lista';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent implements OnInit{
  @Input() libro!:Libro;
  @Input() favorito!:boolean;
  @Output() actLibros = new EventEmitter()

  userLog!:Usuario

  constructor(private libroServ:LibrosService,private router: Router,private listaServ:ListasService, private authServ:AuthService){}

  ngOnInit(): void {
    this.userLog = this.authServ.getUser()
  }

  eliminarLibro(id:number){
    this.libroServ.deleteLibro(id).subscribe(
      response=>this.actLibros.emit(),
      error=>console.error("Error al eliminar el libro: " + error)
    )
  }

  redirectLibro(id:Number){
    this.router.navigate(['/libro/'+id]);
  }

  guardarFavorito(id:number){
    const enlace = {
      "id_libro":id,
      "id_usuario": this.userLog.id
    }

    console.log(enlace)
    this.listaServ.sincronizarListaLibro(enlace).subscribe(
      response=>this.actLibros.emit(),
      error=>console.error(error)
    )
  }

  eliminarFavorito(id:number){
    const enlace = {
      "id_libro":id,
      "id_usuario": this.userLog.id
    }

    this.listaServ.deleteOfLista(enlace).subscribe(
      response=>this.actLibros.emit(),
      error=>console.error(error)
    )
  }

  editarLibro(id:number){
    this.router.navigate(["editar-libro/" + id])
  }
}
