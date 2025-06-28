//user.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserCreateRequest } from '../../models/user-create-request.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/user`; // For general user-related calls

  constructor(private http: HttpClient) {}

  /**
   * Fetch currently authenticated user details
   */
  getCurrentUser(): Observable<{ username: string }> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/me`).pipe(
      catchError((err) => {
        console.error('❌ Failed to fetch current user:', err);
        return throwError(() => err);
      })
    );
  }

  // Remove createUser / deleteUser → those are handled in AdminUserManagementService now
}

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   private apiUrl = `${environment.apiBaseUrl}/admin`; // ✅ append /admin here

//   constructor(private http: HttpClient) {}
//   getCurrentUser() {
//     return this.http.get<{ username: string }>('/api/user/me');
//   }
//   createUser(
//     username: string,
//     password: string,
//     role: string
//   ): Observable<any> {
//     const body = { username, password, role };
//     return this.http.post(`${this.apiUrl}/create-user`, body).pipe(
//       catchError((err) => {
//         console.error('❌ Create user API error', err);
//         if (err.status === 403) {
//           alert('Unauthorized: You do not have permission to create a user.');
//         } else if (err.status === 0) {
//           alert('Server unreachable: Check your network connection.');
//         } else if (err.status === 409) {
//           alert('Username already exists. Please choose a different one.');
//         }
//         return throwError(() => err);
//       })
//     );
//   }

//   deleteUser(id: number): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/delete-user/${id}`);
//   }
// }
