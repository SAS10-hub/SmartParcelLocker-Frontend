import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private auth: Auth, private router: Router) { }

  onSubmit() {
    this.errorMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'The two passwords do not match.';
      return;
    }

    this.loading = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        // Send the user to the login page with a success message
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      error: (err: any) => {
        this.loading = false;
        // e.g. 409 "Email already registered" from the API
        this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
      }
    });
  }
}