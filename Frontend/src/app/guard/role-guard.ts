import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const expected = route.data['role'];
  if (auth.isLoggedIn() && auth.getRole() === expected) return true;
  router.navigate(['/login']);
  return false;
};
