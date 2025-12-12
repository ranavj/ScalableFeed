import { Component, inject, signal } from '@angular/core'; // 👈 signal import kiya
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // RouterLink for navigation
import { AuthService } from '../auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink], // CommonModule ki zarurat nahi ab
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // 👇 STATE MANAGEMENT USING SIGNALS
  errorMessage = signal<string>(''); // Signal banaya
  isLoading = signal<boolean>(false); // Loading state bhi signal mein

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      // 1. Signal Update: Loading shuru
      this.isLoading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          // 2. Signal Update: Error set kiya
          this.errorMessage.set('Invalid Email or Password!');
          console.error(err);
        }
      });
    }
  }
}