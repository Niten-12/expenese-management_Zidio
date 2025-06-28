//ManagerDashboard.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseManagementModalComponent } from './expense-management-modal.component';
import { ManagerService } from '../../services/api/manager.service';
import { ViewTableModalComponent } from './view-table-modal.component';
@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-dashboard.html',
  styleUrls: ['./manager-dashboard.css'],
})
export class ManagerDashboard {
  managerName = 'Jane Smith';
  totalPending = 3;
  totalApproved = 8;
  totalRejected = 1;
  submissionCounter = 1;
  successMessage: string | null = null;

  managerHistory: any[] = [];

  teamExpenses = [
    {
      id: 'E101',
      name: 'Alice',
      department: 'Sales',
      category: 'Travel',
      amount: 1500,
    },
    {
      id: 'E102',
      name: 'Alice',
      department: 'Sales',
      category: 'Food',
      amount: 300,
    },
    {
      id: 'E201',
      name: 'Bob',
      department: 'Marketing',
      category: 'Office',
      amount: 1200,
    },
  ];

  showTeamModal = false;
  userInfo: { id: number; username: string; role: string } | null = null;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private dialog: MatDialog,
    private managerService: ManagerService // ✅ Injected here
  ) {
    this.checkAccess();
    this.userInfo = this.tokenService.getUserInfo();
    console.log('👉 User Info:', this.userInfo);
    this.fetchSubmissionHistory(); // ✅ Initiate history fetch
  }

  private checkAccess(): void {
    if (!this.tokenService.hasRole('ROLE_MANAGER')) {
      this.tokenService.clearToken();
      this.router.navigate(['/unauthorized']);
    }
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  openExpenseManagementModal(): void {
    const dialogRef = this.dialog.open(ExpenseManagementModalComponent, {
      width: '1500px',
      maxWidth: '1200px',
      disableClose: true,
      data: {
        managerId: this.userInfo?.id,
        managerName: this.userInfo?.username,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // ✅ Show toast/feedback only
        this.successMessage = `✅ Submission successful! Your Submission No.: ${result.submissionNo}`;

        // ✅ Fetch updated data instead of manually pushing mock
        this.fetchSubmissionHistory();

        // ✅ Auto-hide after 3 sec
        setTimeout(() => (this.successMessage = null), 3000);
      }
    });
  }
  fetchSubmissionHistory(): void {
    if (!this.userInfo?.id) return;

    this.managerService.getSubmissionHistory(this.userInfo.id).subscribe({
      next: (res) => {
        this.managerHistory = res;
        console.log('✅ Manager History Fetched:', res);
      },
      error: (err) => {
        console.error('❌ Failed to fetch history:', err);
      },
    });
  }
  // viewTable(hist: any): void {
  //   console.log('View table clicked for:', hist);
  //   alert(
  //     `🔍 View table for Submission No: ${hist.submissionNo}\n(Popup/modal coming soon!)`
  //   );
  // }
  viewTable(hist: any): void {
    this.dialog.open(ViewTableModalComponent, {
      width: '1200px',
      maxWidth: '1200px',
      data: {
        submissionNo: hist.submissionNo,
        purpose: hist.purpose,
      },
    });
  }

  openTeamModal(): void {
    this.showTeamModal = true;
  }
  closeTeamModal(): void {
    this.showTeamModal = false;
  }
  approveExpense(expenseId: string): void {
    console.log(`Approved expense ID: ${expenseId}`);
  }
  rejectExpense(expenseId: string): void {
    console.log(`Rejected expense ID: ${expenseId}`);
  }
  openExpenseManagement(): void {
    console.log('Expense Management clicked');
  }
  openFinanceModal(): void {
    console.log('Finance Summary clicked');
  }
}

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { TokenService } from '../../services/auth/token.service';
// import { CommonModule } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { ExpenseManagementModalComponent } from './expense-management-modal.component';

// @Component({
//   selector: 'app-manager-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './manager-dashboard.html',
//   styleUrls: ['./manager-dashboard.css'],
// })
// export class ManagerDashboard {
//   managerName = 'Jane Smith';

//   totalPending = 3;
//   totalApproved = 8;
//   totalRejected = 1;

//   teamExpenses = [
//     {
//       id: 'E101',
//       name: 'Alice',
//       department: 'Sales',
//       category: 'Travel',
//       amount: 1500,
//     },
//     {
//       id: 'E102',
//       name: 'Alice',
//       department: 'Sales',
//       category: 'Food',
//       amount: 300,
//     },
//     {
//       id: 'E201',
//       name: 'Bob',
//       department: 'Marketing',
//       category: 'Office',
//       amount: 1200,
//     },
//   ];

//   showTeamModal = false;
//   userInfo: { id: number; username: string; role: string } | null = null;
//   // managerName = '';
//   constructor(
//     private tokenService: TokenService,
//     private router: Router,
//     private dialog: MatDialog
//   ) {
//     this.checkAccess();
//     this.userInfo = this.tokenService.getUserInfo(); // 💡 Safe after DI ready
//     console.log('👉 User Info:', this.userInfo);
//     //   this.userInfo = this.tokenService.getUserInfo();
//     // if (this.userInfo?.username) {
//     //   this.managerName = this.userInfo.username;
//     // } else {
//     //   this.managerName = 'Manager';
//     // }
//   }

//   private checkAccess(): void {
//     if (!this.tokenService.hasRole('ROLE_MANAGER')) {
//       this.tokenService.clearToken();
//       this.router.navigate(['/unauthorized']);
//     }
//   }

//   logout(): void {
//     this.tokenService.clearToken();
//     this.router.navigate(['/login']);
//   }

//   openTeamModal(): void {
//     this.showTeamModal = true;
//   }

//   closeTeamModal(): void {
//     this.showTeamModal = false;
//   }

//   approveExpense(expenseId: string): void {
//     console.log(`Approved expense ID: ${expenseId}`);
//     // TODO: Connect to backend API
//   }

//   rejectExpense(expenseId: string): void {
//     console.log(`Rejected expense ID: ${expenseId}`);
//     // TODO: Connect to backend API
//   }

//   openExpenseManagement(): void {
//     console.log('Expense Management clicked');
//     // TODO: Implement navigation or modal
//   }

//   openFinanceModal(): void {
//     console.log('Finance Summary clicked');
//     // TODO: Implement navigation or modal
//   }

//   openExpenseManagementModal(): void {
//     const dialogRef = this.dialog.open(ExpenseManagementModalComponent, {
//       width: '1500px',
//       maxWidth: '1200px',
//       disableClose: true,
//       data: {
//         managerId: this.userInfo?.id,
//         managerName: this.userInfo?.username,
//       },
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         console.log('Modal result:', result);
//         // You can process the result (save to server, update UI, etc.)
//       }
//     });
//   }
// }
