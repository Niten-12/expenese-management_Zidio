//admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (
      this.tokenService.isLoggedIn() &&
      this.tokenService.hasRole('ROLE_ADMIN')
    ) {
      return true;
    }

    console.warn(
      '❌ Access denied: User does not have ROLE_ADMIN or not logged in'
    );

    // SSR-safe alert
    if (typeof window !== 'undefined') {
      window.alert('Access denied: You need admin role.');
    }

    this.router.navigate(['/login']);
    return false;
  }
}

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { TokenService } from '../auth/token.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AdminGuard implements CanActivate {
//   constructor(private tokenService: TokenService, private router: Router) {}

//   canActivate(): boolean {
//     if (
//       this.tokenService.isLoggedIn() &&
//       this.tokenService.hasRole('ROLE_ADMIN')
//     ) {
//       return true;
//     }
//     this.tokenService.clearToken();
//     this.router.navigate(['/login']);
//     return false;
//   }
// }
