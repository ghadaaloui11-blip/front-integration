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

  if (auth.getRole() !== 'association') {
    return true;
  }
  router.navigate(['/association-reports']);
  return false;
};