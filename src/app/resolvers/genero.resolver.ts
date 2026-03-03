import { ResolveFn } from '@angular/router';
import { Genero } from '../interfaces/genero';
import { GenerosService } from '../services/generos.service';
import { inject } from '@angular/core';

export const generoResolver: ResolveFn<Genero[]> = (route, state) => {
  return inject(GenerosService).getGeneros();
};
