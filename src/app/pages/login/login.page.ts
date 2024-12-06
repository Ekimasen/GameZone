import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastController } from '@ionic/angular';

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
  isLoginFormVisible: boolean = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private database: DatabaseService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async ngOnInit() {
    try {
      await this.database.initDb();
      await this.database.initTable();
      await this.database.initSessionTable();
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  async presentToast(message: string, duration: number, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
      color: color,
    });
    toast.present();
  }

  async callLogin() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter a valid email and password.';
      this.presentToast(this.errorMessage, 2000, 'danger');
      return;
    }
  
    this.isLoading = true; // Show the loading screen
  
    const { email, password } = this.loginForm.value;
  
    try {
      // Simulate a delay to show loading (useful for UI effect)
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      const users = await this.database.read(email);
      const user = users.find((u: any) => u.email === email && u.password === password);
  
      if (user) {
        this.successMessage = 'Login successful!';
        this.errorMessage = '';
        await this.database.storeSession(user.id);
        this.presentToast(this.successMessage, 2000, 'success');
  
        // Delay navigation to ensure the loading screen completes its progress
        setTimeout(() => {
          this.isLoading = false; // Hide the loading screen only after success
          this.navigateToHome();
        }, 4000); // Adjust this time to ensure the loading screen is complete
      } else {
        this.errorMessage = 'Invalid email or password. Please try again.';
        this.successMessage = '';
        this.presentToast(this.errorMessage, 2000, 'danger');
  
        // Hide loading screen on failure
        this.isLoading = false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.errorMessage = 'Failed to log in. Please try again.';
      this.successMessage = '';
      this.presentToast(this.errorMessage, 2000, 'danger');
  
      // Ensure loading screen is hidden on failure
      this.isLoading = false;
    }
  }    
  // Navigate to the home page after successful login
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  showLoginForm() {
    this.isLoginFormVisible = true;
  }
}
