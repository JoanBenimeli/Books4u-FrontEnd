import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ubicacion } from '../../interfaces/ubicacion';
import { comunidades } from '../../../assets/json/comunidades';
import { provincias } from '../../../assets/json/provincias';
import { poblaciones } from '../../../assets/json/poblaciones';
import { ActivatedRoute, Router } from '@angular/router';
import { Local } from '../../interfaces/local';
import { LocalesService } from '../../services/locales.service';
import { MapGeocoder } from '@angular/google-maps';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-form-local',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatSlideToggleModule],
  templateUrl: './form-local.component.html',
  styleUrl: './form-local.component.scss'
})
export class FormLocalComponent {
  comunidades:Ubicacion[] = comunidades
  provincias:Ubicacion[] = []
  poblacionesT:Ubicacion[] = []
  statusNew:boolean = true
  idUpdate!:number

  constructor(private route:ActivatedRoute,private router:Router, private localServ:LocalesService,private geocoder: MapGeocoder){}

  localNew = new FormGroup({
    nombre: new FormControl('',[Validators.required]),
    descripcion: new FormControl(''),
    direccion: new FormControl('',[Validators.required]),
    latitud: new FormControl(),
    longitud: new FormControl(),
    poblacion: new FormControl('',[Validators.required]),
    provincia: new FormControl('',[Validators.required]),
    comunidad: new FormControl('',[Validators.required]), 
    email_usuario: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    verificado: new FormControl(true)
  })

  get nombre(){return this.localNew.get('nombre')}
  get imagen(){return this.localNew.get('imagen')}
  get descripcion(){return this.localNew.get('descripcion')}
  get direccion(){return this.localNew.get('direccion')}
  get poblacion(){return this.localNew.get('poblacion')}
  get provincia(){return this.localNew.get('provincia')}
  get comunidad(){return this.localNew.get('comunidad')}
  get email_usuario(){return this.localNew.get('email_usuario')}

  ngOnInit(): void {
    this.route.data.subscribe(({ local }) => {
      if (local) {
        this.statusNew = false;
        this.localNew.patchValue(local);
        this.idUpdate = local.id

        console.log(local)

        const idComunidad = this.comunidades.find(comunidad => comunidad.label === local.comunidad)?.code;
        this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);

        const idProvincia = this.provincias.find(provincia => provincia.label === local.provincia)?.code;
        this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
      }
    });
  }
  
  changeComunidad(event: Event) {
    const selectedComunidad = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement

    poblacionSelect.disabled = true

    this.provincias = [];
    this.poblacionesT = [];
    this.localNew.controls['provincia'].setValue(null);
    this.localNew.controls['poblacion'].setValue(null);

    const idComunidad = this.comunidades.find(comunidad => comunidad.label === selectedComunidad.value)?.code;
    this.provincias = provincias.filter(provincia => provincia.parent_code === idComunidad);
  }

  changeProvincia(event: Event) {
    const selectedProvincia = event.target as HTMLInputElement;
    const poblacionSelect = document.getElementById('poblaciones') as HTMLInputElement
    poblacionSelect.disabled = false

    this.localNew.get('poblacion')?.reset();

    const idProvincia = this.provincias.find(provincia => provincia.label === selectedProvincia.value)?.code;
    this.poblacionesT = poblaciones.filter(poblacion => poblacion.parent_code === idProvincia);
  }

  addLocal(){
    
    if(this.direccion){
      let allDireccion = this.poblacion?.value + " " + this.direccion.value
      console.log(allDireccion)
      this.geocoder.geocode({
        address: allDireccion
      }).subscribe(({results}) => {
        if(results.length > 0){
          this.localNew.patchValue({
            latitud: results[0].geometry.location.lat(),
            longitud: results[0].geometry.location.lng()
          });

    
          this.localServ.postLocal(this.localNew.value).subscribe(
            response=>this.router.navigate(['/admin/locales']),
            error=>console.error(error)
          )
        }else{
          console.error('Dirección no valida')
        }
      });
    }

    console.log(this.localNew.value)
  
  }

  updateUsuario(){
    this.localServ.putLocal(this.idUpdate,this.localNew.value).subscribe(
      response=>this.router.navigate(['/admin/locales']),
      error=>console.error(error)
    )
  }
}
