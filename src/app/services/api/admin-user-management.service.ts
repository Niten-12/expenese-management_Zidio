import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserCreateRequest } from '../../models/user-create-request.model';

@Injectable({
  providedIn: 'root',
})
export class AdminUserManagementService {
  private apiUrl = `${environment.apiBaseUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  createUser(payload: UserCreateRequest): Observable<any> {
    return this.http.post(this.apiUrl, payload).pipe(
      catchError((err) => {
        console.error('❌ User creation failed:', err);
        return throwError(() => err);
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      catchError((err) => {
        console.error(`❌ Failed to delete user ${userId}:`, err);
        return throwError(() => err);
      })
    );
  }

  listUsers(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      catchError((err) => {
        console.error('❌ Failed to fetch user list:', err);
        return throwError(() => err);
      })
    );
  }

  updateUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/role`, { role }).pipe(
      catchError((err) => {
        console.error(`❌ Failed to update role for user ${userId}:`, err);
        return throwError(() => err);
      })
    );
  }
  getAllUsers(): Observable<{ id: number; username: string }[]> {
    return this.http.get<{ id: number; username: string }[]>(`${this.apiUrl}`);
  }
}
