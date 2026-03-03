import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss'
})
export class UsersTableComponent {
  usuarios!:Usuario[]
  usuariosFiltrados!:Usuario[]
  
  constructor(private route:ActivatedRoute,private spinner:NgxSpinnerService,private usuarioServ:UsuariosService,private router:Router){}

  ngOnInit(): void {
    this.route.data.subscribe(({ usuarios }) => this.usuarios = usuarios)
    this.usuariosFiltrados = this.usuarios
  }

  eliminarUsuario(id:number){
    this.spinner.show()
    this.usuarioServ.deleteUsuario(id).subscribe(
      response=>this.actualizarUsuarios(),
      error=>console.error("Error al eliminar el usuarios: " + error)
    )
  }

  actualizarUsuarios(){
    this.usuarioServ.getUsuarios().subscribe(
      response=>{
        this.usuarios = response
        this.usuariosFiltrados = response
        this.spinner.hide()
      },
      error=>console.error("Error al actualizar los usuarios: " + error)
    )
  }

  filtrar(event: Event) {
    const target = event.target as HTMLInputElement
    this.usuariosFiltrados = this.usuarios.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
  }

  crearUsuario(){
    this.router.navigate(['/admin/new-usuario'])
  }

  editarUser(id:number){
    this.router.navigate(['/admin/update-usuario/' + id])
  }
}
