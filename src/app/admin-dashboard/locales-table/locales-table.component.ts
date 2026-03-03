import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Local } from '../../interfaces/local';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { LocalesService } from '../../services/locales.service';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-locales-table',
  standalone: true,
  imports: [NgxSpinnerModule,MatTabsModule],
  templateUrl: './locales-table.component.html',
  styleUrl: './locales-table.component.scss'
})
export class LocalesTableComponent {
  locales:Local[] = []
  localesFiltrados!: Local[]

  solicitudes:Local[] = []
  solicitudesFiltradas!: Local[]

  constructor(private route: ActivatedRoute,private spinner: NgxSpinnerService,private localServ:LocalesService,private router:Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ locales }) => {
      if(locales){
        locales.forEach((local:Local) => {
          if(local.verificado == true){
            this.locales.push(local)
          }else if(local.verificado == false){
            this.solicitudes.push(local)
          }
        });
      }
    })
    this.localesFiltrados = this.locales
    this.solicitudesFiltradas = this.solicitudes
  }

  filtrar(event: Event) {
    const target = event.target as HTMLInputElement
    this.localesFiltrados = this.locales.filter((local) =>
      local.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
  }

  filtrarSolicitudes(event: Event){
    const target = event.target as HTMLInputElement
    this.solicitudesFiltradas = this.solicitudes.filter((local) =>
      local.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
  }

  actualizarLocales(){
    this.locales = []
    this.localesFiltrados = []
    this.solicitudes = []
    this.solicitudesFiltradas = []
    this.localServ.getLocales().subscribe(
      response=>{
        response.forEach((local:Local) => {
          if(local.verificado == true){
            this.locales.push(local)
            this.localesFiltrados.push(local)
          }else if(local.verificado == false){
            this.solicitudes.push(local)
            this.solicitudesFiltradas.push(local)
          }
        });
        this.spinner.hide()
      }
    )

    console.log(this.localesFiltrados)
    console.log(this.solicitudesFiltradas)
  }

  eliminarLocal(id:number){
    this.spinner.show()
    this.localServ.deleteLocal(id).subscribe(
      response=>this.actualizarLocales(),
      error=>console.error("Error al eliminar un local: " + error)
    )
  }

  crearLocal(){
    this.router.navigate(['/admin/new-local'])
  }

  editarLocal(id:number){
    this.router.navigate(['/admin/update-local/' + id])
  }

  verificar(local:Local){
    local.verificado = true;
    this.spinner.show()

    console.log(JSON.stringify(local))
    this.localServ.putLocal(local.id,local).subscribe(
      response=>this.actualizarLocales(),
      error=>console.error("Error al verificar: " + error)
    )
  }
}
