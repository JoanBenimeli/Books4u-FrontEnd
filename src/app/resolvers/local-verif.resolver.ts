import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LocalesService } from '../services/locales.service';
import { Local } from '../interfaces/local';

export const localVerifResolver: ResolveFn<Local[]> = (route, state) => {
  return inject(LocalesService).getLocalVerif();
};
