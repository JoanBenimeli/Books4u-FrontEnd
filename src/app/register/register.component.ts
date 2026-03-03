import { Component } from '@angular/core';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Ubicacion } from '../interfaces/ubicacion';
import { comunidades } from '../../assets/json/comunidades';
import { provincias } from '../../assets/json/provincias';
import { poblaciones } from '../../assets/json/poblaciones';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,CommonModule,FileUploadModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  comunidades:Ubicacion[] = comunidades
  provincias:Ubicacion[] = []
  poblacionesT:Ubicacion[] = []

  constructor(private usuarioServ:UsuariosService, private router:Router){}
  
  primerFormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^.{8,}$/)]),
  });
  
  segundoFormGroup = new FormGroup({
    nombre: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z\s]*$/)]),
    nick: new FormControl('',[Validators.required]),
    imagen: new FormControl('')
  });

  terceroFormGroup = new FormGroup({
    comunidad: new FormControl('',[Validators.required]),
    provincia: new FormControl('',[Validators.required]),
    poblacion: new FormControl('',[Validators.required]),
  });

  get email(){return this.primerFormGroup.get('email')}
  get password(){return this.primerFormGroup.get('password')}
  get nombre(){return this.segundoFormGroup.get('nombre')}
  get nick(){return this.segundoFormGroup.get('nick')}
  get imagen(){return this.segundoFormGroup.get('imagen')}
  get comunidad(){return this.terceroFormGroup.get('comunidad')}
  get provincia(){return this.terceroFormGroup.get('provincia')}
  get poblacion(){return this.terceroFormGroup.get('poblacion')}


  changeComunidad(event: Event) {
    const selectedComunidad = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement

    poblacionSelect.disabled = true

    this.provincias = [];
    this.poblacionesT = [];
    this.terceroFormGroup.controls['provincia'].setValue(null);
    this.terceroFormGroup.controls['poblacion'].setValue(null);

    const idComunidad = this.comunidades.find(comunidad => comunidad.label === selectedComunidad.value)?.code;
    this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);
  }

  changeProvincia(event: Event) {
    const selectedProvincia = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement
    poblacionSelect.disabled = false

    this.terceroFormGroup.get('poblacion')?.reset();

    const idProvincia = this.provincias.find(provincia => provincia.label === selectedProvincia.value)?.code;
    this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
  }

  addUsuario(){
    const newUsuario = {
      nombre: this.nombre?.value,
      nick: this.nick?.value,
      poblacion: this.poblacion?.value,
      provincia: this.provincia?.value,
      comunidad: this.comunidad?.value,
      email: this.email?.value,
      password: this.password?.value,
      imagen: this.imagen?.value,
      rol:1
    }

    console.log(JSON.stringify(newUsuario))
    this.usuarioServ.postUsuario(newUsuario).subscribe(
      response=>this.router.navigate(['/login']),
      error=>console.error("No se ha podido iregistrar el usuario: " + error)
    )
  }

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
          this.segundoFormGroup.patchValue({
            imagen: result
          });
        }
      };
  
      reader.readAsDataURL(file);
    }
  }
}
