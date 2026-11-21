import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Runs for every HTTP request the app makes
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage['token'];

  // The login request carries Basic Auth instead, so leave it alone
  const isLogin = req.headers.has('Authorization');

  // 1. Add the token to the request
  if (token && !isLogin) {
    req = req.clone({ setHeaders: { 'x-access-token': token } });
  }

  // 2. Send it, and watch the answer
  return next(req).pipe(
    catchError((error) => {
      // 401 with a token = token expired or logged out: clear it, go to login
      if (error.status === 401 && token && !isLogin) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        router.navigate(['/login'], { queryParams: { expired: true } });
      }
      return throwError(() => error);
    })
  );
};