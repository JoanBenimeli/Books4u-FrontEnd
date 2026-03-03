import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AutoresService } from '../services/autores.service';
import { Autor } from '../interfaces/autor';

export const autorVerifResolver: ResolveFn<Autor[]> = (route, state) => {
  return inject(AutoresService).getAutoresVerif();
};
