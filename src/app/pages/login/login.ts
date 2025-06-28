//pages//login//login.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { TokenService } from '../../services/auth/token.service';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [NgIf, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        console.log('✅ Token stored, preparing to navigate...');

        // Use microtask to ensure storage is settled before navigating
        Promise.resolve().then(() => this.redirectByRole());

        // Alternative: You can use setTimeout(() => this.redirectByRole(), 0);
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        this.errorMessage =
          err.error?.message || 'Invalid username or password';
        this.tokenService.clearToken(); // Clear any old/partial token on failure
      },
    });
  }

  private redirectByRole(): void {
    const roles = this.tokenService.getRoles();
    console.log('✅ Decoded roles:', roles);

    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('ROLE_MANAGER')) {
      this.router.navigate(['/manager']);
    } else if (roles.includes('ROLE_EMPLOYEE')) {
      this.router.navigate(['/employee']);
    } else if (roles.includes('ROLE_FINANCE')) {
      this.router.navigate(['/finance']);
    } else {
      console.warn('❌ No valid role found, clearing token and redirecting.');
      this.tokenService.clearToken();
      this.router.navigate(['/unauthorized']);
    }
  }
}

// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import {
//   FormBuilder,
//   FormGroup,
//   Validators,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common'; // For *ngIf
// import { AuthService } from '../../services/auth/auth.service';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule], // ✅ Added needed modules
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
// })
// export class Login {
//   loginForm: FormGroup;
//   submitted = false;
//   loading = false;
//   error: string | null = null;

//   constructor(
//     private fb: FormBuilder,
//     private authService: AuthService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//       rememberMe: [false],
//     });
//   }

//   get f() {
//     return this.loginForm.controls;
//   }

//   onSubmit() {
//     this.submitted = true;
//     this.error = null;

//     if (this.loginForm.invalid) {
//       return;
//     }

//     this.loading = true;
//     const { username, password } = this.loginForm.value;

//     this.authService.login(username, password).subscribe({
//       next: (response) => {
//         this.authService.storeToken(response.token);
//         if (this.authService.isAdmin()) {
//           this.router.navigate(['/admin']);
//         } else if (this.authService.isManager()) {
//           this.router.navigate(['/manager']);
//         } else if (this.authService.isEmployee()) {
//           this.router.navigate(['/employee']);
//         } else if (this.authService.isFinance()) {
//           // ✅ Add this
//           this.router.navigate(['/finance']);
//         } else {
//           this.router.navigate(['/unauthorized']);
//         }
//       },
//       error: (err) => {
//         this.error = err.error?.message || 'Login failed. Please try again.';
//         this.loading = false;
//       },
//       complete: () => {
//         this.loading = false;
//       },
//     });
//   }
// }
