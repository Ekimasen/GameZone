import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  profileForm: FormGroup;
  showPasswordFields: boolean = false;
  profilePicture: string | undefined = ''; // Default to an empty string or undefined

  constructor(private dbService: DatabaseService, private fb: FormBuilder, private router: Router, private navCtrl: NavController) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Not required initially
      newPassword: [''], // Not required initially
      confirmPassword: [''] // Not required initially
    });
  }  

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading = true;
    try {
      const userId = await this.dbService.getLoggedInUserId();
      if (userId !== null) {
        const user = await this.dbService.getUserById(userId);
        this.user = user;
        this.profilePicture = this.user.profilePicture; // Load the profile picture
        this.profileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          password: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        this.errorMessage = 'No logged-in user found.';
      }
    } catch (error) {
      this.errorMessage = 'Error loading user profile.';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  togglePasswordFields() {
    this.showPasswordFields = !this.showPasswordFields;
    if (this.showPasswordFields) {
      this.profileForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.profileForm.get('newPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.profileForm.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.profileForm.get('password')?.clearValidators();
      this.profileForm.get('newPassword')?.clearValidators();
      this.profileForm.get('confirmPassword')?.clearValidators();
    }
    this.profileForm.get('password')?.updateValueAndValidity();
    this.profileForm.get('newPassword')?.updateValueAndValidity();
    this.profileForm.get('confirmPassword')?.updateValueAndValidity();
  }  

  async saveProfile() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }
  
    const { name, email, password, newPassword, confirmPassword } = this.profileForm.value;
  
    this.isLoading = true;
  
    try {
      if (newPassword && newPassword !== confirmPassword) {
        this.errorMessage = 'New password and confirm password do not match.';
        this.isLoading = false;
        return;
      }
  
      const userId = await this.dbService.getLoggedInUserId();
      if (userId !== null) {
        const user = await this.dbService.getUserById(userId);
        if (!newPassword || user.password === password) {
          await this.dbService.updateUser(user.id, name, email, newPassword || user.password, this.profilePicture); // Ensure profile picture is included
          this.successMessage = 'Profile updated successfully!';
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Current password is incorrect.';
        }
      } else {
        this.errorMessage = 'No logged-in user found.';
      }
    } catch (error) {
      this.errorMessage = 'Error updating profile.';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }  

  async logout() {
    await this.dbService.clearSession();
    alert('Logged out!');
  
    // Clear navigation history and navigate to the login page
    this.navCtrl.navigateRoot(['/login'], { animated: true, animationDirection: 'forward' });
  }  

  // Function to pick a profile picture using the Camera plugin
  async pickProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl,
      });

      // Set the picked image as the profile picture
      this.profilePicture = image.dataUrl; // Store the base64 string (data URL)
    } catch (error) {
      console.error('Error picking profile picture:', error);
      this.errorMessage = 'Failed to pick profile picture.';
    }
  }  
}