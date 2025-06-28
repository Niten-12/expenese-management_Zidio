import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/auth/token.service';
import { UserService } from '../../services/api/user.service';
import { ExpenseService } from '../../services/api/expense.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

interface ExpenseHistory {
  date: string;
  category: string;
  amount: string;
  status: string;
  assignedDepartment: string;
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
})
export class EmployeeDashboard implements AfterViewInit, OnDestroy {
  @ViewChild('expenseChart', { static: false })
  expenseChartRef!: ElementRef<HTMLCanvasElement>;

  employeeName: string = '';

  form = {
    employeeId: '',
    name: '',
    department: '',
  };

  expenseRows = [{ serialNo: 1, category: '', amount: '' }];
  expenses: ExpenseHistory[] = [];

  // 💡 Added: userInfo property to hold ID + username + role
  userInfo: { id: number; username: string; role: string } | null = null;

  private chartInstance: Chart | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private expenseService: ExpenseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.checkAccess();
    this.setEmployeeName();
    this.loadExpenses();
    this.userInfo = this.tokenService.getUserInfo(); // 💡 Now safe
    console.log('👉 Token:', this.tokenService.getToken());
    console.log('👉 Username from token:', this.tokenService.getUsername());
    console.log('👉 Roles from token:', this.tokenService.getRoles());
    console.log('👉 User Info:', this.userInfo); // 💡 Log for verification
  }

  private checkAccess(): void {
    if (!this.tokenService.hasRole('ROLE_EMPLOYEE')) {
      this.tokenService.clearToken();
      this.router.navigate(['/unauthorized']);
    }
  }

  private setEmployeeName(): void {
    const tokenName = this.tokenService.getUsername();
    if (tokenName) {
      this.employeeName = tokenName;
    } else {
      this.userService.getCurrentUser().subscribe({
        next: (res) => {
          this.employeeName = res.username;
        },
        error: (err) => {
          console.error('❌ Failed to load username from backend', err);
          this.employeeName = 'Employee';
        },
      });
    }
  }

  loadExpenses(): void {
    this.expenseService.getExpensesForEmployee().subscribe({
      next: (data) => {
        this.expenses = data;
      },
      error: (err) => {
        console.error('❌ Could not load expense history', err);
      },
    });
  }

  logout(): void {
    this.tokenService.clearToken();
    this.router.navigate(['/login']);
  }

  addExpenseRow(): void {
    this.expenseRows.push({
      serialNo: this.expenseRows.length + 1,
      category: '',
      amount: '',
    });
  }

  removeExpenseRow(index: number): void {
    if (this.expenseRows.length > 1) {
      this.expenseRows.splice(index, 1);
      this.expenseRows = this.expenseRows.map((row, i) => ({
        ...row,
        serialNo: i + 1,
      }));
    }
  }

  submitForm(): void {
    if (!/^\d{12}$/.test(this.form.employeeId)) {
      alert('Employee ID must be 12 digits.');
      return;
    }

    if (!/^[A-Za-z ]+$/.test(this.form.name)) {
      alert('Name must contain letters only.');
      return;
    }

    if (!this.form.department) {
      alert('Department is required.');
      return;
    }

    for (const row of this.expenseRows) {
      if (!row.category) {
        alert('All categories must be selected.');
        return;
      }

      if (!/^\d{1,14}$/.test(row.amount)) {
        alert('Amount must be a number up to 14 digits.');
        return;
      }
    }

    const payload = {
      employeeId: this.form.employeeId,
      name: this.form.name,
      department: this.form.department,
      expenses: this.expenseRows,
    };

    this.expenseService.submitExpenses(payload).subscribe({
      next: () => {
        alert('Expense submitted successfully!');
        this.loadExpenses();
        this.form = { employeeId: '', name: '', department: '' };
        this.expenseRows = [{ serialNo: 1, category: '', amount: '' }];
      },
      error: (err) => {
        console.error('❌ Submission failed', err);
      },
    });
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initChart();

      this.resizeObserver = new ResizeObserver(() => {
        this.chartInstance?.resize();
      });

      if (this.expenseChartRef?.nativeElement?.parentElement) {
        this.resizeObserver.observe(
          this.expenseChartRef.nativeElement.parentElement
        );
      }
    });
  }

  private initChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const ctx = this.expenseChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const expenseData = [500, 700, 400, 650, 800, 550]; // Placeholder data

      this.chartInstance = new Chart(ctx, {
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
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true },
            tooltip: { enabled: true },
          },
        },
      });

      this.cdr.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
