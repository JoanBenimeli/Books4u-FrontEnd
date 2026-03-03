import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isAdmin()) {
    return true
  }else{
    return inject(Router).createUrlTree(['/'])
  }
};
