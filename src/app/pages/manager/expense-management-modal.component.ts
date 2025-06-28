//expenxe-mangement-modal.component.ts

import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../../services/api/manager.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-expense-management-modal',
  templateUrl: './expense-management-modal.component.html',
  styleUrls: ['./expense-management-modal.component.css'],
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
})
export class ExpenseManagementModalComponent implements OnInit {
  expenseForm!: FormGroup;
  showTable = false;
  tableType = '';
  dropdownCategoryOptions: string[] = [];
  rowCategoryOptions: string[] = [];
  totalEmployees = 0;
  totalCost = 0;
  attachedFile: File | null = null;

  departmentOptions = [
    'Human Resources',
    'Finance',
    'IT',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Support',
    'Product Management',
    'None',
  ];

  expensePurposeOptions = [
    'Staff Related Expenses (Employee Expenses)',
    'Office Infrastructure',
    'Utilities and Supplies',
    'IT & Software',
    'Travel & Transportation',
    'Marketing & Promotion',
    'Training & Development',
    'Miscellaneous',
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExpenseManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { managerId: number; managerName: string },
    private managerService: ManagerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      managerId: [{ value: this.data.managerId, disabled: true }],
      managerName: [{ value: this.data.managerName, disabled: true }],
      department: ['', Validators.required],
      date: ['', Validators.required],
      purpose: ['', Validators.required],
      category: [''],
      tableRows: this.fb.array([]),
    });

    this.expenseForm.get('purpose')!.valueChanges.subscribe((purpose) => {
      this.onPurposeChange(purpose);
    });
  }

  get rows(): FormArray<FormGroup> {
    return this.expenseForm.get('tableRows') as FormArray<FormGroup>;
  }

  onPurposeChange(purpose: string): void {
    this.rows.clear();
    this.showTable = false;
    this.tableType = '';
    this.dropdownCategoryOptions = [];
    this.rowCategoryOptions = [];
    this.totalEmployees = 0;
    this.totalCost = 0;

    switch (purpose) {
      case 'Staff Related Expenses (Employee Expenses)':
        this.showTable = true;
        this.tableType = 'staff';
        this.rowCategoryOptions = [
          'Salaries and wages',
          'Bonuses or incentives',
          'Hiring and recruitment costs',
        ];
        this.addRow();
        break;
      case 'Office Infrastructure':
        this.showTable = true;
        this.tableType = 'office';
        this.rowCategoryOptions = [
          'Rent or lease of office space',
          'Electricity bill',
          'Water bill',
          'Internet and phone charges',
        ];
        this.addRow();
        break;
      case 'Utilities and Supplies':
        this.showTable = true;
        this.tableType = 'utilities';
        this.rowCategoryOptions = [
          'Stationery (pens, papers, files)',
          'Printer cartridges, paper',
          'Office pantry supplies (tea, coffee, sugar, etc.)',
          'Cleaning materials',
          'Maintenance (cleaning, plumbing, etc.)',
          'Furniture & Fixtures (chairs, desks, AC, etc.)',
          'Security services (guards, CCTV)',
        ];
        this.addRow();
        break;
      case 'IT & Software':
        this.dropdownCategoryOptions = [
          'Laptops, desktops, peripherals',
          'Software subscriptions (Microsoft Office, Adobe, etc.)',
          'Server/hosting/domain charges',
          'Technical support or AMC (Annual Maintenance Contract)',
        ];
        break;
      case 'Travel & Transportation':
        this.dropdownCategoryOptions = [
          'Business travel (flight/train tickets)',
          'Local travel (auto/cab reimbursements)',
          'Fuel charges (if company vehicles)',
          'Vehicle maintenance (if applicable)',
        ];
        break;
      case 'Marketing & Promotion':
        this.dropdownCategoryOptions = [
          'Online ads (Google, Facebook, etc.)',
          'Printing (brochures, banners)',
          'Event participation',
          'Website development/maintenance',
        ];
        break;
      case 'Miscellaneous':
        this.dropdownCategoryOptions = [
          'Courier/postal services',
          'Entertainment or client meeting expenses',
          'Penalties or fines (if any)',
          'CSR or donations (if company does)',
        ];
        break;
      case 'Training & Development':
        this.showTable = true;
        this.tableType = 'training';
        this.addRow();
        break;
    }
  }

  addRow(): void {
    let group: FormGroup;
    if (this.tableType === 'staff') {
      group = this.fb.group({
        employeeId: ['', Validators.required],
        employeeName: ['', Validators.required],
        category: ['', Validators.required],
        cost: ['', [Validators.required, Validators.min(0)]],
      });
    } else if (this.tableType === 'office' || this.tableType === 'utilities') {
      group = this.fb.group({
        category: ['', Validators.required],
        cost: ['', [Validators.required, Validators.min(0)]], // ✅ UPDATED: renamed 'amount' to 'cost'
      });
    } else if (this.tableType === 'training') {
      group = this.fb.group({
        employeeId: ['', Validators.required],
        employeeName: ['', Validators.required],
        course: [
          {
            value: 'Online courses/subscriptions for employee learning',
            disabled: true,
          },
        ],
        cost: ['', [Validators.required, Validators.min(0)]],
        description: ['', [Validators.required, Validators.maxLength(1000)]],
      });
    } else {
      return;
    }

    group.valueChanges.subscribe(() => this.recalculateTotals());
    this.rows.push(group);
    this.recalculateTotals();
  }

  removeRow(index: number): void {
    if (this.rows.length > 1) {
      this.rows.removeAt(index);
      this.recalculateTotals();
    }
  }

  recalculateTotals(): void {
    const employees = new Set<string>();
    let total = 0;

    this.rows.controls.forEach((row) => {
      if (this.tableType === 'staff' || this.tableType === 'training') {
        const empId = row.get('employeeId')?.value;
        if (empId) {
          employees.add(empId);
        }
        const cost = Number(row.get('cost')?.value) || 0;
        total += cost;
      } else if (
        this.tableType === 'office' ||
        this.tableType === 'utilities'
      ) {
        const cost = Number(row.get('cost')?.value) || 0; // ✅ UPDATED: changed from 'amount'
        total += cost;
      }
    });

    this.totalEmployees = employees.size;
    this.totalCost = total;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachedFile = input.files[0];
      console.log('Selected file:', this.attachedFile);
    }
  }
  onSubmit(): void {
    const purpose = this.expenseForm.get('purpose')!.value;

    // ❌ Block unsupported categories early
    const unsupportedPurposes = [
      'IT & Software',
      'Travel & Transportation',
      'Marketing & Promotion',
      'Miscellaneous',
    ];
    if (unsupportedPurposes.includes(purpose)) {
      this.toastr.info('🚧 This purpose is not yet supported for submission.');
      return;
    }

    // ❌ Validate form before proceeding
    if (this.expenseForm.invalid || this.rows.invalid) {
      this.toastr.warning('⚠️ Please correct all form and row-level errors.');
      this.expenseForm.markAllAsTouched();
      this.rows.markAllAsTouched();
      return;
    }

    // ✅ Construct payload
    const formPayload = {
      ...this.expenseForm.getRawValue(),
      purpose,
      fileName: this.attachedFile?.name || null,
      expenseRows: this.rows.getRawValue(),
      totalEmployees: this.totalEmployees,
      totalCost: this.totalCost,
    };

    // ✅ Build FormData for multipart submission
    const formData = new FormData();
    formData.append(
      'form',
      new Blob([JSON.stringify(formPayload)], { type: 'application/json' })
    );

    if (this.attachedFile) {
      formData.append('file', this.attachedFile);
    }

    // ✅ Submit and handle response
    this.managerService.submitManagerExpense(formData).subscribe({
      next: (res) => {
        this.toastr.success(res.message || '✅ Expense submitted.');
        this.dialogRef.close({
          submissionNo: res.submissionNo ?? null,
          fileName: this.attachedFile?.name || null,
          form: formPayload,
        });
      },
      error: (err) => {
        console.error('❌ Submission error:', err);
        this.toastr.error('❌ Submission failed. Please retry.');
      },
    });
  }

  // onSubmit(): void {
  //   const purpose = this.expenseForm.get('purpose')!.value;

  //   if (
  //     purpose === 'IT & Software' ||
  //     purpose === 'Travel & Transportation' ||
  //     purpose === 'Marketing & Promotion' ||
  //     purpose === 'Miscellaneous'
  //   ) {
  //     alert(
  //       '🚧 Feature coming soon. Submission is disabled for this purpose at the moment.'
  //     );
  //     return;
  //   }

  //   // if (this.expenseForm.invalid) {
  //   //   console.warn('Form is invalid. Please correct the errors.');
  //   //   this.expenseForm.markAllAsTouched();
  //   //   return;
  //   // }
  //   if (this.expenseForm.invalid) {
  //     this.toastr.warning('⚠️ Please fill all required fields');
  //     return;
  //   }

  //   // ✅ UPDATED: Build form payload with fileName injected
  //   const formPayload = {
  //     ...this.expenseForm.getRawValue(),
  //     purpose: purpose,
  //     fileName: this.attachedFile?.name || null, // ✅ Inject fileName here
  //     expenseRows: this.rows.getRawValue(), // ✅ Add this line
  //   };
  //   formPayload.totalEmployees = this.totalEmployees;
  //   formPayload.totalCost = this.totalCost;

  //   // ✅ Prepare FormData with JSON and file
  //   const formData = new FormData();
  //   formData.append(
  //     'form',
  //     new Blob([JSON.stringify(formPayload)], { type: 'application/json' })
  //   );

  //   if (this.attachedFile) {
  //     formData.append('file', this.attachedFile);
  //   }
  //   this.managerService.submitManagerExpense(this.formData).subscribe({
  //     next: (res) => {
  //       // ✅ Safe success handler
  //       this.toastr.success('✅ Expense submitted successfully');
  //       this.dialogRef.close(); // ✅ Auto-close modal
  //     },
  //     error: (err) => {
  //       console.error('❌ Submission error:', err);
  //       this.toastr.error('❌ Failed to submit expense. Please try again.');
  //     },
  //   });
  //   // this.managerService.submitManagerExpense(formData).subscribe({
  //   //   next: (res: any) => {
  //   //     console.log('✅ Submission success response:', res);
  //   //     this.dialogRef.close({
  //   //       form: formPayload,
  //   //       fileName: this.attachedFile ? this.attachedFile.name : null,
  //   //       submissionNo: res.submissionNo,
  //   //     });
  //   //   },
  //   //   error: (err: any) => {
  //   //     console.error('❌ Submission failed:', err);
  //   //     alert('Submission failed. Please try again.');
  //   //   },
  //   // });
  // }

  onCancel(): void {
    this.dialogRef.close();
  }
}

