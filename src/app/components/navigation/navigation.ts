import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css'
})
export class Navigation {

  // public, so the template can use auth.isLoggedIn() and auth.getName()
  constructor(public auth: Auth, private router: Router) { }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.finishLogout(),
      // Even if the token had already expired, still log out in the browser
      error: () => this.finishLogout()
    });
  }

  finishLogout() {
    this.auth.clearLogin();
    this.router.navigate(['/']);
  }
}