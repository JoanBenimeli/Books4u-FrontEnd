import { ResolveFn } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { inject } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';

export const userIdResolver: ResolveFn<Usuario> = (route, state) => {
  return inject(UsuariosService).getIdUser(route.paramMap.get('id')!);
};