// import { Component, OnInit, Inject } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   FormArray,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import {
//   MatDialogRef,
//   MatDialogModule,
//   MAT_DIALOG_DATA,
// } from '@angular/material/dialog';
// import { CommonModule } from '@angular/common';
// import { ManagerService } from '../../services/api/manager.service';

// @Component({
//   standalone: true,
//   selector: 'app-expense-management-modal',
//   templateUrl: './expense-management-modal.component.html',
//   styleUrls: ['./expense-management-modal.component.css'],
//   imports: [CommonModule, ReactiveFormsModule, MatDialogModule],
// })
// export class ExpenseManagementModalComponent implements OnInit {
//   expenseForm!: FormGroup;
//   showTable = false;
//   tableType = '';
//   dropdownCategoryOptions: string[] = [];
//   rowCategoryOptions: string[] = [];
//   totalEmployees = 0;
//   totalCost = 0;
//   attachedFile: File | null = null;

//   departmentOptions = [
//     'Human Resources',
//     'Finance',
//     'IT',
//     'Marketing',
//     'Sales',
//     'Operations',
//     'Customer Support',
//     'Product Management',
//     'None',
//   ];

//   expensePurposeOptions = [
//     'Staff Related Expenses (Employee Expenses)',
//     'Office Infrastructure',
//     'Utilities and Supplies',
//     'IT & Software',
//     'Travel & Transportation',
//     'Marketing & Promotion',
//     'Training & Development',
//     'Miscellaneous',
//   ];

