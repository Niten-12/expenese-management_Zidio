//seriveces//guard//employee.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean {
    if (
      this.tokenService.isLoggedIn() &&
      this.tokenService.hasRole('ROLE_EMPLOYEE')
    ) {
      return true;
    }
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
    return false;
  }
}
