import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ManagerService } from '../../services/api/manager.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-table-modal',
  templateUrl: './view-table-modal.component.html',
  styleUrls: ['./view-table-modal.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class ViewTableModalComponent implements OnInit {
  tableColumns: string[] = [];
  expenseRows: any[] = [];
  loading = true;
  submissionNo!: string;
  purpose!: string;

  constructor(
    private dialogRef: MatDialogRef<ViewTableModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { submissionNo: string; purpose: string },
    private managerService: ManagerService
  ) {
    this.submissionNo = data.submissionNo;
    this.purpose = data.purpose;
  }

  ngOnInit(): void {
    this.setColumnsBasedOnPurpose(this.purpose);
    this.fetchExpenseRows(this.submissionNo);
  }

  fetchExpenseRows(submissionNo: string): void {
    this.managerService.getExpenseRowsBySubmissionNo(submissionNo).subscribe({
      next: (rows: any[]) => {
        this.expenseRows = rows;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Failed to load rows:', err);
        this.loading = false;
      },
    });
  }

  setColumnsBasedOnPurpose(purpose: string): void {
    if (['Office Infrastructure', 'Utilities and Supplies'].includes(purpose)) {
      this.tableColumns = ['S.No', 'category', 'cost', 'status'];
    } else if (purpose === 'Training & Development') {
      this.tableColumns = [
        'S.No',
        'employeeId',
        'name',
        'cost',
        'description',
        'status',
      ];
    } else {
      this.tableColumns = [
        'S.No',
        'employeeId',
        'name',
        'category',
        'cost',
        'status',
      ];
    }
  }

  // fetchExpenseRows(submissionNo: string): void {
  //   this.managerService.getExpenseRows(submissionNo).subscribe({
  //     next: (rows) => {
  //       this.expenseRows = rows;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('❌ Failed to load rows:', err);
  //       this.loading = false;
  //     },
  //   });
  // }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'badge green';
      case 'REVIEW_FINANCE':
        return 'badge blue';
      case 'REVIEW_ADMIN':
        return 'badge orange';
      case 'REJECTED_FINANCE':
      case 'REJECTED_ADMIN':
        return 'badge red';
      default:
        return 'badge gray';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
