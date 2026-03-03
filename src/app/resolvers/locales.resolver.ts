import { ResolveFn } from '@angular/router';
import { Local } from '../interfaces/local';
import { inject } from '@angular/core';
import { LocalesService } from '../services/locales.service';

export const localesResolver: ResolveFn<Local[]> = (route, state) => {
  return inject(LocalesService).getLocales();
};
