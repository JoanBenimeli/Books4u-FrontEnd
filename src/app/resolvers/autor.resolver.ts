import { ResolveFn } from '@angular/router';
import { Autor } from '../interfaces/autor';
import { inject } from '@angular/core';
import { AutoresService } from '../services/autores.service';


export const autorResolver: ResolveFn<Autor[]> = (route, state) => {
  return inject(AutoresService).getAutores();
};
