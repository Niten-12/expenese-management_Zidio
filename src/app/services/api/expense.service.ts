//expense.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  getAllExpenses() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = `${environment.apiBaseUrl}/employee`;

  constructor(private http: HttpClient) {}

  submitExpenses(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expenses`, payload).pipe(
      catchError((err) => {
        console.error('❌ Expense submission failed', err);
        alert('Expense submission failed. Please try again.');
        return throwError(() => err);
      })
    );
  }

  getExpensesForEmployee(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses`).pipe(
      catchError((err) => {
        console.error('❌ Failed to load expenses', err);
        alert('Could not load expense history.');
        return throwError(() => err);
      })
    );
  }
}
