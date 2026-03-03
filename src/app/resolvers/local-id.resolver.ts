import { ResolveFn } from '@angular/router';
import { Local } from '../interfaces/local';
import { inject } from '@angular/core';
import { LocalesService } from '../services/locales.service';

export const localIdResolver: ResolveFn<Local> = (route, state) => {
  return inject(LocalesService).showLocal(route.paramMap.get('id')!);
};
