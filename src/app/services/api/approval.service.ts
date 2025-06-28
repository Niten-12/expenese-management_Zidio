import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApprovalService {
  private apiUrl = `${environment.apiBaseUrl}/admin/review`;

  constructor(private http: HttpClient) {}

  // 🔍 Fetch rows eligible for final approval
  getPendingRows(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pending`).pipe(
      catchError((err) => {
        console.error('❌ Failed to fetch pending rows for Admin:', err);
        return throwError(() => err);
      })
    );
  }

  // ✅ Approve specific row
  approveRow(rowId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve/${rowId}`, {}).pipe(
      catchError((err) => {
        console.error(`❌ Failed to approve row ${rowId}:`, err);
        return throwError(() => err);
      })
    );
  }

  // ❌ Reject specific row
  rejectRow(rowId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reject/${rowId}`, {}).pipe(
      catchError((err) => {
        console.error(`❌ Failed to reject row ${rowId}:`, err);
        return throwError(() => err);
      })
    );
  }
}
