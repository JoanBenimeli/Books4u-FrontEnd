import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { GenerosService } from '../services/generos.service';
import { Genero } from '../interfaces/genero';

export const generoVerifResolver: ResolveFn<Genero[]> = (route, state) => {
  return inject(GenerosService).getGenerosVerif();
};
