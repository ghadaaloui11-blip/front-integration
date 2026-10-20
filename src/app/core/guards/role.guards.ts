import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const associationGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getRole() === 'association') {
    return true;
  }
  router.navigate(['/campagnes']);
  return false;
};

export const citoyenGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();

  if (!auth.getToken()) {
    return router.createUrlTree(['/login']);
  }

  if (role === 'citoyen') {
    return true;
  }

  if (role === 'association') {
    return router.createUrlTree(['/association-reports']);
  }

  // Admin
  return router.createUrlTree(['/campagnes']);
};

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getToken()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.getRole() === 'admin') {
    return true;
  }
  router.navigate(['/campagnes']);
  return false;
};