import { Component, OnInit } from '@angular/core';
import { RawgService } from '../services/rawg.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  platforms: any[] = [];
  isLoading = true;
  showPlatforms = false; // Flag to toggle visibility of platform list

  constructor(private rawgService: RawgService) {}

  ngOnInit() {
    this.fetchPlatforms();
  }

  fetchPlatforms() {
    this.rawgService.getPlatforms().subscribe({
      next: (response) => {
        this.platforms = response.results; // RAWG API returns the platforms in `results`
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching platforms:', error);
        this.isLoading = false;
      },
    });
  }

  // Method to toggle the visibility of the platform list
  togglePlatforms() {
    this.showPlatforms = !this.showPlatforms; // Toggle the visibility of the platforms list
  }

  // Method to get a random platform ID
  getRandomPlatformId(): number {
    const randomIndex = Math.floor(Math.random() * this.platforms.length);
    return this.platforms[randomIndex]?.id; // Return random platform ID, if available
  }
}
