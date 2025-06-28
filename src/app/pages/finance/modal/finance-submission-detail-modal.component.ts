// ✅ src/app/pages/finance/modal/finance-submission-detail-modal.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../../../services/api/finance.service';
import { FinanceRow } from '../../../models/finance-row.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-finance-submission-detail-modal',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './finance-submission-detail-modal.component.html',
  // styleUrls: ['./finance-submission-detail-modal.component.css']
})
export class FinanceSubmissionDetailModalComponent implements OnInit {
  public rows: FinanceRow[] = [];
  public loading = true;
  public processingRows: Set<number> = new Set();
  public columns: string[] = [
    'employeeName',
    'category',
    'cost',
    'status',
    'action',
  ];

  constructor(
    public dialogRef: MatDialogRef<FinanceSubmissionDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { submissionId: number },
    private financeService: FinanceService
  ) {}

  ngOnInit(): void {
    this.financeService
      .getRowsBySubmissionId(this.data.submissionId)
      .subscribe((data) => {
        this.rows = data;
        this.loading = false;
      });
  }

  approve(rowId: number): void {
    this.financeService.approveRow(rowId).subscribe(() => {
      this.refresh();
    });
  }

  reject(rowId: number): void {
    this.financeService.rejectRow(rowId).subscribe(() => {
      this.refresh();
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private refresh(): void {
    this.financeService
      .getRowsBySubmissionId(this.data.submissionId)
      .subscribe((data) => {
        this.rows = data;
      });
  }
}
