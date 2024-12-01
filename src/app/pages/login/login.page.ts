import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private database: DatabaseService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async ngOnInit() {
    try {
      await this.database.initDb();
      await this.database.initTable();
      await this.database.initSessionTable();  // Initialize session table
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async callLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      const users = await this.database.read(email);
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';

        // Store user_id in session table
        await this.database.storeSession(user.id);

        // Redirect to home page
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
        this.successMessage = '';
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.errorMessage = 'Failed to log in. Please try again.';
      this.successMessage = '';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
