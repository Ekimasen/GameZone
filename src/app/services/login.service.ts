import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedInEmail: string | null = null;

  // Set the logged-in user's email (after successful login)
  setLoggedInUserEmail(email: string) {
    this.loggedInEmail = email;
  }

  // Get the logged-in user's email
  getLoggedInUserEmail(): string | null {
    return this.loggedInEmail;
  }

  // Clear the session (e.g., after logging out)
  clearSession() {
    this.loggedInEmail = null;
  }
}
