import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      console.error('❌ API Error:', {
        url: req.url,
        status: err.status,
        message: err.message,
        error: err.error,
      });

      // Placeholder for future shared notification integration
      if (typeof window !== 'undefined') {
        if (err.status === 0) {
          window.alert('Server unreachable. Please check your connection.');
        } else if (err.status >= 500) {
          window.alert('Server error occurred. Please try again later.');
        } else if (err.status === 403) {
          window.alert('Access denied. You do not have permission.');
        } else if (err.status === 404) {
          window.alert('Requested resource not found.');
        } else {
          window.alert(err.error?.message || 'An unexpected error occurred.');
        }
      }

      return throwError(() => err);
    })
  );
};
