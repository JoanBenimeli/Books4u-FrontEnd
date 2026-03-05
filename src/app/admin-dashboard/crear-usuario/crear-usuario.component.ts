import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { comunidades } from '../../../assets/json/comunidades';
import { provincias } from '../../../assets/json/provincias';
import { poblaciones } from '../../../assets/json/poblaciones';
import { Ubicacion } from '../../interfaces/ubicacion';

import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import { Rol } from '../../interfaces/rol';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSelectModule,ScrollingModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss'
})
export class CrearUsuarioComponent{
  comunidades:Ubicacion[] = comunidades
  provincias:Ubicacion[] = []
  poblacionesT:Ubicacion[] = []
  statusNew:boolean = true
  idUpdate!:number
  roles:Rol[] = []

  constructor(private route:ActivatedRoute,private userServ:UsuariosService,private router:Router){}

  ngOnInit(): void {
    this.route.data.subscribe(({roles}) => this.roles = roles)
    console.log(this.roles)
    this.route.data.subscribe(({ usuario }) => {
      if (usuario) {
        this.statusNew = false;
        usuario.password = ""
        this.usuario.patchValue(usuario);
        this.usuario.get('password')?.clearValidators()
        this.usuario.get('password')?.addValidators([Validators.minLength(8)])
        this.idUpdate = usuario.id
        

        if(usuario.imagen != null){
          console.log(usuario.imagen)
          let img = document.getElementById('imgPreview') as HTMLImageElement
          img.src = '/api/backProyectoFinal/public/' + usuario.imagen
        }

        const idComunidad = this.comunidades.find(comunidad => comunidad.label === this.usuario.value.comunidad)?.code;
        this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);

        const idProvincia = this.provincias.find(provincia => provincia.label === this.usuario.value.provincia)?.code;
        this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
      }
    });
  }

  usuario = new FormGroup({
    nombre: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z\s]{1,}$/)]),
    imagen: new FormControl(''),
    nick: new FormControl('', [Validators.required]),
    poblacion: new FormControl('',[Validators.required]),
    provincia: new FormControl('',[Validators.required]),
    comunidad: new FormControl('',[Validators.required]),
    rol: new FormControl('',Validators.required),
    email: new FormControl('', [Validators.required,Validators.pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('', [Validators.required,Validators.pattern(/^.{8,}$/)])
  })

  get nombre() { return this.usuario.get('nombre') }
  get nick() { return this.usuario.get('nick') }
  get rol(){ return this.usuario.get('rol') }
  get email() { return this.usuario.get('email') }
  get imagen() { return this.usuario.get('imagen') }
  get password() { return this.usuario.get('password') }
  get comunidad(){ return this.usuario.get('comunidad') }
  get provincia(){ return this.usuario.get('provincia') }
  get poblacion(){ return this.usuario.get('poblacion') }

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
    this.usuario.controls['provincia'].setValue(null);
    this.usuario.controls['poblacion'].setValue(null);

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

  addUsuario(){
    console.log(JSON.stringify(this.usuario.value))
    this.userServ.postUsuario(this.usuario.value).subscribe(
      response=>this.router.navigate(['/admin/usuarios']),
      error=>console.error(error)
    )
  }

  updateUsuario(){
    console.log(JSON.stringify(this.usuario.value))
    this.userServ.putUsuario(this.idUpdate,this.usuario.value).subscribe(
      response=>this.router.navigate(['/admin/usuarios']),
      error=>console.error(error)
    )
  }
}
