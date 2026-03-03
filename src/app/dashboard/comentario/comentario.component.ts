import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { CommonModule } from '@angular/common';
import { ComentariosService } from '../../services/comentarios.service';
import { Observable } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comentario',
  standalone: true,
  imports: [CommonModule,AvatarModule,RouterLink],
  templateUrl: './comentario.component.html',
  styleUrl: './comentario.component.scss'
})
export class ComentarioComponent implements OnInit{
  @Input() comentario!: Comentario
  @Output() comModificado = new EventEmitter<Comentario>()

  constructor(private comentarioServ: ComentariosService,private authServ:AuthService) { }

  ngOnInit(): void {
    this.userLog = this.authServ.getUser()
    console.log(this.comentario)
  }

  contenidoOriginal!:Element|null
  userLog!:Usuario

  eliminarCom(id: number) {
    this.comentarioServ.deleteComentario(id).subscribe(
      response => {
        this.comModificado.emit(response)
      },
      error => {
        console.error('No se ha podido eliminar el comentario: ' + error)
      }
    )
  }

  modTrjeta(id: number) {
    const padre = document.querySelector('#padre-' + id);
    const hijo = document.querySelector('#hijo-' + id);
    this.contenidoOriginal = hijo
    const contenidoHijo = hijo?.textContent

    if (padre && hijo) {
      padre.removeChild(hijo);
    }
    padre?.setAttribute('class', 'card-body text-end mt-3')

    let textArea = document.createElement("textarea")
    textArea.style.width = '100%'
    textArea.style.resize = 'none'
    textArea.style.border = 'none'
    textArea.style.overflow = 'hidden'
    textArea.setAttribute('rows', '6');
    textArea.setAttribute('id', 'Textarea-' + id);

    if (contenidoHijo) {
      textArea.textContent = contenidoHijo
    }

    let buttonUpdate = document.createElement("button")
    buttonUpdate.textContent = "Update"
    buttonUpdate.setAttribute('class', 'btn btn-warning')
    buttonUpdate.addEventListener('click', () => {
      if (hijo) {
        this.modificarCom(id, hijo);
      }
    });

    let buttonCanecel = document.createElement("button")
    buttonCanecel.textContent = "Cancelar"
    buttonCanecel.setAttribute('class', 'btn btn-danger')
    buttonCanecel.addEventListener('click', () => {
      if(hijo?.textContent){
        this.volverEstadoOriginal(id,hijo.textContent)
      }
    });

    padre?.appendChild(textArea)
    padre?.appendChild(buttonCanecel)
    padre?.appendChild(buttonUpdate)
  }

  modificarCom(id: number, old: Element) {
    const contenido = document.querySelector("#Textarea-" + id) as HTMLTextAreaElement
    const updtComentario = {
      "contenido": contenido.value
    }

    this.comentarioServ.putComentario(id, updtComentario).subscribe(
      response => {
        this.volverEstadoOriginal(id,response.contenido)
      },
      error => {
        console.error("Error al modificar el usuario: " + error)
      }
    )
  }

  volverEstadoOriginal(id:number,contenido:string) {
    const padre = document.querySelector('#padre-' + id);
    const hijo = this.contenidoOriginal
    
    if (padre && hijo) {
      padre.classList.remove('text-end')
      while (padre.firstChild) {
        padre.removeChild(padre.firstChild);
      }

      hijo.textContent = contenido
      padre.appendChild(hijo);
    }
  }
}
