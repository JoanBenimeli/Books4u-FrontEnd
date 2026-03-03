import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Genero } from '../../interfaces/genero';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibrosService } from '../../services/libros.service';
import { Autor } from '../../interfaces/autor';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';
import { Libro } from '../../interfaces/libro';

@Component({
  selector: 'app-update-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-book.component.html',
  styleUrl: './update-book.component.scss'
})
export class UpdateBookComponent {
  constructor(private route: ActivatedRoute, private librosServ: LibrosService, private router: Router, private authServ:AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(({libro}) => this.libroEdit = libro)
    this.route.data.subscribe(({ generos }) => this.generos = generos)
    this.route.data.subscribe(({ autores }) => this.autores = autores)
    this.userLog = this.authServ.getUser()

    console.log(this.libroEdit.generos)

    this.libro.patchValue({ 
      nombre: this.libroEdit.nombre,
      descripcion: this.libroEdit.descripcion,
      imagen: this.libroEdit.imagen,
      precio: this.libroEdit.precio.toString(),
      paginas: this.libroEdit.paginas.toString(),
      id_autor: this.libroEdit.id_autor.toString(),
    });

    this.getGeneros().clear()
    this.libroEdit.generos.forEach(genero => {
      if(this.generos.some((generoArray) => generoArray.id == genero.id)){
        this.getGeneros().push(new FormGroup({ id: new FormControl(genero.id, [Validators.required]) }))
      }else{
        this.libro.patchValue({newGenero: genero.nombre})
        this.getGeneros().push(new FormGroup({ id: new FormControl("otros", [Validators.required]) }))
      }
    });
  }

  generos!: Genero[]
  autores!: Autor[]
  libroEdit!:Libro
  userLog!:Usuario

  libro = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    descripcion: new FormControl(''),
    imagen: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    paginas: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    id_autor: new FormControl('', [Validators.required]),
    newAutor: new FormControl(''),
    newGenero: new FormControl(''),
    generosLibro: new FormArray<FormGroup>([new FormGroup({ id: new FormControl('', [Validators.required]) })])
  })

  get nombre() { return this.libro.get('nombre') }
  get imagen() { return this.libro.get('imagen') }
  get descripcion() { return this.libro.get('descripcion') }
  get precio() { return this.libro.get('precio') }
  get paginas() { return this.libro.get('paginas') }
  get id_autor() { return this.libro.get('id_autor') }
  getGeneros() { return this.libro.get('generosLibro') as FormArray }
  getGenero(index: number) { return this.getGeneros().at(index) }

  addGenero() {
    this.getGeneros().push(new FormGroup({ id: new FormControl('', [Validators.required]) }))
  }

  removeGenero(index: number) {
    this.getGeneros().removeAt(index);
  }


  editarLibro() {
    console.log(JSON.stringify(this.libro.value))
    this.librosServ.putLibro(this.libroEdit.id,this.libro.value).subscribe(
      response => {
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
        this.libro.get('imagen')?.setValue(reader.result as string);
      };
    }
  }

  checkAutor(event: Event) {
    const target = event.target as HTMLSelectElement;

    if (target.value !== "otros") {
      this.libro.patchValue({ newAutor: "" });
    }
  }

  checkGenero(event: Event,index:number) {
    const target = event.target as HTMLSelectElement;
    const btnAdd = document.getElementById('addGen') as HTMLInputElement

    if (target.value !== "otros") {
      this.libro.patchValue({ newGenero: "" });
      btnAdd.disabled = false
    }else{
      btnAdd.disabled = true
    }
  }
}
