//token.services.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_INFO_KEY = 'userInfo';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  storeUserInfo(userInfo: {
    id: number;
    username: string;
    role: string;
  }): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
      console.log('✅ User info stored successfully');
    }
  }

  getUserInfo(): { id: number; username: string; role: string } | null {
    if (this.isBrowser()) {
      const data = localStorage.getItem(this.USER_INFO_KEY);
      if (data) {
        return JSON.parse(data);
      }
    }
    return null;
  }

  clearUserInfo(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.USER_INFO_KEY);
      console.log('ℹ️ User info cleared from storage');
    }
  }

  storeToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, token);
      console.log('✅ Token stored successfully');
    }
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (!token) {
        console.warn('❌ No token in localStorage');
      }
      return token;
    }
    return null;
  }

  // Enhance logout to clear both token + user info
  clearToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY); // 💡 clear user info too
      console.log('ℹ️ Token and user info cleared from storage');
    }
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    try {
      const payload: any = jwtDecode(token);
      return payload.roles || [];
    } catch (err) {
      console.error('❌ Failed to decode roles:', err);
      return []; // Don't clear token, just return empty
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || null;
    } catch (err) {
      console.error('❌ Failed to parse token for username:', err);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return true;
      return Date.now() >= payload.exp * 1000;
    } catch (err) {
      console.error('❌ Failed to parse token for expiry:', err);
      return true;
    }
  }

  isLoggedIn(): boolean {
    const valid = !!this.getToken() && !this.isTokenExpired();
    console.log(`🔐 isLoggedIn: ${valid}`);
    return valid;
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}

// import { Injectable } from '@angular/core';
// import { jwtDecode } from 'jwt-decode';

// @Injectable({
//   providedIn: 'root',
// })
// export class TokenService {
//   private readonly TOKEN_KEY = 'authToken';

//   private isBrowser(): boolean {
//     return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
//   }

//   storeToken(token: string): void {
//     if (this.isBrowser()) {
//       localStorage.setItem(this.TOKEN_KEY, token);
//       console.log('✅ Token stored successfully');
//     }
//   }

//   getToken(): string | null {
//     if (this.isBrowser()) {
//       const token = localStorage.getItem(this.TOKEN_KEY);
//       if (!token) {
//         console.warn('❌ No token in localStorage');
//       }
//       return token;
//     }
//     return null;
//   }

//   clearToken(): void {
//     if (this.isBrowser()) {
//       localStorage.removeItem(this.TOKEN_KEY);
//       console.log('ℹ️ Token cleared from storage');
//     }
//   }

//   getRoles(): string[] {
//     const token = this.getToken();
//     if (!token) return [];
//     try {
//       const payload: any = jwtDecode(token);
//       return payload.roles || [];
//     } catch (err) {
//       console.error('❌ Invalid token format:', err);
//       this.clearToken();
//       return [];
//     }
//   }

//   getUsername(): string | null {
//     const token = this.getToken();
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       return payload.sub || null; // ✅ yahi se username milega
//     } catch (err) {
//       console.error('❌ Failed to parse token for username:', err);
//       return null;
//     }
//   }

//   isTokenExpired(): boolean {
//     const token = this.getToken();
//     if (!token) return true;
//     try {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       if (!payload.exp) return true;
//       return Date.now() >= payload.exp * 1000;
//     } catch (err) {
//       console.error('❌ Failed to parse token for expiry:', err);
//       return true;
//     }
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken() && !this.isTokenExpired();
//   }

//   hasRole(role: string): boolean {
//     return this.getRoles().includes(role);
//   }
// }
