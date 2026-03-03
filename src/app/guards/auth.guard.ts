import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  if (inject(AuthService).isLoged()) {
    return true
  }else{
    sessionStorage.clear()
    return inject(Router).createUrlTree(['/login'])
  }
};