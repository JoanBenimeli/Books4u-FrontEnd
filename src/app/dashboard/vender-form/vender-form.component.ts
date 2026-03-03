import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Genero } from '../../interfaces/genero';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibrosService } from '../../services/libros.service';
import { Autor } from '../../interfaces/autor';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';


@Component({
  selector: 'app-vender-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './vender-form.component.html',
  styleUrl: './vender-form.component.scss'
})
export class VenderFormComponent {
  constructor(private route: ActivatedRoute, private librosServ: LibrosService, private router: Router, private authServ:AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(({ generos }) => this.generos = generos)
    this.route.data.subscribe(({ autores }) => this.autores = autores)
    this.userLog = this.authServ.getUser()
    console.log(this.userLog)
    this.newLibro.get('id_usuario')?.setValue(this.userLog.id);
  }

  generos!: Genero[]
  autores!: Autor[]
  userLog!:Usuario

  newLibro = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    imagen: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    paginas: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    id_autor: new FormControl('', [Validators.required]),
    newAutor: new FormControl(''),
    newGenero: new FormControl(''),
    id_usuario: new FormControl(),
    generosLibro: new FormArray<FormGroup>([new FormGroup({ id: new FormControl('', [Validators.required]) })])
  })

  get nombre() { return this.newLibro.get('nombre') }
  get imagen() { return this.newLibro.get('imagen') }
  get descripcion() { return this.newLibro.get('descripcion') }
  get precio() { return this.newLibro.get('precio') }
  get paginas() { return this.newLibro.get('paginas') }
  get id_autor() { return this.newLibro.get('id_autor') }
  getGeneros() { return this.newLibro.get('generosLibro') as FormArray }
  getGenero(index: number) { return this.getGeneros().at(index) }

  addGenero() {
    this.getGeneros().push(new FormGroup({ id: new FormControl('', [Validators.required]) }))
  }

  removeGenero(index: number) {
    this.getGeneros().removeAt(index);
  }


  subirLibro() {
    console.log(JSON.stringify(this.newLibro.value))
    this.librosServ.postLibro(this.newLibro.value).subscribe(
      response => {
        const userLo = this.authServ.getUser()
        userLo.libros.push(response)
        this.authServ.setUser(userLo)
        this.router.navigate(['/lista']);
      },
      error => {
        console.error("Error al subir el libro: " + error)
      }
    )
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const reader = new FileReader();

    if (target.files && target.files.length) {
      const file = target.files[0];

      reader.readAsDataURL(file);

      reader.onload = () => {
        this.newLibro.get('imagen')?.setValue(reader.result as string);
      };
    }
  }

  checkAutor(event: Event) {
    const target = event.target as HTMLSelectElement;

    if (target.value !== "otros") {
      this.newLibro.patchValue({ newAutor: "" });
    }
  }

  checkGenero(event: Event,index:number) {
    const target = event.target as HTMLSelectElement;
    const btnAdd = document.getElementById('addGen') as HTMLInputElement

    if (target.value !== "otros") {
      this.newLibro.patchValue({ newGenero: "" });
      btnAdd.disabled = false
    }else{
      btnAdd.disabled = true
    }
  }
}
