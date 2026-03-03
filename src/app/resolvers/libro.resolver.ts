import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LibrosService } from '../services/libros.service';
import { Libro } from '../interfaces/libro';

export const libroResolver: ResolveFn<Libro[]> = (route, state) => {
  return inject(LibrosService).getLibros();
};
