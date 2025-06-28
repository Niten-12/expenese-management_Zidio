// src/app/pages/finance/finance-dashboard.ts
// src/app/pages/finance/finance-dashboard.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../services/api/finance.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FinanceRow } from '../../models/finance-row.model';
import { FinanceSubmission } from '../../models/finance-submission.model';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FinanceSubmissionDetailModalComponent } from './modal/finance-submission-detail-modal.component';

// ✅ Chart dependencies
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgChartsModule,
  ],
  templateUrl: './finance-dashboard.html',
  styleUrls: ['./finance-dashboard.css'],
})
export class FinanceDashboard implements OnInit {
  // 🧾 Table
  submissions$: Observable<FinanceSubmission[]>;
  displayedColumns = [
    'submissionNo',
    'managerName',
    'department',
    'totalCost',
    'status',
    'action',
  ];

  // 👤 User & State
  userInfo: { id: number; username: string; role: string } | null = null;
  pendingRows$!: Observable<FinanceRow[]>;
  totalPendingSubmissions = 0;
  totalPendingRows = 0;
  approvedToday = 0;
  rejectedToday = 0;
  processingRows = new Set<number>();

  totalApproved: any;
  totalRejected: any;
  approvalRate: any;
  monthlySpent: any;
  monthlyBudget: any;
  annualSpent: any;
  annualBudget: any;
  currentMonth: any;
  currentYear: any;

