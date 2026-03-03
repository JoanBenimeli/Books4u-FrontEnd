import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const favGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).getUser()) {
    return true
  }else{
    return inject(Router).createUrlTree(['/'])
  }
};
