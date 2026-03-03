import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const notLoggedGuard: CanActivateFn = (route, state) => {
  if (!inject(AuthService).isLoged()) {
    return true
  }else{
    return inject(Router).createUrlTree(['/'])
  }
};
