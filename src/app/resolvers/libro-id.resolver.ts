import { ResolveFn } from '@angular/router';
import { LibrosService } from '../services/libros.service';
import { inject } from '@angular/core';
import { Libro } from '../interfaces/libro';

export const libroIdResolver: ResolveFn<Libro> = (route, state) => {
  return inject(LibrosService).getLibroId(route.paramMap.get('id')!);
};
