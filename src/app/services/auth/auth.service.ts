//auth.services.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/auth`; // ✅ append /auth here

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        this.tokenService.clearToken();
        console.log('ℹ️ Old token cleared');

        if (response.token) {
          this.tokenService.storeToken(response.token);
          console.log('✅ New token stored');

          // 💡 Store additional user info
          this.tokenService.storeUserInfo({
            id: response.id,
            username: response.username,
            role: response.role,
          });
          console.log('✅ User info stored');
        } else {
          console.error('❌ No token received from backend');
          alert('Login failed: No token received. Please try again.');
        }
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    console.log('ℹ️ User logged out, token cleared');
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private apiUrl = environment.apiBaseUrl; // ✅ Uses env config, not hard-coded
//   private tokenKey = 'authToken';

//   constructor(private http: HttpClient) {}

//   /**
//    * Sends login request to backend
//    */
//   login(username: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
//       tap((response: any) => {
//         if (response.token) {
//           this.storeToken(response.token);
//         }
//       })
//     );
//   }

//   /**
//    * Stores JWT token in localStorage (only in browser)
//    */
//   storeToken(token: string): void {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(this.tokenKey, token);
//     }
//   }

//   /**
//    * Gets JWT token (only in browser)
//    */
//   getToken(): string | null {
//     if (typeof window === 'undefined') {
//       return null;
//     }
//     return localStorage.getItem(this.tokenKey);
//   }

//   /**
//    * Clears token from storage (only in browser)
//    */
//   clearToken(): void {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem(this.tokenKey);
//     }
//   }

//   /**
//    * Decodes roles from JWT
//    */
//   getRoles(): string[] {
//     const token = this.getToken();
//     if (!token) return [];
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.roles || [];
//     } catch {
//       return [];
//     }
//   }

//   /**
//    * Checks if token expired
//    */
//   isTokenExpired(): boolean {
//     const token = this.getToken();
//     if (!token) return true;
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       if (!payload.exp) return true;
//       return Date.now() >= payload.exp * 1000;
//     } catch {
//       return true;
//     }
//   }

//   /**
//    * Checks if user is logged in
//    */
//   isLoggedIn(): boolean {
//     return !!this.getToken() && !this.isTokenExpired();
//   }

//   /**
//    * Role checkers
//    */
//   isAdmin(): boolean {
//     return this.getRoles().includes('ROLE_ADMIN');
//   }

//   isManager(): boolean {
//     return this.getRoles().includes('ROLE_MANAGER');
//   }

//   isFinance(): boolean {
//     return this.getRoles().includes('ROLE_FINANCE');
//   }

//   isEmployee(): boolean {
//     return this.getRoles().includes('ROLE_EMPLOYEE');
//   }
// }
