import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { LibroComponent } from '../libro/libro.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ComentarioComponent } from '../comentario/comentario.component';
import { ComentariosService } from '../../services/comentarios.service';
import { Comentario } from '../../interfaces/comentario';
import { Libro } from '../../interfaces/libro';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [LibroComponent, MatTabsModule, ComentarioComponent, RatingModule, FormsModule, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  usuario!: Usuario
  userLog!:Usuario
  valoracion!: number
  numVal:number = 0
  valoracionMedia: number = 0
  valoracionMediaRedond:number = 0

  constructor(private route: ActivatedRoute, private cmentarioServ: ComentariosService, private usuarioServ: UsuariosService, private router: Router, private authServ: AuthService) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ usuario }) => this.usuario = usuario)
    this.userLog = this.authServ.getUser()

    let sumaVal = 0

    if(this.usuario.comentarios_recibidos.length > 0){
      for (let i = 0; i < this.usuario.comentarios_recibidos.length; i++) {
        if (this.usuario.comentarios_recibidos[i].valoracion != 0 && this.usuario.comentarios_recibidos[i].valoracion != null) {
          sumaVal += this.usuario.comentarios_recibidos[i].valoracion
          this.numVal++
        }
      }
      this.valoracionMedia = sumaVal / this.numVal
      this.valoracionMediaRedond = Math.round(this.valoracionMedia)
    }
  }

  publicarComentario() {
    let contenido = document.getElementById('newComentario') as HTMLTextAreaElement

    const comentario = {
      "contenido": contenido.value,
      "id_usuario_emisor": this.userLog.id,
      "valoracion": this.valoracion,
      "id_usuario_receptor": this.usuario.id
    }

    this.cmentarioServ.postComentario(comentario).subscribe(
      response => {
        this.actualizarFeed()
      },
      error => {
        console.error("No se pudo subir el comentario: " + error)
      }
    )
  }

  actualizarFeed() {
    let contenido = document.getElementById('newComentario') as HTMLTextAreaElement

    this.usuarioServ.getIdUser(this.usuario.id.toString()).subscribe(
      response => {
        this.usuario = response
        contenido.value = ""
        this.valoracion = 0

        let sumaVal = 0
        this.numVal = 0

        for (let i = 0; i < this.usuario.comentarios_recibidos.length; i++) {
          if (this.usuario.comentarios_recibidos[i].valoracion != 0 && this.usuario.comentarios_recibidos[i].valoracion != null) {
            sumaVal += this.usuario.comentarios_recibidos[i].valoracion
            this.numVal++
          }
        }
        this.valoracionMedia = sumaVal / this.numVal
        this.valoracionMediaRedond =  Math.floor(this.valoracionMedia)
      },
      error => {
        console.error("Erro al actualizar el feed del usuario: " + error)
      }
    )
  }

  eliminarUser(id: number) {
    this.usuarioServ.deleteUsuario(id).subscribe(
      response => {
        this.router.navigate(['lista']);
      },
      error => {
        console.error('Error al eliminar el usuario: ' + error)
      }
    )
  }

  editUser(id: number) {
    this.router.navigate(['/edit-user/' + id])
  }
}
