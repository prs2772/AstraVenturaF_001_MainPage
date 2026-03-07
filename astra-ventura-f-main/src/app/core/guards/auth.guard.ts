import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (_, state: RouterStateSnapshot) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn) return true;

    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
    return false;
};
