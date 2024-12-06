import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  isLoading: boolean = false;
  profileForm: FormGroup;
  showPasswordFields: boolean = false;
  profilePicture: string | undefined = '';

  constructor(
    private dbService: DatabaseService,
    private fb: FormBuilder,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  // Load user profile on initialization
  ngOnInit() {
    this.loadUserProfile();
  }

  // Load the user profile from the database
  async loadUserProfile() {
    this.isLoading = true;
    try {
      const userId = await this.dbService.getLoggedInUserId();
      if (userId !== null) {
        const user = await this.dbService.getUserById(userId);
        this.user = user;
        this.profilePicture = this.user.profilePicture;
        this.profileForm.patchValue({
          name: this.user.name,
          email: this.user.email,
          password: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        await this.showToast('No logged-in user found.', 'danger');
      }
    } catch (error) {
      await this.showToast('Error loading user profile.', 'danger');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  // Toggle the visibility of password fields
  togglePasswordFields() {
    this.showPasswordFields = !this.showPasswordFields;
    const validators = this.showPasswordFields
      ? [Validators.required, Validators.minLength(8)]
      : [];
    this.profileForm.get('password')?.setValidators(validators);
    this.profileForm.get('newPassword')?.setValidators(validators);
    this.profileForm.get('confirmPassword')?.setValidators(this.showPasswordFields ? [Validators.required] : []);
    this.profileForm.updateValueAndValidity();
  }

  // Save the user profile
  async saveProfile() {
    if (this.profileForm.invalid) {
      await this.showToast('Please fill in all fields correctly.', 'danger');
      return;
    }

    const { name, email, password, newPassword, confirmPassword } = this.profileForm.value;

    this.isLoading = true;

    try {
      if (newPassword && newPassword !== confirmPassword) {
        await this.showToast('New password and confirm password do not match.', 'danger');
        this.isLoading = false;
        return;
      }

      const userId = await this.dbService.getLoggedInUserId();
      if (userId !== null) {
        const user = await this.dbService.getUserById(userId);
        if (!newPassword || user.password === password) {
          await this.dbService.updateUser(user.id, name, email, newPassword || user.password, this.profilePicture);
          await this.showToast('Profile updated successfully!', 'success');
        } else {
          await this.showToast('Current password is incorrect.', 'danger');
        }
      } else {
        await this.showToast('No logged-in user found.', 'danger');
      }
    } catch (error) {
      await this.showToast('Error updating profile.', 'danger');
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  // Log out the user
  async logout() {
    await this.dbService.clearSession();
    await this.showToast('Logged out!', 'success');
    this.navCtrl.navigateRoot(['/login'], { animated: true, animationDirection: 'forward' });
  }

  // Pick a profile picture using the camera
  async pickProfilePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl,
      });

      this.profilePicture = image.dataUrl;
    } catch (error) {
      console.error('Error picking profile picture:', error);
      await this.showToast('Failed to pick profile picture.', 'danger');
    }
  }

  // Show a toast message
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