  // 📊 Chart Properties
  chartType: ChartType = 'bar';
  viewMode: 'year' | 'month' = 'year';
  chartLabels: string[] = [];
  chartData: ChartDataset[] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private financeService: FinanceService,
    private dialog: MatDialog
  ) {
    this.checkAccess();
    this.submissions$ = this.financeService.getPendingSubmissions();
  }

  ngOnInit(): void {
    this.userInfo = this.tokenService.getUserInfo();
    this.refreshPendingRows();
    this.setViewMode('year');
  }

  setViewMode(mode: 'year' | 'month') {
    this.viewMode = mode;
    this.chartType = mode === 'year' ? 'bar' : 'line';

    this.chartLabels =
      mode === 'year'
        ? Array.from({ length: 26 }, (_, i) => (2025 + i).toString())
        : [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];

    this.chartData = [
      {
        label:
          mode === 'year'
            ? 'Annual Expense'
            : `Monthly Expense (${this.currentYear})`,
        data: this.generateRandomData(mode),
        backgroundColor:
          mode === 'year' ? '#6366f1' : 'rgba(99, 102, 241, 0.3)',
        borderColor: '#6366f1',
        fill: mode === 'month',
        tension: 0.3,
      },
    ];
  }

  generateRandomData(mode: 'year' | 'month'): number[] {
    const count = mode === 'year' ? 26 : 12;
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * 1000) + 400
    );
  }

  viewRows(submissionId: number): void {
    this.dialog.open(FinanceSubmissionDetailModalComponent, {
      width: '1000px',
      maxWidth: '1000px',
      data: { submissionId },
      disableClose: false,
    });
  }

  private checkAccess(): void {
    if (!this.tokenService.hasRole('ROLE_FINANCE')) {
      this.tokenService.clearToken();
      this.router.navigate(['/unauthorized']);
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  approve(rowId: number): void {
    this.processingRows.add(rowId);
    this.financeService.approveRow(rowId).subscribe({
      next: () => {
        this.processingRows.delete(rowId);
        this.refreshPendingRows();
      },
      error: () => this.processingRows.delete(rowId),
    });
  }

  reject(rowId: number): void {
    this.processingRows.add(rowId);
    this.financeService.rejectRow(rowId).subscribe({
      next: () => {
        this.processingRows.delete(rowId);
        this.refreshPendingRows();
      },
      error: () => this.processingRows.delete(rowId),
    });
  }

  private refreshPendingRows(): void {
    this.pendingRows$ = this.financeService.getPendingRows();
    this.pendingRows$.subscribe((rows) => {
      this.totalPendingRows = rows.length;
      this.approvedToday = 2;
      this.rejectedToday = 1;
    });
  }

  goToReview(): void {
    this.router.navigate(['/finance/review']);
  }

  generate(type: 'PDF' | 'Excel'): void {
    this.financeService.generateReport(type).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-report.${type.toLowerCase()}`;
      a.click();
    });
  }
}

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { TokenService } from '../../services/auth/token.service';
// import { CommonModule } from '@angular/common';
// import { FinanceService } from '../../services/api/finance.service';
// import { Observable } from 'rxjs';
// import { MatButtonModule } from '@angular/material/button';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { FinanceRow } from '../../models/finance-row.model';
// import { FinanceSubmission } from '../../models/finance-submission.model';
// import { MatTableModule } from '@angular/material/table';
// import { MatDialog } from '@angular/material/dialog';
// import { FinanceSubmissionDetailModalComponent } from './modal/finance-submission-detail-modal.component';
// import { ChartType, ChartOptions, ChartDataset } from 'chart.js';

// chartType: ChartType = 'bar';
// chartOptions: ChartOptions = {
//   responsive: true,
//   plugins: {
//     legend: { display: true }
//   }
// };
// chartLabels: string[] = [];
// chartData: ChartDataset[] = [];

// import { NgChartsModule } from 'ng2-charts';

// @Component({
//   selector: 'app-finance-dashboard',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatButtonModule,
//     MatProgressSpinnerModule,
//     MatTableModule,
//     NgChartsModule,
//   ],
//   templateUrl: './finance-dashboard.html',
//   styleUrls: ['./finance-dashboard.css'],
// })
// export class FinanceDashboard implements OnInit {
//   submissions$: Observable<FinanceSubmission[]>;
//   displayedColumns: string[] = [
//     'submissionNo',
//     'managerName',
//     'department',
//     'totalCost',
//     'status',
//     'action',
//   ];

//   userInfo: { id: number; username: string; role: string } | null = null;
//   pendingRows$!: Observable<FinanceRow[]>;

//   totalPendingSubmissions: number = 0;
//   totalPendingRows: number = 0;
//   approvedToday: number = 0;
//   rejectedToday: number = 0;

//   processingRows: Set<number> = new Set();
//   totalApproved: any;
//   totalRejected: any;
//   approvalRate: any;
//   monthlySpent: any;
//   monthlyBudget: any;
//   annualSpent: any;
//   annualBudget: any;
//   currentMonth: any;
//   currentYear: any;
//   chartLabels: any;
//   chartData: any;

//   constructor(
//     private tokenService: TokenService,
//     private router: Router,
//     private financeService: FinanceService,
//     private dialog: MatDialog
//   ) {
//     this.userInfo = this.tokenService.getUserInfo();
//     this.checkAccess();
//     this.submissions$ = this.financeService.getPendingSubmissions();
//   }

//   ngOnInit(): void {
//     this.refreshPendingRows();
//   }

//   // viewRows(submissionId: number) {
//   //   this.router.navigate(['/finance/submission', submissionId, 'rows']);
//   // }
//   viewRows(submissionId: number): void {
//     this.dialog.open(FinanceSubmissionDetailModalComponent, {
//       width: '1000px',
//       maxWidth: '1000px',
//       data: { submissionId },
//       disableClose: false,
//     });
//   }
//   private checkAccess(): void {
//     if (!this.tokenService.hasRole('ROLE_FINANCE')) {
//       this.tokenService.clearToken();
//       this.router.navigate(['/unauthorized']);
//     }
//   }

//   logout(): void {
//     this.tokenService.clearToken();
//     this.router.navigate(['/login']);
//   }

//   approve(rowId: number): void {
//     this.processingRows.add(rowId);
//     this.financeService.approveRow(rowId).subscribe({
//       next: () => {
//         this.processingRows.delete(rowId);
//         this.refreshPendingRows();
//       },
//       error: () => {
//         this.processingRows.delete(rowId);
//       },
//     });
//   }

//   reject(rowId: number): void {
//     this.processingRows.add(rowId);
//     this.financeService.rejectRow(rowId).subscribe({
//       next: () => {
//         this.processingRows.delete(rowId);
//         this.refreshPendingRows();
//       },
//       error: () => {
//         this.processingRows.delete(rowId);
//       },
//     });
//   }

//   private refreshPendingRows(): void {
//     this.pendingRows$ = this.financeService.getPendingRows();
//     this.pendingRows$.subscribe((rows) => {
//       this.totalPendingRows = rows.length;
//       this.approvedToday = 2;
//       this.rejectedToday = 1;
//     });
//   }

//   goToReview(): void {
//     this.router.navigate(['/finance/review']);
//   }

//   generate(type: 'PDF' | 'Excel'): void {
//     this.financeService.generateReport(type).subscribe((blob) => {
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `finance-report.${type.toLowerCase()}`;
//       a.click();
//     });
//   }
//   chartType: ChartType = 'bar';
//   viewMode: 'year' | 'month' = 'year';

//   setViewMode(mode: 'year' | 'month') {
//     this.viewMode = mode;
//     this.chartType = mode === 'year' ? 'bar' : 'line';
//     this.chartLabels =
//       mode === 'year'
//         ? Array.from({ length: 26 }, (_, i) => (2025 + i).toString())
//         : [
//             'Jan',
//             'Feb',
//             'Mar',
//             'Apr',
//             'May',
//             'Jun',
//             'Jul',
//             'Aug',
//             'Sep',
//             'Oct',
//             'Nov',
//             'Dec',
//           ];
//     this.chartData = [
//       {
//         label:
//           mode === 'year'
//             ? 'Annual Expense'
//             : `Monthly Expense (${this.currentYear})`,
//         data: this.generateRandomData(mode),
//         backgroundColor:
//           mode === 'year' ? '#6366f1' : 'rgba(99, 102, 241, 0.3)',
//         borderColor: '#6366f1',
//         fill: mode === 'month',
//         tension: 0.3,
//       },
//     ];
//   }

//   generateRandomData(mode: 'year' | 'month'): number[] {
//     const count = mode === 'year' ? 26 : 12;
//     return Array.from(
//       { length: count },
//       () => Math.floor(Math.random() * 1000) + 400
//     );
//   }
// }
