import { ResolveFn } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { inject } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';

export const usuarioResolver: ResolveFn<Usuario[]> = (route, state) => {
  return inject(UsuariosService).getUsuarios();
};
