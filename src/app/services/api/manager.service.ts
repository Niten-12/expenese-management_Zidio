import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl = `${environment.apiBaseUrl}/manager`;

  constructor(private http: HttpClient) {}

  // ✅ NEW: Submit manager expense form
  submitManagerExpense(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-expense`, formData).pipe(
      catchError((err) => {
        console.error('❌ Expense submission failed:', err);
        return throwError(() => err);
      })
    );
  }

  getPendingExpenses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses/pending`).pipe(
      catchError((err) => {
        console.error('❌ Failed to fetch pending expenses:', err);
        return throwError(() => err);
      })
    );
  }

  approveExpense(expenseId: number, note?: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/expenses/${expenseId}/approve`, { note })
      .pipe(
        catchError((err) => {
          console.error(`❌ Failed to approve expense ${expenseId}:`, err);
          return throwError(() => err);
        })
      );
  }

  rejectExpense(expenseId: number, reason: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/expenses/${expenseId}/reject`, { reason })
      .pipe(
        catchError((err) => {
          console.error(`❌ Failed to reject expense ${expenseId}:`, err);
          return throwError(() => err);
        })
      );
  }

  bulkApprove(expenseIds: number[]): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/expenses/bulk-approve`, { expenseIds })
      .pipe(
        catchError((err) => {
          console.error('❌ Bulk approval failed:', err);
          return throwError(() => err);
        })
      );
  }

  bulkReject(expenseIds: number[], reason: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/expenses/bulk-reject`, { expenseIds, reason })
      .pipe(
        catchError((err) => {
          console.error('❌ Bulk rejection failed:', err);
          return throwError(() => err);
        })
      );
  }
  // 🔁 GET Submission History
  getSubmissionHistory(managerId: number): Observable<any[]> {
    const url = `${this.apiUrl}/history/${managerId}`; // ✅ Clean & consistent
    return this.http.get<any[]>(url).pipe(
      catchError((err) => {
        console.error(
          `❌ Failed to fetch submission history for manager ${managerId}:`,
          err
        );
        return throwError(() => err);
      })
    );
  }
  getExpenseRowsBySubmissionNo(submissionNo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rows/${submissionNo}`);
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class ManagerService {
//   private apiUrl = `${environment.apiBaseUrl}/manager`;

//   constructor(private http: HttpClient) {}

//   getPendingExpenses(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/expenses/pending`).pipe(
//       catchError((err) => {
//         console.error('❌ Failed to fetch pending expenses:', err);
//         return throwError(() => err);
//       })
//     );
//   }

//   approveExpense(expenseId: number, note?: string): Observable<any> {
//     return this.http
//       .post(`${this.apiUrl}/expenses/${expenseId}/approve`, { note })
//       .pipe(
//         catchError((err) => {
//           console.error(`❌ Failed to approve expense ${expenseId}:`, err);
//           return throwError(() => err);
//         })
//       );
//   }

//   rejectExpense(expenseId: number, reason: string): Observable<any> {
//     return this.http
//       .post(`${this.apiUrl}/expenses/${expenseId}/reject`, { reason })
//       .pipe(
//         catchError((err) => {
//           console.error(`❌ Failed to reject expense ${expenseId}:`, err);
//           return throwError(() => err);
//         })
//       );
//   }

//   bulkApprove(expenseIds: number[]): Observable<any> {
//     return this.http
//       .post(`${this.apiUrl}/expenses/bulk-approve`, { expenseIds })
//       .pipe(
//         catchError((err) => {
//           console.error('❌ Bulk approval failed:', err);
//           return throwError(() => err);
//         })
//       );
//   }

//   bulkReject(expenseIds: number[], reason: string): Observable<any> {
//     return this.http
//       .post(`${this.apiUrl}/expenses/bulk-reject`, { expenseIds, reason })
//       .pipe(
//         catchError((err) => {
//           console.error('❌ Bulk rejection failed:', err);
//           return throwError(() => err);
//         })
//       );
//   }
// }
