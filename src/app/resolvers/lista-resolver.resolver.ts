import { ResolveFn } from '@angular/router';
import { Lista } from '../interfaces/lista';
import { inject } from '@angular/core';
import { ListasService } from '../services/listas.service';
import { UserLogedService } from '../services/user-loged.service';
import { AuthService } from '../services/auth.service';

export const listaResolverResolver: ResolveFn<Lista> = (route, state) => {
  return inject(ListasService).getIdLista(inject(AuthService).getUser().id);
};