//   constructor(
//     private fb: FormBuilder,
//     private dialogRef: MatDialogRef<ExpenseManagementModalComponent>,
//     @Inject(MAT_DIALOG_DATA)
//     public data: { managerId: number; managerName: string },
//     private managerService: ManagerService // ✅ Injected
//   ) {}

//   ngOnInit(): void {
//     this.expenseForm = this.fb.group({
//       managerId: [{ value: this.data.managerId, disabled: true }],
//       managerName: [{ value: this.data.managerName, disabled: true }],
//       department: ['', Validators.required],
//       date: ['', Validators.required],
//       purpose: ['', Validators.required],
//       category: [''],
//       tableRows: this.fb.array([]),
//     });

//     this.expenseForm.get('purpose')!.valueChanges.subscribe((purpose) => {
//       this.onPurposeChange(purpose);
//     });
//   }

//   get rows(): FormArray<FormGroup> {
//     return this.expenseForm.get('tableRows') as FormArray<FormGroup>;
//   }

//   onPurposeChange(purpose: string): void {
//     this.rows.clear();
//     this.showTable = false;
//     this.tableType = '';
//     this.dropdownCategoryOptions = [];
//     this.rowCategoryOptions = [];
//     this.totalEmployees = 0;
//     this.totalCost = 0;

