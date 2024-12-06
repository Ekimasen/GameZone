import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private database: DatabaseService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.passwordMatchValidator });
  }

  // Initialize the component
  ngOnInit() {
    try {
      this.callInit();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    if (form.get('password')?.value !== form.get('confirmPassword')?.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Initialize the database
  async callInit() {
    try {
      await this.database.initDb();
      await this.database.initTable();
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.errorMessage = 'Database initialization failed. Please try again later.';
    }
  }

  // Create a new user account
  async callCreate() {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { name, email, password } = this.signupForm.value;

    try {
      await this.database.create(name, email, password);
      this.successMessage = 'User created successfully!';
      this.errorMessage = '';
      this.signupForm.reset();
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Failed to create user. Please try again.';
      this.successMessage = '';
    }
  }

  // Toggle the visibility of the password input field
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle the visibility of the confirm password input field
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
