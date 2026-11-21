import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

// Only lets the user open the page when logged in
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  // Not logged in: go to Login, and remember where the user wanted to go
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};