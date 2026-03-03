import { Component, OnInit } from '@angular/core';
import { Genero } from '../../interfaces/genero';
import { ActivatedRoute } from '@angular/router';
import { GenerosService } from '../../services/generos.service';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-generos-table',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, CommonModule, MatSlideToggleModule],
  templateUrl: './generos-table.component.html',
  styleUrl: './generos-table.component.scss'
})
export class GenerosTableComponent implements OnInit {
  generos!: Genero[]
  generosFiltrados!: Genero[]

  constructor(private route: ActivatedRoute, private generoServ: GenerosService, private spinner: NgxSpinnerService) { }

  genero = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    isVerificado: new FormControl(true)
  })

  generoEdit = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    isVerificado: new FormControl(true)
  })


  ngOnInit(): void {
    this.route.data.subscribe(({ generos }) => this.generos = generos)
    this.generosFiltrados = this.generos
  }

  eliminarGenero(id: number) {
    this.spinner.show()
    this.generoServ.deleteGenero(id).subscribe(
      response => this.actualizarGeneros(),
      error => console.error("Error al eliminar un genero: " + error)
    )
  }

  actualizarGeneros() {
    this.generoServ.getGeneros().subscribe(
      response => {
        this.generos = response
        this.generosFiltrados = response
        this.spinner.hide()
      },
      error => console.error("Error al actualizar los generos: " + error)
    )
  }

  addGenero() {
    this.spinner.show()

    const nombreControl = this.genero.get('nombre');

    if (nombreControl && nombreControl.value !== null) {
      const nombre = nombreControl.value.trim();

      if (nombre != "") {
        this.generoServ.postGenero(this.genero.value).subscribe(
          response => {
            let input = document.getElementById('namegenero') as HTMLInputElement
            input.value = ""
            this.actualizarGeneros()
          },
          error => console.error('Error al crear un género: ' + error)
        )
      } else {
        console.error("El nombre del género no puede estar vacío")
        this.spinner.hide()
      }
    } else {
      console.error("El nombre del género es nulo")
      this.spinner.hide()
    }
  }

  filtrar(event: Event) {
    const target = event.target as HTMLInputElement
    this.generosFiltrados = this.generos.filter((genero) =>
      genero.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
  }

  mostrarGenero(genero: Genero) {
    this.generoEdit.patchValue({
      id: genero.id.toString(),
      nombre: genero.nombre,
      isVerificado: genero.isVerificado
    });
  }

  editarGenero() {
    this.spinner.show()

    const idControl = this.generoEdit.get('id')
    if (idControl && idControl.value) {
      const id = parseInt(idControl.value)

      this.generoServ.putGenero(id, this.generoEdit.value).subscribe(
        response => {
          let input = document.getElementById('namegenero') as HTMLInputElement;
          input.value = ""
          this.actualizarGeneros()
        },
        error => console.error('Error al modificar un género: ' + error)
      );
    } else {
      console.error('El ID del género no puede ser nulo')
      this.spinner.hide()
    }
  }
}
