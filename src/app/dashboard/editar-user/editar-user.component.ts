import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { comunidades } from '../../../assets/json/comunidades';
import { provincias } from '../../../assets/json/provincias';
import { poblaciones } from '../../../assets/json/poblaciones';
import { Ubicacion } from '../../interfaces/ubicacion';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-editar-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.scss'
})
export class EditarUserComponent implements OnInit {
  comunidades: Ubicacion[] = comunidades
  provincias: Ubicacion[] = []
  poblacionesT: Ubicacion[] = []
  usuarioDatos!:Usuario
  userLog!:Usuario

  constructor(private route: ActivatedRoute, private userServ: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ usuario }) => {
      usuario.password = ""
      this.usuario.patchValue(usuario);
      this.usuario.get('password')?.clearValidators()
      this.usuario.get('password')?.addValidators([Validators.minLength(8)])
      this.usuarioDatos = usuario


      if (usuario.imagen != null) {
        console.log(usuario.imagen)
        let img = document.getElementById('imgPreview') as HTMLImageElement
        img.src = 'https://www.books4u.es/api/backProyectoFinal/public/' + usuario.imagen
      }

      const idComunidad = this.comunidades.find(comunidad => comunidad.label === this.usuario.value.comunidad)?.code;
      this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);

      const idProvincia = this.provincias.find(provincia => provincia.label === this.usuario.value.provincia)?.code;
      this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
    });
  }

  usuario = new FormGroup({
    nombre: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z\s]{1,}$/)]),
    imagen: new FormControl(''),
    nick: new FormControl('', [Validators.required]),
    poblacion: new FormControl('', [Validators.required]),
    provincia: new FormControl('', [Validators.required]),
    comunidad: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('',[Validators.pattern(/^.{8,}$/)]),
    rol:new FormControl('')
  })

  get nombre() { return this.usuario.get('nombre') }
  get nick() { return this.usuario.get('nick') }
  get email() { return this.usuario.get('email') }
  get imagen() { return this.usuario.get('imagen') }
  get password() { return this.usuario.get('password') }
  get comunidad() { return this.usuario.get('comunidad') }
  get provincia() { return this.usuario.get('provincia') }
  get poblacion() { return this.usuario.get('poblacion') }

  preview(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = (target.files as FileList)[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imgPreview = document.getElementById("imgPreview") as HTMLImageElement;
        if (imgPreview) {
          imgPreview.src = reader.result as string;
        }

        const result = reader.result;
        if (typeof result === 'string') {
          this.usuario.patchValue({
            imagen: result
          });
        }
      };

      reader.readAsDataURL(file);
    }
  }

  changeComunidad(event: Event) {
    const selectedComunidad = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement

    poblacionSelect.disabled = true

    this.provincias = [];
    this.poblacionesT = [];
    this.usuario.controls['provincia'].setValue('');
    this.usuario.controls['poblacion'].setValue('');

    const idComunidad = this.comunidades.find(comunidad => comunidad.label === selectedComunidad.value)?.code;
    this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);
  }

  changeProvincia(event: Event) {
    const selectedProvincia = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement
    poblacionSelect.disabled = false

    this.usuario.get('poblacion')?.reset();

    const idProvincia = this.provincias.find(provincia => provincia.label === selectedProvincia.value)?.code;
    this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
  }

  updateUsuario() {
    this.userServ.putUsuario(this.usuarioDatos.id, this.usuario.value).subscribe(
      response =>{
        this.router.navigate(['/profile/' + this.usuarioDatos.id])
      },
      error => console.error(error)
    )
  }
}