//     switch (purpose) {
//       case 'Staff Related Expenses (Employee Expenses)':
//         this.showTable = true;
//         this.tableType = 'staff';
//         this.rowCategoryOptions = [
//           'Salaries and wages',
//           'Bonuses or incentives',
//           'Hiring and recruitment costs',
//         ];
//         this.addRow();
//         break;
//       case 'Office Infrastructure':
//         this.showTable = true;
//         this.tableType = 'office';
//         this.rowCategoryOptions = [
//           'Rent or lease of office space',
//           'Electricity bill',
//           'Water bill',
//           'Internet and phone charges',
//         ];
//         this.addRow();
//         break;
//       case 'Utilities and Supplies':
//         this.showTable = true;
//         this.tableType = 'utilities';
//         this.rowCategoryOptions = [
//           'Stationery (pens, papers, files)',
//           'Printer cartridges, paper',
//           'Office pantry supplies (tea, coffee, sugar, etc.)',
//           'Cleaning materials',
//           'Maintenance (cleaning, plumbing, etc.)',
//           'Furniture & Fixtures (chairs, desks, AC, etc.)',
//           'Security services (guards, CCTV)',
//         ];
//         this.addRow();
//         break;
//       case 'IT & Software':
//         this.dropdownCategoryOptions = [
//           'Laptops, desktops, peripherals',
//           'Software subscriptions (Microsoft Office, Adobe, etc.)',
//           'Server/hosting/domain charges',
//           'Technical support or AMC (Annual Maintenance Contract)',
//         ];
//         break;
//       case 'Travel & Transportation':
//         this.dropdownCategoryOptions = [
//           'Business travel (flight/train tickets)',
//           'Local travel (auto/cab reimbursements)',
//           'Fuel charges (if company vehicles)',
//           'Vehicle maintenance (if applicable)',
//         ];
//         break;
//       case 'Marketing & Promotion':
//         this.dropdownCategoryOptions = [
//           'Online ads (Google, Facebook, etc.)',
//           'Printing (brochures, banners)',
//           'Event participation',
//           'Website development/maintenance',
//         ];
//         break;
//       case 'Miscellaneous':
//         this.dropdownCategoryOptions = [
//           'Courier/postal services',
//           'Entertainment or client meeting expenses',
//           'Penalties or fines (if any)',
//           'CSR or donations (if company does)',
//         ];
//         break;
//       case 'Training & Development':
//         this.showTable = true;
//         this.tableType = 'training';
//         this.addRow();
//         break;
//     }
//   }

