//create-user.component.ts
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminUserManagementService } from '../../services/api/admin-user-management.service';
import { UserCreateRequest } from '../../models/user-create-request.model';
import { ROLES } from '../../shared/constants/roles';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent {
  createUserForm: FormGroup;
  roles = ROLES;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  // Added: created users list (would be better from backend, but mock for now)
  createdUsers: { id: number; username: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private adminUserService: AdminUserManagementService
  ) {
    this.createUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    const payload: UserCreateRequest = this.createUserForm.value;

    this.adminUserService.createUser(payload).subscribe({
      next: (res) => {
        console.log('✅ Success response:', res);
        this.successMessage = res?.message || '✅ User created successfully!';
        this.errorMessage = null;

        const newUser = { id: res.id, username: payload.username };
        this.createdUsers.push(newUser);

        this.createUserForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ CreateUserComponent error handler:', err);

        if (err.status === 409) {
          this.errorMessage = 'Username already exists. Please choose another.';
        } else if (err.status === 403) {
          this.errorMessage = 'Access denied: You need admin role.';
        } else if (err.status === 0) {
          this.errorMessage = 'Server unreachable. Please check connection.';
        } else {
          this.errorMessage =
            err.error?.message || 'Failed to create user. Please try again.';
        }

        this.successMessage = null;
        this.isLoading = false;
      },
    });
  }

  confirmDeleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminUserService.deleteUser(id).subscribe({
        next: () => {
          alert('✅ User deleted successfully.');
          this.createdUsers = this.createdUsers.filter((u) => u.id !== id);
        },
        error: (err) => {
          console.error('❌ Delete failed:', err);
          alert('Failed to delete user. Please try again.');
        },
      });
    }
  }
  ngOnInit(): void {
    this.adminUserService.getAllUsers().subscribe({
      next: (users) => {
        this.createdUsers = users;
      },
      error: (err) => {
        console.error('❌ Failed to load users', err);
      },
    });
  }
}

// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { AdminUserManagementService } from '../../services/api/admin-user-management.service';
// import { UserCreateRequest } from '../../models/user-create-request.model';
// import { ROLES } from '../../shared/constants/roles';

// @Component({
//   selector: 'app-create-user',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './create-user.component.html',
// })
// export class CreateUserComponent {
//   createUserForm: FormGroup;
//   roles = ROLES;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   isLoading = false;

//   constructor(
//     private fb: FormBuilder,
//     private adminUserService: AdminUserManagementService
//   ) {
//     this.createUserForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//       role: ['', Validators.required],
//     });
//   }

//   onSubmit(): void {
//     if (this.createUserForm.invalid) {
//       this.errorMessage = 'Please fill in all fields correctly.';
//       return;
//     }

//     this.isLoading = true;
//     const payload: UserCreateRequest = this.createUserForm.value;

//     this.adminUserService.createUser(payload).subscribe({
//       next: (res) => {
//         console.log('✅ Success response:', res);
//         this.successMessage = res?.message || '✅ User created successfully!';
//         this.errorMessage = null;
//         this.createUserForm.reset();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('❌ CreateUserComponent error handler:', err);

//         if (err.status === 409) {
//           this.errorMessage = 'Username already exists. Please choose another.';
//         } else if (err.status === 403) {
//           this.errorMessage = 'Access denied: You need admin role.';
//         } else if (err.status === 0) {
//           this.errorMessage = 'Server unreachable. Please check connection.';
//         } else {
//           this.errorMessage =
//             err.error?.message || 'Failed to create user. Please try again.';
//         }

//         this.successMessage = null;
//         this.isLoading = false;
//       },
//     });
//   }

// }

// import { Component } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { UserService } from '../../services/api/user.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-create-user',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './create-user.component.html',
// })
// export class CreateUserComponent {
//   createUserForm: FormGroup;
//   successMessage: string | null = null;
//   errorMessage: string | null = null;
//   isLoading: boolean = false;

//   constructor(private fb: FormBuilder, private userService: UserService) {
//     this.createUserForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//       role: ['', Validators.required],
//     });
//   }

//   onSubmit() {
//     if (this.createUserForm.invalid) {
//       this.errorMessage = 'Please fill in all fields correctly.';
//       return;
//     }

//     this.isLoading = true;
//     const { username, password, role } = this.createUserForm.value;

//     this.userService.createUser(username, password, role).subscribe({
//       next: (res) => {
//         console.log('✅ Success response:', res);

//         if (typeof res === 'string') {
//           // If backend sent plain string
//           this.successMessage = res;
//         } else if (res?.message) {
//           // If backend sent JSON { message: ... }
//           this.successMessage = res.message;
//         } else {
//           this.successMessage = '✅ User created successfully!';
//         }

//         this.errorMessage = null;
//         this.createUserForm.reset();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('❌ CreateUserComponent error handler:', err);

//         if (err.status === 409) {
//           this.errorMessage = 'Username already exists. Please choose another.';
//         } else if (err.status === 200) {
//           // Actually succeeded but mis-parsed
//           this.successMessage = '✅ User created successfully!';
//           this.errorMessage = null;
//         } else if (err.status !== 403 && err.status !== 0) {
//           this.errorMessage =
//             err.error?.message || 'Failed to create user. Please try again.';
//         } else if (err.status === 403) {
//           this.errorMessage = 'Access denied: You need admin role.';
//         } else if (err.status === 0) {
//           this.errorMessage = 'Server unreachable. Please check connection.';
//         }

//         this.isLoading = false;
//       },
//     });
//   }
// }
