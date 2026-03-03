import { Component } from '@angular/core';
import { Autor } from '../../interfaces/autor';
import { ActivatedRoute } from '@angular/router';
import { AutoresService } from '../../services/autores.service';
import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-autores-table',
  standalone: true,
  imports: [NgxSpinnerModule, MatSlideToggleModule, ReactiveFormsModule, CommonModule],
  templateUrl: './autores-table.component.html',
  styleUrl: './autores-table.component.scss'
})
export class AutoresTableComponent {
  autores!: Autor[]
  autoresFiltrados!: Autor[]

  constructor(private route: ActivatedRoute, private autoresServ: AutoresService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.route.data.subscribe(({ autores }) => this.autores = autores)
    this.autoresFiltrados = this.autores
  }

  autor = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    isVerificado: new FormControl(true)
  })

  autorEdit = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    isVerificado: new FormControl(true)
  })


  eliminarAutor(id: number) {
    this.spinner.show()
    this.autoresServ.deleteAutores(id).subscribe(
      response => this.actualizarAutores(),
      error => console.error('Error al eliminar un autor: ' + error)
    )
  }

  actualizarAutores() {
    this.autoresServ.getAutores().subscribe(
      response => {
        this.autores = response
        this.autoresFiltrados = response
        this.spinner.hide()
      },
      error => console.error("Error al actualizar los autores: " + error)
    )
  }

  filtrar(event: Event) {
    const target = event.target as HTMLInputElement
    this.autoresFiltrados = this.autores.filter((autores) =>
      autores.nombre.toLowerCase().includes(target.value.toLowerCase())
    );
  }

  addAutor() {
    this.spinner.show()
    this.autoresServ.postAutor(this.autor.value).subscribe(
      response => {
        let input = document.getElementById('nameAutor') as HTMLInputElement
        input.value = ""
        this.actualizarAutores()
      },
      error => console.error("Error al añadir un autor: " + error)
    )
  }

  mostrarAutorEdit(autor: Autor) {
    this.autorEdit.patchValue({
      id: autor.id.toString(),
      nombre: autor.nombre,
      isVerificado: autor.isVerificado
    });
  }

  editarAutor() {
    this.spinner.show()
    const idControl = this.autorEdit.get('id')

    if (idControl && idControl.value) {
      const id = parseInt(idControl.value)
      this.autoresServ.putAutor(id, this.autorEdit.value).subscribe(
        response => {
          this.actualizarAutores()
        },
        error => console.error('Error al modificar un autor: ' + error)
      )
    } else {
      console.error('El ID del autor no puede ser nulo')
      this.spinner.hide()
    }
  }
}
