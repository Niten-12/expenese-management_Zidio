//seriveces//guard//manager.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root',
})
export class ManagerGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (
      this.tokenService.isLoggedIn() &&
      this.tokenService.hasRole('ROLE_MANAGER')
    ) {
      return true;
    }
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
    return false;
  }
}
