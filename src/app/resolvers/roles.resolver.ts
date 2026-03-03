import { ResolveFn } from '@angular/router';
import { Rol } from '../interfaces/rol';
import { RolService } from '../services/rol.service';
import { inject } from '@angular/core';

export const rolesResolver: ResolveFn<Rol[]> = (route, state) => {
  return inject(RolService).getRoles();
};
