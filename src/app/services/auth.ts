import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  apiUrl: string = 'http://127.0.0.1:5001/api/v1.0';

  constructor(private http: HttpClient) { }

  // POST /register - create a customer account (form data, as the API expects)
  register(name: string, email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    return this.http.post<any>(this.apiUrl + '/register', formData);
  }

  // POST /login - Basic Auth: "Basic " + base64("email:password")
  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(email + ':' + password)
    });
    return this.http.post<any>(this.apiUrl + '/login', null, { headers });
  }

    // GET /profile - the interceptor adds the token
  getProfile(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/profile');
  }

  // GET /logout - the API blacklists the token
  logout(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/logout');
  }

  // ---------- Remember who is logged in (browser storage) ----------

  saveLogin(token: string, role: string) {
    localStorage['token'] = token;
    localStorage['role'] = role;
  }

  saveName(name: string) {
    localStorage['name'] = name;
  }

  clearLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
  }

  getToken(): string {
    return localStorage['token'] || '';
  }

  getName(): string {
    return localStorage['name'] || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage['token'];
  }

  isAdmin(): boolean {
    return localStorage['role'] === 'admin';
  }
}