import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const editUserGuard: CanActivateFn = (route, state) => {
  if(inject(AuthService).getUser()){
    const idLog = inject(AuthService).getUser().id
    const userIdParam = route.params['id'];
    if (idLog.toString() ===  userIdParam || inject(AuthService).getUser().rol == 2) {
      return true
    }else{
      return inject(Router).createUrlTree(['/login'])
    }
  }else{
    return inject(Router).createUrlTree(['/login'])
  }
};
