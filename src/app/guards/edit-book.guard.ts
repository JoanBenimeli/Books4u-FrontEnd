import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const editBookGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).getUser()){
    //console.log("entra")
    //console.log(inject(AuthService).getUser().libros)
    if (inject(AuthService).getUser().libros.some((libro) => libro.id.toString() === route.params['id']) || inject(AuthService).getUser().rol == 2) {
      return true;
    } else {
      return inject(Router).createUrlTree(['/login'])
    }
  }else{
    return inject(Router).createUrlTree(['/login'])
  }
};
