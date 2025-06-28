// auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../auth/token.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();

    // Only attach token to API URLs
    if (token && req.url.startsWith(environment.apiBaseUrl)) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(cloned);
    }

    // For non-API URLs or no token, pass request as is
    return next.handle(req);
  }
}

// import { Injectable } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { TokenService } from '../auth/token.service'; // adjust path if needed

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private tokenService: TokenService) {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const token = this.tokenService.getToken();

//     console.log('📝 Raw token from TokenService:', token);
//     console.log('🚀 Request URL:', req.url);
//     console.log('🚀 Request Headers BEFORE:', req.headers.keys());
//     console.log('🌍 Is SSR:', typeof window === 'undefined');
//     console.log('📝 Raw token:', this.tokenService.getToken());

//     if (token) {
//       const cloned = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('✅ Authorization header added');
//       console.log(
//         '🚀 Request Headers AFTER:',
//         cloned.headers.get('Authorization')
//       );

//       return next.handle(cloned);
//     } else {
//       console.warn(
//         '❌ No token found. Sending request without Authorization header.'
//       );
//       return next.handle(req);
//     }
//   }
// }
