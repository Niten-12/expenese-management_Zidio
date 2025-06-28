//src/app/model/finance-Submission.model.ts
export interface FinanceSubmission {
  id: number;
  submissionNo: string;
  managerName: string;
  department: string;
  date: string;
  purpose: string;
  totalCost: number;
  status: string;
}
