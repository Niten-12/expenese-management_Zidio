//finance.Service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FinanceSubmission } from '../../models/finance-submission.model'; // ✅ Added
import { FinanceRow } from '../../models/finance-row.model'; // ✅ Added

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private apiUrl = `${environment.apiBaseUrl}/finance`;

  constructor(private http: HttpClient) {}

  // 🧾 Old Finance Methods
  getExpensesToProcess(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses/to-process`).pipe(
      catchError((err) => {
        console.error('❌ Failed to fetch finance expenses:', err);
        return throwError(() => err);
      })
    );
  }

  processExpense(expenseId: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/expenses/${expenseId}/process`, {})
      .pipe(
        catchError((err) => {
          console.error(`❌ Failed to process expense ${expenseId}:`, err);
          return throwError(() => err);
        })
      );
  }

  generateReport(type: 'PDF' | 'Excel'): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/reports/export`, {
        params: { type },
        responseType: 'blob',
      })
      .pipe(
        catchError((err) => {
          console.error(`❌ Failed to generate ${type} report:`, err);
          return throwError(() => err);
        })
      );
  }

  // 🔄 Finance Review Flow

  // ✅ GET all pending submissions for finance review
  getPendingSubmissions(): Observable<FinanceSubmission[]> {
    return this.http.get<FinanceSubmission[]>(
      `${this.apiUrl}/pending-submissions`
    );
  }

  // ✅ GET all rows under a specific submission
  getRowsBySubmissionId(submissionId: number): Observable<FinanceRow[]> {
    return this.http.get<FinanceRow[]>(
      `${this.apiUrl}/submission/${submissionId}/rows`
    );
  }

  // ✅ PATCH Approve a row
  approveRow(rowId: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/row/${rowId}/status?status=APPROVED`,
      {}
    );
  }

  // ✅ PATCH Reject a row
  rejectRow(rowId: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/row/${rowId}/status?status=REJECTED_FINANCE`,
      {}
    );
  }
  getPendingRows(): Observable<FinanceRow[]> {
    return this.http.get<FinanceRow[]>(`${this.apiUrl}/review/pending`).pipe(
      catchError((err) => {
        console.error('❌ Failed to fetch pending rows:', err);
        return throwError(() => err);
      })
    );
  }
}
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, catchError, throwError } from 'rxjs';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class FinanceService {
//   private apiUrl = `${environment.apiBaseUrl}/finance`;

//   constructor(private http: HttpClient) {}

//   getExpensesToProcess(): Observable<any> {
//     return this.http.get(`${this.apiUrl}/expenses/to-process`).pipe(
//       catchError((err) => {
//         console.error('❌ Failed to fetch finance expenses:', err);
//         return throwError(() => err);
//       })
//     );
//   }

//   processExpense(expenseId: number): Observable<any> {
//     return this.http
//       .post(`${this.apiUrl}/expenses/${expenseId}/process`, {})
//       .pipe(
//         catchError((err) => {
//           console.error(`❌ Failed to process expense ${expenseId}:`, err);
//           return throwError(() => err);
//         })
//       );
//   }

//   generateReport(type: 'PDF' | 'Excel'): Observable<Blob> {
//     return this.http
//       .get(`${this.apiUrl}/reports/export`, {
//         params: { type },
//         responseType: 'blob',
//       })
//       .pipe(
//         catchError((err) => {
//           console.error(`❌ Failed to generate ${type} report:`, err);
//           return throwError(() => err);
//         })
//       );
//   }
//   // 🔹 NEW Feature: Get pending expense rows (for approval)
//   getPendingRows(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.apiUrl}/review/pending`).pipe(
//       catchError((err) => {
//         console.error('❌ Failed to fetch pending review rows:', err);
//         return throwError(() => err);
//       })
//     );
//   }

//   // 🔹 NEW Feature: Approve a row
//   approveRow(rowId: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/review/approve/${rowId}`, {}).pipe(
//       catchError((err) => {
//         console.error(`❌ Failed to approve row ${rowId}:`, err);
//         return throwError(() => err);
//       })
//     );
//   }

//   // 🔹 NEW Feature: Reject a row
//   rejectRow(rowId: string): Observable<any> {
//     return this.http.put(`${this.apiUrl}/review/reject/${rowId}`, {}).pipe(
//       catchError((err) => {
//         console.error(`❌ Failed to reject row ${rowId}:`, err);
//         return throwError(() => err);
//       })
//     );
//   }
//   getPendingSubmissions(): Observable<FinanceSubmission[]> {
//   return this.http.get<FinanceSubmission[]>(`${this.apiUrl}/pending-submissions`);
//   }
//   getRowsBySubmissionId(submissionId: number): Observable<FinanceRow[]> {
//   return this.http.get<FinanceRow[]>(`${this.apiUrl}/submission/${submissionId}/rows`);
// }

// approveRow(rowId: number): Observable<any> {
//   return this.http.patch(`${this.apiUrl}/row/${rowId}/status?status=APPROVED`, {});
// }

// rejectRow(rowId: number): Observable<any> {
//   return this.http.patch(`${this.apiUrl}/row/${rowId}/status?status=REJECTED_FINANCE`, {});
// }
// }
