import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { FileUploadModule } from 'primeng/fileupload';
import { Ubicacion } from '../../interfaces/ubicacion';
import { comunidades } from '../../../assets/json/comunidades';
import { provincias } from '../../../assets/json/provincias';
import { poblaciones } from '../../../assets/json/poblaciones';
import { MapGeocoder } from '@angular/google-maps';
import { LocalesService } from '../../services/locales.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-solicitar-local',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule, CommonModule, FileUploadModule],
  templateUrl: './solicitar-local.component.html',
  styleUrl: './solicitar-local.component.scss'
})
export class SolicitarLocalComponent implements OnInit{
  comunidades: Ubicacion[] = comunidades
  provincias: Ubicacion[] = []
  poblacionesT: Ubicacion[] = []
  userLog!:Usuario

  constructor(private geocoder: MapGeocoder, private localServ:LocalesService,private router:Router, private authServ:AuthService) { }

  ngOnInit(): void {
    this.userLog = this.authServ.getUser()
  }

  primerFormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl('')
  });

  segundoFormGroup = new FormGroup({
    comunidad: new FormControl('', [Validators.required]),
    provincia: new FormControl('', [Validators.required]),
    poblacion: new FormControl('', [Validators.required]),
  });

  terceroFormGroup = new FormGroup({
    direccion: new FormControl('', [Validators.required])
  });

  get nombre() { return this.primerFormGroup.get('nombre') }
  get descripcion() { return this.primerFormGroup.get('descripcion') }
  get comunidad() { return this.segundoFormGroup.get('comunidad') }
  get provincia() { return this.segundoFormGroup.get('provincia') }
  get poblacion() { return this.segundoFormGroup.get('poblacion') }
  get direccion() { return this.terceroFormGroup.get('direccion') }

  changeComunidad(event: Event) {
    const selectedComunidad = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement

    poblacionSelect.disabled = true

    this.provincias = [];
    this.poblacionesT = [];
    this.segundoFormGroup.controls['provincia'].setValue(null);
    this.segundoFormGroup.controls['poblacion'].setValue(null);

    const idComunidad = this.comunidades.find(comunidad => comunidad.label === selectedComunidad.value)?.code;
    this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);
  }

  changeProvincia(event: Event) {
    const selectedProvincia = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement
    poblacionSelect.disabled = false

    this.segundoFormGroup.get('poblacion')?.reset();

    const idProvincia = this.provincias.find(provincia => provincia.label === selectedProvincia.value)?.code;
    this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
  }

  solicitarLocal() {
    let latitud:number
    let longitud:number

    const addres = this.poblacion?.value + " " + this.direccion?.value
    this.geocoder.geocode({
      address: addres
    }).subscribe(({ results }) => {
      if (results.length > 0) {
        latitud = results[0].geometry.location.lat()
        longitud = results[0].geometry.location.lng()

        const solLocal = {
          nombre: this.nombre?.value,
          descripcion: this.descripcion?.value,
          comunidad: this.comunidad?.value,
          provincia: this.provincia?.value,
          poblacion: this.poblacion?.value,
          direccion: this.direccion?.value,
          email_usuario: this.userLog.email,
          latitud: latitud,
          longitud: longitud,
          verificado:false
        };

        console.log(JSON.stringify(solLocal))
        this.localServ.postLocal(solLocal).subscribe(
          response => this.router.navigate(["/"]),
          error => console.error(error)
        )
      }
    });
  }
}