//   addRow(): void {
//     let group: FormGroup;
//     if (this.tableType === 'staff') {
//       group = this.fb.group({
//         employeeId: ['', Validators.required],
//         employeeName: ['', Validators.required],
//         category: ['', Validators.required],
//         cost: ['', [Validators.required, Validators.min(0)]],
//       });
//     } else if (this.tableType === 'office' || this.tableType === 'utilities') {
//       group = this.fb.group({
//         category: ['', Validators.required],
//         amount: ['', [Validators.required, Validators.min(0)]],
//       });
//     } else if (this.tableType === 'training') {
//       group = this.fb.group({
//         employeeId: ['', Validators.required],
//         employeeName: ['', Validators.required],
//         course: [
//           {
//             value: 'Online courses/subscriptions for employee learning',
//             disabled: true,
//           },
//         ],
//         cost: ['', [Validators.required, Validators.min(0)]],
//         description: ['', [Validators.required, Validators.maxLength(1000)]],
//       });
//     } else {
//       return;
//     }

//     group.valueChanges.subscribe(() => this.recalculateTotals());
//     this.rows.push(group);
//     this.recalculateTotals();
//   }

//   removeRow(index: number): void {
//     if (this.rows.length > 1) {
//       this.rows.removeAt(index);
//       this.recalculateTotals();
//     }
//   }

//   recalculateTotals(): void {
//     const employees = new Set<string>();
//     let total = 0;

//     this.rows.controls.forEach((row) => {
//       if (this.tableType === 'staff' || this.tableType === 'training') {
//         const empId = row.get('employeeId')?.value;
//         if (empId) {
//           employees.add(empId);
//         }
//         const cost = Number(row.get('cost')?.value) || 0;
//         total += cost;
//       } else if (
//         this.tableType === 'office' ||
//         this.tableType === 'utilities'
//       ) {
//         const amt = Number(row.get('amount')?.value) || 0;
//         total += amt;
//       }
//     });

//     this.totalEmployees = employees.size;
//     this.totalCost = total;
//   }

//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.attachedFile = input.files[0];
//       console.log('Selected file:', this.attachedFile);
//     }
//   }

//   onSubmit(): void {
//     const purpose = this.expenseForm.get('purpose')!.value;

//     if (
//       purpose === 'IT & Software' ||
//       purpose === 'Travel & Transportation' ||
//       purpose === 'Marketing & Promotion' ||
//       purpose === 'Miscellaneous'
//     ) {
//       alert(
//         '🚧 Feature coming soon. Submission is disabled for this purpose at the moment.'
//       );
//       return;
//     }

//     if (this.expenseForm.invalid) {
//       console.warn('Form is invalid. Please correct the errors.');
//       this.expenseForm.markAllAsTouched();
//       return;
//     }

//     // Build form payload
//     const formPayload = {
//       ...this.expenseForm.getRawValue(),
//       purpose: purpose,
//     };

//     // Prepare FormData for future file upload
//     const formData = new FormData();
//     formData.append(
//       'form',
//       new Blob([JSON.stringify(formPayload)], { type: 'application/json' })
//     );

//     if (this.attachedFile) {
//       formData.append('file', this.attachedFile);
//     }

//     this.managerService.submitManagerExpense(formData).subscribe({
//       next: (res: any) => {
//         // 👈 or provide strong typing if backend returns a known DTO
//         console.log('✅ Submission success response:', res);
//         this.dialogRef.close({
//           form: formPayload,
//           fileName: this.attachedFile ? this.attachedFile.name : null,
//           submissionNo: res.submissionNo,
//         });
//       },
//       error: (err: any) => {
//         console.error('❌ Submission failed:', err);
//         alert('Submission failed. Please try again.');
//       },
//     });
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }
// }
