import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'auth_token'; // LocalStorage key

  // Login Request
  login(credentials: any) {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          // Token milne par LocalStorage mein save karo
          localStorage.setItem(this.tokenKey, response.access_token);
        })
      );
  }

  // Token get karne ke liye
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout (Token delete karo)
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // Check karo user login hai ya nahi
  isLoggedIn() {
    return !!this.getToken();
  }
}