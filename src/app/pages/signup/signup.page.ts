import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // For navigation
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
  showPassword: boolean = false;  // To toggle password visibility
  showConfirmPassword: boolean = false;  // To toggle confirm password visibility

  constructor(
    private fb: FormBuilder,
    private database: DatabaseService,
    private router: Router  // Inject Router to navigate programmatically
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.passwordMatchValidator });  // Custom validator to check if passwords match
  }

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

  async callInit() {
    try {
      await this.database.initDb();
      await this.database.initTable();
    } catch (error) {
      console.error('Database initialization failed:', error);
      this.errorMessage = 'Database initialization failed. Please try again later.';
    }
  }

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
      this.signupForm.reset(); // Reset the form after successful creation
      // Redirect to Login page after successful signup
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);  // Optional delay before redirect
    } catch (error) {
      console.error('Error creating user:', error);
      this.errorMessage = 'Failed to create user. Please try again.';
      this.successMessage = ''; // Clear success message
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
