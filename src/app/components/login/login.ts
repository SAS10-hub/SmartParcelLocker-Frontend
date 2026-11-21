import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;
  returnUrl: string = '/stations';

  constructor(private auth: Auth,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // Coming from the Register page: /login?registered=true
    if (this.route.snapshot.queryParamMap.get('registered')) {
      this.successMessage = 'Account created. Please log in.';
    }
    // Sent here by the interceptor: /login?expired=true
    if (this.route.snapshot.queryParamMap.get('expired')) {
      this.errorMessage = 'Your session has expired. Please log in again.';
    }
    // Sent here by the guard: go back to that page after logging in
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      this.returnUrl = returnUrl;
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.loading = true;

    this.auth.login(this.email, this.password).subscribe({
      next: (response: any) => {
        // Keep the token, then get the user's name for the navbar
        this.auth.saveLogin(response.token, response.role);
        this.auth.getProfile().subscribe({
          next: (profile: any) => {
            this.auth.saveName(profile.name);
            this.router.navigateByUrl(this.returnUrl);
          },
          error: () => {
            this.router.navigateByUrl(this.returnUrl);
          }
        });
      },
      error: (err: any) => {
        this.loading = false;
        // e.g. 401 "Invalid email or password" from the API
        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
      }
    });
  }
}