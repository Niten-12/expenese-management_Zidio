// admin-dashboard.ts
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { CommonModule } from '@angular/common';
import { CreateUserComponent } from './create-user.component';
import { ApprovalService } from '../../services/api/approval.service';
import { Observable } from 'rxjs';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  PieController,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, CreateUserComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements AfterViewInit {
  @ViewChild('expenseChart') expenseChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

  adminName = 'Niten Swain';
  employeeCount = 50;
  managerCount = 5;

  auditLogs = [
    'User Alice created a new user account.',
    'Manager Bob approved expense ID 1023.',
    'Admin assigned Manager role to Charlie.',
  ];
  totalExpense = 0;
  userInfo: { id: number; username: string; role: string } | null = null;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private approvalService: ApprovalService
  ) {
    this.checkAccess();

    // 💡 Safely assign after DI ready
    this.userInfo = this.tokenService.getUserInfo();
    console.log('👉 Admin User Info:', this.userInfo);

    // Optionally replace static adminName
    if (this.userInfo?.username) {
      this.adminName = this.userInfo.username;
    } else {
      this.adminName = 'Admin';
    }
  }

  private checkAccess(): void {
    if (!this.tokenService.isLoggedIn()) {
      console.warn('❌ Not logged in or token expired');
      this.tokenService.clearToken();
      this.router.navigate(['/login']);
      return;
    }

    if (!this.tokenService.hasRole('ROLE_ADMIN')) {
      console.warn('❌ Access denied: missing ROLE_ADMIN');
      this.tokenService.clearToken();
      this.router.navigate(['/unauthorized']);
    }
  }

  ngAfterViewInit(): void {
    const expenseData = [500, 700, 400, 650, 800, 550];
    this.totalExpense = expenseData.reduce((acc, val) => acc + val, 0);
    this.cdr.detectChanges();

    requestAnimationFrame(() => {
      new Chart(this.expenseChartRef.nativeElement.getContext('2d')!, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Monthly Expenses',
              data: expenseData,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
        },
      });

      new Chart(this.categoryChartRef.nativeElement.getContext('2d')!, {
        type: 'pie',
        data: {
          labels: ['Food', 'Transport', 'Utilities', 'Entertainment'],
          datasets: [
            {
              data: [300, 150, 200, 100],
              backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
        },
      });
    });
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }
  pendingRows$!: Observable<any[]>;
  processingRows: Set<string> = new Set();

  approve(rowId: string): void {
    this.processingRows.add(rowId);
    this.approvalService.approveRow(rowId).subscribe(() => {
      this.processingRows.delete(rowId);
      this.pendingRows$ = this.approvalService.getPendingRows();
    });
  }

  reject(rowId: string): void {
    this.processingRows.add(rowId);
    this.approvalService.rejectRow(rowId).subscribe(() => {
      this.processingRows.delete(rowId);
      this.pendingRows$ = this.approvalService.getPendingRows();
    });
  }
}

// import {
//   Component,
//   AfterViewInit,
//   ViewChild,
//   ElementRef,
//   ChangeDetectorRef,
// } from '@angular/core';
// import { Router } from '@angular/router';
// import { TokenService } from '../../services/auth/token.service';
// import {
//   Chart,
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   CategoryScale,
//   PieController,
//   ArcElement,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';
// import { CommonModule } from '@angular/common';
// import { CreateUserComponent } from '../admin/create-user.component';

// // Register Chart.js components
// Chart.register(
//   LineController,
//   LineElement,
//   PointElement,
//   LinearScale,
//   Title,
//   CategoryScale,
//   PieController,
//   ArcElement,
//   Tooltip,
//   Legend,
//   Filler
// );

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, CreateUserComponent],
//   templateUrl: './admin-dashboard.html',
//   styleUrls: ['./admin-dashboard.css'],
// })
// export class AdminDashboard implements AfterViewInit {
//   @ViewChild('expenseChart') expenseChartRef!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('categoryChart') categoryChartRef!: ElementRef<HTMLCanvasElement>;

//   adminName = 'Niten Swain';
//   employeeCount = 50;
//   managerCount = 5;

//   auditLogs = [
//     'User Alice created a new user account.',
//     'Manager Bob approved expense ID 1023.',
//     'Admin assigned Manager role to Charlie.',
//   ];

//   totalExpense = 0;

//   constructor(
//     private tokenService: TokenService,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {
//     this.checkAccess();
//   }

//   private checkAccess(): void {
//     if (!this.tokenService.hasRole('ROLE_ADMIN')) {
//       this.tokenService.clearToken();
//       this.router.navigate(['/unauthorized']);
//     }
//   }

//   ngAfterViewInit(): void {
//     const expenseData = [500, 700, 400, 650, 800, 550];
//     this.totalExpense = expenseData.reduce((acc, val) => acc + val, 0);

//     this.cdr.detectChanges();

//     requestAnimationFrame(() => {
//       // Line chart
//       new Chart(this.expenseChartRef.nativeElement.getContext('2d')!, {
//         type: 'line',
//         data: {
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//           datasets: [
//             {
//               label: 'Monthly Expenses',
//               data: expenseData,
//               borderColor: '#3b82f6',
//               backgroundColor: 'rgba(59, 130, 246, 0.2)',
//               fill: true,
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: { display: true },
//             tooltip: { enabled: true },
//           },
//         },
//       });

//       // Pie chart
//       new Chart(this.categoryChartRef.nativeElement.getContext('2d')!, {
//         type: 'pie',
//         data: {
//           labels: ['Food', 'Transport', 'Utilities', 'Entertainment'],
//           datasets: [
//             {
//               data: [300, 150, 200, 100],
//               backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24'],
//             },
//           ],
//         },
//         options: {
//           responsive: true,
//           plugins: {
//             legend: { display: true },
//             tooltip: { enabled: true },
//           },
//         },
//       });
//     });
//   }

//   logout(): void {
//     this.tokenService.clearToken();
//     this.router.navigate(['/login']);
//   }
// }
